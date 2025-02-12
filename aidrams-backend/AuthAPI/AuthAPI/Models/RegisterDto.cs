namespace AuthAPI.Models
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }  // Plain password (hashed before saving)
        public DateTime DateOfBirth { get; set; }
    }

}
