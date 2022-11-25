using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;

namespace worksheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {

        private readonly WorksheetContext _worksheetContext;

        public UserController(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        [HttpGet]
        public IActionResult getUsers()
        {
            return Ok(_worksheetContext.Users.Select(u=> new UserDto {Id= u.Id, DisplayName = u.GivenName+" "+u.Surname, Email= u.Email }).ToList());
        }
    }
}
