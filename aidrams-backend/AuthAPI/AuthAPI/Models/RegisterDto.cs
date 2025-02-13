namespace AuthAPI.Models
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }

        // ✅ Optional Profile Picture
        public string? ProfilePicture { get; set; }
    }
}
