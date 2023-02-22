using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace worksheet.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public DateTime CheckIn { get; set; }
        [Required]
        public DateTime CheckOut { get; set; }
        [Required]
        public Activity Activity { get; set; }
        [MaxLength(50)]
        public String Comment { get; set; }

    }
}
