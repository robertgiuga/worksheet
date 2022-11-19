using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;
using worksheet.Utils;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IPasswordHasher _passwordHasher;
        private readonly WorksheetContext _worksheetContext;
        private readonly IAuthService _authService;

        public AuthenticateController(IConfiguration config, IPasswordHasher passwordHasher, WorksheetContext worksheetContext, IAuthService authService)
        {
            _config = config;
            _passwordHasher = passwordHasher;
            _worksheetContext = worksheetContext;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            var result = _authService.LogIn(userLogin);
            if (result == null)
                return NotFound();
            return Ok(new {
                Token = result.Value.token, 
                ExpiresIn = result.Value.expiresIn, 
                FullName = result.Value.user.Surname + " " + result.Value.user.GivenName, 
                Role = result.Value.user.Role.ToString() });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Signin([FromBody] User user)
        {
            _worksheetContext.Users.AddAsync(new User
            {
                Email= user.Email,
                GivenName= user.GivenName,
                Surname= user.Surname,
                Password= _passwordHasher.Hash(user.Password),
                Role= UserRoles.admin
            });
            _worksheetContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("users")]
        [Authorize(Roles = "admin")]
        public IActionResult GetUsers()
        {
            return Ok(_worksheetContext.Users.ToArray());
        }
    }
}
