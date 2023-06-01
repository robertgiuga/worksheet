using Microsoft.EntityFrameworkCore.Migrations;

namespace worksheet.Migrations
{
    public partial class updatedattendance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActivityId",
                table: "Attendances",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Attendances",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_ActivityId",
                table: "Attendances",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Activities_ActivityId",
                table: "Attendances",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Activities_ActivityId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_ActivityId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Attendances");
        }
    }
}
