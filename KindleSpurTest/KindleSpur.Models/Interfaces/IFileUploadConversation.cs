using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
    public interface IFileUploadConversation
    {
        ObjectId Id { get; set; }
        string FileNameConversation { get; set; }
        string FilePathConversation { get; set; }
        string TagNameConversation { get; set; }
    }
}
