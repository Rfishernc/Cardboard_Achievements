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
    public class GameController : ControllerBase
    {
        readonly GameConnection _connection;

        public GameController(GameConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("all")]
        public ActionResult GetAllGames()
        {
            var games = _connection.GetAllGamesWithAchievements();
            return Accepted(games);
        }

        [HttpGet("{gameId}/{userId}")]
        public ActionResult GetGameDetails(int gameId, int userId)
        {
            var request = new UserAchievementRequest() { GameId = gameId, UserId = userId };
            var gameAchievements = _connection.GetGameDetails(request);
            return Accepted(gameAchievements);
        }

        [HttpGet("{gameId}/players")]
        public ActionResult GetNumberOfPlayers(int gameId)
        {
            var players = _connection.GetNumberOfPlayers(gameId);
            return Accepted(players);
        }

        [HttpGet("{gameId}/popularity")]
        public ActionResult GetGamePopularity(int gameId)
        {
            var popularity = _connection.GetGamePopularity(gameId);
            return Accepted(popularity);
        }

        [HttpGet("names")]
        public ActionResult GetNames()
        {
            var names = _connection.GetNames();
            return Accepted(names);
        }

        [HttpGet("search/{gameId}")]
        public ActionResult GetGameForSearchResult(int gameId)
        {
            var game = _connection.GetGameForSearchResult(gameId);
            return Accepted(game);
        }
    }
}