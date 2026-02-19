using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddingSearchFunciton : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserShowEntries_TVShows_TVShowId",
                table: "UserShowEntries");

            migrationBuilder.DropIndex(
                name: "IX_UserShowEntries_TVShowId",
                table: "UserShowEntries");

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "UserShowEntries",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "UserShowEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserShowEntries_TVShowId",
                table: "UserShowEntries",
                column: "TVShowId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserShowEntries_TVShows_TVShowId",
                table: "UserShowEntries",
                column: "TVShowId",
                principalTable: "TVShows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
