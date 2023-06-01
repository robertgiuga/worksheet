using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Models;

namespace worksheet.Dto
{
    public class ActivityDto
    {
        public ActivityDto(){}

        public ActivityDto(Activity a)
        {
            Id = a.Id;
            Name = a.Name;
            Description = a.Description;
            if (a.Users.Count > 0)
                Users = a.Users.Select(u => new UserDto(u)).ToList();

        }

        public int Id { get; set; }    
        [MinLength(4)]
        public string Name { get; set; }
        [MinLength(4)]
        public string Description { get; set; }

        public List<UserDto> Users { get; set; }
    }
}
