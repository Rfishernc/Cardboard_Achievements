using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime JoinDate { get; set; }
        public int Points { get; set; }
        public string ProfilePic { get; set; }
        public int TotalAchievements { get; set; }
        public int MonthlyPoints { get; set; }
        public int MonthlyAchievements { get; set; }
    }
}
