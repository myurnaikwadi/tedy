using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class FileUploadConversation
    {
        public ObjectId Id { get; set; }
        public string FileNameConversation { get; set; }
        public string TagNameConversation { get; set; }


    }
}
