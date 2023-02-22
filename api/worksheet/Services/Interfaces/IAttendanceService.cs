using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;
using worksheet.Models;

namespace worksheet.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<AttendanceDto?> AddAttendanceAsync(AttendanceDto attendance);
        Task<IEnumerable<AttendanceDto>> GetUserAttendanceAsync(User user, DateTime date);
        Task<bool> DeleteAttendanceAsync(int id, User user);
        Task<AttendanceDto> UpdateAttendanceAsync(AttendanceDto attendance, User user);
    }
}
