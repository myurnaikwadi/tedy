using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class FileUpload: IFileUpload
    {
        public ObjectId Id { get; set; }
        public string FileName { get; set; }
    }
}
