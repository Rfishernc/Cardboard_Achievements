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
    public class UserConnection
    {
        readonly string _connectionString;
        public UserConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public Dictionary<int, List<GameAchievement>> GetUsersGames(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Game.Id as GameId, Achievement.Id as AchievementId, Game.Name as GameName,
                                        Game.Link, Achievement.Difficulty, Game.Image as GameImage, Game.DateAdded
                                    From Game
                                    Join UserGame on UserGame.GameId = Game.Id
                                    Join Achievement ON Achievement.GameId = UserGame.GameId
                                    Where Achievement.IsApproved = 1 AND UserGame.UserId = @UserId";
                var games = connection.Query<GameAchievement>(queryString, new { userId });
                var groupedAchievements = games.GroupBy(achievement => achievement.GameId);
                var gamesWithAchieves = groupedAchievements.ToDictionary(x => x.Key, x => x.ToList());
                return gamesWithAchieves;
            }
            throw new Exception("Failed to return games list.");
        }

        public List<UserWithAchievements> GetGamers()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select [User].Username, [User].JoinDate, [User].ProfilePic, [User].Points, [User].Id,
                                        UserAchievement.DateSubmitted, Achievement.Difficulty
                                    From [User]
                                    Join UserAchievement on UserAchievement.UserId = [User].Id
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Where UserAchievement.IsApproved = 1";
                var gamers = connection.Query<UserWithAchievements>(queryString);
                var gamersGroupedAchievements = gamers.GroupBy(userAchievement => userAchievement.Id);
                var gamersWithValues = new List<UserWithAchievements>();
                var currentMonth = DateTime.Now.Month;

                foreach(IEnumerable<UserWithAchievements> userWithAchievements in gamersGroupedAchievements)
                {
                    var currentUser = userWithAchievements.First();
                    currentUser.TotalAchievements = userWithAchievements.Count();
                    currentUser.MonthlyAchievements = userWithAchievements.Where(x => x.DateSubmitted.Month == currentMonth).Count();

                    var monthPoints = 0;
                    foreach(UserWithAchievements achievement in userWithAchievements)
                    {
                        if (achievement.DateSubmitted.Month == currentMonth)
                        {
                            monthPoints += achievement.Difficulty * 10;
                        }
                    }

                    currentUser.MonthlyPoints = monthPoints;
                    gamersWithValues.Add(currentUser);
                }
                gamersWithValues.OrderByDescending(gamer => gamer.MonthlyPoints);
                return gamersWithValues;
            }
            throw new Exception("Could not get gamers");
        }

        public UserOverview GetUserOverview(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select Top(1) [User].Username, [User].ProfilePic, [User].Points, Achievement.Image, Achievement.Name as AchievementName,
                                        Achievement.Description, Achievement.DateAdded, Achievement.Difficulty, Game.Id as GameId, Game.Name as GameName
                                    From [User]
                                    Join UserAchievement on UserAchievement.UserId = [User].Id
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Join Game on Game.Id = Achievement.GameId
                                    Where [User].Id = @UserId
                                    Order by UserAchievement.DateSubmitted Desc";
                var user = connection.QueryFirstOrDefault<UserOverview>(queryString, new { userId });
                if (user != null)
                {
                    return user;
                } 
            }
            throw new Exception("Could not get user info.");
        }

        public User UpdateUserPoints(SqlConnection connection, int userId, int points)
        {
            var queryString = @"Update User
                                    Set Points = Points + @Points
                                Output inserted.*
                                Where Id = @UserId";
            var user = connection.QueryFirstOrDefault<User>(queryString);
            if (user != null)
            {
                return user;
            }
            else
            {
                throw new Exception("Could not update users points.");
            }
        }

        public IEnumerable<Notification> GetNotifications(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select UserAchievement.DateSubmitted, UserAchievement.DeclineMsg, Achievement.Name as AchievementName,
                                        Achievement.Image, Achievement.Description, Game.Name as GameName, UserAchievement.Link,
                                        UserAchievement.IsApproved, UserAchievement.Id
                                    From UserAchievement
                                    Join Achievement on Achievement.Id = UserAchievement.AchievementId
                                    Join Game on Game.Id = Achievement.GameId
                                    Where UserAchievement.UserId = @UserId AND UserAchievement.NotificationPending = 1";
                var notifications = connection.Query<Notification>(queryString, new { userId });
                return notifications;
            }
            throw new Exception("Could not get notifications.");
        }

        public Notification ClearNotification(int notificationId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Update UserAchievement
                                        Set NotificationPending = 0
                                    Output inserted.*
                                    Where UserAchievement.Id = @NotificationId";
                var notification = connection.QueryFirstOrDefault<Notification>(queryString, new { notificationId });
                if (notification != null)
                {
                    return notification;
                }   
            }
            throw new Exception("Could not clear notification");
        }
    }
}
