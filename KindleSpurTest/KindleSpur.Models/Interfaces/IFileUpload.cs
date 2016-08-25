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
        string FileName { get; set; }
    }
}
