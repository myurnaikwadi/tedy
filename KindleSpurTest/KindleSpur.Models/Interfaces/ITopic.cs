using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KindleSpur.Models.Interfaces
{
   public interface ITopic
    {
        [BsonId]
        ObjectId Id { get; set; }
        string Name { get; set; }
        List<ISkill> Skills { get; set; }
    }
}
