using AuthAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using AuthAPI.Data;
using System.Security.Cryptography;
using System;
using System.Threading.Tasks;

namespace AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email is already in use.");
            }

            // Hash the password and generate a salt
            var hashedPassword = HashPassword(registerDto.Password, out string salt);

            // Create new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = hashedPassword,
                PasswordSalt = salt,
                DateOfBirth = registerDto.DateOfBirth
            };

            // Save user in database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Verify password
            if (!VerifyPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(new { message = "Login successful." });
        }

        // Utility method for password hashing
        private string HashPassword(string password, out string salt)
        {
            // Generate a secure random salt (16 bytes)
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }

            // Convert salt to Base64 to store in DB
            salt = Convert.ToBase64String(saltBytes);

            // Hash the password using PBKDF2 with the generated salt
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32 // 256-bit key length
            ));
        }

        // Utility method to verify password
        private bool VerifyPassword(string inputPassword, string storedHash, string storedSalt)
        {
            // Convert stored salt from Base64 to byte array
            byte[] saltBytes = Convert.FromBase64String(storedSalt);

            // Hash the input password with the stored salt
            string hashedInput = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: inputPassword,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32
            ));

            // Compare hashes
            return hashedInput == storedHash;
        }
    }
}
