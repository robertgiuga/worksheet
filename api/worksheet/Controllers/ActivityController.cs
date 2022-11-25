using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ActivityController : ControllerBase
    {
        private readonly WorksheetContext _worksheetContext;

        public ActivityController(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        [HttpGet]
        public IActionResult getActivities()
        {

            return Ok(_worksheetContext.Activities.ToListAsync().Result);
        }

        [HttpGet("{id}")]
        public IActionResult getActivity(int id)
        {
            return Ok(_worksheetContext.Activities.FirstOrDefaultAsync(a => a.Id == id).Result);
        }

        [HttpGet("users/{id}")]
        public IActionResult getActivityUsers(int id)
        {

            return Ok(_worksheetContext.Activities
                .Where(a => a.Id == id)
                .Include(a => a.Users).Select(a => a.Users.Select(
                    u => new UserDto
                    {
                        Id= u.Id,
                        DisplayName = u.GivenName + " " + u.Surname,
                        Email = u.Email
                    })).First());
        }

        [HttpPut("{id}")]
        public IActionResult updateActivity([FromBody] Activity activity)
        {
            return Ok(_worksheetContext.Activities.Update(activity));
        }
    }
}
