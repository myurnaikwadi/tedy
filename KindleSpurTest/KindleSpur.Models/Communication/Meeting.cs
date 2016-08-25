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
        public  string MeetingId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string SkillName { get; set; }
        public string TopicName { get; set; }
        public string Subject { get; set; }
        public String Status { get; set; }
        public DateTime StartDate { get; set; }
        public String TimeSlot { get; set; }
        public DateTime EndDate { get; set; }
        public Boolean IsVerified { get; set; }
    }
}
