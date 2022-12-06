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
        public async Task<IActionResult> GetActivitiesAsync()
        {
            return Ok(await _activityService.GetActivitiesAsync());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetActivityAsync(int id)
        {
            var result = await _activityService.GetActivityAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpGet("users/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetActivityUsersAsync(int id)
        {
         
            return Ok(await _activityService.GetActivityUsersAsync(id));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateActivityAsync([FromBody] ActivityDto activity)
        {
            var result = await _activityService.UpdateActivityAsync(activity);
            if (result == null)
                return Problem();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteActivityAsync(int id)
        {
            var result = await _activityService.DeleteActivityAsync(id);
            if (result == false)
                return Problem();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddActivityAsync([FromBody] ActivityDto activityDto)
        {
            var result = await _activityService.AddActivityAsync(activityDto);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
    }
}
