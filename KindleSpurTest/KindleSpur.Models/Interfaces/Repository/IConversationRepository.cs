using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KindleSpur.Models.Interfaces.Repository
{
    public interface IConversationRepository
    {
        bool AddNewConversation(IConversation conversationData);

        bool EditConversation(string id, IConversation conversationData);

        bool UpdateConversationStatus(string senderEmail, string receiverEmail, string content, bool isVerified, string ConversationType,string ParentId);

        IConversation GetConversationDetail(int conversationId);

        List<BsonDocument> ListConversationForSender(string loggedEmail, string ConversationType);

        List<BsonDocument> GetConversation(string ParentId, string ConversationType);

        List<BsonDocument> GetConversationRequest(string senderEmail,string ConversationType);
    }

}
