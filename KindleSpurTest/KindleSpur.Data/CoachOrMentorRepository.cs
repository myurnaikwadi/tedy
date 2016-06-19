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
using KindleSpur.Models;

namespace KindleSpur.Data
{
    public class CoachOrMentorRepository : ICoachOrMentorRepository
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
            bool _transactionStatus = false;

            try
            {
                var _collection = _kindleDatabase.GetCollection("CoachOrMentor");

                var result = _collection.Find(Query.And(Query.EQ("UserId", Data.UserId), Query.EQ("Role", Data.Role))).ToList();                                                              

                if (result.Count() > 0)
                {
                    EditCoachOrMentor(Data.UserId.ToString(), Data);
                }
                else
                {
                    _collection.Insert(Data);
                }

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }
        

            return _transactionStatus;
        }

        public List<string> GetSkillsForCoach(string UserId)
        {
           
            var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
           var result = _collection.FindOneAs<CoachOrMentor>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", "Coach")
                                                                ));
            if (result != null)
                return result.Skills;
            else
                return new List<string>();
        }

        public bool DeleteCoachOrMentor(string Id)
        {
            bool _transactionStatus = false;
            try
            {
                var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
                _collection.Remove(Query.EQ("_id", Id));
                _transactionStatus = true;

            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _transactionStatus;
        }

        public bool EditCoachOrMentor(string UserId, ICoachOrMentor Data)
        {
            bool _transactionStatus = false;
            try
            {
                var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
                var _entity = _collection.FindOneAs<CoachOrMentor>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", Data.Role)
                                                                ));

                if (Data.Role == "Coach")
                {
                    foreach (string skill in Data.Skills)
                    {
                        if (!_entity.Skills.Contains(skill))
                        {
                            _entity.Skills.Add(skill);
                        }
                    }
                }

                if (Data.Role == "Mentor")
                {
                    foreach (string topic in Data.Topics)
                    {
                        if (!_entity.Topics.Contains(topic))
                        {
                            _entity.Topics.Add(topic);
                        }
                    }
                }
                _entity.UpdateDate = DateTime.Now;
                _collection.Save(_entity);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        
        }

        public List<ICoachOrMentor> GetAllCoachOrMentorDetails()
        {
            List<ICoachOrMentor> result = null;
            try
            {
                var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
                result = _collection.FindAllAs<ICoachOrMentor>().ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return result;
        }

        public ICoachOrMentor GetCoachOrMentorDetail(string Id)
        {
            ICoachOrMentor result = null;
            try
            {
                var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
                result = _collection.FindOneAs<ICoachOrMentor>(Query.EQ("_id", ObjectId.Parse(Id)));
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return result;
        }
    }
}


