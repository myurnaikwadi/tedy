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
using MongoDB.Bson.Serialization;

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

        public bool AddNewInvite(IConversation conversationData)
        {
            bool _transactionStatus = false;

            try
            {
                var result = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail), Query.EQ("skill", conversationData.skill))).ToList();

                if (result.Count() > 0 && conversationData.Content == null && conversationData.FilesURLlink == null)
                {
                    if (result[result.Count - 1]["ConversationClosed"] == true)
                    {
                        conversationData.Active = true;

                    }
                    else if (result[result.Count - 1]["IsRejected"] == false && result[result.Count - 1]["IsVerified"] == false && result[result.Count - 1]["Active"] == true)
                    {
                        _conversationCollection.Update(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail), Query.EQ("skill", conversationData.skill)), Update<Conversation>.Set(c => c.IsRejected, false).Set(q => q.Active, false));
                        return true;

                    }
                    else
                    {
                        _transactionStatus = false;
                        return false;
                    }
                }
                conversationData.IsRejected = false;

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
                var st = new System.Diagnostics.StackTrace(e, true);
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

        public bool AddNewConversation(IConversation conversationData)
        {
            bool _transactionStatus = false;
            string swappingEmail = string.Empty;

            try
            {
                var result = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail), Query.EQ("skill", conversationData.skill))).ToList();

                if (result.Count() > 0 && conversationData.Content == null && conversationData.FilesURLlink == null)
                {
                    if (result[result.Count - 1]["IsRejected"] == false && result[result.Count - 1]["IsVerified"] == false && result[result.Count - 1]["Active"] == true)
                    {
                        _conversationCollection.Update(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail), Query.EQ("skill", conversationData.skill)), Update<Conversation>.Set(c => c.IsRejected, false).Set(q => q.Active, false));
                        return true;
                    }
                    else
                    {
                        _transactionStatus = false;
                        return false;
                    }
                }

                conversationData.isRead = "Coachee";
                conversationData.SendOrReceive = "Coach";
                conversationData.IsRejected = false;

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
                var st = new System.Diagnostics.StackTrace(e, true);
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
                var st = new System.Diagnostics.StackTrace(e, true);
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

        public bool UpdateConversationStatus(string senderEmail, string receiverEmail, string content, bool isVerified, bool isRejected, string ConversationType, string ParentId, string skill)
        {
            bool _transactionStatus = false;
            CoachOrMentor coach = null;
            CoacheeOrMentee coacheeOrMentee = null;
            try
            {

                var conversationDetail = _conversationCollection.FindOneAs<Conversation>(Query.And(Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail), Query.EQ("ConversationType", ConversationType), Query.EQ("skill", skill)));
                conversationDetail.Content = content;
                conversationDetail.UpdateDate = DateTime.Now;
                conversationDetail.ConversationParentId = ParentId;
                conversationDetail.IsVerified = isVerified;
                conversationDetail.SendOrReceive = "Coach";
                conversationDetail.isRead = "Coachee";
                if (isVerified)
                {
                    MongoCollection _coachOrMentorCollection;
                    _coachOrMentorCollection = con.GetCollection("CoachOrMentor");
                    MongoCollection _coacheeOrMenteeCollection;
                    _coacheeOrMenteeCollection = con.GetCollection("CoacheeOrMentee");

                    if (ConversationType == "Coaching")
                    {
                        coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", senderEmail), Query.EQ("Role", "Coach")));
                        coacheeOrMentee = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", receiverEmail), Query.EQ("Role", "Coachee")));
                    }
                    else if (ConversationType == "Mentoring")
                    {
                        coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", senderEmail), Query.EQ("Role", "Mentor")));
                        coacheeOrMentee = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", receiverEmail), Query.EQ("Role", "Mentee")));

                    }
                    if (coach.CoachingStatus == null) coach.CoachingStatus = new List<ICoachingStatus>();
                    CoachingStatus coachingStatus = new CoachingStatus();
                    coachingStatus.CreateDate = DateTime.Now;
                    coachingStatus.Sender = receiverEmail;
                    coachingStatus.Receiver = senderEmail;
                    coachingStatus.Skill = skill;
                    coachingStatus.customerSatisfactionRating = 0;
                    coachingStatus.FeedbackClosed = false;
                    coachingStatus.FeedBackCount = 0;
                    coach.CoachingStatus.Add(coachingStatus);
                    _coachOrMentorCollection.Save(coach);

                    if (coacheeOrMentee.CoachingStatus == null) coacheeOrMentee.CoachingStatus = new List<ICoachingStatus>();
                    CoachingStatus coachingStatus1 = new CoachingStatus();
                    coachingStatus1.CreateDate = DateTime.Now;
                    coachingStatus1.Sender = senderEmail;
                    coachingStatus1.Receiver = receiverEmail;
                    coachingStatus1.Skill = skill;
                    coachingStatus1.customerSatisfactionRating = 0;
                    coachingStatus1.FeedbackClosed = false;
                    coachingStatus1.FeedBackCount = 0;
                    coacheeOrMentee.CoachingStatus.Add(coachingStatus1);
                    _coacheeOrMenteeCollection.Save(coacheeOrMentee);
                }
                else
                {
                    _conversationCollection.Update(Query.And(Query.EQ("SenderEmail", conversationDetail.SenderEmail), Query.EQ("ReceiverEmail", conversationDetail.ReceiverEmail), Query.EQ("skill", conversationDetail.skill)), Update<Conversation>.Set(c => c.IsRejected, false).Set(q => q.Active, true));
                    return true;
                }
                conversationDetail.IsRejected = isRejected;
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
                var st = new System.Diagnostics.StackTrace(e, true);
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

        //Coach or Mentor list in the communication window
        public List<BsonDocument> ListConversationForReceiver(string loggedEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {
                var _query1 = Query.And(Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));
                _categories = _conversationCollection.FindAs<BsonDocument>(_query1).SetFields(Fields.Exclude("_id").Include("ReceiverEmail", "SenderEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();

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

        //Coachee or Mentee list in the communication window
        public List<BsonDocument> ListConversationForSender(string loggedEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {

                _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType), Query<Conversation>.EQ(p2 => p2.SendOrReceive, "Coachee"), Query<Conversation>.EQ(p3 => p3.isRead, "Coach"))).SetFields(Fields.Exclude("_id").Include("SenderEmail", "ReceiverEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();

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

            #region commented code
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
            #endregion
        }

        #region commented code

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
        #endregion


        //This method is used on dashboard to get all the coaching/mentoring invites
        public List<BsonDocument> GetAllConversationRequest(string senderEmail)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {

                var _query = Query.And(Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.IsVerified, false), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p1 => p1.Active, false));

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

        public List<Conversation> GetAllConversationRequestPerMonth(string userId, DateTime FromDate, DateTime ToDate)
        {
            BsonDateTime newFromDate = BsonDateTime.Create(FromDate);
            BsonDateTime newToDate = BsonDateTime.Create(ToDate);
            List<Conversation> _categories = new List<Conversation>();

            try
            {

                var _query = Query.And(Query<Conversation>.GTE(p => p.UpdateDate, newFromDate.ToUniversalTime()), Query<Conversation>.LTE(p => p.UpdateDate, newToDate.ToUniversalTime()), Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.IsVerified, false), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, userId));
                _categories = _conversationCollection.FindAs<Conversation>(_query).ToList();

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

        public List<BsonDocument> GetConversation(string ParentId, string ConversationType, string Role)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            string newRole = Role == "Coach" ? "Coachee" : "Mentee";

            _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("ConversationParentId", ParentId), Query.EQ("ConversationType", ConversationType), Query.EQ("SendOrReceive",Role), Query.EQ("isRead", newRole))).ToList();

            var _userDetailsCollection = con.GetCollection("UserDetails");
            try
            {
                for (int i = 0; i < _categories.Count; i++)
                {
                    string sender = _categories[i].GetElement("SenderEmail").Value.ToString();
                    _categories[i].Remove("_id");
                    BsonElement element = _categories[i].GetElement("UpdateDate");
                    _categories[i].RemoveElement(element);
                    _categories[i].Add(new BsonElement("UpdateDate", element.Value.ToString().TrimEnd('Z')));
                    string receiver = _categories[i].GetElement("ReceiverEmail").Value.ToString();

                }
            }

            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetConversation()";
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




            return _categories;


        }


        public List<BsonDocument> GetConversationRequest(string senderEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {

                var _query = Query.And(Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.IsVerified, false), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));

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
                //throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetConversationRequest()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                //throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return list;

        }

        public bool Bookmarks(string UserId, List<BookMark> bookmarks)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = con.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", UserId));
                List<BookMark> path = new List<BookMark>();
                foreach (var bookmark in bookmarks)
                {
                    BookMark Link = new BookMark();
                    Link.Id = ObjectId.GenerateNewId();
                    Link.BookMarkId= Guid.NewGuid().ToString();
                    Link.LinkUrl = bookmark.LinkUrl;
                    Link.DocumentName = bookmark.DocumentName;
                    Link.TagName = bookmark.TagName;

                    path.Add(Link);
                }
                if (userDetail.BookMarks == null)
                    userDetail.BookMarks = new List<BookMark>();
                userDetail.BookMarks.AddRange(path.ToList());




                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at uploadResourceFile()";
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
            return _transactionStatus;


        }


        public List<FileUpload> getFiles(string UserId)
        {
            var _UserrCollection = con.GetCollection("UserDetails");

            var userDetail = _UserrCollection.FindOneAs<User>(Query.EQ("EmailAddress", UserId));




            if (userDetail != null)
                return userDetail.Files;
            else
                return new List<FileUpload>();

        }
        public List<BookMark> getFilesBookmarks(string UserId)
        {
            var _UserrCollection = con.GetCollection("UserDetails");

            var userDetail = _UserrCollection.FindOneAs<User>(Query.EQ("EmailAddress", UserId));



            if (userDetail != null)
                return userDetail.BookMarks;
            else
                return new List<BookMark>();

        }
        public bool AddResourceFileLink(IConversation conversationData)
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
                var st = new System.Diagnostics.StackTrace(e, true);
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




    }
}
