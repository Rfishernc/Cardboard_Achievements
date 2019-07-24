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
    public class BlogController : ControllerBase
    {
        readonly BlogConnection _connection;

        public BlogController(BlogConnection connection)
        {
            _connection = connection;
        }

        [HttpGet]
        public ActionResult GetBlogPosts()
        {
            var blogPosts = _connection.GetBlogPosts();
            return Accepted(blogPosts);
        }
    }
}