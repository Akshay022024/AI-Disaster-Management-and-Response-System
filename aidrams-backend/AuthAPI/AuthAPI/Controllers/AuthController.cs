using AuthAPI.Models;
using AuthAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ Generate JWT Token
        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("username", user.Username),
                    new Claim("profilePicture", user.ProfilePicture ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // ✅ Register User
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest(new { message = "Email is already in use." });

            // Generate Salt
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create()) rng.GetBytes(salt);
            string saltString = Convert.ToBase64String(salt);

            // Hash the password
            string hashedPassword = HashPassword(registerDto.Password, salt);

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = hashedPassword,
                PasswordSalt = saltString,
                DateOfBirth = registerDto.DateOfBirth,
                ProfilePicture = registerDto.ProfilePicture
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            SetAuthCookie(token);

            return Ok(new { message = "User registered successfully." });
        }

        // ✅ Login (Email OR Username)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.EmailOrUsername || u.Username == loginDto.EmailOrUsername);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            if (!VerifyPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized(new { message = "Invalid credentials" });

            var token = GenerateJwtToken(user);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "Login successful" });
        }


        // ✅ Check Auth
        [HttpGet("check-auth")]
        public IActionResult CheckAuth()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "No JWT token found in cookies." });

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);

                var parameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JwtSettings:Audience"],
                    ValidateLifetime = true
                };

                var principal = tokenHandler.ValidateToken(token, parameters, out _);
                var claims = principal.Claims.ToDictionary(c => c.Type, c => c.Value);

                return Ok(new { message = "User is authenticated.", user = claims });
            }
            catch
            {
                return Unauthorized(new { message = "Invalid token." });
            }
        }

        // ✅ Logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Append("jwt", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1) // Expire the cookie
            });

            return Ok(new { message = "Logged out successfully." });
        }


        // ✅ Update Profile (Username, Email, Profile Picture)
        [HttpPut("update-profile/{userId}")]
        public async Task<ActionResult> UpdateProfile(int userId, UpdateProfileDto profileDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!string.IsNullOrWhiteSpace(profileDto.Username))
                user.Username = profileDto.Username;

            if (!string.IsNullOrWhiteSpace(profileDto.Email))
                user.Email = profileDto.Email;

            if (!string.IsNullOrWhiteSpace(profileDto.ProfilePicture))
                user.ProfilePicture = profileDto.ProfilePicture;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully." });
        }

        // ✅ Forgot Password (Generates Reset Token)
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.ResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Reset token generated.",
                resetToken = user.ResetToken // ⚠️ Send this via email in real apps!
            });
        }

        // ✅ Utility: Set JWT Cookie
        private void SetAuthCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddHours(1)
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
        }

        // ✅ Utility: Hash Password
        private string HashPassword(string password, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32
            ));
        }

        // ✅ Utility: Verify Password
        private bool VerifyPassword(string inputPassword, string storedHash, string storedSalt)
        {
            byte[] salt = Convert.FromBase64String(storedSalt);
            string hashedInput = HashPassword(inputPassword, salt);
            return storedHash == hashedInput;
        }
    }
}
