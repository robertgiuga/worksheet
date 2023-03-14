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
        public async Task<HolidayRecordDto> AddHolidayRequestAsync(HolidayRecordDto holidayRecord)
        {
            var sameMonthRecords = await _worksheetContext.HolidayRecords
                .Where(h => h.User.Id == holidayRecord.User.Id
                        && (holidayRecord.StartDate.Ticks >= h.StartDate.Ticks && holidayRecord.StartDate.Ticks <= h.EndDate.Ticks
                            || holidayRecord.EndDate.Ticks >= h.StartDate.Ticks && holidayRecord.EndDate.Ticks <= h.EndDate.Ticks)).CountAsync();
            if (sameMonthRecords > 0)
                return null;
            var modelHoliday = new HolidayRecord
            {
                StartDate = holidayRecord.StartDate,
                EndDate = holidayRecord.EndDate,
                User = await _worksheetContext.Users.FindAsync(holidayRecord.User.Id)
            };
            _worksheetContext.HolidayRecords.Add(modelHoliday);
            await _worksheetContext.SaveChangesAsync();
            return new HolidayRecordDto(modelHoliday);

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
            return await _worksheetContext.HolidayRecords.Where(h => h.User.Id == userId).Select(h => new HolidayRecordDto { EndDate= h.EndDate, Id= h.Id, StartDate= h.StartDate}).ToListAsync();
        }
    }
}
