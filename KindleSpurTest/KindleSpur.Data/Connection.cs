using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Data
{
    public class Connection
    {
        private MongoClient _mongoClient;
        private MongoServer _mongoServer;
        private MongoDatabase _kindleDatabase;
        private string mongoServerConfig = "mongodb://127.0.0.1:27017";

        public Connection()
        {
            _mongoClient = new MongoClient(mongoServerConfig);
            _mongoServer = _mongoClient.GetServer();
            _kindleDatabase = _mongoServer.GetDatabase("KindleSpur");
        }

        public MongoCollection GetCollection(string collectionName)
        {
            return _kindleDatabase.GetCollection(collectionName);
        }
    }
}
