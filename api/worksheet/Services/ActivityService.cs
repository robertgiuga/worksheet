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
    public class ActivityService : IActivityService
    {
        private readonly WorksheetContext _worksheetContext;

        public ActivityService(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public async Task<ActivityDto> AddActivityAsync(ActivityDto activity)
        {
            List<User> users = new();
            foreach (var u in activity.Users)
            {
                var result = await _worksheetContext.Users.FindAsync(u.Id);
                if (result == null)
                    return null;
                users.Add(result);
            }

            var savedActivity = new Activity
            {
                Description = activity.Description,
                Name = activity.Name,
                Users = users
            };
            await _worksheetContext.Activities.AddAsync(savedActivity);
            await _worksheetContext.SaveChangesAsync();
            return new ActivityDto(savedActivity);
        }

        public async Task<bool> DeleteActivityAsync(int id)
        {
            var activityModel = await _worksheetContext.Activities.Where(a => a.Id == id).Include(a => a.Users).FirstOrDefaultAsync();
            if (activityModel == null)
                return false;
            activityModel.Users.Clear();
            await _worksheetContext.SaveChangesAsync();
            _worksheetContext.Activities.Remove(activityModel);
            await _worksheetContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ActivityDto>> GetActivitiesAsync()
        {
            return (await _worksheetContext.Activities.ToListAsync()).Select(a=> new ActivityDto(a)).ToList();
        }

        public async Task<ActivityDto> GetActivityAsync(int id)
        {
            return new ActivityDto(await _worksheetContext.Activities.FirstOrDefaultAsync(a => a.Id == id));
        }

        public async Task<IEnumerable<UserDto>> GetActivityUsersAsync(int id)
        {
            return (await _worksheetContext.Activities
                .Where(a=>a.Id==id)
                .Include(a => a.Users)
                .FirstOrDefaultAsync())
                .Users.Select(u=>new UserDto(u)).ToList();
        }

        public async Task<ActivityDto> UpdateActivityAsync(ActivityDto activity)
        {
            List<User> users = new();
            foreach (var u in activity.Users)
            {
                var result = await _worksheetContext.Users.FindAsync(u.Id);
                if (result == null)
                    return null;
               users.Add(result);
            }
            Activity activityModel = await _worksheetContext.Activities.Where(a => a.Id == activity.Id)
                .Include(a => a.Users)
                .FirstOrDefaultAsync();
            if (activityModel == null)
                return null;
            activityModel.Users.Clear();
            await _worksheetContext.SaveChangesAsync();
            activityModel.Users = users;
            activityModel.Description = activity.Description;
            activityModel.Name = activity.Name;
            _worksheetContext.Activities.Update(activityModel);
            await _worksheetContext.SaveChangesAsync();
            return new ActivityDto(activityModel);
        }
    }
}
