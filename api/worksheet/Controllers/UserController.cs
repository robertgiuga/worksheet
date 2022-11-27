using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult getUsers()
        {
            return Ok(_userService.GetUsers());
        }

        [HttpGet("activities")]
        public IActionResult getCurrentUserActivities()
        {
            return Ok(_userService.GetCurrentUserActivities(GetCurrentUser()));
        }

        private User GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null) {
                var claims = identity.Claims;
                return new User
                {
                    Email = claims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    Id = int.Parse(claims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value),
                    GivenName = claims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    Surname = claims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                    Role = claims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value == "admin" ? UserRoles.admin : UserRoles.user
                };
            }
            return null;
        }
        

    }
}
