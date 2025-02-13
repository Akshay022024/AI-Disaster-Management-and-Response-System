namespace AuthAPI.Models
{
    public class LoginDto
    {
        public string EmailOrUsername { get; set; } // ✅ Accepts email OR username
        public string Password { get; set; }
    }
}
