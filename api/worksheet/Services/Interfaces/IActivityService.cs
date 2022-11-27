using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;

namespace worksheet.Services.Interfaces
{
    public interface IActivityService
    {
        public List<ActivityDto> GetActivities();

        public ActivityDto? GetActivity(int id);

        public List<UserDto> GetActivityUsers(int id);

        public ActivityDto? UpdateActivity(ActivityDto activity);

        public bool DeleteActivity(int id);

        public ActivityDto? AddActivity(ActivityDto activity);
    }
}
