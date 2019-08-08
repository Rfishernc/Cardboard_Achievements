using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace capstone.Models
{
    public class NewUserRequest
    {
        public string Uid { get; set; }
        public string Username { get; set; }
        public DateTime JoinDate { get; set; }
        public string ProfilePic { get; set; }
    }
}
