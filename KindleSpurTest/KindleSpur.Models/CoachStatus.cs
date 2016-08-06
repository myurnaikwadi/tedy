using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class CoachStatus
    {
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoURL { get; set; }
        public int Mobile { get; set; }
        public string LinkdinURL { get; set; }
        public string description { get; set; }
        public string Skill { get; set; }
        public int Rating { get; set; }
        public string TreeURL { get; set; }
        public int FeedbackCount { get; set; }
        public Boolean FeedbackClosed { get; set; }
        public List<string> topics { get; set; }
        public List<SkillOrTopic> skills { get; set; }
    }
}
