using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProfiWay.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class Second : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompetenceName",
                table: "ResumeCompetences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompetenceName",
                table: "ResumeCompetences");
        }
    }
}
