using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost]
        public async Task<IActionResult> AddCurrentUserAttendanceAsync([FromBody] AttendanceDto attendance)
        {
            attendance.User = new UserDto(GetCurrentUser());
            var result = await _attendanceService.AddAttendanceAsync(attendance);
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpGet("{date}")]
        public async Task<IActionResult> GetCurrentUserAttendanceAsync(DateTime date)
        {
            return Ok(await _attendanceService.GetUserAttendanceAsync(GetCurrentUser(), date));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendanceAsync(int id)
        {
            var result = await _attendanceService.DeleteAttendanceAsync(id,GetCurrentUser());
            if (!result)
                return Problem();
            return Ok();
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateAttendanceAsync([FromBody] AttendanceDto attendance)
        {
            var result = await _attendanceService.UpdateAttendanceAsync(attendance, GetCurrentUser());
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpGet("hours")]
        public async Task<IActionResult> GetCurrentUserHoursAsync()
        {
            var result = await _attendanceService.GetUserHoursAsync(GetCurrentUser());
            if (result == null)
                return Problem();
            return Ok(new { TotalHours= result.Value.TotalHours, WorkedHours= result.Value.WorkedHours, ExtraHours= result.Value.ExtraHours });
        }

        private User GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
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
