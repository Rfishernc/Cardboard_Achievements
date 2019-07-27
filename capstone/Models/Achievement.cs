using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Achievement
    {
        public int AchievementId { get; set; }
        public int GameId { get; set; }
        public int VoteId { get; set; }
        public string AchievementName { get; set; }
        public string GameName { get; set; }
        public string Image { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string Description { get; set; }
        public int Difficulty { get; set; }
        public bool Completed { get; set; }
    }
}
