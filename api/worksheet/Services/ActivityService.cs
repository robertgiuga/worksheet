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

        public ActivityDto AddActivity(ActivityDto activity)
        {
            List<User> users = new();
            foreach (var u in activity.Users)
            {
                users.Add(_worksheetContext.Users.Find(u.Id));
            }

            var savedActivity = new Activity
            {
                Description = activity.Description,
                Name = activity.Name,
                Users = users
            };
            _worksheetContext.Activities.Add(savedActivity);
            _worksheetContext.SaveChanges();
            return new ActivityDto(savedActivity);
        }

        public bool DeleteActivity(int id)
        {
            var activityModel = _worksheetContext.Activities.Where(a => a.Id == id).Include(a => a.Users).FirstOrDefault();
            activityModel.Users.Clear();
            _worksheetContext.SaveChanges();
            _worksheetContext.Activities.Remove(activityModel);
            _worksheetContext.SaveChanges();
            return true;
        }

        public List<ActivityDto> GetActivities()
        {
            return _worksheetContext.Activities.ToListAsync().Result.Select(a=> new ActivityDto(a)).ToList();
        }

        public ActivityDto GetActivity(int id)
        {
            return new ActivityDto(_worksheetContext.Activities.FirstOrDefaultAsync(a => a.Id == id).Result);
        }

        public List<UserDto> GetActivityUsers(int id)
        {
            return _worksheetContext.Activities
                .Where(a=>a.Id==id)
                .Include(a => a.Users)
                .FirstOrDefault()
                .Users.Select(u=>new UserDto(u)).ToList();
        }

        public ActivityDto UpdateActivity(ActivityDto activity)
        {
            List<User> users = new();
            foreach (var u in activity.Users)
            {
               users.Add(_worksheetContext.Users.Find(u.Id));
            }
            Activity activityModel = _worksheetContext.Activities.Where(a => a.Id == activity.Id)
                .Include(a => a.Users)
                .FirstOrDefault();
            activityModel.Users.Clear();
            _worksheetContext.SaveChanges();
            activityModel.Users = users;
            activityModel.Description = activity.Description;
            activityModel.Name = activity.Name;
            _worksheetContext.Activities.Update(activityModel);
            _worksheetContext.SaveChanges();
            return new ActivityDto(activityModel);
        }
    }
}
