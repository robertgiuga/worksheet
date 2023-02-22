using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Models;

namespace worksheet.Dto
{
    public class AttendanceDto
    {
        public AttendanceDto() { }
       
        public AttendanceDto(Attendance attendaceModel)
        {
            Id = attendaceModel.Id;
            User = new UserDto(attendaceModel.User);
            Activity = new ActivityDto(attendaceModel.Activity);
            CheckIn = attendaceModel.CheckIn;
            CheckOut = attendaceModel.CheckOut;
            Comment = attendaceModel.Comment;
        }

        [Required]
        public int Id { get; set; }
        public UserDto User { get; set; }
        [Required]
        public DateTime CheckIn { get; set; }
        [Required]
        public DateTime CheckOut { get; set; }
        [Required]
        public ActivityDto Activity { get; set; }
        [Required]
        [MaxLength(40)]
        public string Comment { get; set; }
    }
}
