using System;
using System.Collections.Generic;
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
            DisplayName = u.GivenName + " " + u.Surname;
        }

        public int Id { get; set; }
        public String Email { get; set; }
        public String DisplayName { get; set; }
    }
}
