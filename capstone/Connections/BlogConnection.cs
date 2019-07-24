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
    public class BlogConnection
    {
        readonly string _connectionString;
        public BlogConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public IEnumerable<BlogPost> GetBlogPosts()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var sixMonthsAgo = DateTime.Now.AddMonths(-6);
                var queryString = @"Select Id, BlogContent, BlogTitle, DatePosted, Author
                                    From BlogPost
                                    Where DatePosted > @sixMonthsAgo
                                    Order by DatePosted Desc";
                var blogPosts = connection.Query<BlogPost>(queryString, new { sixMonthsAgo });
                return blogPosts;
            }
            throw new Exception("Could not get blog posts");
        }
    }
}
