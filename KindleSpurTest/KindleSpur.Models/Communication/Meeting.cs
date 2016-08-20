using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Communication
{
    public class Meeting : IMeeting
    {
        public DateTime EndDate { get; set; }
        public IFeedback Feedbacks { get; set; }
        public string MeetingId { get; set; }
        public string SkillName { get; set; }
        public DateTime StartDate { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public string TimeSlot { get; set; }
        public string TopicName { get; set; }
    }
}
