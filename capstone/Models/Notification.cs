using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Notification
    {
        public string GameName { get; set; }
        public string AchievementName { get; set; }
        public string DeclineMsg { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public string Image { get; set; }
        public DateTime DateSubmitted { get; set; }
        public bool IsApproved { get; set; }
        public int Id { get; set; }
    }
}
