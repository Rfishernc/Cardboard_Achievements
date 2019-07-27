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
        readonly IOptions<DbConfiguration> _dbConfig;

        public GameConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
            _dbConfig = dbConfig;
        }

        public Dictionary<int, List<GameAchievement>> GetAllGamesWithAchievements()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Game.Id as GameId, Achievement.Id as AchievementId, Game.Name as GameName, Achievement.Name as AchievementName,
                                        Game.Link, Achievement.Difficulty, Game.Image as GameImage, Game.DateAdded
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

        public IEnumerable<GameAchievement> GetGameDetails(UserAchievementRequest request)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var gameId = request.GameId;
                var queryString = @"Select Game.Id as GameId, Achievement.Id as AchievementId, Game.Name as GameName,
                                        Game.Link, Achievement.Difficulty, Game.Image as GameImage, Achievement.Image as AchievementImage, 
                                        Achievement.Difficulty, Achievement.Description, Achievement.DateAdded, Achievement.Name as AchievementName
                                    From Game
                                    Join Achievement ON Achievement.GameId = Game.Id
                                    Where Game.Id = @GameId AND Achievement.IsApproved = 1";
                var gameAchievements = connection.Query<GameAchievement>(queryString, new { gameId });
                var usersAchievements = new AchievementConnection(_dbConfig).GetUsersAchievementsForGame(request);
                //var achievementsWithCompletionStatus = from gA in gameAchievements
                //                                       join uA in usersAchievements on gA.AchievementId equals uA.AchievementId;
                                                        
                foreach (GameAchievement achievement in gameAchievements)
                {
                    foreach(UserAchievement userAchievement in usersAchievements)
                    {
                        if (achievement.AchievementId == userAchievement.AchievementId)
                        {
                            achievement.Completed = true;
                        }
                    }
                }

                return gameAchievements;
            }
            throw new Exception("Failed to get game details.");
        }

        public int GetNumberOfPlayers(int gameId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Count(*)
                                    From UserGame
                                    Join [User] on [User].Id = UserGame.UserId
                                    Where UserGame.GameId = @GameId";
                var players = connection.QueryFirst<int>(queryString, new { gameId });
                return players;
            }
            throw new Exception("Failed to get player info.");
        }

        public int GetGamePopularity(int gameId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Count(*) as Popularity, GameId, Row_Number() Over (Order by Count(*) Desc) as Ranking
                                    From UserAchievement
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Where UserAchievement.IsApproved = 1
                                    Group by Achievement.GameId
                                    Order by Popularity Desc";
                var popularityRankings = connection.Query<GamePopularity>(queryString);
                var popularity = popularityRankings.Where(game => game.GameId == gameId).Select(listing => listing.Ranking).ToList();
                if (popularity.Count > 0)
                {
                    return popularity[0];
                }
                else
                {
                    return 0;
                }
            }
            throw new Exception("Failed to get player info.");
        }

        public NamesGroup GetNames()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var gameQueryString = @"Select Name, Id
                                        From Game";
                var gameNames = connection.Query<SearchItem>(gameQueryString);

                var achievementQueryString = @"Select Name, Id
                                               From Achievement
                                               Where IsApproved = 1";
                var achievementNames = connection.Query<SearchItem>(achievementQueryString);

                var userQueryString = @"Select Username as Name, Id
                                        From [User]";
                var usernames = connection.Query<SearchItem>(userQueryString);

                var names = new NamesGroup() { GameNames = gameNames, Usernames = usernames, AchievementNames = achievementNames };
                return names;
            }
            throw new Exception("Could not get names");
        }

        public Game GetGameForSearchResult(int gameId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Game.Link, Game.Name, Game.Image
                                    From Game
                                    Join Achievement on Achievement.GameId = Game.Id
                                    Where Game.Id = @GameId AND Achievement.IsApproved = 1";
                var game = connection.Query<Game>(queryString, new { gameId });
                var achievementCount = game.Count();
                var returnGame = new Game() {
                    AchievementCount = achievementCount,
                    Link = game.First().Link,
                    Image = game.First().Image,
                    Name = game.First().Name
                };
                return returnGame;
            }
            throw new Exception("Could not get game");
        }
    }
}
