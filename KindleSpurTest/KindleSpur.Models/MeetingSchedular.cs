using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KindleSpur.Models
{
    [BsonIgnoreExtraElements]
    public class MeetingSchedular : IMeetingSchedular
    {
        [BsonId]
        public ObjectId Id { get; set; }
        
        public string SenderEmail { get; set; }
        public string ReceiverEmail { get; set; }
        public string Subject { get; set; }
        public DateTime MeetingDate { get; set; }
        public DateTime FromTime { get; set; }
        public DateTime ToTime { get; set; }
        public string PlatformType { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Boolean IsVerified { get; set; }
    }
}
