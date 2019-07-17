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
        public AchievementConnection(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public Game DoAThing(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @" ";
                var thing = connection.QueryFirstOrDefault<Game>(queryString);
                return thing;
            }
            throw new Exception("It didn't work.");
        }
    }
}
