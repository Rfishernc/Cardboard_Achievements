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
    public class VoteController : ControllerBase
    {
        readonly VoteConnection _connection;

        public VoteController(VoteConnection connection)
        {
            _connection = connection;
        }

        [HttpPost]
        public ActionResult AddVote(VoteRequest voteRequest)
        {
            var vote = _connection.AddVote(voteRequest);
            return Accepted(vote);
        }
    }
}