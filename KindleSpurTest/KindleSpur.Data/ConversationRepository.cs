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

        public bool AddNewConversation(IConversation conversationData, string role)
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

                if (role == "Coach" || role == "Mentor")
                {
                    conversationData.CoachOrMentor = conversationData.SenderEmail;
                    conversationData.CoacheeOrMentee = conversationData.ReceiverEmail;
                }

                else if (role == "Coachee" || role == "Mentee")
                {
                    conversationData.CoachOrMentor = conversationData.ReceiverEmail;
                    conversationData.CoacheeOrMentee = conversationData.SenderEmail;
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

        public bool EditConversation(string conversationId, IConversation conversationData)
        {
            bool _transactionStatus = false;
            try
            {
                var conversationDetail = _conversationCollection.FindOneAs<IConversation>(Query.EQ("_id", ObjectId.Parse(conversationId)));
                conversationDetail.SenderEmail = conversationData.SenderEmail;
                conversationDetail.ReceiverEmail = conversationData.ReceiverEmail;
                conversationDetail.UpdateDate = DateTime.Now;
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
                conversationDetail.CoachOrMentor = senderEmail;
                conversationDetail.CoacheeOrMentee = receiverEmail;
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
        public List<BsonDocument> ListConversationForReceiver(string loggedEmail, string ConversationType, string role)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {
                if (role == "Coach" || role == "Mentor")
                {
                    var _query1 = Query.And(Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.CoachOrMentor, loggedEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));
                    _categories = _conversationCollection.FindAs<BsonDocument>(_query1).SetFields(Fields.Exclude("_id").Include("ReceiverEmail", "SenderEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();
                }
                else if (role == "Coachee" || role == "Mentee")
                {
                    var _query2 = Query.And(Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.CoacheeOrMentee, loggedEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));
                    _categories = _conversationCollection.FindAs<BsonDocument>(_query2).SetFields(Fields.Exclude("_id").Include("ReceiverEmail", "SenderEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();


                }

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
        public List<BsonDocument> ListConversationForSender(string loggedEmail, string ConversationType, string role)
        {

            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {
                if (role == "Coach" || role == "Mentor")
                    _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p11 => p11.CoachOrMentor, loggedEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType))).SetFields(Fields.Exclude("_id").Include("SenderEmail", "ReceiverEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();
                else if (role == "Coachee" || role == "Mentee")
                    _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true), Query<Conversation>.EQ(p11 => p11.CoacheeOrMentee, loggedEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType))).SetFields(Fields.Exclude("_id").Include("SenderEmail", "ReceiverEmail", "skill", "ConversationType", "ConversationId", "ConversationParentId")).Distinct().ToList();


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

        }




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
            UserRepository userRepo = new Data.UserRepository();

            try
            {

                var _query = Query.And(Query<Conversation>.GTE(p => p.UpdateDate, newFromDate.ToUniversalTime()), Query<Conversation>.LTE(p => p.UpdateDate, newToDate.ToUniversalTime()), Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p1 => p1.IsVerified, false), Query<Conversation>.EQ(p5 => p5.Active, false), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, userId));
                _categories = _conversationCollection.FindAs<Conversation>(_query).ToList();
                for (int count = 0; count < _categories.Count; count++)
                {
                    User userDetails = (User)userRepo.GetUserDetail(_categories[count].ReceiverEmail);
                    User userDetails1 = (User)userRepo.GetUserDetail(_categories[count].SenderEmail);

                    _categories[count].ToFirstName = userDetails.FirstName;
                    _categories[count].ToLastName = userDetails.LastName;
                    _categories[count].ToPhoto = userDetails.Photo;
                    _categories[count].ReceiverEmail = userDetails.EmailAddress;

                    _categories[count].FromFirstName = userDetails1.FirstName;
                    _categories[count].FromLastName = userDetails1.LastName;
                    _categories[count].FromPhoto = userDetails1.Photo;
                    _categories[count].SenderEmail = userDetails1.EmailAddress;
                }

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

        //This method is used to retrieve the chat
        public List<BsonDocument> GetConversation(string ParentId, string ConversationType, string role, string loggedinEmailAddress)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            if (role == "Coach" || role == "Mentor")
                _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("ConversationParentId", ParentId), Query.EQ("ConversationType", ConversationType))).ToList();
            else if (role == "Coachee" || role == "Mentee")
                _categories = _conversationCollection.FindAs<BsonDocument>(Query.And(Query.EQ("ConversationParentId", ParentId), Query.EQ("ConversationType", ConversationType))).ToList();


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

            return _categories;


        }


        public List<BsonDocument> GetConversationRequest(string senderEmail, string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {

                var _query = Query.And(Query<Conversation>.EQ(p => p.IsRejected, false), Query<Conversation>.EQ(p3 => p3.Active, false), Query<Conversation>.EQ(p1 => p1.IsVerified, false), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));

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
                list.Add(SkillFilterListCoaching);
                list.Add(TopicFilterListMentoring);



            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetSkillsForConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
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

            }
            finally
            {

            }

            return list;

        }

        public bool Bookmarks(string UserId, List<BookMark> bookmarks)
        {
            bool _transactionStatus = false;
            UserRepository _repo = new UserRepository();
            try
            {
                var _userCollection = con.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", UserId));
                List<BookMark> path = new List<BookMark>();

                //var result = _userCollection.FindAs<BsonDocument>(Query.And(Query.EQ("EmailAddress", userDetail.EmailAddress), Query.EQ("Files", userDetail.Files.Select(c => c.FileId ==))).ToList();
                // List<FileUpload> fileupdate = new List<FileUpload>();

                foreach (var bookmark in bookmarks)
                {
                    // var id = _userCollection.FindAs<User>(Query.EQ("Bookmarks.BookMarkId", userDetail.BookMarks.Select(x=>x.BookMarkId).ToBsonDocument().Any())).ToList();
                    //   FileUpload file = new FileUpload();
                    if (userDetail.BookMarks != null)
                    {
                        var id = userDetail.BookMarks.Select(x => new BookMark { ParentFileId = x.ParentFileId }).Distinct().ToList();
                        var check = id.FirstOrDefault(ch => ch.ParentFileId == bookmark.ParentFileId);
                        if (check != null)
                        {
                            if (check.ParentFileId != null)
                            {
                                _userCollection.Update(Query.EQ("EmailAddress", userDetail.EmailAddress), Update<User>.Set(c => c.BookMarks, userDetail.BookMarks));
                            }
                            else
                            {
                                Bookmark(_userCollection, userDetail, path, bookmark);

                            }

                        }
                        else
                        {
                            Bookmark(_userCollection, userDetail, path, bookmark);

                        }
                    }
                    else
                    {
                        Bookmark(_userCollection, userDetail, path, bookmark);

                    }


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
        private static void GetFillesAnBookmarks(User user, ConversationRepository cs, Dictionary<string, object> obj)
        {
            var files = cs.getFiles(user.EmailAddress);
            var bookmark = cs.getFilesBookmarks(user.EmailAddress);
            if (files != null)
            {
                List<FileUpload> listfile = new List<FileUpload>();
                foreach (var i in files)

                    listfile.Add(i);
                obj.Add("Artifacts", listfile);

            }
            if (bookmark != null)
            {
                List<BookMark> listbookmark = new List<BookMark>();
                foreach (var e in bookmark)
                    listbookmark.Add(e);

                obj.Add("Bookmarks", listbookmark);
            }
        }
        private static void Bookmark(MongoCollection _userCollection, User userDetail, List<BookMark> path, BookMark bookmark)
        {
            BookMark Link = new BookMark();
            Link.Id = ObjectId.GenerateNewId();
            Link.BookMarkId =bookmark.BookMarkId;
            Link.LinkUrl = bookmark.LinkUrl;
            Link.DocumentName = bookmark.DocumentName;
            Link.ParentFileId = bookmark.ParentFileId;

            path.Add(Link);
            if (bookmark.ParentFileId != null)
            {
                foreach (var fileid in userDetail.Files.Where(w => w.FileId == bookmark.ParentFileId))
                {
                    fileid.bookMarked = bookmark.ParentFileId;
                    _userCollection.Update(Query.EQ("EmailAddress", userDetail.EmailAddress), Update<User>.Set(c => c.Files, userDetail.Files));

                }
            }
            else
            {
               
                    _userCollection.Update(Query.EQ("EmailAddress", userDetail.EmailAddress), Update<User>.Set(c => c.Files, userDetail.Files));
                
            }
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
