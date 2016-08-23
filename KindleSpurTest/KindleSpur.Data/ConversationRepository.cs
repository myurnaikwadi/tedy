using KindleSpur.Models.Interfaces;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using MongoDB.Bson.Serialization.Attributes;
using System.Diagnostics;

namespace KindleSpur.Data
{
    [BsonIgnoreExtraElements]
    public class ConversationRepository : IConversationRepository
    {
        Connection con = new Connection();
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection _conversationCollection;

        public ConversationRepository()
        {

            try
            {
                _conversationCollection = con.GetCollection("Conversations");
                _logCollection = con.GetCollection("ErrorLogs");
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public bool AddNewConversation(IConversation conversationData)
        {
            bool _transactionStatus = false;

            try
            {
                var result = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail), Query.EQ("skill", conversationData.skill))).ToList();

                if (result.Count() > 0 && conversationData.Content == null)
                {
                    _transactionStatus = false;
                    return false;
                }
                _conversationCollection.Insert(conversationData);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCoachingStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoachingStatus()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _transactionStatus;
        }

        public bool EditConversation(string conversationId, IConversation conversationData)
        {
            bool _transactionStatus = false;
            try
            {
                var conversationDetail = _conversationCollection.FindOneAs<IConversation>(Query.EQ("_id", ObjectId.Parse(conversationId)));
                conversationDetail.SenderEmail = conversationData.SenderEmail;
                conversationDetail.ReceiverEmail = conversationData.ReceiverEmail;
                //conversationDetail.Content = conversationData.Content;
                conversationDetail.UpdateDate = DateTime.Now;
                //conversationDetail.IsVerified = true;

                _conversationCollection.Save(conversationDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at EditConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at EditConversation()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public bool UpdateConversationStatus(string senderEmail, string receiverEmail, string content, bool isVerified, string ConversationType, string ParentId, string skill)
        {
            bool _transactionStatus = false;
            try
            {

                var conversationDetail = _conversationCollection.FindOneAs<Conversation>(Query.And(Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail), Query.EQ("ConversationType", ConversationType), Query.EQ("skill", skill)));

                conversationDetail.IsVerified = isVerified;
                conversationDetail.Content = content;
                conversationDetail.UpdateDate = DateTime.Now;
                conversationDetail.ConversationParentId = ParentId;
                _conversationCollection.Save(conversationDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateConversationStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateConversationStatus()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public List<BsonDocument> ListConversationForReceiver(string loggedEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {
                //var _query = Query.And(Query.Or(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail)), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));


                //_checkUser = _conversationCollection.Find(_query).ToList();
                //if (_checkUser.Count() > 0)
                //{
                var _query1 = Query.And(Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));
                _categories = _conversationCollection.FindAs<BsonDocument>(_query1).SetFields(Fields.Exclude("_id").Include("ReceiverEmail", "SenderEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();

                //}
                //else
                //{
                //    var _query1 = //Query.Or(
                //                  // Query.And(
                //                  //             Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true)),
                //    Query.And(
                //                Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType))
                //        ;
                //    _categories = _conversationCollection.Find(
                //    _query1
                //    ).SetFields(Fields.Exclude("_id").Include("SenderEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();
                //}


                //_categories = _conversationCollection.Find().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at ListConversationForReceiver().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at ListConversationForReceiver()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
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
        public List<BsonDocument> ListConversationForSender(string loggedEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {

                _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType))).SetFields(Fields.Exclude("_id").Include("SenderEmail", "ReceiverEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();

                //_categories = _conversationCollection.Find().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at ListConversationForSender().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at ListConversationForSender()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _categories;

            //var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
            //IQueryable<BsonDocument> convEntities = default(IQueryable<BsonDocument>);

            //try
            //{
            //    var res1 = new List<BsonDocument>();

            //    convEntities = _conversationCollection.FindAll().ToList().AsQueryable();

            //}
            //catch (MongoException ex)
            //{
            //    _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            //}

            //return convEntities.ToList();
        }

        //public List<BsonDocument> ListConversation()
        //{
        //    List<BsonDocument> result = null;

        //    try
        //    {
        //        var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
        //        result = _conversationCollection.FindAll().ToList();

        //    }
        //    catch (MongoException ex)
        //    {
        //        _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
        //    }

        //    return result;
        //}

        public List<BsonDocument> GetConversation(string ParentId, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                //var _convCollection = _kindleDatabase.GetCollection<Conversation>("Conversations");
                //var _query = Query.And(
                //            Query.Or(
                //                        Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail)),
                //            Query.Or(
                //                        Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail))
                //                );

                //var _query = Query.Or(
                //    Query.And(
                //                Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType)),
                //    Query.And(
                //                Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType))
                //        );

                //MongoCursor<Conversation> cursor = _convCollection.Find(_query);

                //_categories = _conversationCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();

                _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("ConversationParentId", ParentId), Query.EQ("ConversationType", ConversationType))).ToList();
                var _userDetailsCollection = con.GetCollection("UserDetails");
                try
                {
                    for (int i = 0; i < _categories.Count; i++)
                    {
                        string sender = _categories[i].GetElement("SenderEmail").Value.ToString();
                        BsonDocument result = _userDetailsCollection.FindAs<BsonDocument>(Query.EQ("EmailAddress", sender.ToString())).ToBsonDocument();
                        _categories[i].Add(new BsonElement("Sender", result.GetElement("FirstName").Value + " " + result.GetElement("LastName").Value));
                        string receiver = _categories[i].GetElement("ReceiverEmail").Value.ToString();
                        BsonDocument result1 = _userDetailsCollection.FindAs<BsonDocument>(Query.EQ("EmailAddress", receiver)).ToBsonDocument();
                        _categories[i].Add(new BsonElement("Receiver", result.GetElement("FirstName").Value + " " + result.GetElement("LastName").Value));
                    }
                }
                catch (Exception ex)
                {

                }
                //_query
                //Query.And(
                //    Query.Or(
                //                Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail)),
                //    Query.Or(
                //                Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail))
                //        )


                //_categories = _conversationCollection.Find(Query.Or(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).ToList();

                //            var query =
                //from e in _conversationCollection.AsQueryable<Conversation>().ToList()
                //where (e.ReceiverEmail == receiverEmail || e.ReceiverEmail == senderEmail) && (e.SenderEmail == receiverEmail || e.SenderEmail == senderEmail)
                //select e;


                //_categories = _conversationCollection.Find(Query.And(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail), Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail))).ToList();

                //_categories = _conversationCollection.Find(Query.And(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).ToList();
                //_categories = _categories.Find(Query.And((Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).Query.And(Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail)).ToList();

                //var _ctsCollection = _kindleDatabase.GetCollection("Conversations");
                //_categories = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _categories;


        }


        public List<BsonDocument> GetConversationRequest(string senderEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {

                var _query = Query.And(Query<Conversation>.EQ(p => p.Content, null), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));

                _categories = _conversationCollection.FindAs<BsonDocument>(_query).ToList();


            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetConversationRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetConversationRequest()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
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

        public IConversation GetConversationDetail(int conversationId)
        {
            return _conversationCollection.FindOneByIdAs<IConversation>(conversationId);
        }

        public IConversation GetConversationDetail(string message)
        {
            return _conversationCollection.FindOneAs<Conversation>(Query.EQ("message", message));
        }
        public List<object> GetSkillsForConversation()
        {
            var list = new List<object>();
            try
            {


                var _CoachOrMentorCollection = con.GetCollection("CoachOrMentor");
                var _CoacheeOrMenteeCollection = con.GetCollection("CoacheeOrMentee");
                //Coaching Skills
                var Coach = (from c in _CoachOrMentorCollection.AsQueryable<CoachOrMentor>()
                             where c.Role == "Coach"
                             select (c.Skills.Select(r => r.Name).ToList())).ToList();

                var Coachee = (from c in _CoacheeOrMenteeCollection.AsQueryable<CoacheeOrMentee>()
                               where c.Role == "Coachee"
                               select (c.Skills.Select(r => r.Name).ToList())).ToList();



                var resultsCoaching = Coach.Concat(Coachee);
                List<string> skillListCoaching = new List<string>();
                foreach (var skills in resultsCoaching)
                {
                    foreach (var skill in skills)
                    {
                        skillListCoaching.Add(skill);
                    }
                }
                List<string> SkillFilterListCoaching = skillListCoaching.Distinct().Take(5).ToList();


                //Mentor SKill

                var Mentor = (from c in _CoachOrMentorCollection.AsQueryable<CoachOrMentor>()
                              where c.Role == "Mentor"
                              select (c.Topics.Select(r => r.Name).ToList())).ToList();

                var Mentee = (from c in _CoacheeOrMenteeCollection.AsQueryable<CoacheeOrMentee>()
                              where c.Role == "Mentee"
                              select (c.Topics.Select(r => r.Name).ToList())).ToList();

                var resultsMentoring = Mentor.Concat(Mentee);
                List<string> skillListMentoring = new List<string>();
                foreach (var topics in resultsMentoring)
                {
                    foreach (var topic in topics)
                    {
                        skillListMentoring.Add(topic);
                    }
                }
                List<string> TopicFilterListMentoring = skillListMentoring.Distinct().Take(5).ToList();


              //  var list = new List<object>();
                list.Add(SkillFilterListCoaching);
                list.Add(TopicFilterListMentoring);



            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetSkillsForConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetConversationRequest()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return list;

        }


    }
}
