using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Dto;

namespace worksheet.Services.Interfaces
{
    public interface IUserService
    {
        public IEnumerable<UserDto> GetUsers();
    }
}
