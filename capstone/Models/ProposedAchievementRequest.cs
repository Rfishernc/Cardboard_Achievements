﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class ProposedAchievementRequest
    {
        public int GameId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Difficulty { get; set; }
        public string Image { get; set; }
    }
}
