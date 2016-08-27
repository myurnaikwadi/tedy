﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace KindleSpur.Models.Interfaces
{
    public interface IConversation
    {
        [BsonId]
        ObjectId Id { get; set; }

        string SenderEmail { get; set; }
        string ReceiverEmail { get; set; }
        string Content { get; set; }
        string SendOrReceive { get; set; }
        //List<Message> Content { get; set; }
        //int group_id { get; set; }
        Boolean isRead { get; set; }
        Boolean IsVerified { get; set; }
        string CreateDate { get; set; }
        DateTime UpdateDate { get; set; }
        string skill { get; set; }
        List<FileUploadConversation> FilesConversations { get; set; }
        List<ResourceFileLink> FilesURLlink { get; set; }
    }
}
