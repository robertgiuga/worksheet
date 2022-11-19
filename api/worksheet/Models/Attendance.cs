using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace worksheet.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public User User { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }


    }
}
