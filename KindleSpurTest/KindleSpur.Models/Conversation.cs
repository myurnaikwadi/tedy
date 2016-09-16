using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KindleSpur.Models
{
    [BsonIgnoreExtraElements]
    public class Conversation : IConversation
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string SenderEmail { get; set; }
        public string ReceiverEmail { get; set; }
        public string Content { get; set; }
        public string SendOrReceive { get; set; }
        public string isRead { get; set; }
        public Boolean IsVerified { get; set; }
        public Boolean IsRejected { get; set; }
        public string CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string skill { get; set; }
        public List<ResourceFileLink> FilesURLlink { get; set; }
        public Boolean ConversationClosed { get; set; }
        public string ConversationType { get; set; }
        public string ConversationId { get; set; }
        public string ConversationParentId { get; set; }
        public bool Active { get; set; }
        public string CoachOrMentor { get; set; }
        public string CoacheeOrMentee { get; set; }
        public string FromFirstName { get; set; }
        public string FromLastName { get; set; }
        public string FromPhoto { get; set; }
        public string ToFirstName { get; set; }
        public string ToLastName { get; set; }
        public string ToPhoto { get; set; }
    }
}
