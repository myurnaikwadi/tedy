using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
   public interface ISkill
    {
        [BsonId]
        ObjectId Id { get; set; }

        string Name { get; set; }
    }
}
