using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;
using worksheet.Utils;

namespace worksheet.Services
{
    public class AuthService : IAuthService
    {
        private readonly WorksheetContext _worksheetContext;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IConfiguration _config;
        private const int tokenExpireTime= 15;

        public AuthService(WorksheetContext worksheetContext, IPasswordHasher passwordHasher, IConfiguration config)
        {
            _worksheetContext = worksheetContext;
            _passwordHasher = passwordHasher;
            _config = config;
        }

        public (string token, int expiresIn, User user)? LogIn(UserLogin userLogin)
        {
            var user = _worksheetContext.Users.Where(u => u.Email == userLogin.Email).SingleOrDefault();

            if (user.Email!=userLogin.Email)
                return null;
            if (!_passwordHasher.Check(user.Password, userLogin.Password).Verified)
                return null;


            return (GenerateToken(user), tokenExpireTime, user);
        }

        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(ClaimTypes.GivenName, user.GivenName),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(tokenExpireTime),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
