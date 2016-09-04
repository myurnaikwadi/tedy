using KindleSpur.Models.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
  
    public class Feedback : IFeedback
    {
        public string Sender { get; set; }
        public DateTime CreateDate { get; set; }
        public Boolean FeedbackClosed { get; set; }
        public string FeedBackId { get; set; }
        public string Skill { get; set; }
        public int customerSatisfactionRating { get; set; }
        public List<QueAndAns> QueAndAns { get; set; }
        public string FeedbackStatus { get; set; } //PRESESSION, FEEDBACK, CLOSESESSION
    }
}