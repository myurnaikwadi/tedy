using KindleSpur.Models.Interfaces;
using MongoDB.Bson;

namespace KindleSpur.Models
{
    public class FileUploadConversation : IFileUploadConversation
    {
        public ObjectId Id { get; set; }
        public string FileNameConversation { get; set; }
        public string FilePathConversation { get; set; }
        public string TagNameConversation { get; set; }

    }
}