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
        Task<IEnumerable<UserDto>> GetUsersAsync();
        Task<IEnumerable<ActivityDto>> GetUserActivitiesAsync(int userId);
        Task<UserDto?> UpdateUserAsync(UserDto user);
        Task<UserDto?> AddUserAsync(UserDto user);
        Task<byte[]> CreateMonthlyActivityReportAsync();
    }
}
