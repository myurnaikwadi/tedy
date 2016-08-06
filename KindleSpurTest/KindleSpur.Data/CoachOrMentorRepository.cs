using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Linq;

namespace KindleSpur.Data
{
    public class CoachOrMentorRepository : ICoachOrMentorRepository
    {
        Connection con = new Connection();
        MongoCollection _logCollection;
        MongoCollection _coachOrMentorCollection;

        public CoachOrMentorRepository()
        {
            try
            {         
                _logCollection = con.GetCollection("ErrorLogs");
                _coachOrMentorCollection = con.GetCollection("CoachOrMentor");
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
                _logCollection.Insert("{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
            }
        

            return _transactionStatus;
        }

        public int addFeedback(string UserId, Feedback feedback)
        {
            bool _transactionStatus = false;
            try {
                CoachOrMentor entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", feedback.Sender), Query.EQ("Role", "Coach")));
                entity.FeedbackPoints += feedback.customerSatisfactionRating;

                if (entity.Feedbacks == null) entity.Feedbacks = new List<Feedback>();
                feedback.Sender = UserId;
                feedback.CreateDate = DateTime.Now;
                feedback.Skill = feedback.Skill;
                entity.Feedbacks.Add(feedback);
                entity.RewardPointsGained += 5;           
                _coachOrMentorCollection.Save(entity);
                var _users = con.GetCollection("UserDetails");
                User user = _users.FindOneAs<User>(Query.EQ("EmailAddress", UserId));
                user.BalanceRewardPoints += 5;
                user.TotalRewardPoints +=5;
                _users.Save(user);
                _transactionStatus = true;
                return user.TotalRewardPoints;
            }
            catch(Exception e)
            {
                _transactionStatus = false;
            }
            return 0;

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
                var _entity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(
                                                                   Query.EQ("UserId", UserId),
                                                                   Query.EQ("Role", Data.Role)
                                                                ));

                if (Data.Role.ToLower() == "coach" || Data.Role.ToLower() == "coachee")
                {
                    for (int i = _entity.Skills.Count - 1; i >= 0; i--)
                    {
                        bool blnDelete = true;

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

                if (Data.Role.ToLower() == "mentor" || Data.Role.ToLower() == "mentee")
                {
                    for (int i = _entity.Topics.Count - 1; i >= 0; i--)
                    {
                        bool blnDelete = true;

                        foreach (SkillOrTopic item in Data.Topics)
                        {
                            if (item.Id == _entity.Topics[i].Id)
                            {
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
                            if(_entity.Topics[i].Id == topic.Id)
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
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
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
                _logCollection.Insert("{ Error : 'Failed at AddNewCoachOrMentor().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
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
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
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
            catch (Exception ex)
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
                result = _coachOrMentorCollection.FindOneAs<ICoachOrMentor>(Query.EQ("_id", ObjectId.Parse(Id)));
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return result;
        }

        public List<CoachOrMentor> GetAllCoachOrMentors(CTSFilter ctsFilter)
        {
            IQueryable<CoachOrMentor> coachEntities = default(IQueryable<CoachOrMentor>);
            try
            {
                var res1 = new List<BsonDocument>();
                if (ctsFilter.Type == FilterType.Skill)
                {
                    coachEntities = _coachOrMentorCollection.FindAs<CoachOrMentor>(Query.ElemMatch("Skills", Query.EQ("Name", ctsFilter.Name))).AsQueryable();
                }
                if (ctsFilter.Type == FilterType.Topic || !(_coachOrMentorCollection.Count() > 0))
                    coachEntities = _coachOrMentorCollection.FindAs<CoachOrMentor>(Query.ElemMatch("Topics", Query.EQ("Name", ctsFilter.Name))).AsQueryable();

                if (ctsFilter.Type == FilterType.Category || !(_coachOrMentorCollection.Count() > 0))
                {
                    //Get Topics -> Get Skills
                    coachEntities = new List<CoachOrMentor>().AsQueryable();
                }
               
            }
            catch (Exception ex)
            {

                throw;
            }

            return coachEntities.ToList();
        }

        public List<CoachStatus> GetCoachingStatus(string UserId)
        {
            List<Feedback> LstCochees = new List<Feedback>();
            List<CoachStatus> result = new List<CoachStatus>();
            try
            {
                CoachOrMentor coach = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.EQ("UserId", UserId));
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
            if(c != null)
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
                c.skills= _coacheeRepo.GetSkillsForCoachee(c.EmailAddress);
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

        public List<CoachOrMentor> GetRecommendedCoachList(List<SkillOrTopic> lstSkillforCochee, string Role)
        {
            List<CoachOrMentor> lstCoachOrMentor = new List<CoachOrMentor>();
            foreach (SkillOrTopic s1 in lstSkillforCochee)
            {
                lstCoachOrMentor.AddRange(_coachOrMentorCollection.FindAs<CoachOrMentor>(Query.And(Query.EQ("Skills.Name", s1.Name), Query.EQ("Role", Role))));
            }
            return lstCoachOrMentor;
        }
    }
}


