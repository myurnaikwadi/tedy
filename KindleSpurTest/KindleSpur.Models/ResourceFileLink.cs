using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class ResourceFileLink
    {
        public ObjectId Id { get; set; }
        public string FileName { get; set; }

        public string FilePath { get; set; }
    }
}
