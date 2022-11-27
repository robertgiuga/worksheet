using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;
using worksheet.Models;

namespace worksheet.Services.Interfaces
{
    public interface IUserService
    {
        IEnumerable<UserDto> GetUsers();
        IEnumerable<ActivityDto> GetCurrentUserActivities(User user);
    }
}
