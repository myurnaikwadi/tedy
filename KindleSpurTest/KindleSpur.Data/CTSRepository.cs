using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace KindleSpur.Data
{
   public class CTSRepository : ICTSRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection __ctsCollectionCoaching;
        MongoCollection _ctsCollectionMentoring;
        Connection con = new Connection();
        Dictionary<string, List<string>> list = new Dictionary<string, List<string>>();
        List<string> l = new List<string>();

        public CTSRepository()
        {

            try
            {
                __ctsCollectionCoaching = con.GetCollection("CTSDataCoaching");
                _ctsCollectionMentoring = con.GetCollection("CTSDataMentoring");
                _logCollection = con.GetCollection("ErrorLogs");
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
                _categories = __ctsCollectionCoaching.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCTS().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCTS()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _categories;

        }

        public List<BsonDocument> GetTopics()
        {

            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                _categories = _ctsCollectionMentoring.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetTopics().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetTopics()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _categories;

        }

        public List<BsonDocument> GetCTSCategoryAndTopic(List<string> skills)
        {

            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
               
                _categories = __ctsCollectionCoaching.FindAs<BsonDocument>(Query.EQ("Name", skills[0])).SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCTSCategoryAndTopic().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCTSCategoryAndTopic()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _categories;

        }

        public List<BsonDocument> GetCategories()
        {
           
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                _categories = __ctsCollectionCoaching.FindAllAs<BsonDocument>().SetFields("Category").ToList();              
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCategories().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCategories()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _categories;

        }

        public List<BsonDocument> GetTopics(string category)
        {
            List<BsonDocument> _topics = new List<BsonDocument>();

            try
            {
                _topics = _ctsCollectionMentoring.FindAs<BsonDocument>(Query.EQ("Category", category)).SetFields("Topic").ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetTopics().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetTopics()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _topics;
        }

        public List<BsonDocument> GetSkills(string category)
        {
            List<BsonDocument> _skills = new List<BsonDocument>();

            try
            {
                _skills = __ctsCollectionCoaching.FindAs<BsonDocument>(Query.EQ("Category", category)).SetFields("Skill").ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetSkills().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetSkills()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _skills;
        }

        public List<BsonDocument> GetSkills(string category, string topic)
        {
            List<BsonDocument> _skills = new List<BsonDocument>();

            try
            {
                _skills = __ctsCollectionCoaching.FindAs<BsonDocument>(Query.And(Query.EQ("Category",category),Query.EQ("Topic",topic))).SetFields("Skill").ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetSkills().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!"); ;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetSkills()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _skills;
        }

        public BsonDocument GetMentorCategory(SkillOrTopic topic)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                if (topic != null)
                {
                    var query = Query.EQ("Name", topic.Name);
                    BsonDocument result = _ctsCollectionMentoring.FindAs<BsonDocument>(Query.ElemMatch("Topics", Query.EQ("Name", topic.Name))).SetFields(Fields.Include("Category", "Topics.$")).ToList()[0];
                    if (result != null)
                    {
                        _Category = _Category.Add(new BsonElement("Category", result["Category"].AsString));
                        _Category = _Category.Add(new BsonElement("Topic", topic.Name));
                        _Category = _Category.Add(new BsonElement("profiLevel", topic.profiLevel));
                    }
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetMentorCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!"); ;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetMentorCategory()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _Category;
        }

        public BsonDocument GetCoachTopicAndCategory(SkillOrTopic skill)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                if (skill != null)
                {
                    var query = Query.EQ("Name", skill.Name);
                    if (__ctsCollectionCoaching.FindAs<BsonDocument>(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList().Count >0)
                    { 
                        BsonDocument result = __ctsCollectionCoaching.FindAs<BsonDocument>(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList()[0];
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
                string message = "{ Error : 'Failed at GetCoachTopicAndCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!"); ;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoachTopicAndCategory()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _Category;
        }

        public List<CTSFilter> GetCTSFilters(string Role)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            var filters = new List<CTSFilter>();

            try
            {
                if(Role=="Coach")
                { 
                    _categories = __ctsCollectionCoaching.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToList();

                    foreach (BsonDocument category in _categories)
                    {
                       // filters.Add(new CTSFilter() { Id = category["Id"].ToString(), Name = category["Category"].ToString(), Type = FilterType.Category });
                        if (category.Contains("Topics"))
                        {
                            BsonArray topics = (BsonArray)category["Topics"];
                            foreach (BsonDocument topic in topics)
                            {
                               // filters.Add(new CTSFilter() { Id = topic["Id"].ToString(), Name = topic["Name"].ToString(), Type = FilterType.Topic, ParentId = category["Id"].ToString() });
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
                else if (Role == "Mentor")
                {
                    _categories = _ctsCollectionMentoring.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToList();

                    foreach (BsonDocument category in _categories)
                    {
                        // filters.Add(new CTSFilter() { Id = category["Id"].ToString(), Name = category["Category"].ToString(), Type = FilterType.Category });
                        if (category.Contains("Topics"))
                        {
                            BsonArray topics = (BsonArray)category["Topics"];
                            foreach (BsonDocument topic in topics)
                            {
                               filters.Add(new CTSFilter() { Id = topic["Id"].ToString(), Name = topic["Name"].ToString(), Type = FilterType.Topic, ParentId = category["Id"].ToString() });
                            }
                        }
                    }
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCTSFilters().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!"); ;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoachTopicAndCategory()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return filters;
        }

        public BsonDocument GetCoacheeTopicAndCategory(SkillOrTopic skill)
        {
            BsonDocument _Category = new BsonDocument();

            try
            {
                if (skill != null)
                {
                    var query = Query.EQ("Name", skill.Name);
                    BsonDocument result = __ctsCollectionCoaching.FindAs<BsonDocument>(Query.ElemMatch("Topics.Skills", Query.EQ("Name", skill.Name))).SetFields(Fields.Include("Category", "Topics.Skills.$")).ToList()[0];
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
                string message = "{ Error : 'Failed at GetCoacheeTopicAndCategory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!"); 
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoacheeTopicAndCategory()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _Category;
        }

        public BsonDocument GetTrendingTopics()
        {
            BsonDocument _Category = new BsonDocument();
            var _collection = con.GetCollection("CoachOrMentor");
            //var result = _collection.Find(Query.And(Query.EQ("UserId", Data.UserId), Query.EQ("Role", Data.Role))).ToList();
            return _Category;
        }


        public List<BsonDocument> GetSkillsForTopic(string topic)
        {
            List<BsonDocument> _skills = new List<BsonDocument>();
            try
            {
                _skills = __ctsCollectionCoaching.FindAs<BsonDocument>( Query.EQ("Name", topic)).SetFields("Skills").ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetSkillsForTopic().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetSkillsForTopic()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _skills;
        }
        public Dictionary<string, List<string>> GetAllSkillAndTopics(string userID)
        {            
            string[] str = { "Coach" , "Coachee", "Mentor" , "Mentee" };
            var CoachOrMentorCollections = con.GetCollection("CoachOrMentor");
            var CoacheeOrMenteeCollections = con.GetCollection("CoacheeOrMentee");
            foreach (string items in str)
            {
                list.Add(items, l);
            }
            try
            {
                var Coach = (from c in CoachOrMentorCollections.AsQueryable<CoachOrMentor>()
                             where c.Role == "Coach" && c.UserId == userID
                             select c.Skills.Select(r => r.Name).ToList());
                var Coachee = (from c in CoacheeOrMenteeCollections.AsQueryable<CoacheeOrMentee>()
                               where c.Role == "Coachee" && c.UserId == userID
                               select c.Skills.Select(r => r.Name).ToList());
                var Mentor = (from c in CoachOrMentorCollections.AsQueryable<CoachOrMentor>()
                              where c.Role == "Mentor" && c.UserId == userID
                              select c.Topics.Select(r => r.Name).ToList());
                var Mentee = (from c in CoacheeOrMenteeCollections.AsQueryable<CoacheeOrMentee>()
                              where c.Role == "Mentee" && c.UserId == userID
                              select c.Topics.Select(r => r.Name).ToList());

                addSkillORTopicsToDictionary(Coach, "Coach");
                addSkillORTopicsToDictionary(Coachee, "Coachee");
                addSkillORTopicsToDictionary(Mentor, "Mentor");
                addSkillORTopicsToDictionary(Mentee, "Mentee");

            

            }
            catch (Exception e)
            {

                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllSkillAndTopics()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }

            return list;
        }

        private void addSkillORTopicsToDictionary(IQueryable<List<string>> obj, string strRole)
        {
            l = new List<string>();
            try
            {
                foreach (var skill in obj)
                {
                    foreach (var s in skill)
                    {
                        l.Add(s.ToString());
                    }

                }
                if (list.ContainsKey(strRole))
                {
                    list[strRole] = l;
                }
            }
            catch (Exception exp) { }
            finally
            {
                l = null;
            }
            
          }

    }
}
