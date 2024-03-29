﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace worksheet.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }
        [Required]
        [MaxLength(50)]
        public string Password { get; set; }
        [Required]
        [MaxLength(50)]
        public string Surname { get; set; }
        [Required]
        [MaxLength(50)]
        public string GivenName { get; set; }
        
        public int HolidayDays { get; set; }

        public int UsedHolidayDays { get; set; }
        public UserRoles Role { get; set; }
        public List<Activity> Activities { get; set; } = new List<Activity>();
        public List<Attendance> Attendances { get; set; } = new List<Attendance>();
        public List<HolidayRecord> HolidayRecords { get; set; } = new List<HolidayRecord>();

        public override bool Equals(object obj)
        {
            return obj is User user &&
                   Id == user.Id;
        }
    }

    public enum UserRoles
    {
        admin,
        user
    }


}
