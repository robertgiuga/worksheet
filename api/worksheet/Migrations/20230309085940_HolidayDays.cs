using Microsoft.EntityFrameworkCore.Migrations;

namespace worksheet.Migrations
{
    public partial class HolidayDays : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HolidayDays",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 21);

            migrationBuilder.AddColumn<int>(
                name: "UsedHolidayDays",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HolidayDays",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UsedHolidayDays",
                table: "Users");
        }
    }
}
