using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;

namespace worksheet.Utils
{
    public interface IValidator
    {
        public bool ValidateUser(UserDto user);

        public bool ValidateActivity(ActivityDto user);

    }
}
