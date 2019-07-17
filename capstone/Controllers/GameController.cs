using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using capstone.Connections;
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

        [HttpGet("{gameId}")]
        public ActionResult GetGameDetails(int gameId)
        {
            var gameAchievements = _connection.GetGameDetails(gameId);
            return Accepted(gameAchievements);
        }
    }
}