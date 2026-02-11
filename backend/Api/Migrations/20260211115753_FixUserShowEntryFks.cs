using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class FixUserShowEntryFks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP CONSTRAINT IF EXISTS \"FK_UserShowEntries_TVShows_TVShowId1\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP CONSTRAINT IF EXISTS \"FK_UserShowEntries_UserLists_UserListId1\";");

            migrationBuilder.Sql(
                "DROP INDEX IF EXISTS \"IX_UserShowEntries_TVShowId1\";");

            migrationBuilder.Sql(
                "DROP INDEX IF EXISTS \"IX_UserShowEntries_UserListId1\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP COLUMN IF EXISTS \"TVShowId1\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP COLUMN IF EXISTS \"UserListId1\";");

            migrationBuilder.Sql(
                "DELETE FROM \"UserShowEntries\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP COLUMN IF EXISTS \"UserListId\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" ADD COLUMN IF NOT EXISTS \"UserListId\" integer NOT NULL;");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" DROP COLUMN IF EXISTS \"TVShowId\";");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" ADD COLUMN IF NOT EXISTS \"TVShowId\" integer NOT NULL;");

            migrationBuilder.CreateIndex(
                name: "IX_UserShowEntries_TVShowId",
                table: "UserShowEntries",
                column: "TVShowId");

            migrationBuilder.CreateIndex(
                name: "IX_UserShowEntries_UserListId",
                table: "UserShowEntries",
                column: "UserListId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserShowEntries_TVShows_TVShowId",
                table: "UserShowEntries",
                column: "TVShowId",
                principalTable: "TVShows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserShowEntries_UserLists_UserListId",
                table: "UserShowEntries",
                column: "UserListId",
                principalTable: "UserLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserShowEntries_TVShows_TVShowId",
                table: "UserShowEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_UserShowEntries_UserLists_UserListId",
                table: "UserShowEntries");

            migrationBuilder.DropIndex(
                name: "IX_UserShowEntries_TVShowId",
                table: "UserShowEntries");

            migrationBuilder.DropIndex(
                name: "IX_UserShowEntries_UserListId",
                table: "UserShowEntries");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" ALTER COLUMN \"UserListId\" TYPE uuid USING \"UserListId\"::uuid;");

            migrationBuilder.Sql(
                "ALTER TABLE \"UserShowEntries\" ALTER COLUMN \"TVShowId\" TYPE uuid USING \"TVShowId\"::uuid;");

            migrationBuilder.AddColumn<int>(
                name: "TVShowId1",
                table: "UserShowEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserListId1",
                table: "UserShowEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserShowEntries_TVShowId1",
                table: "UserShowEntries",
                column: "TVShowId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserShowEntries_UserListId1",
                table: "UserShowEntries",
                column: "UserListId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserShowEntries_TVShows_TVShowId1",
                table: "UserShowEntries",
                column: "TVShowId1",
                principalTable: "TVShows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserShowEntries_UserLists_UserListId1",
                table: "UserShowEntries",
                column: "UserListId1",
                principalTable: "UserLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
