using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class NewUserAchievement
    {
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public string Link { get; set; }
        public DateTime DateSubmitted { get; set; }
        public int Id { get; set; }
        public bool IsApproved { get; set; }
        public bool IsPending { get; set; }
    }
}
