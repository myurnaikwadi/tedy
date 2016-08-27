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
        List<FeedBacks> FeedBacks { get; set; }
    }

    public interface FeedBacks
    {
        string Question { get; set; }
        string Answer { get; set; }
    }
    
}
