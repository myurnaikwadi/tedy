using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class Feedback : IFeedback
    {
        public string Sender { get; set; }
        public QueAndAns selectedComparioson { get; set; }
        public QueAndAns selectedAttractive { get; set; }
        public string FeedbackText { get; set; }
        public DateTime CreateDate { get; set; }
        public string Skill { get; set; }
        public int customerSatisfactionRating { get; set; }
    }
}