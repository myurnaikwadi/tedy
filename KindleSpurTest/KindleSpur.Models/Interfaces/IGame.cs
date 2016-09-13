using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
   public interface IGame
    {
        string GameId { get; set; }
         string Name { get; set; }
         string Key { get; set; }
        string UnlockedBy { get; set; }
        string ExpiredInDays { get; set; }
        [BsonId]
        ObjectId Id { get; set; }
    }
}
