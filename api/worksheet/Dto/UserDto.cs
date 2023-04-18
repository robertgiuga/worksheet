using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Models;

namespace worksheet.Dto
{
    public class UserDto
    {
        public UserDto(){}

        public UserDto(User u)
        {
            Id = u.Id;
            Email = u.Email;
            GivenName = u.GivenName;
            Surname = u.Surname;
            DisplayName = u.GivenName + " " + u.Surname;
            Role = u.Role.ToString();
            HolidayDays = u.HolidayDays;
        }

        public int Id { get; set; }

        [MinLength(4)]
        public String Email { get; set; }
        public String DisplayName { get; set; }

        [MinLength(3)]
        public String Surname { get; set; }

        [MinLength(3)]
        public String GivenName { get; set; }

        public int HolidayDays { get; set; }

        public List<ActivityDto> Activities { get; set; }

        public String Role { get; set; }

    }
}
