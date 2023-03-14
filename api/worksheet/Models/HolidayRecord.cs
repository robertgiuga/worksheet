using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace worksheet.Models
{
    public class HolidayRecord
    {
        public int Id { get; set; }

        [Required]
        public User User { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public HolidayRecordType Status { get; set; }

    }

    public enum HolidayRecordType
    {
        pending,
        accepted,
        rejected
    }
}
