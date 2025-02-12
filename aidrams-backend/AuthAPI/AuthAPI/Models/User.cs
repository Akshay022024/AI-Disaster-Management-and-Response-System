
    using System;
    using System.ComponentModel.DataAnnotations;

    namespace AuthAPI.Models
    {
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
        }
    }



