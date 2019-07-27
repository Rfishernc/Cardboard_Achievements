using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class NewUserAchievementRequest
    {
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public string Link { get; set; }
    }
}
