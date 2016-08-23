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
        public string mentorcoachInteractions { get; set; }
        public string mentorcoachIdeasDiscussed { get; set; }
        public string mentorcoachQualities { get; set; }
        public string mentorcoachImprove { get; set; }
        public string mentorcoachCriticalAreas { get; set; }
        public string mentorcoachTargettedAreas { get; set; }
        public string mentorcoachWorthTimeEnergy { get; set; }
        public string menteecoacheeObjectiveAchieved { get; set; }
        public string menteecoacheeSessionFeedback { get; set; }
        public string menteecoacheeAvoidDescribe { get; set; }
        public string menteecoacheeBestSession { get; set; }
        public string menteecoacheeReviewImprovment { get; set; }
        public string menteecoacheeGainConfidence { get; set; }
        public string menteecoacheeEnergyAndInterest { get; set; }
    }
}