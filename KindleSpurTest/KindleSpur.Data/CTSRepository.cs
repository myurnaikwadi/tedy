using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Collections.Generic;
using System.Linq;

namespace KindleSpur.Data
{
   public class CTSRepository : ICTSRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;

        public CTSRepository()
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

        public List<BsonDocument> GetCTS()
        {

            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _categories = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _categories;

        }

        public List<BsonDocument> GetTopics()
        {

            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataMentoring");
                _categories = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _categories;

        }

        public List<BsonDocument> GetCTSCategoryAndTopic(List<string> skills)
        {

            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _categories = _ctsCollection.Find(Query.EQ("Name", skills[0])).SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _categories;

        }

        public List<BsonDocument> GetCategories()
        {
           
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _categories = _ctsCollection.FindAll().SetFields("Category").ToList();              
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _categories;

        }

        public List<BsonDocument> GetTopics(string category)
        {
            List<BsonDocument> _topics = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataMentoring");
                _topics = _ctsCollection.Find(Query.EQ("Category", category)).SetFields("Topic").ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetTopics().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _topics;
        }

        public List<BsonDocument> GetSkills(string category)
        {
            List<BsonDocument> _skills = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _skills = _ctsCollection.Find(Query.EQ("Category", category)).SetFields("Skill").ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetSkills().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _skills;
        }

        public List<BsonDocument> GetSkills(string category, string topic)
        {
            List<BsonDocument> _skills = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _skills = _ctsCollection.Find(Query.And(Query.EQ("Category",category),Query.EQ("Topic",topic))).SetFields("Skill").ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetSkills().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _skills;
        }

        public BsonDocument GetMentorCategory(string topic)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataMentoring");
                if (topic != null)
                {
                    var query = Query.EQ("Name", topic);
                    BsonDocument result = _ctsCollection.Find(Query.ElemMatch("Topics", Query.EQ("Name", topic))).SetFields(Fields.Include("Category", "Topics.$")).ToList()[0];
                    if (result != null)
                    {
                        _Category = _Category.Add(new BsonElement("Category", result["Category"].AsString));
                        _Category = _Category.Add(new BsonElement("Topic", topic));
                    }
                }
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCoachTopicAndCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _Category;
        }

        public BsonDocument GetCoachTopicAndCategory(SkillOrTopic skill)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                if (skill != null)
                {
                    var query = Query.EQ("Name", skill.Name);
                    if (_ctsCollection.Find(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList().Count >0)
                    { 
                        BsonDocument result = _ctsCollection.Find(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList()[0];
                    if (result != null)
                    {
                        _Category = _Category.Add(new BsonElement("Category", result["Category"].AsString));
                        _Category = _Category.Add(new BsonElement("Topic", result["Topics"][0]["Name"].AsString));
                        _Category = _Category.Add(new BsonElement("Skill", skill.Name));
                        if (skill.profiLevel == null) skill.profiLevel = "0";
                        _Category = _Category.Add(new BsonElement("profiLevel", skill.profiLevel));
                    }
                }
              }
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCoachTopicAndCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _Category;
        }

        public List<CTSFilter> GetCTSFilters()
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            var filters = new List<CTSFilter>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                _categories = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();

                foreach (BsonDocument category in _categories)
                {
                    filters.Add(new CTSFilter() { Id = category["Id"].ToString(), Name = category["Category"].ToString(), Type = FilterType.Category });
                    if (category.Contains("Topics"))
                    {
                        BsonArray topics = (BsonArray)category["Topics"];
                        foreach (BsonDocument topic in topics)
                        {
                            filters.Add(new CTSFilter() { Id = topic["Id"].ToString(), Name = topic["Name"].ToString(), Type = FilterType.Topic, ParentId = category["Id"].ToString() });
                            if (topic.Contains("Skills"))
                            {
                                BsonArray skills = (BsonArray)topic["Skills"];
                                foreach (BsonDocument skill in skills)
                                {
                                    filters.Add(new CTSFilter() { Id = skill["Id"].ToString(), Name = skill["Name"].ToString(), Type = FilterType.Skill, ParentId = topic["Id"].ToString() });
                                }
                            }
                        }
                    }
                }
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return filters;
        }

        public BsonDocument GetCoacheeTopicAndCategory(SkillOrTopic skill)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("CTSDataCoaching");
                if (skill != null)
                {
                    var query = Query.EQ("Name", skill.Name);
                    BsonDocument result = _ctsCollection.Find(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList()[0];
                    if (result != null)
                    {
                        _Category = _Category.Add(new BsonElement("Category", result["Category"].AsString));
                        _Category = _Category.Add(new BsonElement("Topic", result["Topics"][0]["Name"].AsString));
                        _Category = _Category.Add(new BsonElement("Skill", skill.Name));
                        _Category = _Category.Add(new BsonElement("profiLevel", skill.profiLevel));
                    }
                }
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetCoacheeTopicAndCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }

            return _Category;
        }

        public BsonDocument GetTrendingTopics()
        {
            BsonDocument _Category = new BsonDocument();

            var _collection = _kindleDatabase.GetCollection("CoachOrMentor");
            //var result = _collection.Find(Query.And(Query.EQ("UserId", Data.UserId), Query.EQ("Role", Data.Role))).ToList();

            return _Category;
        }

    }
}
