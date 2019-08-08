using capstone.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using System.Data.SqlClient;

namespace capstone.Connections
{
    public class AchievementConnection
    {
        readonly string _connectionString;
        readonly IOptions<DbConfiguration> _dbConfig;

        public AchievementConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
            _dbConfig = dbConfig;
        }

        public IEnumerable<UserAchievement> GetUsersAchievementsForGame(UserAchievementRequest request)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select UserAchievement.UserId, UserAchievement.AchievementId, Achievement.Difficulty
                                    From UserAchievement
                                    Join Achievement on UserAchievement.AchievementId = Achievement.Id
                                    Where UserAchievement.UserId = @UserId AND UserAchievement.IsApproved = 1 AND Achievement.GameId = @GameId";
                var parameters = new { request.UserId, request.GameId };
                var achievements = connection.Query<UserAchievement>(queryString, parameters);
                return achievements;
            }
            throw new Exception("It didn't work.");
        }

        public IEnumerable<GamePopularity> GetPopularity()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Count(*) as Popularity, GameId
                                    From UserAchievement
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Where UserAchievement.IsApproved = 1
                                    Group by Achievement.GameId";
                var popularity = connection.Query<GamePopularity>(queryString);
                return popularity;
            }
            throw new Exception("It didn't work.");
        }

        public Dictionary<int, List<GameAchievement>> GetUsersAchievements(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Achievement.GameId, Achievement.Difficulty, Achievement.Name as AchievementName, Achievement.Id as AchievementId,
                                    Achievement.Description, Achievement.Image as AchievementImage, Achievement.DateAdded, UserAchievement.DateSubmitted
                                    From UserAchievement
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Where UserAchievement.IsApproved = 1 AND UserAchievement.UserId = @UserId";
                var achievements = connection.Query<GameAchievement>(queryString, new { userId });
                var groupedAchievements = achievements.GroupBy(achievement => achievement.GameId);
                return groupedAchievements.ToDictionary(x => x.Key, x => x.ToList());
            }
            throw new Exception("It didn't work.");
        }

        public bool UserAchievementExists(int achievementId, int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select *
                                    From UserAchievement
                                    Where AchievementId = @AchievementId AND UserId = @UserId";
                var existenceState = connection.Query<int>(queryString, new { achievementId, userId }).SingleOrDefault();
                return existenceState > 0;
            }
            throw new Exception("It didn't work.");
        }

        public NewUserAchievement SubmitAchievement(NewUserAchievementRequest newAchievementRequest)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                if (!UserAchievementExists(newAchievementRequest.AchievementId, newAchievementRequest.UserId))
                {
                    var newAchievement = new NewUserAchievement()
                    {
                        UserId = newAchievementRequest.UserId,
                        AchievementId = newAchievementRequest.AchievementId,
                        Link = newAchievementRequest.Link,
                        IsApproved = false,
                        IsPending = true,
                        DateSubmitted = DateTime.Now
                    };
                    var queryString = @"Insert into UserAchievement(UserId, AchievementId, Link, IsPending, IsApproved, DateSubmitted)
                                    Output inserted.*
                                    Values(@UserId, @AchievementId, @Link, @IsPending, @IsApproved, @DateSubmitted)";
                    var achievement = connection.QueryFirstOrDefault<NewUserAchievement>(queryString, newAchievement);
                    return achievement;
                }
            }
            throw new Exception("Could not post new achievement.");
        }

        public IEnumerable<Achievement> GetRecentAchievements()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Top(10) Achievement.Id as AchievementId, GameId, Achievement.DateAdded, Difficulty, Description,
                                        Achievement.Image, Achievement.Name as AchievementName, Game.Name as GameName
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Where IsApproved = 1
                                    Order by DateAdded Desc";
                var achievements = connection.Query<Achievement>(queryString);
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public IEnumerable<Achievement> GetRecentAchievements(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Top(10) Achievement.Id as AchievementId, GameId, Achievement.DateAdded, Difficulty, Description,
                                        Achievement.Image, Achievement.Name as AchievementName, Game.Name as GameName, UserAchievement.IsApproved as Completed
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Left Join UserAchievement on UserAchievement.AchievementId = Achievement.Id
                                        AND UserAchievement.UserId = @UserId AND UserAchievement.IsApproved = 1
                                    Where Achievement.IsApproved = 1
                                    Order by DateAdded Desc";
                var achievements = connection.Query<Achievement>(queryString, new { userId });
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public IEnumerable<Achievement> GetRecentProposedAchievements(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Top(10) Achievement.Id as AchievementId, GameId, Achievement.DateSubmitted, Difficulty, Description,
                                        Achievement.Image, Achievement.Name as AchievementName, Game.Name as GameName, Vote.Id as VoteId
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Left Join Vote on Vote.AchievementId = Achievement.Id AND Vote.UserId = @UserId
                                    Where VotingIsActive = 1 
                                    Order by DateSubmitted Desc";
                var achievements = connection.Query<Achievement>(queryString, new { userId });
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public IEnumerable<Achievement> GetRecentProposedAchievements()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Top(10) Achievement.Id as AchievementId, GameId, Achievement.DateSubmitted, Difficulty, Description,
                                        Achievement.Image, Achievement.Name as AchievementName, Game.Name as GameName
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Where VotingIsActive = 1 
                                    Order by DateSubmitted Desc";
                var achievements = connection.Query<Achievement>(queryString);
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public IEnumerable<Achievement> GetProposedAchievementsForGame(ProposedAchievementsForGameRequest request)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Achievement.Id as AchievementId, Achievement.DateSubmitted, Difficulty, Description,
                                        Achievement.Image, Achievement.Name as AchievementName, Vote.Id as VoteId
                                    From Achievement
                                    Left Join Vote on Vote.AchievementId = Achievement.Id AND Vote.UserId = @UserId
                                    Where VotingIsActive = 1 AND Achievement.GameId = @GameId
                                    Order by DateSubmitted Desc";
                var achievements = connection.Query<Achievement>(queryString, request);
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public Achievement GetAchievementForSearchResult(int achievementId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Achievement.Name as AchievementName, Game.Name as GameName, Achievement.DateAdded, Achievement.Description,
                                        Achievement.Image, Achievement.Difficulty
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Where Achievement.Id = @AchievementId AND IsApproved = 1";
                var achievement = connection.QueryFirstOrDefault<Achievement>(queryString, new { achievementId });
                if (achievement != null)
                {
                    return achievement;
                }
            }
            throw new Exception("Could not get achievement");
        }

        public IEnumerable<Achievement> GetSearchedAchievements(string[] names)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Achievement.Name as AchievementName, Game.Name as GameName, Achievement.DateAdded, Achievement.Description,
                                        Achievement.Image, Achievement.Difficulty, Achievement.Id as AchievementId, Game.Id as GameId
                                    From Achievement
                                    Join Game on Game.Id = Achievement.GameId
                                    Where Achievement.Name In @Names";
                var achievements = connection.Query<Achievement>(queryString, new { names });
                return achievements;
            }
            throw new Exception("Could not get users");
        }

        public NewAchievement AddProposedAchievement(ProposedAchievementRequest proposedAchievementRequest)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                    var newAchievement = new NewAchievement()
                    {
                        GameId = proposedAchievementRequest.GameId,
                        Name = proposedAchievementRequest.Name,
                        Description = proposedAchievementRequest.Description,
                        Image = proposedAchievementRequest.Image,
                        DateSubmitted = DateTime.Now,
                        Difficulty = proposedAchievementRequest.Difficulty
                    };
                    var queryString = @"Insert into Achievement(GameId, Name, Description, Image, DateSubmitted, IsPending, IsApproved, VotingIsActive, Difficulty)
                                        Output inserted.*
                                        Values(@GameId, @Name, @Description, @Image, @DateSubmitted, 1, 0, 1, @Difficulty)";
                    var achievement = connection.QueryFirstOrDefault<NewAchievement>(queryString, newAchievement);
                    return achievement;
            }
            throw new Exception("Could not post new achievement.");
        }

        public IEnumerable<UserAchievementForMod> GetAchievementsToCheck()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Achievement.Id as AchievementId, UserAchievement.Id as UserAchievementId, Game.Id as GameId,
                                        UserAchievement.UserId, Achievement.Difficulty, UserAchievement.DateSubmitted, UserAchievement.Link,
                                        Game.Name as GameName, Achievement.Image as AchievementImage, Achievement.Description, [User].Username,
                                        Achievement.Name as AchievementName
                                    From UserAchievement
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Join Game on Game.Id = Achievement.GameId
                                    Join [User] on [User].Id = UserAchievement.UserId
                                    Where UserAchievement.IsPending = 1
                                    Order by UserAchievement.DateSubmitted asc";
                var achievements = connection.Query<UserAchievementForMod>(queryString);
                return achievements;
            }
            throw new Exception("Could not get achievements.");
        }

        public UserAchievement ApproveUserAchievement(int userAchievementId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var userGame = new GameConnection(_dbConfig).AddGameToUser(connection, userAchievementId);

                var queryString = @"Update UserAchievement
                                        Set IsPending = 0,
                                            IsApproved = 1
                                            NotificationPending = 1
                                    Output inserted.*
                                    Where UserAchievement.Id = @UserAchievementId";
                var userAchievement = connection.QueryFirstOrDefault<UserAchievement>(queryString, new { userAchievementId });
                if (userAchievement != null)
                {
                    var pointsToAdd = GetAchievementPoints(connection, userAchievement.AchievementId);
                    var updatedUser = new UserConnection(_dbConfig).UpdateUserPoints(connection, userAchievement.UserId, pointsToAdd);
                    return userAchievement;
                } 
            }
            throw new Exception("Could not update Users Achievement");
        }

        public UserAchievement DeclineUserAchievement(DeclineRequest request)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Update UserAchievement
                                        Set IsPending = 0,
                                            IsApproved = 0
                                            DeclineMsg = @DeclineMsg
                                            NotificationPending = 1
                                    Output inserted.*
                                    Where UserAchievement.Id = @UserAchievementId";
                var userAchievement = connection.QueryFirstOrDefault<UserAchievement>(queryString, request);
                if (userAchievement != null)
                {
                    return userAchievement;
                }
            }
            throw new Exception("Could not update.");
        }

        public int GetAchievementPoints(SqlConnection connection, int achievementId)
        {
            var queryString = @"Select Difficulty
                                From Achievement
                                Where Achievement.Id = @AchievementId";
            var points = connection.QueryFirstOrDefault<int>(queryString) * 10;
            return points;
        }
    }
}

