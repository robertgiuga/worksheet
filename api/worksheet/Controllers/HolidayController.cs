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
    public class HolidayController : ControllerBase
    {
        private readonly IHolidayService _holidayService;

        public HolidayController(IHolidayService holidayService)
        {
            _holidayService = holidayService;
        }


        [HttpGet("days")]
        public async Task<IActionResult> GetUserHolidayDaysAsync()
        {
            var result = await _holidayService.GetUserHolidayDaysAsync(GetCurrentUser());
            if (result == null)
                return Problem();
            return Ok(new { UsedDays = result.Value.UsedDays, TotalDays = result.Value.TotalDays });
        }

        [HttpPost()]
        public async Task<IActionResult> AddHolidayRequestAsync([FromBody] HolidayRecordDto holidayRecord)
        {
            Console.WriteLine(holidayRecord.StartDate);
            holidayRecord.User = new UserDto(GetCurrentUser());
            var result = await _holidayService.AddHolidayRequestAsync(holidayRecord);
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpGet("requests")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetHolidayPendigRequestsAsync()
        {
            var result = await  _holidayService.GetHolidayPendigRequestsAsync();
            return Ok(result);
        }

        [HttpGet("my-requests")]
        public async Task<IActionResult> GetCurrentUserHolidayRequestAsync()
        {
            //migth be better for month values
            var result = await _holidayService.GetUserHolidayRequestsAsync(GetCurrentUser().Id);
            return Ok(result);
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
