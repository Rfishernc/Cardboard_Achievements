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

        public bool VoteExists(VoteRequest voteRequest)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select *
                                    From Vote
                                    Where AchievementId = @AchievementId AND UserId = @UserId";
                var existenceState = connection.Query<int>(queryString, voteRequest).SingleOrDefault();
                return existenceState > 0;
            }
            throw new Exception("It didn't work.");
        }

        public Vote AddVote(VoteRequest voteRequest)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                if (!VoteExists(voteRequest))
                {
                    var queryString = @"Insert into Vote(UserId, AchievementId)
                                    Output inserted.*
                                    Values(@UserId, @AchievementId)";
                    var vote = connection.QueryFirstOrDefault<Vote>(queryString, voteRequest);
                    if (vote != null)
                    {
                        return vote;
                    }
                }
            }
            throw new Exception("Could not process vote.");
        }

        public List<int> GetTopVoted()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var queryString = @"Select top(10) Count(*) as VoteCount, Achievement.Id
                                    From Vote
                                    Join Achievement on Achievement.Id = Vote.AchievementId
                                    Where Achievement.IsPending = 1 AND Achievement.VotingIsActive = 0
                                    Group by Achievement.Id
                                    Order by VoteCount desc";
                var achievements = connection.Query<TopVoted>(queryString);
                var topVotedIds = achievements.Select(achievement => achievement.AchievementId).ToList();
                return topVotedIds;
            }
            throw new Exception("Could not get achievements.");
        }
    }
}
