using capstone.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace capstone.Connections
{
    public class GameConnection
    {
        readonly string _connectionString;
        public GameConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public Dictionary<int, List<GameAchievement>> GetAllGamesWithAchievements()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Game.Id as GameId, Achievement.Id as AchievementId, Game.Name as GameName, Achievement.Name as AchievementName,
                                        Game.Link, Achievement.Difficulty, Achievement.DateAdded, Achievement.Description,
                                        Game.Image as GameImage, Achievement.Image as AchievementImage
                                    From Game
                                    Join Achievement ON Achievement.GameId = Game.Id
                                    Where Achievement.IsApproved = 1";
                var games = connection.Query<GameAchievement>(queryString);
                var groupedAchievements = games.GroupBy(achievement => achievement.GameId);
                var gamesWithAchieves = groupedAchievements.ToDictionary(x => x.Key, x => x.ToList());
                return gamesWithAchieves;
            }
            throw new Exception("Failed to return games list.");
        }
    }
}
