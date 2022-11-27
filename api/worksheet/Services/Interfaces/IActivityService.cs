using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;

namespace worksheet.Services.Interfaces
{
    public interface IActivityService
    {
        IEnumerable<ActivityDto> GetActivities();

        ActivityDto? GetActivity(int id);

        IEnumerable<UserDto> GetActivityUsers(int id);

        ActivityDto? UpdateActivity(ActivityDto activity);

        bool DeleteActivity(int id);

        ActivityDto? AddActivity(ActivityDto activity);
    }
}
