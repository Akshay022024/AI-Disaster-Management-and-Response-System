using Microsoft.EntityFrameworkCore;
using AuthAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var configuration = builder.Configuration;

// Get JWT secret key
var key = Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]);

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["JwtSettings:Issuer"],
            ValidAudience = configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Configure CORS to allow frontend to communicate with API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificAndAll", builder =>
        builder.WithOrigins("http://localhost:5173") // React Frontend
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials()); // Allow cookies
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificAndAll"); // Enable CORS before authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
