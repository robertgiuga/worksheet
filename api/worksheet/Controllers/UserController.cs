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
using worksheet.Utils;

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
        public async Task<IActionResult> GetUsersAsync()
        {
            return Ok(await _userService.GetUsersAsync());
        }

        [HttpGet("activities")]
        public async Task<IActionResult> GetCurrentUserActivitiesAsync()
        {
            var rez = await _userService.GetUserActivitiesAsync(GetCurrentUser().Id);
            return Ok(rez);
        }

        [HttpGet("{id}/activities")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUserActivitiesAsync(int id)
        {
            return Ok(await _userService.GetUserActivitiesAsync(id));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UserDto user)
        {
            var result = await _userService.UpdateUserAsync(user);
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddUserAsync([FromBody] UserDto user)
        {
            var result = await _userService.AddUserAsync(user);
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpGet("report")]
        [Authorize(Roles = "admin")]
        [FormatFilter]
        public async Task<FileResult> GetMonthlyActivityReport()
        {
            var file = await _userService.CreateMonthlyActivityReportAsync();

            return File(file, "text/csv", "report.csv");
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
