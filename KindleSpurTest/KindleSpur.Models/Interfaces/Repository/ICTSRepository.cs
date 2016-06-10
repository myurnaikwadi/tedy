using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces.Repository
{
   public interface ICTSRepository
    {
         List<BsonDocument> GetCategories();

         List<BsonDocument> GetTopics(string category);

        List<BsonDocument> GetSkills(string category);

        List<BsonDocument> GetSkills(string category, string topic);
       

    }
}
