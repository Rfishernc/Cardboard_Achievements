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
    public class UserController : ControllerBase
    {
        readonly UserConnection _connection;

        public UserController(UserConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("{userId}/games")]
        public ActionResult GetUsersGames(int userId)
        {
            var games = _connection.GetUsersGames(userId);
            return Accepted(games);
        }

        [HttpGet]
        public ActionResult GetGamers()
        {
            var gamers = _connection.GetGamers();
            return Accepted(gamers);
        }

        [HttpGet("{userId}")]
        public ActionResult GetUserOverview(int userId)
        {
            var user = _connection.GetUserOverview(userId);
            return Accepted(user);
        }

        [HttpGet("{userId}/notifications")]
        public ActionResult GetNotifications(int userId)
        {
            var notifications = _connection.GetNotifications(userId);
            return Accepted(notifications);
        }

        [HttpGet("search/{userId}")]
        public ActionResult GetUserForSearchResult(int userId)
        {
            var user = _connection.GetUserForSearchResult(userId);
            return Accepted(user);
        }

        [HttpGet("search/detail")]
        public ActionResult GetSearchedUsers([FromQuery(Name = "names")] string[] names)
        {
            var games = _connection.GetSearchedUsers(names);
            return Accepted(games);
        }

        [HttpGet("uid/{uid}")]
        public ActionResult GetUserInfo(string uid)
        {
            var userId = _connection.GetUserInfo(uid);
            return Accepted(userId);
        }

        [HttpPut("notified/{notificationId}")]
        public ActionResult ClearNotification(int notificationId)
        {
            var notification = _connection.ClearNotification(notificationId);
            return Accepted(notification);
        }

        [HttpPost]
        public ActionResult AddUserInDB(NewUserRequest request)
        {
            var user = _connection.AddUserInDB(request);
            return Accepted(request);
        }

        [HttpPut("pic")]
        public ActionResult ChangeImage(ChangeImageRequest request)
        {
            var imgUpdate = _connection.ChangeImage(request);
            return Accepted(imgUpdate);
        }
    }
}