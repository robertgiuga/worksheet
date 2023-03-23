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
    public class HolidayService : IHolidayService
    {
        private readonly WorksheetContext _worksheetContext;

        public HolidayService(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public async Task<bool> AcceptHolidayRequestAsync(int holidayRequestId)
        {
            var holidayReq = await _worksheetContext.HolidayRecords.Where(h => h.Id == holidayRequestId).Include(h => h.User).FirstAsync();
            if (holidayReq == null)
                return false;

            var days = await this.GetUserHolidayDaysAsync(holidayReq.User);
            if (!days.HasValue)
                return false;
            if (days.Value.UsedDays + (holidayReq.EndDate - holidayReq.StartDate).TotalDays +1> days.Value.TotalDays)
                return false;
            holidayReq.Status = HolidayRecordType.accepted;
            var user = holidayReq.User;
            user.UsedHolidayDays = (int)(days.Value.UsedDays + (holidayReq.EndDate - holidayReq.StartDate).TotalDays) + 1;
            await _worksheetContext.SaveChangesAsync();
            return true;
        }

        public async Task<HolidayRecordDto> AddHolidayRequestAsync(HolidayRecordDto holidayRecord)
        {
            var sameMonthRecords = await _worksheetContext.HolidayRecords
                .Where(h => h.User.Id == holidayRecord.User.Id
                        && (holidayRecord.StartDate.Ticks >= h.StartDate.Ticks && holidayRecord.StartDate.Ticks <= h.EndDate.Ticks
                            || holidayRecord.EndDate.Ticks >= h.StartDate.Ticks && holidayRecord.EndDate.Ticks <= h.EndDate.Ticks)).CountAsync();
            if (sameMonthRecords > 0)
                return null;
            var user = await _worksheetContext.Users.FindAsync(holidayRecord.User.Id);
            var days = await this.GetUserHolidayDaysAsync(user);
            if (days.Value.UsedDays + (holidayRecord.EndDate - holidayRecord.StartDate).TotalDays + 1 > days.Value.TotalDays)
                return null;
            var modelHoliday = new HolidayRecord
            {
                StartDate = holidayRecord.StartDate,
                EndDate = holidayRecord.EndDate,
                User = user
            };
            _worksheetContext.HolidayRecords.Add(modelHoliday);
            await _worksheetContext.SaveChangesAsync();
            return new HolidayRecordDto(modelHoliday);

        }

        public async Task<bool> DeclineHolidayRequestAsync(int holidayRequestId)
        {
            var holidayReq = await _worksheetContext.HolidayRecords.FindAsync(holidayRequestId);
            if (holidayReq == null)
                return false;
            _worksheetContext.HolidayRecords.Remove(holidayReq);
            await _worksheetContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HolidayRecordDto>> GetHolidayPendigRequestsAsync()
        {
            return await _worksheetContext.HolidayRecords.Where(h => h.Status == HolidayRecordType.pending).Include(h => h.User).Select(h=> new HolidayRecordDto(h)).ToListAsync();
        }

        public async Task<(int UsedDays, int TotalDays)?> GetUserHolidayDaysAsync(User user)
        {
            var userDb = await _worksheetContext.Users.FindAsync(user.Id);
            if (userDb == null)
                return null;
            return (userDb.UsedHolidayDays, userDb.HolidayDays);
        }

        public async Task<IEnumerable<HolidayRecordDto>> GetUserHolidayRequestsAsync(int userId)
        {
            return await _worksheetContext.HolidayRecords.Where(h => h.User.Id == userId).Select(h => new HolidayRecordDto { EndDate= h.EndDate, Id= h.Id, StartDate= h.StartDate, Status= h.Status.ToString()}).ToListAsync();
        }
    }
}
