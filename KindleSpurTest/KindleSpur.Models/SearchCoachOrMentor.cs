using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class SearchCoachOrMentor
    {
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public List<SkillOrTopic> Skills { get; set; }
        public List<SkillOrTopic> Topics { get; set; }
        public string LinkdinURL { get; set; }
        public string PhotoURL { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int Mobile { get; set; }
        public string description { get; set; }
    }
}
