using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class CoachStatus
    {
        public string Sender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoURL { get; set; }
        public string Skill { get; set; }
        public int Rating { get; set; }
        public string TreeURL { get; set; }
        public int FeedbackCount { get; set; }
    }
}
