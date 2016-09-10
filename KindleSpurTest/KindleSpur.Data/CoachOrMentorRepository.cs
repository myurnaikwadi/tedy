using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace KindleSpur.Data
{
    public class CoachOrMentorRepository : ICoachOrMentorRepository
    {
        Connection con = new Connection();
        MongoCollection _logCollection;
        MongoCollection _coachOrMentorCollection;
        MongoCollection _coacheeOrMenteeCollection;
        MongoCollection _conversationCollection;


        public CoachOrMentorRepository()
        {
            try
            {
                _logCollection = con.GetCollection("ErrorLogs");
                _coachOrMentorCollection = con.GetCollection("CoachOrMentor");
                _coacheeOrMenteeCollection = con.GetCollection("CoacheeOrMentee");
                _conversationCollection = con.GetCollection("Conversations");
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at CoachOrMentorRepository().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at CoachOrMentorRepository()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Error");
            }
        }

        public bool AddNewCoachOrMentor(ICoachOrMentor Data)
        {
            bool _transactionStatus = false;

            try
            {
                var result = _coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("UserId", Data.UserId), Query.EQ("Role", Data.Role))).ToList();

                if (result.Count() > 0)
                {
                    EditCoachOrMentor(Data.UserId.ToString(), Data);
                }
                else
                {
                    _coachOrMentorCollection.Insert(Data);
                }

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddNewCoachOrMentor()";
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

        public List<CoachStatus> GenerateGarden(string UserId, string Role)
        {
            List<ICoachingStatus> LstCochees = new List<ICoachingStatus>();
            Role = Role == "Coach" ? "Coachee" : "Mentee";
            List<CoachStatus> result = new List<CoachStatus>();
            try
            {

                CoacheeOrMentee coach = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("CoachingStatus.Sender", UserId), Query.EQ("Role", Role)));
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

        public int addFeedback(string UserId, Feedback feedback, string Role)
{
            bool _transactionStatus = false;
            string newRole = string.Empty;
            CoachOrMentor entity = new CoachOrMentor();
            CoacheeOrMentee coacheeOrMenteeEntity = new CoacheeOrMentee();
            try
            {
                // CoachOrMentor entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", "Coach")));
                if (Role == "Coach")
                {
                    entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", Role)));
                    coacheeOrMenteeEntity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", "Coachee")));
                }
                else if (Role == "Mentor")
                {
                    entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", Role)));
                    coacheeOrMenteeEntity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", "Mentee")));
                }

                if (feedback.FeedbackStatus == "PRESESSION")
                    entity.FeedbackPoints = feedback.customerSatisfactionRating;
                else
                    entity.FeedbackPoints += feedback.customerSatisfactionRating;

                if (entity.Feedbacks == null) entity.Feedbacks = new List<IFeedback>();

                feedback.Sender = UserId;
                feedback.CreateDate = DateTime.Now;
                entity.Feedbacks.Add(feedback);

                _coachOrMentorCollection.Save(entity);

                var _users = con.GetCollection("UserDetails");
                User user = _users.FindOneAs<User>(Query.EQ("EmailAddress", UserId));
                if (feedback.FeedbackStatus == "FEEDBACK")
                { 
                    user.BalanceRewardPoints += 5;
                    user.TotalRewardPoints += 5;
                    coacheeOrMenteeEntity.RewardPointsGained += 5;
                }
                _users.Save(user);

                

                ICoachingStatus coachingStatus = coacheeOrMenteeEntity.CoachingStatus.Find(x => x.Sender == entity.UserId && x.Skill == feedback.Skill);
                coachingStatus.customerSatisfactionRating = feedback.customerSatisfactionRating;
                if (feedback.FeedbackStatus != "PRESESSION")
                    coachingStatus.FeedBackCount += 1;
                coachingStatus.FeedbackClosed = feedback.FeedbackClosed;
              
                coacheeOrMenteeEntity.CoachingStatus.Add(coachingStatus);
                
                //coacheeOrMenteeEntity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", newRole)));
                _coacheeOrMenteeCollection.Save(coacheeOrMenteeEntity);
                _transactionStatus = true;
                return user.TotalRewardPoints;


            }

            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at addFeedback().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                _transactionStatus = false;
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
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

        }

        public List<SkillOrTopic> GetSkillsForCoach(string UserId)
        {
            var result = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(
                                                                    Query.EQ("UserId", UserId),
                                                                    Query.EQ("Role", "Coach")
                                                                 ));
            if (result != null)
                return result.Skills;
            else
                return new List<SkillOrTopic>();
        }

        public List<SkillOrTopic> GetTopicsForMentor(string UserId)
        {
            var result = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(
                                                                    Query.EQ("UserId", UserId),
                                                                    Query.EQ("Role", "Mentor")
                                                                 ));
            if (result != null)
                return result.Topics;
            else
                return new List<SkillOrTopic>();
        }

        public bool DeleteCoachOrMentor(string Id)
        {
            bool _transactionStatus = false;
            try
            {
                _coachOrMentorCollection.Remove(Query.EQ("_id", Id));
                _transactionStatus = true;

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetTopicsForMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetTopicsForMentor()";
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                em.Log = e.Message.Replace("\r\n", "");
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _transactionStatus;
        }

        public bool EditCoachOrMentor(string UserId, ICoachOrMentor Data)
        {
            bool _transactionStatus = false;
            try
            {
                var _entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", Data.Role)
                                                                ));

                if (Data.Role.ToLower() == "coach")
                {
                    for (int i = _entity.Skills.Count - 1; i >= 0; i--)
                    {

                        bool blnDelete = true;

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

                if (Data.Role.ToLower() == "mentor")
                {
                    for (int i = _entity.Topics.Count - 1; i >= 0; i--)
                    {
                        bool blnDelete = true;

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

                    foreach (SkillOrTopic topic in Data.Topics)
                    {
                        bool blnAdd = true;
                        for (int i = _entity.Topics.Count - 1; i >= 0; i--)
                        {
                            if (_entity.Topics[i].Id == topic.Id)
                            {
                                blnAdd = false;
                                break;
                            }
                        }

                        if (blnAdd) _entity.Topics.Add(topic);
                    }
                }
                _entity.UpdateDate = DateTime.Now;
                _coachOrMentorCollection.Save(_entity);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at EditCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at EditCoachOrMentor()";
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

        public void GetRewardPoints(string userId, ref Reward reward)
        {
            bool _transactionStatus = false;
            try
            {
                CoachOrMentor coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", userId),
                                                                                             Query.EQ("Role", "Coach")));
                reward.CoachRewardPoints = (coach != null ? coach.RewardPointsGained : 0);
                CoachOrMentor mentor = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", userId),
                                                                                              Query.EQ("Role", "Mentor")));

                reward.MentorRewardPoints = (mentor != null ? mentor.RewardPointsGained : 0);

                _transactionStatus = true;

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRewardPoints().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                //throw new MongoException("Signup failure!!!");
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

        public List<ICoachOrMentor> GetAllCoachOrMentorDetails()
        {
            List<ICoachOrMentor> result = null;
            try
            {
                result = _coachOrMentorCollection.FindAllAs<ICoachOrMentor>().ToList();
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetAllCoachOrMentorDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllCoachOrMentorDetails()";
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


        public BsonDocument GetRecommended(string role)
        {
            BsonDocument result = null;
            try
            {
                result = _coachOrMentorCollection.FindAs<ICoachOrMentor>(Query.EQ("Role", role)).SetFields(Fields.Exclude("_id")).ToBsonDocument();
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

        public ICoachOrMentor GetCoachOrMentorDetail(string Id)
        {
            ICoachOrMentor result = null;
            try
            {
                result = _coachOrMentorCollection.FindOneAs<ICoachOrMentor>(Query.EQ("_id", ObjectId.Parse(Id)));
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetCoachOrMentorDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoachOrMentorDetail()";
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

        public List<SearchCoachOrMentor> GetAllCoachOrMentors(CTSFilter ctsFilter, string Role)
        {
            List<CoachOrMentor> lstCoachOrMentor = new List<CoachOrMentor>();
            try
            {
                if (Role == "Coach")
                {
                    if (ctsFilter.Type == FilterType.Skill)
                    {
                        lstCoachOrMentor.AddRange(_coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("Skills.Name", ctsFilter.Name), Query.EQ("Role", Role))).SetFields(Fields.Exclude("Feedbacks")));
                    }
                    else if (ctsFilter.Type == FilterType.Topic && _coachOrMentorCollection.Count() > 0)
                    {
                        CTSRepository ctsrep = new CTSRepository();
                        ctsrep.GetSkillsForTopic(ctsFilter.Name);
                        //coachEntities = _coachOrMentorCollection.FindAs<CoachOrMentor>(Query.ElemMatch("Topics", Query.EQ("Name", ctsFilter.Name))).AsQueryable();
                    }
                    //else if (ctsFilter.Type == FilterType.Category && _coachOrMentorCollection.Count() > 0)
                    // {
                    //     coachEntities = new List<CoachOrMentor>().AsQueryable();
                    // }
                }
                else if (Role == "Mentor")
                {
                    if (ctsFilter.Type == FilterType.Topic && _coachOrMentorCollection.Count() > 0)
                    {
                        lstCoachOrMentor.AddRange(_coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("Topics.Name", ctsFilter.Name), Query.EQ("Role", Role))).SetFields(Fields.Exclude("Feedbacks"))); ;
                    }
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetAllCoachOrMentors().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at  GetAllCoachOrMentors().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");

            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllCoachOrMentors()";
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


            if (lstCoachOrMentor.Count > 0)
                return FillSerachData(lstCoachOrMentor);
            return null;
        }

       
        public List<CoachStatus> GetCoachingStatus(string UserId, string Role)
        {
            List<ICoachingStatus> LstCochees = new List<ICoachingStatus>();
            List<CoachStatus> result = new List<CoachStatus>();
            try
            {
                CoachOrMentor coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", UserId), Query.EQ("Role", Role)));
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

                       // if (result.Count() > 0)
                       // {
                            for (var i = 0; i < result.Count(); i++)
                            {
                                result[i] = GetCocheeDetails(result[i]);
                                result[i].TreeURL = GetTreeURL(result[i].FeedbackCount, result[i].Rating, result[i].FeedbackClosed);
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
        public string GetTreeURL(int FeedbackCount, int Rating, bool closingStatus)
        {

            string TreeURL = "Images/Tree/Stage 1.png";

            if (closingStatus) return TreeURL = TreeURL = "Images/Tree/Stage 5 with Fruits.png";

            if (FeedbackCount == 2)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 2.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 2 with water.png";
            }
            else if (FeedbackCount == 3)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 3.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 3 with flower.png";
            }
            else if (FeedbackCount == 4)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 4.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 4 with Fruits.png";
            }
            else if (FeedbackCount >= 5)
            {
                if (Rating >= 1 && Rating <= 3)
                    TreeURL = "Images/Tree/Stage 5.png";
                else if (Rating >= 4 && Rating <= 5)
                    TreeURL = "Images/Tree/Stage 5 with Fruits.png";
            }
            return TreeURL;
        }

        public List<SearchCoachOrMentor> GetRecommendedCoachList(List<SkillOrTopic> lstSkillforCochee, string Role, string UserId)
        {
            List<CoachOrMentor> lstCoach = new List<CoachOrMentor>();
            List<string> lstTopicOrSkill = new List<string>();
            try
            {
                foreach (SkillOrTopic s1 in lstSkillforCochee)
                {
                    lstTopicOrSkill.Add(s1.Name);
                }
                foreach (SkillOrTopic s1 in lstSkillforCochee)
                {
                    lstCoach.AddRange(_coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("Skills.Name", s1.Name), Query.EQ("Role", Role))));
                }

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRecommendedCoachList().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at  GetRecommendedCoachList().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRecommendedCoachList()";
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
            if (lstCoach.Count > 0)
                //  return FillSerachData(lstCoach);
                return RecommendedFillSerachData(lstCoach, lstTopicOrSkill, UserId);
            return null;
        }

        public List<SearchCoachOrMentor> GetRecommendedMentorList(List<SkillOrTopic> lstTopicforMentee, string Role, string UserId)
        {
            List<CoachOrMentor> lstCoach = new List<CoachOrMentor>();
            List<string> lstTopicOrSkill = new List<string>();
            try
            {
                foreach (SkillOrTopic s1 in lstTopicforMentee)
                {
                    lstTopicOrSkill.Add(s1.Name);
                }
                foreach (SkillOrTopic s1 in lstTopicforMentee)
                {
                    lstCoach.AddRange(_coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("Topics.Name", s1.Name), Query.EQ("Role", Role))).SetFields(Fields.Exclude("Feedbacks")));
                }

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRecommendedMentorList().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");

                //_logCollection.Insert("{ Error : 'Failed at  GetRecommendedMentorList().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRecommendedMentorList()";
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
            if (lstCoach.Count > 0)
                //  return FillSerachData(lstCoach);
                return RecommendedFillSerachData(lstCoach, lstTopicOrSkill, UserId);
            return null;
        }

        private List<SearchCoachOrMentor> FillSerachData(List<CoachOrMentor> lstCoachOrMentor)
        {
            List<SearchCoachOrMentor> lstSearchCoachOrMentor = new List<SearchCoachOrMentor>();
            try
            {
                lstCoachOrMentor = lstCoachOrMentor.GroupBy(test => test.UserId)
                           .Select(grp => grp.First())
                           .ToList();
                if (lstCoachOrMentor.Count > 0)
                {
                    for (int i = 0; i < lstCoachOrMentor.Count; i++)
                    {
                        lstSearchCoachOrMentor.Add(GetCoachOrMentorSearchDetails(lstCoachOrMentor[i]));
                    }
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at FillSerachData().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_logCollection.Insert("{ Error : 'Failed at  FillSerachData().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at FillSerachData()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }


            return lstSearchCoachOrMentor;
        }

        private SearchCoachOrMentor GetCoachOrMentorSearchDetails(CoachOrMentor c)
        {
            SearchCoachOrMentor obj = new SearchCoachOrMentor();
            try
            {
                obj.EmailAddress = c.UserId;
                obj.Role = c.Role;
                if (c.Role == "Coach")
                    obj.Skills = c.Skills;
                else if (c.Role == "Mentor")
                    obj.Topics = c.Topics;
                var _userCollection = con.GetCollection("UserDetails");
                User userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", c.UserId));
                obj.FirstName = userDetail.FirstName;
                obj.LastName = userDetail.LastName;
                obj.PhotoURL = userDetail.Photo;
                obj.City = userDetail.City;
                obj.Country = userDetail.Country;
                obj.State = userDetail.State;
                obj.Mobile = userDetail.Mobile;
                obj.LinkdinURL = userDetail.LinkdinURL;
                obj.description = userDetail.description;

            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetCoachOrMentorSearchDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at  GetCoachOrMentorSearchDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");

            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetCoachOrMentorSearchDetails()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }

            return obj;
        }

        private List<SearchCoachOrMentor> RecommendedFillSerachData(List<CoachOrMentor> lstCoachOrMentor, List<string> lstTopicOrSkill, string UserId)
        {
            List<SearchCoachOrMentor> lstSearchCoachOrMentor = new List<SearchCoachOrMentor>();
            try
            {
                lstCoachOrMentor = lstCoachOrMentor.Where(t => t.UserId != UserId)
               .GroupBy(test => test.UserId)
              .Select(grp => grp.First())
              .ToList();

                if (lstCoachOrMentor.Count > 0)
                {

                    for (int i = 0; i < lstCoachOrMentor.Count; i++)
                    {
                        lstSearchCoachOrMentor.Add(GetRecommendedCoachOrMentorSearchDetails(lstCoachOrMentor[i], lstTopicOrSkill));
                    }
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at RecommendedFillSerachData().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at  RecommendedFillSerachData().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at RecommendedFillSerachData()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }


            return lstSearchCoachOrMentor;
        }

        private SearchCoachOrMentor GetRecommendedCoachOrMentorSearchDetails(CoachOrMentor c, List<string> lstTopicOrSkill)
        {
            SearchCoachOrMentor obj = new SearchCoachOrMentor();
            try
            {
                obj.EmailAddress = c.UserId;
                obj.Role = c.Role;
                 if (c.Role == "Coach")
                {
                    
                    c.Skills = c.Skills.Where(i => lstTopicOrSkill.Contains(i.Name)).ToList();
                    if (c.CoachingStatus != null)
                    {
                       List<string> skills=  c.CoachingStatus.Where(i => lstTopicOrSkill.Contains(i.Skill)).Select(x => x.Skill).ToList();
                        c.Skills.RemoveAll(x=> skills.Contains(x.Name));
                    }
                    obj.Skills = c.Skills;
                }
                else if (c.Role == "Mentor")
                {
                    c.Topics = c.Topics.Where(i => lstTopicOrSkill.Contains(i.Name)).ToList();

                    if (c.CoachingStatus != null)
                    {
                        List<string> topics = c.CoachingStatus.Where(i => lstTopicOrSkill.Contains(i.Skill)).Select(x => x.Skill).ToList();
                        c.Topics.RemoveAll(x => topics.Contains(x.Name));
                    }
                    obj.Topics = c.Topics;
                }
                var _userCollection = con.GetCollection("UserDetails");
                User userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", c.UserId));
                obj.FirstName = userDetail.FirstName;
                obj.LastName = userDetail.LastName;
                obj.Photo = userDetail.Photo;
                obj.Mobile = userDetail.Mobile;
                obj.LinkdinURL = userDetail.LinkdinURL;
                obj.description = userDetail.description;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetRecommendedCoachOrMentorSearchDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                // _logCollection.Insert("{ Error : 'Failed at  GetRecommendedCoachOrMentorSearchDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRecommendedCoachOrMentorSearchDetails()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }

            return obj;
        }
    }
}