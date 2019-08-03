using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using capstone.Connections;
using capstone.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace capstone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementController : ControllerBase
    {
        readonly AchievementConnection _connection;

        public AchievementController(AchievementConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("{userId}/{gameId}")]
        public ActionResult GetUsersAchievementsForGame(int userId, int gameId)
        {
            var request = new UserAchievementRequest() { UserId = userId, GameId = gameId };
            var achievements = _connection.GetUsersAchievementsForGame(request);
            return Accepted(achievements);
        }

        [HttpGet("popularity")]
        public ActionResult GetPopularity()
        {
            var popularity = _connection.GetPopularity();
            return Accepted(popularity);
        }

        [HttpGet("{userId}")]
        public ActionResult GetUsersAchievements(int userId)
        {
            var achievements = _connection.GetUsersAchievements(userId);
            return Accepted(achievements);
        }

        [HttpGet("mod")]
        public ActionResult GetAchievementsToCheck()
        {
            var achievements = _connection.GetAchievementsToCheck();
            return Accepted(achievements);
        }

        [HttpGet("recent")]
        public ActionResult GetRecentAchievements()
        {
            var achievements = _connection.GetRecentAchievements();
            return Accepted(achievements);
        }

        [HttpGet("recent/{userId}")]
        public ActionResult GetRecentAchievementsLoggedIn(int userId)
        {
            var achievements = _connection.GetRecentAchievements(userId);
            return Accepted(achievements);
        }

        [HttpGet("proposed&recent/{userId}")]
        public ActionResult GetRecentProposedAchievements(int userId)
        {
            var achievements = _connection.GetRecentProposedAchievements(userId);
            return Accepted(achievements);
        }

        [HttpGet("proposed&recent")]
        public ActionResult GetRecentProposedAchievementsNoUser()
        {
            var achievements = _connection.GetRecentProposedAchievements();
            return Accepted(achievements);
        }

        [HttpGet("proposed/{gameId}/{userId}")]
        public ActionResult GetProposedAchievementsForGame(int gameId, int userId)
        {
            var request = new ProposedAchievementsForGameRequest() { UserId = userId, GameId = gameId };
            var achievements = _connection.GetProposedAchievementsForGame(request);
            return Accepted(achievements);
        }

        [HttpGet("search/{achievementId}")]
        public ActionResult GetAchievementForSearchResult(int achievementId)
        {
            var achievement = _connection.GetAchievementForSearchResult(achievementId);
            return Accepted(achievement);
        }

        [HttpGet("search/detail")]
        public ActionResult GetSearchedAchievements([FromQuery(Name = "names")] string[] names)
        {
            var games = _connection.GetSearchedAchievements(names);
            return Accepted(games);
        }

        [HttpPost]
        public ActionResult SubmitAchievement(NewUserAchievementRequest newAchievement)
        {
            var achievement = _connection.SubmitAchievement(newAchievement);
            return Accepted(achievement);
        }

        [HttpPost("proposed")]
        public ActionResult AddProposedAchievement(ProposedAchievementRequest proposedAchievementRequest)
        {
            var achievement = _connection.AddProposedAchievement(proposedAchievementRequest);
            return Accepted(achievement);
        }

        [HttpPut("approve/${userId}")]
        public ActionResult ApproveUserAchievement(int userAchievementId)
        {
            var userAchievement = _connection.ApproveUserAchievement(userAchievementId);
            return Accepted(userAchievement);
        }

        [HttpPut("decline/${userId}")]
        public ActionResult DeclineUserAchievement(DeclineRequest request)
        {
            var userAchievement = _connection.DeclineUserAchievement(request);
            return Accepted(userAchievement);
        }

    }
}