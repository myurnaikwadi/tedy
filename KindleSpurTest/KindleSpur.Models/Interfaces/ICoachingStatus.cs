using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
  public  interface ICoachingStatus
    {
        string Sender { get; set; }
        DateTime CreateDate { get; set; }
        string Skill { get; set; }
        int customerSatisfactionRating { get; set; }
        bool FeedbackClosed { get; set; }
         int FeedBackCount { get; set; }
    }
}
