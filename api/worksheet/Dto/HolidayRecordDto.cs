using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Models;

namespace worksheet.Dto
{
    public class HolidayRecordDto
    {
        public HolidayRecordDto() { }

        public HolidayRecordDto(HolidayRecord holiday)
        {
            Id = holiday.Id;
            User = new UserDto(holiday.User);
            StartDate = holiday.StartDate;
            EndDate = holiday.EndDate;
        }
        public int Id { get; set; }

        public UserDto User { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
