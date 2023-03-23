using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;
using worksheet.Models;

namespace worksheet.Services.Interfaces
{
    public interface IHolidayService
    {
        Task<(int UsedDays, int TotalDays)?> GetUserHolidayDaysAsync(User user);

        Task<HolidayRecordDto?> AddHolidayRequestAsync(HolidayRecordDto holidayRecord);

        Task<IEnumerable<HolidayRecordDto>> GetHolidayPendigRequestsAsync();

        Task<IEnumerable<HolidayRecordDto>> GetUserHolidayRequestsAsync(int userId);

        Task<bool> AcceptHolidayRequestAsync(int holidayRequestId);

        Task<bool> DeclineHolidayRequestAsync(int holidayRequestId);
    }
}
