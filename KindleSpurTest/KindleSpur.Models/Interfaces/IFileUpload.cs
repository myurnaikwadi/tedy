using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
    public interface IFileUpload
    {
        ObjectId Id { get; set; }
        string FileId { get; set; }
        string FileName { get; set; }
        string FilePath { get; set; }
        string TagName { get; set; }
        string ContentType { get; set; }
        string Filesize { get; set; }
    }
}
