using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace KindleSpur.Models.Interfaces
{
    public interface IMeetingSchedular
    {
        [BsonId]
        ObjectId Id { get; set; }

        string SenderEmail { get; set; }
        string ReceiverEmail { get; set; }
        string Subject { get; set; }
        DateTime MeetingDate { get; set; }
        DateTime FromTime { get; set; }
        DateTime ToTime { get; set; }
        string PlatformType { get; set; }
        string UserId { get; set; }
        string Role { get; set; }
        DateTime CreateDate { get; set; }
        DateTime UpdateDate { get; set; }
        Boolean IsVerified { get; set; }
    }
    
}
