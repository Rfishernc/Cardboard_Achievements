using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class GameAchievement
    {
        public int GameId { get; set; }
        public int AchievementId { get; set; }
        public string GameName { get; set; }
        public string AchievementName { get; set; }
        public string Link { get; set; }
        public int Difficulty { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string GameImage { get; set; }
        public string AchievementImage { get; set; }
        public DateTime DateSubmitted { get; set; }
        public bool Completed { get; set; }
        public int UserPoints { get; set; }
    }
}
