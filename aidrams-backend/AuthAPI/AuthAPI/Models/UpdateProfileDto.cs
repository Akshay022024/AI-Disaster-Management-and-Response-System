namespace AuthAPI.Models
{
    public class UpdateProfileDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
