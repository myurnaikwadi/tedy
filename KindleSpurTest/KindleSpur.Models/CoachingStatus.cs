using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class CoachingStatus : ICoachingStatus
    {
        public string Sender { get; set; }
        public DateTime CreateDate { get; set; }
        public string Skill { get; set; }
        public int customerSatisfactionRating { get; set; }
        public bool FeedbackClosed { get; set; }
        public int FeedBackCount { get; set; }
    }
}
