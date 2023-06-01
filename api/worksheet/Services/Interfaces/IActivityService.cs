using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;

namespace worksheet.Services.Interfaces
{
    public interface IActivityService
    {
        Task<IEnumerable<ActivityDto>> GetActivitiesAsync();

        Task<ActivityDto?> GetActivityAsync(int id);

        Task<IEnumerable<UserDto>> GetActivityUsersAsync(int id);

        Task<ActivityDto?> UpdateActivityAsync(ActivityDto activity);

        Task<bool> DeleteActivityAsync(int id);

        Task<ActivityDto?> AddActivityAsync(ActivityDto activity);
    }
}
