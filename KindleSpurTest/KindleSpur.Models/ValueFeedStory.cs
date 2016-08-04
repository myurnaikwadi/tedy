using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public class ValueFeedStory
    {
        public string ImpactZone { get; set; }
        public string StoryTitle { get; set; }
        public string StoryContent { get; set; }
        public DateTime CreateDate { get; set; }
        public string UserId { get; set; }
    }
}
