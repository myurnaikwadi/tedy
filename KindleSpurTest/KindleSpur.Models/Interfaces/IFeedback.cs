using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
        public interface IFeedback
        {
            string Sender { get; set; }
            string FeedbackText { get; set; }
            DateTime CreateDate { get; set; }
            string Skill { get; set; }
            int customerSatisfactionRating { get; set; }
        }
}
