﻿using Microsoft.EntityFrameworkCore;
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
    public class AttendanceService : IAttendanceService
    {
        private readonly WorksheetContext _worksheetContext;

        public AttendanceService(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public async Task<AttendanceDto> AddAttendanceAsync(AttendanceDto attendance)
        {
            var userModel = await _worksheetContext.Users.FindAsync(attendance.User.Id);
            if (userModel == null)
                return null;
            var activityModel = await _worksheetContext.Activities.FindAsync(attendance.Activity.Id);
            if (activityModel == null)
                return null;

            var attendaceModel = new Attendance
            {
                User = userModel,
                Activity = activityModel,
                CheckIn = attendance.CheckIn,
                CheckOut = attendance.CheckOut,
                Comment = attendance.Comment
            };
            _worksheetContext.Attendances.Add(attendaceModel);
            await _worksheetContext.SaveChangesAsync();
            return new AttendanceDto(attendaceModel);
        }

        public async Task<bool> DeleteAttendanceAsync(int id, User user)
        {
            var attendanceModel =await _worksheetContext.Attendances.Where(a=>a.Id==id).Include(a=>a.User).FirstOrDefaultAsync();
            if (attendanceModel == null)
                return false;
            if (attendanceModel.User.Id != user.Id)
                return false;
            _worksheetContext.Attendances.Remove(attendanceModel);
            await _worksheetContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AttendanceDto>> GetUserAttendanceAsync(User user, DateTime date)
        {
            return await _worksheetContext.Attendances.Where(a => a.User.Id == user.Id && a.CheckIn.Date == date.Date).Include(a=>a.Activity).Select(a=> 
            new AttendanceDto
            {
                Id = a.Id,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                Comment= a.Comment,
                Activity= new ActivityDto(a.Activity)
            }).ToListAsync();
        }

        public async Task<AttendanceDto> UpdateAttendanceAsync(AttendanceDto attendance, User user)
        {
            var attendanceModel = await _worksheetContext.Attendances.Where(a => a.Id == attendance.Id).Include(a => a.User).FirstOrDefaultAsync();
            if (attendanceModel == null)
                return null;
            if (attendanceModel.User.Id != user.Id)
                return null;
            attendanceModel.Activity = await _worksheetContext.Activities.FindAsync(attendance.Activity.Id);
            attendanceModel.CheckIn = attendance.CheckIn;
            attendanceModel.CheckOut = attendance.CheckOut;
            attendanceModel.Comment = attendance.Comment;
            _worksheetContext.Attendances.Update(attendanceModel);
            await _worksheetContext.SaveChangesAsync();
            return new AttendanceDto
            {
                Id = attendanceModel.Id,
                Activity = new ActivityDto(attendanceModel.Activity),
                CheckIn = attendanceModel.CheckIn,
                CheckOut = attendanceModel.CheckOut,
                Comment = attendanceModel.Comment
            };
        }
    }
}
