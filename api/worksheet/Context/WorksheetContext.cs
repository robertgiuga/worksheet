using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using worksheet.Context;
using worksheet.Models;

namespace worksheet.Context
{
    public class WorksheetContext : DbContext
    {
        
        public WorksheetContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>().Property(u => u.HolidayDays).HasDefaultValue(21);
            modelBuilder.Entity<HolidayRecord>().Property(u => u.Status).HasDefaultValue(HolidayRecordType.pending);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<HolidayRecord> HolidayRecords { get; set; }
    }
}
