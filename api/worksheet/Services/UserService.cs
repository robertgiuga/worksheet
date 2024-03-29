﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Models;
using worksheet.Services.Interfaces;
using worksheet.Utils;

namespace worksheet.Services
{
    public class UserService : IUserService
    {
        private readonly WorksheetContext _worksheetContext;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IAttendanceService _attendanceService;

        public UserService(WorksheetContext worksheetContext, IPasswordHasher passwordHasher, IAttendanceService attendanceService)
        {
            _worksheetContext = worksheetContext;
            _passwordHasher = passwordHasher;
            _attendanceService = attendanceService;
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
                Password = _passwordHasher.Hash("12345")
            };
            _worksheetContext.Users.Add(modelUser);
            await _worksheetContext.SaveChangesAsync();
            return new UserDto(modelUser);
        }

        public async Task<byte[]> CreateMonthlyActivityReportAsync()
        {
            var csvFile = new StringBuilder();
            var today = DateTime.Now;
            csvFile.AppendLine(today.ToString());
            csvFile.AppendLine("Employee Name;Day of Month");
            csvFile.Append(";");
            Enumerable.Range(1, DateTime.DaysInMonth(today.Year, today.Month)).ToList().ForEach(day => {
                csvFile.Append(day).Append(";");
            });
            csvFile.Append("Worked Hours").Append(";").Append("Extra Hours").Append(";");
            csvFile.AppendLine();

            var fisrtDateOfMonth = new DateTime(today.Year, today.Month, 1);
            var lastDateOfMonth = new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month));
            var users = await _worksheetContext.Users
                .Include(u => u.Attendances.Where(a => fisrtDateOfMonth.Date <= a.CheckIn.Date && a.CheckIn.Date <= lastDateOfMonth.Date))
                    .ThenInclude(a=>a.Activity)
                .ToListAsync();
            users.ForEach(async u =>
            {
                csvFile.Append(u.GivenName).Append(" ").Append(u.Surname).Append(";");
                var indexDay = fisrtDateOfMonth;
                Enumerable.Range(1, DateTime.DaysInMonth(today.Year, today.Month)).ToList().ForEach(day =>
                {
                    var result = u.Attendances.Where(a => a.CheckIn.Date == indexDay.Date).ToList();
                    if (result.Count>0)
                    {
                        result.ForEach(r =>
                        {
                            csvFile.Append(r.CheckIn.TimeOfDay)
                                   .Append("-").Append(r.CheckOut.TimeOfDay).Append(" ")
                                   .Append(r.Comment.Trim()).Append(" ").Append(r.Activity.Name)
                                   .Append("  ");
                        });
                        csvFile.Append(";");
                    }
                    else
                    {
                        var holiday = this._worksheetContext.HolidayRecords.Where(h => h.User.Id == u.Id && h.StartDate <= indexDay.Date && indexDay.Date <= h.EndDate && h.Status == HolidayRecordType.accepted).FirstOrDefault();
                        if (holiday != null)
                        {
                            csvFile.Append("Holiday;");
                        }
                        else
                            csvFile.Append("-;");
                    }
                    indexDay = indexDay.AddDays(1);
                });
                
                var result =await  this._attendanceService.GetUserMinutesAsync(u);
                if (result.HasValue)
                {
                    csvFile.Append(result.Value.WorkedMinutes / 60).Append(":").Append(result.Value.WorkedMinutes % 60).Append(";")
                    .Append(result.Value.ExtraMinutes / 60).Append(":").Append(result.Value.ExtraMinutes % 60).Append(";");
                }
                csvFile.AppendLine();
            });
            return Encoding.Unicode.GetBytes(csvFile.ToString());
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
            userModel.HolidayDays = user.HolidayDays;
            _worksheetContext.Update(userModel);
            await _worksheetContext.SaveChangesAsync();
            return new UserDto(userModel);
        }
    }
}
