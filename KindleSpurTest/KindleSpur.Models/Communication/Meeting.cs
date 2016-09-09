using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Communication
{
    public class Meeting : IMeeting
    {
        [BsonId]
        public ObjectId Id
        {
            get; set;
        }
        public  string MeetingId { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string FromFirstName { get; set; }
        public string FromLastName { get; set; }
        public string FromPhoto { get; set; }
        public string ToFirstName { get; set; }
        public string ToLastName { get; set; }
        public string ToPhoto { get; set; }
        public string SkillName { get; set; }
        public string TopicName { get; set; }
        public string Subject { get; set; }
        public String Status { get; set; }
        public DateTime StartDate { get; set; }
        public String TimeSlot { get; set; }
        public DateTime EndDate { get; set; }
        public Boolean IsVerified { get; set; }
        public string Role { get; set; }
    }
}
