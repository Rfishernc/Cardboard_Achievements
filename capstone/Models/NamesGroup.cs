using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class NamesGroup
    {
        public IEnumerable<SearchItem> GameNames { get; set; }
        public IEnumerable<SearchItem> AchievementNames { get; set; }
        public IEnumerable<SearchItem> Usernames { get; set; }
    }
}
