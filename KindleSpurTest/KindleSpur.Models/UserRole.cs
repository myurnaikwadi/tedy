using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    [BsonIgnoreExtraElements]
    public class UserRole
    {
        public string Role { get; set; }
    }
}
