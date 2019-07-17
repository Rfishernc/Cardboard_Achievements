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
    public class VoteConnection
    {
        readonly string _connectionString;
        public VoteConnection(IOptions<DbConfiguration> dbConfig)
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
