using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KindleSpur.Models;
using System.Diagnostics;

namespace KindleSpur.Data
{
    public class CoacheeOrMenteeRepository
    {
        Connection con = new Connection();
        //MongoClient _mongoClient;
        //MongoServer _mongoServer;
    //    MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection _coacheeOrMenteeCollection;
        MongoCollection _coachOrMentorCollection;

        public CoacheeOrMenteeRepository()
        {


            try
            {
                _logCollection = con.GetCollection("ErrorLogs");
                _coacheeOrMenteeCollection = con.GetCollection("CoacheeOrMentee");
                _coachOrMentorCollection = con.GetCollection("CoachOrMentor");
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public bool AddNewCoacheeOrMentee(ICoacheeOrMentee Data)
        {
            bool _transactionStatus = false;

            try
            {
                //     var _collection = _kindleDatabase.GetCollection("CoacheeOrMentee");

                var result = _coacheeOrMenteeCollection.FindAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", Data.UserId), Query.EQ("Role", Data.Role))).ToList();

                if (result.Count() > 0)
                {
                    EditCoacheeOrMentee(Data.UserId.ToString(), Data);
                }
                else
                {
                    _coacheeOrMenteeCollection.Insert(Data);
                }

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                //throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddNewCoacheeOrMentee()";
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

        public bool EditCoacheeOrMentee(string UserId, ICoacheeOrMentee Data)
        {
            bool _transactionStatus = false;
            try
            {
                var _entity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", Data.Role)
                                                                ));

                if (Data.Role == "Coachee")
                {
                    bool blnDelete = true;
                    for (int i = _entity.Skills.Count - 1; i >= 0; i--)
                    {

                        foreach (SkillOrTopic item in Data.Skills)
                        {
                            if (item.Id == _entity.Skills[i].Id)
                            {
                                _entity.Skills[i].profiLevel = item.profiLevel;
                                blnDelete = false;
                                break;
                            }


                        }
                        if (blnDelete) _entity.Skills.RemoveAt(i);
                    }

                    foreach (SkillOrTopic skill in Data.Skills)
                    {
                        bool blnAdd = true;
                        for (int i = _entity.Skills.Count - 1; i >= 0; i--)
                        {
                            if (_entity.Skills[i].Id == skill.Id)
                            {
                                blnAdd = false;
                                break;
                            }
                        }

                        if (blnAdd) _entity.Skills.Add(skill);
                    }
                }

                if (Data.Role == "Mentee")
                {

                    bool blnDelete = true;
                    for (int i = _entity.Topics.Count - 1; i >= 0; i--)
                    {

                        foreach (SkillOrTopic item in Data.Topics)
                        {
                            if (item.Id == _entity.Topics[i].Id)
                            {
                                _entity.Topics[i].profiLevel = item.profiLevel;
                                blnDelete = false;
                                break;
                            }


                        }
                        if (blnDelete) _entity.Topics.RemoveAt(i);
                    }

                    foreach (SkillOrTopic Topics in Data.Topics)
                    {
                        bool blnAdd = true;
                        for (int i = _entity.Topics.Count - 1; i >= 0; i--)
                        {
                            if (_entity.Topics[i].Id == Topics.Id)
                            {
                                blnAdd = false;
                                break;
                            }
                        }

                        if (blnAdd) _entity.Topics.Add(Topics);
                    }

                }



                _entity.UpdateDate = DateTime.Today.ToShortDateString();
                _coacheeOrMenteeCollection.Save(_entity);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at EditCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at EditCoacheeOrMentee()";
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

        public SearchCoachOrMentor GetProfileDetails(string role, string emailAddress)
        {
            SearchCoachOrMentor obj = new SearchCoachOrMentor();
            try
            {
                var result = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(
                                                                  Query.EQ("UserId", emailAddress),
                                                                  Query.EQ("Role", role)
                                                               ));

                obj.EmailAddress = result.UserId;
                obj.Role = result.Role;
                if (result.Role == "Coachee")
                    obj.Skills = result.Skills;
                else if (result.Role == "Mentee")
                    obj.Topics = result.Topics;
                var _userCollection = con.GetCollection("UserDetails");
                User userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", result.UserId));
                obj.FirstName = userDetail.FirstName;
                obj.LastName = userDetail.LastName;
                obj.Photo = userDetail.Photo;
                obj.City = userDetail.City;
                obj.Country = userDetail.Country;
                obj.State = userDetail.State;
                obj.Mobile = userDetail.Mobile;
                obj.LinkdinURL = userDetail.LinkdinURL;
                obj.description = userDetail.description;
                return obj;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetProfileDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Not able to find profile details!!!");
                //_logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                //throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetProfileDetails()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true); var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Not able to find profile details!!!");
            }
            finally
            {

            }

        }

        public List<SkillOrTopic> GetTopicsForMentee(string UserId)
        {
            // var _collection = _kindleDatabase.GetCollection("CoacheeOrMentee");
            var result = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(
                                                                    Query.EQ("UserId", UserId),
                                                                    Query.EQ("Role", "Mentee")
                                                                 ));
            if (result != null)
                return result.Topics;
            else
                return new List<SkillOrTopic>();
        }

        public bool DeleteCoacheeOrMentee(string Id)
        {
            bool _transactionStatus = false;
            try
            {
                _coacheeOrMenteeCollection.Remove(Query.EQ("_id", Id));
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at DeleteCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                //throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at DeleteCoacheeOrMentee()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true); var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }
        public BsonDocument GetRecommended(string role)
        {
            BsonDocument result = null;
            try
            {
                result = _coacheeOrMenteeCollection.FindAs<ICoacheeOrMentee>(Query.EQ("Role", role)).SetFields(Fields.Exclude("_id")).ToBsonDocument();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRecommended().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRecommended()";
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

            return result;
        }

        public void GetRewardPoints(string userId, ref Reward reward)
        {
            bool _transactionStatus = false;
            try
            {
                CoacheeOrMentee coachee = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", userId),
                                                                                             Query.EQ("Role", "Coachee")));
                reward.CoacheeRewardPoints = (coachee != null ? coachee.RewardPointsGained : 0);
                CoacheeOrMentee mentee = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", userId),
                                                                                              Query.EQ("Role", "Mentee")));

                reward.MenteeRewardPoints = (mentee != null ? mentee.RewardPointsGained : 0);

                _transactionStatus = true;

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRewardPoints().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRewardPoints()";
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

        }

        public List<ICoacheeOrMentee> GetAllCoacheeOrMenteeDetails()
        {
            List<ICoacheeOrMentee> result = null;
            try
            {
                result = _coacheeOrMenteeCollection.FindAllAs<ICoacheeOrMentee>().ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return result;
        }

        public ICoacheeOrMentee GetCoacheeOrMenteeDetail(string Id)
        {
            ICoacheeOrMentee result = null;
            try
            {
                result = _coacheeOrMenteeCollection.FindOneAs<ICoacheeOrMentee>(Query.EQ("_id", ObjectId.Parse(Id)));
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCoacheeOrMenteeDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoacheeOrMenteeDetail()";
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

            return result;
        }

        public List<CoacheeOrMentee> GetAllCoacheeOrMentee(CTSFilter ctsFilter)
        {
            IQueryable<CoacheeOrMentee> coacheeEntities = default(IQueryable<CoacheeOrMentee>);
            try
            {
                var res1 = new List<BsonDocument>();
                if (ctsFilter.Type == FilterType.Skill)
                {
                    coacheeEntities = _coacheeOrMenteeCollection.FindAs<CoacheeOrMentee>(Query.ElemMatch("Skills", Query.EQ("Name", ctsFilter.Name))).AsQueryable();
                }
                if (ctsFilter.Type == FilterType.Topic || !(_coacheeOrMenteeCollection.Count() > 0))
                    coacheeEntities = _coacheeOrMenteeCollection.FindAs<CoacheeOrMentee>(Query.EQ("Topics", ctsFilter.Name)).AsQueryable();

                if (ctsFilter.Type == FilterType.Category || !(_coacheeOrMenteeCollection.Count() > 0))
                {
                    //Get Topics -> Get Skills
                    coacheeEntities = new List<CoacheeOrMentee>().AsQueryable();
                }

            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetAllCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllCoacheeOrMentee()";
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

            return coacheeEntities.ToList();
        }
        public int addFeedback(string UserId, Feedback feedback, string Role)
        {
            bool _transactionStatus = false;
            CoacheeOrMentee entity = new CoacheeOrMentee();
            CoachOrMentor coachOrMentorEntity = new CoachOrMentor();
            try
            {
                if (Role == "Coachee")
                {
                    entity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", Role)));
                    coachOrMentorEntity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", "Coach")));
                }
                else if (Role == "Mentee")
                {
                    entity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", Role)));
                    coachOrMentorEntity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", "Mentor")));
                }

                if(feedback.FeedbackStatus == "PRESESSION")
                    entity.FeedbackPoints = feedback.customerSatisfactionRating;
                else
                    entity.FeedbackPoints += feedback.customerSatisfactionRating;
                
                if (entity.Feedbacks == null) entity.Feedbacks = new List<IFeedback>();
                feedback.Sender = UserId;
                feedback.CreateDate = DateTime.Now;
                entity.Feedbacks.Add(feedback);

                _coacheeOrMenteeCollection.Save(entity);

                var _users = con.GetCollection("UserDetails");
                User user = _users.FindOneAs<User>(Query.EQ("EmailAddress", UserId));

                if (feedback.FeedbackStatus == "FEEDBACK")
                {
                    user.BalanceRewardPoints += 5;
                    user.TotalRewardPoints += 5;
                    coachOrMentorEntity.RewardPointsGained += 5;
                }
                _users.Save(user);

                ICoachingStatus coachingStatus = coachOrMentorEntity.CoachingStatus.Find(x => x.Sender == entity.UserId && x.Skill == feedback.Skill);
                coachingStatus.customerSatisfactionRating = feedback.customerSatisfactionRating;
                if (feedback.FeedbackStatus != "PRESESSION")
                    coachingStatus.FeedBackCount += 1;
                coachingStatus.FeedbackClosed = feedback.FeedbackClosed;
              

                coachOrMentorEntity.CoachingStatus.Add(coachingStatus);
                _coachOrMentorCollection.Save(coachOrMentorEntity);
                _transactionStatus = true;
                return user.TotalRewardPoints;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at addFeedback().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_transactionStatus = false;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at addFeedback()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
              //  throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return 0;

        }
        public List<SkillOrTopic> GetSkillsForCoachee(string UserId)
        {
            try
            {
                var result = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", "Coachee")
                                                                ));
                if (result != null)
                    return result.Skills;
                else
                    return new List<SkillOrTopic>();
            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetSkillsForCoachee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetSkillsForCoachee()";
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
        }

        public List<CoacheeOrMentee> GetAllCoacheeOrMentees(CTSFilter ctsFilter)
        {
            IQueryable<CoacheeOrMentee> coacheeEntities = default(IQueryable<CoacheeOrMentee>);
            try
            {
                var res1 = new List<BsonDocument>();
                if (ctsFilter.Type == FilterType.Skill)
                {
                    coacheeEntities = _coacheeOrMenteeCollection.FindAs<CoacheeOrMentee>(Query.ElemMatch("Skills", Query.EQ("Name", ctsFilter.Name))).AsQueryable();
                }
                if (ctsFilter.Type == FilterType.Topic || !(_coacheeOrMenteeCollection.Count() > 0))
                    coacheeEntities = _coacheeOrMenteeCollection.FindAs<CoacheeOrMentee>(Query.EQ("Topics", ctsFilter.Name)).AsQueryable();

                if (ctsFilter.Type == FilterType.Category || !(_coacheeOrMenteeCollection.Count() > 0))
                {
                    //Get Topics -> Get Skills
                    coacheeEntities = new List<CoacheeOrMentee>().AsQueryable();
                }

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetAllCoacheeOrMentees().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllCoacheeOrMentees()";
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

            return coacheeEntities.ToList();
        }

        public List<CoachStatus> GetCoachingStatus(string UserId, string Role)
        {
            List<ICoachingStatus> LstCochees = new List<ICoachingStatus>();
            List<CoachStatus> result = new List<CoachStatus>();
            try
            {

                CoacheeOrMentee coach = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", Role)));
                if (coach != null)
                {
                    LstCochees = coach.CoachingStatus;

                    if (LstCochees != null)
                    {
                        result = (from t in LstCochees
                                  group t by new { t.Sender, t.Skill }
                                     into grp
                                  select new CoachStatus()
                                  {
                                      EmailAddress = grp.Key.Sender,
                                      Skill = grp.Key.Skill,
                                      FeedbackClosed = grp.OrderByDescending(t => t.CreateDate).FirstOrDefault().FeedbackClosed,
                                      FeedbackCount = grp.Count(),
                                      Rating = grp.OrderByDescending(t => t.customerSatisfactionRating).FirstOrDefault().customerSatisfactionRating
                                  }).ToList();

                        //if (result.Count() > 0)
                        //{
                            for (var i = 0; i < result.Count(); i++)
                            {
                                result[i] = GetCocheeDetails(result[i]);
                                result[i].TreeURL = GetTreeURL(result[i].FeedbackCount, result[i].Rating);
                            }
                       // }
                    }
                }

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCoachingStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
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
            return result;
        }

        public List<CoachStatus> GenerateGarden(string UserId, string Role)
        {
            List<ICoachingStatus> LstCochees = new List<ICoachingStatus>();
            List<CoachStatus> result = new List<CoachStatus>();
          
            Role = Role == "Coachee" ? "Coach" : "Mentor";
            try
            {

                CoachOrMentor coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("CoachingStatus.Sender", UserId), Query.EQ("Role", Role)));
                if (coach != null)
                {
                    LstCochees = coach.CoachingStatus;

                    if (LstCochees != null)
                    {
                        result = (from t in LstCochees
                                  group t by new { t.Sender, t.Skill }
                                     into grp
                                  select new CoachStatus()
                                  {
                                      EmailAddress = grp.Key.Sender,
                                      Skill = grp.Key.Skill,
                                      FeedbackClosed = grp.OrderByDescending(t => t.CreateDate).FirstOrDefault().FeedbackClosed,
                                      FeedbackCount = grp.Count(),
                                      Rating = grp.OrderByDescending(t => t.customerSatisfactionRating).FirstOrDefault().customerSatisfactionRating
                                  }).ToList();

                        //if (result.Count() > 0)
                        //{
                        for (var i = 0; i < result.Count(); i++)
                        {
                            result[i] = GetCocheeDetails(result[i]);
                            result[i].TreeURL = GetTreeURL(result[i].FeedbackCount, result[i].Rating);
                        }
                        // }
                    }
                }

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCoachingStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
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
            return result;
        }

        public CoachStatus GetCocheeDetails(CoachStatus c)
        {
            if (c != null)
            {
                var _userCollection = con.GetCollection("UserDetails");
                User userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", c.EmailAddress));
                c.FirstName = userDetail.FirstName;
                c.LastName = userDetail.LastName;
                c.PhotoURL = userDetail.Photo;
                c.Mobile = userDetail.Mobile;
                c.LinkdinURL = userDetail.LinkdinURL;
                c.description = userDetail.description;

                CoacheeOrMenteeRepository _coacheeRepo = new CoacheeOrMenteeRepository();
                //c.topics = _coacheeRepo.GetTopicsForMentee(c.EmailAddress);
                c.skills = _coacheeRepo.GetSkillsForCoachee(c.EmailAddress);
            }
            return c;
        }
        public string GetTreeURL(int FeedbackCount, int Rating)
        {
            string TreeURL = "Images/Tree/Stage 1.png";

            if (FeedbackCount == 1)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 2.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 2 with water.png";
            }
            else if (FeedbackCount == 2)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 3.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 3 with flower.png";
            }
            else if (FeedbackCount == 3)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 4.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 4 with Fruits.png";
            }
            else if (FeedbackCount >= 4)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 5.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 5 with Fruits.png";
            }
            return TreeURL;
        }
    }
}
