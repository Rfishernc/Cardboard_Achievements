using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using capstone.Models;

namespace capstone.Connections
{
    public class UpdateAchievements
    {
        readonly string _connectionString;
        readonly IOptions<DbConfiguration> _dbConfig;
        public UpdateAchievements(IOptions<DbConfiguration> dbConfig)
        {
            // builds ConnectionString from appsettings.json
            _connectionString = dbConfig.Value.ConnectionString;
            _dbConfig = dbConfig;
        }

        public IEnumerable<Achievement> UpdateMonthsAchievements()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                if(!CurrentMonthIsUpdated(connection))
                {
                    var topVoted = new VoteConnection(_dbConfig).GetTopVoted();

                    var dateApproved = DateTime.Now;
                    var queryString = @"Update Achievement
                                        Set
                                            IsPending = 0,
                                            IsApproved = 1,
                                            DateApproved = @DateApproved
                                        Where Id IN @TopVoted

                                        Update Achievement
                                        Output updated.*
                                        Set
                                            IsPending = 0
                                            IsApproved = 0
                                        Where IsPending = 1 AND VotingIsActive = 0 AND Id NOT IN @TopVoted";
                    var achievements = connection.Query<Achievement>(queryString, new { dateApproved, topVoted });

                    UpdateMonthStatus(connection);

                    return achievements;
                }
            }
            throw new Exception("Failed to update achievements.");
        }

        public IEnumerable<Achievement> UpdateVotingStates()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Update Achievement                                 
	                                    Set VotingIsActive = 0
                                    Output inserted.*
                                    Where IsPending = 1 AND VotingIsActive = 1 AND DateSubmitted < DateAdd(month, -1, GETDATE())";
                var achievements = connection.Query<Achievement>(queryString);
                return achievements;
            }
            throw new Exception("Could not update voting status");
        }

        public bool CurrentMonthIsUpdated(SqlConnection connection)
        {
            var queryString = @"Select *
                                    From UpdateAchievementStatus
                                    Where [Month] = @Month AND AchievementsUpdated = 1";
            var month = DateTime.Now.ToString("MM/yyyy");
            var updateStatus = connection.QueryFirstOrDefault<int>(queryString, new { month });
            return updateStatus > 0;
        }

        public int UpdateMonthStatus(SqlConnection connection)
        {
            var queryString = @"Update UpdateAchievementStatus                             
                                    Set AchievementStatus = 1
                                Output inserted.*
                                Where [Month] = @Month
                                
                                Insert into UpdateAchievementStatus([Month], AchievementsUpdated)
                                Values( DateAdd(month, 1, @Month), 0)";
            var month = DateTime.Now.ToString("MM/yyyy");
            var updateStatus = connection.QueryFirstOrDefault<int>(queryString, new { month });
            return updateStatus;
        }
    }
}
