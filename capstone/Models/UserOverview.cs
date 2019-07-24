using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class UserOverview
    {
        public string Username { get; set; }
        public string ProfilePic { get; set; }
        public int Points { get; set; }
        public string Image { get; set; }
        public string AchievementName { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public int Difficulty { get; set; }
        public int GameId { get; set; }
        public string GameName { get; set; }
    }
}
