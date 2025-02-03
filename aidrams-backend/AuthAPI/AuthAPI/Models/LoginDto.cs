namespace AuthAPI.Models
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }  // Plain text password for login
    }
}
