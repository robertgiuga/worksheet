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
using worksheet.Services.Interfaces;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivityController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult GetActivities()
        {

            return Ok(_activityService.GetActivities());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult GetActivity(int id)
        {
            return Ok(_activityService.GetActivity(id));
        }

        [HttpGet("users/{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult GetActivityUsers(int id)
        {
         
            return Ok(_activityService.GetActivityUsers(id));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateActivity([FromBody] ActivityDto activity)
        {
            return Ok(_activityService.UpdateActivity(activity));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteActivity(int id)
        {
            return Ok(_activityService.DeleteActivity(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult AddActivity([FromBody] ActivityDto activityDto)
        {
            return Ok(_activityService.AddActivity(activityDto));
        }
    }
}
