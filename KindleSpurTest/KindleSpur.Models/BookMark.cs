using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class BookMark :IBookMark
    {
        public ObjectId Id { get; set; }
        public string DocumentName { get; set; }
        public string TagName { get; set; }
        public string LinkUrl { get; set; }
    }
}
