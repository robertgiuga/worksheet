using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;

namespace worksheet.Services
{
    public class UserService : IUserService
    {
        private readonly WorksheetContext _worksheetContext;

        public UserService(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public async Task<UserDto> AddUserAsync(UserDto user)
        {
            List<Activity> activities = new();
            foreach (var a in user.Activities)
            {
                var activity = _worksheetContext.Activities.Find(a.Id);
                if (activity == null)
                    return null;
                activities.Add(activity);
            }
            if (!Enum.TryParse(user.Role, out UserRoles role))
                return null;
            var modelUser = new User
            {
                Email = user.Email,
                GivenName = user.GivenName,
                Role = role,
                Activities = activities,
                Surname = user.Surname,
                Password = "12345"
            };
            _worksheetContext.Users.Add(modelUser);
            await _worksheetContext.SaveChangesAsync();
            return new UserDto(modelUser);
        }

        public async Task<IEnumerable<ActivityDto>> GetUserActivitiesAsync(int userId)
        {
            var result = await _worksheetContext.Users
                 .Where(u => u.Id == userId)
                 .Include(u => u.Activities)
                 .FirstOrDefaultAsync();
            return result.Activities.Select(a => new ActivityDto { Id = a.Id, Name = a.Name, Description = a.Description }).ToList();
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync()
        {
            return await _worksheetContext.Users.Select(u => new UserDto(u)).ToListAsync();
        }

        public async Task<UserDto> UpdateUserAsync(UserDto user)
        {

            List<Activity> activities = new();
            foreach(var a in user.Activities)
            {
                var activity = _worksheetContext.Activities.Find(a.Id);
                if (activity==null)
                    return null;
                activities.Add(activity);
            }
            var userModel = _worksheetContext.Users.Where(u => u.Id == user.Id).Include(u => u.Activities).FirstOrDefault();
            UserRoles role;
            if (!Enum.TryParse(user.Role, out role))
                return null;
            userModel.Activities.Clear();
            await _worksheetContext.SaveChangesAsync();
            userModel.Activities = activities;
            userModel.Email = user.Email;
            userModel.GivenName = user.GivenName;
            userModel.Surname = user.Surname;
            userModel.Role = role;
            _worksheetContext.Update(userModel);
            await _worksheetContext.SaveChangesAsync();
            return new UserDto(userModel);
        }
    }
}
