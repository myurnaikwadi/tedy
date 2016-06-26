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
        public Dictionary<string,int> FeedbakWithRating { get; set; }
        public string FeedbackText { get; set; }
        public DateTime CreateDate { get; set; }
        public int Rating { get; set; }
    }
}