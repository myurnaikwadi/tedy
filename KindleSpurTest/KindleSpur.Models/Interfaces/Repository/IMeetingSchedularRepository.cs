using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KindleSpur.Models.Interfaces.Repository
{
    public interface IMeetingSchedularRepository
    {
        bool AddNewMeeting(IMeetingSchedular meetingSchedularData);

        List<BsonDocument> ListMeetingSchedular();

        List<BsonDocument> GetMeetingSchedular(string senderEmail, string receiverEmail);

        bool UpdateMeetingStatus(string senderEmail, string receiverEmail, bool isVerified, string Role);

        List<BsonDocument> GetAllMeetingRequest(string userId);
    }

}
