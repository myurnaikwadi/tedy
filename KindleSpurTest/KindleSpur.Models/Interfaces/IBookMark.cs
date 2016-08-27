using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
    public interface IBookMark
    {
        ObjectId Id { get; set; }
        string DocumentName { get; set; }
        string TagName { get; set; }
        string LinkUrl { get; set; }

    }
}
