using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Dto;
using worksheet.Services.Interfaces;

namespace worksheet.Services
{
    public class UserService : IUserService
    {
        private readonly WorksheetContext _worksheetContext;

        public UserService(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public IEnumerable<UserDto> GetUsers()
        {
            return _worksheetContext.Users.Select(u => new UserDto(u)).ToList();
        }
    }
}
