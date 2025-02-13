using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string PasswordSalt { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    public string? ProfilePicture { get; set; }  // ✅ New field for profile picture

    public string? ResetToken { get; set; }  // ✅ For password reset

    public DateTime? ResetTokenExpiry { get; set; }  // ✅ Token expiration
}
