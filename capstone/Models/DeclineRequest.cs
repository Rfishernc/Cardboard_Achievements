using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class DeclineRequest
    {
        public int UserAchievementId { get; set; }
        public string DeclineMsg { get; set; }
    }
}
