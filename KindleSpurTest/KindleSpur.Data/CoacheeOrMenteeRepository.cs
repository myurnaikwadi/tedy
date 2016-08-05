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

namespace KindleSpur.Data
{
    public class CoacheeOrMenteeRepository
    {
        Connection con = new Connection();
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection _coacheeOrMenteeCollection;

        public CoacheeOrMenteeRepository()
        {
            string mongoServerConfig = "mongodb://127.0.0.1:27017";

            try
            {
                _mongoClient = new MongoClient(mongoServerConfig);
                _mongoServer = _mongoClient.GetServer();
                _kindleDatabase = _mongoServer.GetDatabase("KindleSpur");
                _logCollection = con.GetCollection("ErrorLogs");
                _coacheeOrMenteeCollection = con.GetCollection("CoacheeOrMentee");
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
                _logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
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

                        foreach (string topic in Data.Topics)
                        {
                            if (!_entity.Topics.Contains(topic))
                            {
                                blnDelete = false;
                                //   _entity.Topics.Add(topic);
                                break;

                            }
                        }
                        if (blnDelete) _entity.Topics.RemoveAt(i);
                    }
                    foreach (string topic in Data.Topics)
                    {

                        if (!_entity.Topics.Contains(topic))
                        {
                            _entity.Topics.Add(topic);

                        }
                    }

                }



                _entity.UpdateDate = DateTime.Today.ToShortDateString();
                _coacheeOrMenteeCollection.Save(_entity);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;

        }

        public List<string> GetTopicsForMentee(string UserId)
        {
           // var _collection = _kindleDatabase.GetCollection("CoacheeOrMentee");
            var result = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(
                                                                    Query.EQ("UserId", UserId),
                                                                    Query.EQ("Role", "Mentee")
                                                                 ));
            if (result != null)
                return result.Topics;
            else
                return new List<string>();
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
                _logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
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
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
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

                reward.MentorRewardPoints = (mentee != null ? mentee.RewardPointsGained : 0);

                _transactionStatus = true;

            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
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
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
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
            catch (Exception ex)
            {

                throw;
            }

            return coacheeEntities.ToList();
        }
        public int addFeedback(string UserId, Feedback feedback)
        {
            bool _transactionStatus = false;
            try
            {
                CoacheeOrMentee entity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", "Coach")));
                entity.FeedbackPoints += ((feedback.customerSatisfactionRating + feedback.selectedAttractive.answer + feedback.selectedComparioson.answer) / 3);

                if (entity.Feedbacks == null) entity.Feedbacks = new List<IFeedback>();
                feedback.Sender = UserId;
                entity.Feedbacks.Add(feedback);
                entity.RewardPointsGained += 1;
                _coacheeOrMenteeCollection.Save(entity);
                var _users = _kindleDatabase.GetCollection("UserDetails");
                User user = _users.FindOneAs<User>(Query.EQ("EmailAddress", UserId));
                user.BalanceRewardPoints += 1;
                user.TotalRewardPoints += 1;
                _users.Save(user);
                _transactionStatus = true;
                return user.TotalRewardPoints;
            }
            catch (Exception e)
            {
                _transactionStatus = false;
            }
            return 0;

        }
        public List<SkillOrTopic> GetSkillsForCoachee(string UserId)
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
            catch (Exception ex)
            {

                throw;
            }

            return coacheeEntities.ToList();
        }

        public List<CoachStatus> GetCoachingStatus(string UserId)
        {
            List<IFeedback> LstCochees = new List<IFeedback>();
            List<CoachStatus> result = new List<CoachStatus>();
            try
            {

                CoacheeOrMentee coach = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.EQ("UserId", UserId));
                if (coach != null)
                {
                    LstCochees = coach.Feedbacks;

                    if (LstCochees != null)
                    {
                        result = (from t in LstCochees
                                  group t by new { t.Sender, t.Skill }
                                     into grp
                                  select new CoachStatus()
                                  {
                                      EmailAddress = grp.Key.Sender,
                                      Skill = grp.Key.Skill,
                                      FeedbackCount = grp.Count(),
                                      Rating = grp.OrderByDescending(t => t.customerSatisfactionRating).FirstOrDefault().customerSatisfactionRating
                                  }).ToList();

                        if (result.Count() > 0)
                        {
                            for (var i = 0; i < result.Count(); i++)
                            {
                                result[i] = GetCocheeDetails(result[i]);
                                result[i].TreeURL = GetTreeURL(result[i].FeedbackCount, result[i].Rating);
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }
        public CoachStatus GetCocheeDetails(CoachStatus c)
        {
            if (c != null)
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
