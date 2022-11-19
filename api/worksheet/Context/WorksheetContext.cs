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
            modelBuilder.Entity<UserActivity>().HasKey(ua => new { ua.UserId, ua.ActivityId });
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
    }
}
