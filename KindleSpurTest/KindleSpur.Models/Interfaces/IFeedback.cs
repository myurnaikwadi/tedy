using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
        public interface IFeedback
        {
            string Sender { get; set; }
            DateTime CreateDate { get; set; }
            string Skill { get; set; }
            int customerSatisfactionRating { get; set; }
        string mentorcoachInteractions { get; set; }
        string mentorcoachIdeasDiscussed { get; set; }
        string mentorcoachQualities { get; set; }
        string mentorcoachImprove { get; set; }
        string mentorcoachCriticalAreas { get; set; }
        string mentorcoachTargettedAreas { get; set; }
        string mentorcoachWorthTimeEnergy { get; set; }
        string menteecoacheeObjectiveAchieved { get; set; }
        string menteecoacheeSessionFeedback { get; set; }
        string menteecoacheeAvoidDescribe { get; set; }
        string menteecoacheeBestSession { get; set; }
        string menteecoacheeReviewImprovment { get; set; }
        string menteecoacheeGainConfidence { get; set; }
        string menteecoacheeEnergyAndInterest { get; set; }
    }
}
