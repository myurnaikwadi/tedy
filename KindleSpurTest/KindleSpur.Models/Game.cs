using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class Game : IGame
    {
        
        public string GameId { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        public DateTime UnlockedDate { get; set; }
        public string ExpiredInDays { get; set; }
        public string UnlockedBy { get; set; }
        [BsonId]
        public ObjectId Id
        {
            get; set;
        }
    }
}
