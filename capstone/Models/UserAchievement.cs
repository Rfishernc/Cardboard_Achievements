using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class UserAchievement
    {
        public int AchievementId { get; set; }
        public int UserId { get; set; }
        public int Difficulty { get; set; }
        public string DeclineMsg { get; set; }
    }
}
