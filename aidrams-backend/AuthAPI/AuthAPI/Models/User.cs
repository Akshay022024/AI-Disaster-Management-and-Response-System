using System;


namespace AuthAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }  // Store hashed password
        public string PasswordSalt { get; set; }  // Store salt for password verification
        public DateTime DateOfBirth { get; set; }
    }
}
