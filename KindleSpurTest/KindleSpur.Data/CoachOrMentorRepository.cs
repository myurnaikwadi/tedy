using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KindleSpur.Models.Interfaces;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;


namespace KindleSpur.Data
{
    class CoachOrMentorRepository : ICoachOrMentorRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;

        public CoachOrMentorRepository()
        {
            string mongoServerConfig = "mongodb://127.0.0.1:27017";

            try
            {
                _mongoClient = new MongoClient(mongoServerConfig);
                _mongoServer = _mongoClient.GetServer();
                _kindleDatabase = _mongoServer.GetDatabase("KindleSpur");
                _logCollection = _kindleDatabase.GetCollection("ErrorLogs");
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public bool AddNewCoachOrMentor(ICoachOrMentor Data)
        {
            throw new NotImplementedException();
        }

        public bool DeleteCoachOrMentor(int Id)
        {
            throw new NotImplementedException();
        }

        public bool EditCoachOrMentor(int id, ICoachOrMentor Data)
        {
            throw new NotImplementedException();
        }

        public List<ICoachOrMentor> GetAllCoachOrMentorDetails()
        {
            throw new NotImplementedException();
        }

        public ICoachOrMentor GetCoachOrMentorDetail(int Id)
        {
            throw new NotImplementedException();
        }
    }
}
