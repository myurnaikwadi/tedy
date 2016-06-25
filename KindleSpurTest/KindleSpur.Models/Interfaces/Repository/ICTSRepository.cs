using MongoDB.Bson;
using System.Collections.Generic;

namespace KindleSpur.Models.Interfaces.Repository
{
   public interface ICTSRepository
    {
         List<BsonDocument> GetCategories();

         List<BsonDocument> GetTopics(string category);

        List<BsonDocument> GetSkills(string category);

        List<BsonDocument> GetSkills(string category, string topic);

        List<CTSFilter> GetCTSFilters();
    }
}
