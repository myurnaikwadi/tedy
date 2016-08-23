using KindleSpur.Models.Interfaces;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using System.Collections;
using System.Diagnostics;

namespace KindleSpur.Data
{
    public class UserRepository : IUserRepository
    {
        private Connection con = new Connection();
        private MongoCollection _logCollection;
        private MongoCollection _userCollection;
        private string emailAddress;


        public UserRepository()
        {              
            try
            {
                _logCollection = con.GetCollection("ErrorLogs");
                 _userCollection= con.GetCollection("UserDetails");
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public UserRepository(string emailAddress) : this()
        {
            this.emailAddress = emailAddress;
        }

        public bool AddNewUser(IUser userData)
        {
            bool _transactionStatus = false;

            try
            {
                var result = _userCollection.FindAs<IUser>(Query.EQ("EmailAddress", userData.EmailAddress));

                if (result.Count() > 0)
                    return false;
                
                userData.UpdateDate = DateTime.Now;
                userData.IsVerified = true;
                _userCollection.Insert(userData);
                
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddNewUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddNewUser()";
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

        public bool EditUser(string userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<IUser>(Query.EQ("_id", ObjectId.Parse(userId)));
                userDetail.EmailAddress = userData.EmailAddress;
                userDetail.Password = userData.Password;
                userDetail.IsExternalAuthentication = userData.IsExternalAuthentication;
                userDetail.UpdateDate = DateTime.Now;
                userDetail.IsVerified = true;

                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at EditUser()";
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

        public User SavePassword(string userId, IUser userData)
        { 
            User userDetail = _userCollection.FindOneAs<User>(Query.EQ("_id", ObjectId.Parse(userId)));
            userDetail.Password = userData.Password;
            userDetail.IsExternalAuthentication = userData.IsExternalAuthentication;
            userDetail.UpdateDate = DateTime.Now;
            userDetail.IsVerified = true;

            _userCollection.Save(userDetail);

            return (User)userDetail;

        }

        public IUser GetUserDetail(int userId)
        {
            try
            {
                 return _userCollection.FindOneByIdAs<IUser>(userId);
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetUserDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetUserDetail()";
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
        }
        public IUser GetUserDetail(string EmailAddress)
        {
            try
            {
                return _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetUserDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetUserDetail()";
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
        }

        public bool UpdateUserDetails(string EmailAddress, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                //var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.FirstName = userData.FirstName;
                userDetail.LastName = userData.LastName;
                userDetail.Mobile = userData.Mobile;
                userDetail.Country = userData.Country;
                userDetail.City = userData.City;
                userDetail.State = userData.State;
                userDetail.LinkdinURL = userData.LinkdinURL;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserDetails()";
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

        public bool UpdateUserDesc(string EmailAddress, string description)
        {
            bool _transactionStatus = false;
            try
            {
                //var userDetail = _userCollection.FindOneByIdAs<IUser>(EmailAddress);
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.description = description;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserDesc().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserDesc()";
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

        public bool UpdateUserPhoto(string EmailAddress, string PhotoPath)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.Photo = PhotoPath;
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
                em.Error = "Failed at UpdateUserPhoto()";
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
        public bool UpdatecoverPhoto(string EmailAddress, string coverPhotoPath)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.coverphoto = coverPhotoPath;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdatecoverPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdatecoverPhoto()";
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


        public void GetRewardPoints(string EmailAddress, ref Reward reward)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                 reward.TotalRewardPoints = (userDetail.TotalRewardPoints.ToString() != null ? userDetail.TotalRewardPoints : 0);
                 reward.BalanceRewardPoints = (userDetail.BalanceRewardPoints.ToString() != null ? userDetail.BalanceRewardPoints : 0);
                 reward.RedeemedPoints = (userDetail.RedeemedPoints.ToString() != null ? userDetail.RedeemedPoints : 0);
               
                if (reward.PSRAndGames == null) reward.PSRAndGames = new List<ActiveGamesAndPSR>();

                if (userDetail.Games != null)
                {
                    for (int index = userDetail.Games.Count - 1; index >= 0; index--)
                    {
                        ActiveGamesAndPSR objGamesAndPSR = new ActiveGamesAndPSR();
                        if (!userDetail.Games[index].Name.Contains("PSR"))
                        {
                            objGamesAndPSR.Name = "Game " + (index + 1);
                            objGamesAndPSR.PSR = false;
                        } 
                        else
                        {
                            objGamesAndPSR.Name = userDetail.Games[index].Name;
                            objGamesAndPSR.PSR = true;
                        }

                        
                        objGamesAndPSR.Key = userDetail.Games[index].Key;
                        objGamesAndPSR.date = userDetail.Games[index].UnlockedDate.ToShortDateString();
                        

                        reward.PSRAndGames.Add(objGamesAndPSR);
                    }
                }
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetRewardPoints().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRewardPoints()";
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
        }

        public string GamesUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                
                Game _game = UnlockGames(userDetail.TotalRewardPoints, userDetail.BalanceRewardPoints);
                if (_game != null)
                {
                    if (userDetail.Games == null) userDetail.Games = new List<Game>();

                    if (!userDetail.Games.Any(x => x.Key == _game.Key))
                    {
                        _game.UnlockedDate = DateTime.Now;
                        userDetail.Games.Add(_game);
                        userDetail.BalanceRewardPoints -= (int.Parse(_game.GameId) * 10);
                        userDetail.RedeemedPoints += (int.Parse(_game.GameId) * 10);
                        _userCollection.Save(userDetail);                       
                    }
                    _transactionStatus = true;
                    return _game.Key;
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GamesUnLocked().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GamesUnLocked()";
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

            return "";
        }

        public string PSRUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);

                Boolean _psr = UnlockPSR(userDetail.TotalRewardPoints, userDetail.BalanceRewardPoints);
                if (_psr)
                {
                    if (userDetail.Games == null) userDetail.Games = new List<Game>();

                    int count = userDetail.Games.Select(x => x.Name.Contains("PSR")).Count() + 1;

                       Game _game = new Game();
                        _game.Id = new ObjectId();
                        _game.Name = "PSR" + count;
                        _game.Key = "";
                    
                        _game.UnlockedDate = DateTime.Now;

                        userDetail.Games.Add(_game);
                        userDetail.BalanceRewardPoints -= 10;
                        userDetail.RedeemedPoints += 10;
                        _userCollection.Save(userDetail);
                   
                    _transactionStatus = true;
                    return _game.Key;
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at PSRUnLocked().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at PSRUnLocked()";
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
            return "";
        }

        private Game UnlockGames(int RewardPointsGained, int BalancePoints)
        {
            var _gamesCollection = con.GetCollection("BrainGames");
     
            if(RewardPointsGained < 10 || BalancePoints < 10)
            {
                return null;
            }

            // RewardPointsGained = (RewardPointsGained - (RewardPointsGained % 10))/10;
            string Id = (BalancePoints / 10).ToString();
            return _gamesCollection.FindOneAs<Game>(Query.EQ("GameId", Id));
        }

        private Boolean UnlockPSR(int RewardPointsGained, int BalancePoints)
        {
         
            if (RewardPointsGained < 10 || BalancePoints < 10)
            {
                // throw new Exception("You do not have sufficient points to unlock games!!!");
                return false;
            }

            return true;
        }

        public Boolean RemoveVCSCActivity(string EmailAddress, VSCS _vscs)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));

                userDetail.ValueCreationActivity.RemoveAll(x => x.VSCSId == _vscs.VSCSId);

                _userCollection.Save(userDetail);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at RemoveVCSCActivity().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
                _transactionStatus = false;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at RemoveVCSCActivity()";
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

        public Boolean SaveVCSCActivity(string EmailAddress, VSCS _vscs)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                
                if (userDetail.ValueCreationActivity == null)
                {
                    userDetail.ValueCreationActivity = new List<VSCS>();
                    userDetail.ValueCreationActivity.Add(_vscs);
                }
                else
                {
                    VSCS _entity = userDetail.ValueCreationActivity.Where(x => x.VSCSId == _vscs.VSCSId).SingleOrDefault();
                    if (_entity == null)
                        userDetail.ValueCreationActivity.Add(_vscs);
                    else
                    {
                        _entity.eventTitle = _vscs.eventTitle;
                        for (int i = _entity.Tasks.Count - 1; i >= 0; i--)
                        {
                            bool blnDelete = true;

                            foreach (Tasks item in _vscs.Tasks)
                            {
                                if (item.eventTitle == _entity.Tasks[i].eventTitle)
                                {
                                   
                                    blnDelete = false;
                                    break;
                                }
                            }

                            if (blnDelete) _entity.Tasks.RemoveAt(i);
                        }

                        foreach (Tasks item in _vscs.Tasks)
                        {
                            bool blnAdd = true;
                            for (int i = _entity.Tasks.Count - 1; i >= 0; i--)
                            {
                                if (_entity.Tasks[i].eventTitle == item.eventTitle)
                                {
                                    blnAdd = false;
                                    break;
                                }
                            }

                            if (blnAdd) _entity.Tasks.Add(item);
                        }
                    }

                }
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at SaveVCSCActivity().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at SaveVCSCActivity()";
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

        private int CalculateScore(int type, int measure)
        {
            return (1 * type * measure);
        }

        public bool SaveValueFeedStory(ValueFeedStory story)
        {
            var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", emailAddress));
            try
            {
                story.CreateDate = DateTime.Now;
                story.UserId = emailAddress;
                if (userDetail.ValueFeedStories == null) userDetail.ValueFeedStories = new List<ValueFeedStory>();
                userDetail.ValueFeedStories.Add(story);
                _userCollection.Save(userDetail);
                
                return true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at SaveValueFeedStory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at SaveValueFeedStory()";
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
        }

        public List<ValueFeedStory> GetValueFeedStories(string ImpactZone)
        {
            //var matchMember = new BsonDocument { { "$match", new BsonDocument { { "ValueFeedStories.ImpactZone", ImpactZone } } } };
            //var unwindStories = new BsonDocument { { "$unwind", "$ValueFeedStories" } };
            //var sortOperation = new BsonDocument { { "$sort", new BsonDocument { { "CreateDate", 1 } } } };
            ////var ProjectFinal = new BsonDocument { { "$project", new BsonDocument { { "_id", 0 }, { "UserId", "EmailAddress" }, { "ValueFeedStories", "$ValueFeedStories" } } } };
            //IEnumerable<BsonDocument> pipeline = new[] { matchMember, unwindStories, sortOperation };

            //var args = new AggregateArgs();
            //args.Pipeline = pipeline;
            //args.AllowDiskUse = true;

            //return _userCollection.Aggregate(args).ToJson();
            //_userCollection = con.GetCollection("UserDetails");
            MongoCursor<User> result = _userCollection.FindAs<User>(Query.EQ("ValueFeedStories.ImpactZone", ImpactZone));
            List<ValueFeedStory> stories = new List<ValueFeedStory>();
            foreach (var item in result)
            {
                var story = item.ValueFeedStories.Where(x => x.ImpactZone == ImpactZone).ToArray();
                stories.AddRange(story);
            }
            return stories;

        }

        public string GetVCSCActivity(string EmailAddress)
        {           
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));

            return userDetail.ValueCreationActivity.ToJson();
        }
    }
}
