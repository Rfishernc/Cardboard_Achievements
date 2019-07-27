using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class BlogPost
    {
        public int Id { get; set; }
        public string BlogContent { get; set; }
        public string BlogTitle { get; set; }
        public string Author { get; set; }
        public DateTime DatePosted { get; set; }
    }
}
