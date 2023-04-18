using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using Microsoft.EntityFrameworkCore;

namespace worksheet.Utils.Jobs
{
    public class HolidayJob : IJob
    {
        private readonly WorksheetContext _worksheetContext;

        public HolidayJob(WorksheetContext worksheetContext)
        {
            _worksheetContext = worksheetContext;
        }

        public Task Execute(IJobExecutionContext context)
        {
            _worksheetContext.Users.ForEachAsync(u => { if (u.HolidayDays - u.UsedHolidayDays > 0) u.HolidayDays = u.HolidayDays + (u.HolidayDays - u.UsedHolidayDays); });
            _worksheetContext.SaveChangesAsync();
            return Task.CompletedTask;
        }
    }
}
