using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class Vote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AchievementId { get; set; }
    }
}
