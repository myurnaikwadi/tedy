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

namespace KindleSpur.Data
{
    public class UserRepository : IUserRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;

        public UserRepository()
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
        public bool AddNewUser(IUser userData)
        {
            bool _transactionStatus = false;

            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var result = _userCollection.Find(Query.EQ("EmailAddress", userData.EmailAddress));

                if (result.Count() > 0)
                    return false;

                _userCollection.Insert(userData);
                
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new Exception("Signup failure!!!");
            }
            
            return _transactionStatus;

        }

        public bool EditUser(string userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public User SavePassword(string userId, IUser userData)
        {

                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                 return _userCollection.FindOneByIdAs<IUser>(userId);
            }
            catch (Exception ex)
            {
                throw new Exception("User does not Exist!!!");
            }
        }
        public IUser GetUserDetail(string EmailAddress)
        {
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                return _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
            }
            catch (Exception ex)
            {
                throw new Exception("User does not Exist!!!");
            }
        }

        public bool UpdateUserDetails(ObjectId userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                userDetail.FirstName = userData.FirstName;
                userDetail.LastName = userData.LastName;
                userDetail.Mobile = userData.Mobile;
                userDetail.LinkdinURL = userData.LinkdinURL;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public bool UpdateUserDesc(ObjectId userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<IUser>(userId);
                userDetail.description = userData.description;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public bool UpdateUserPhoto(ObjectId userId, string PhotoPath)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<IUser>(userId);
                userDetail.Photo = PhotoPath;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public void GetRewardPoints(string EmailAddress, ref Reward reward)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public string GamesUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                 throw ex;
            }
            return "";
        }

        public string PSRUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
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
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw ex;
            }
            return "";
        }

        private Game UnlockGames(int RewardPointsGained, int BalancePoints)
        {
            var _gamesCollection = _kindleDatabase.GetCollection("BrainGames");
     
            if(RewardPointsGained < 10 || BalancePoints < 10)
            {
                return null;
            }

            // RewardPointsGained = (RewardPointsGained - (RewardPointsGained % 10))/10;
            string Id = (RewardPointsGained / 10).ToString();
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


        public Boolean SaveVCSCActivity(string EmailAddress, VSCS _vscs)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                if (userDetail.ValueCreationActivity == null) userDetail.ValueCreationActivity = new List<VSCS>();
                userDetail.ValueCreationActivity.Add(_vscs);
                //ValueCreationActivity _activity = new ValueCreationActivity();

                //if (_activity.Tasks == null) _activity.Tasks = new List<ValueCreationTasks>();

                //ValueCreationTasks _vscsTasks = new ValueCreationTasks();
                //_vscsTasks.TaskName = _vscs.TaskName;
                //ValueCreationScore _vscsScore = new ValueCreationScore();
                //_vscsScore.ImpactMeasure = _vscs.ImpactMeasure;
                //_vscsScore.ImpactType = _vscs.ImpactType;
                //_vscsScore.ImpactZone = _vscs.ImpactZone;

                //int type = int.Parse(_vscs.ImpactType.ToString());
                //int measure = int.Parse(_vscs.ImpactMeasure.ToString());
                //_vscsScore.Score = CalculateScore(type, measure);

                //_vscsTasks.TaskScore += _vscsScore.Score;
                //_activity.ActivityScore += _vscsScore.Score;
                //if (_vscs.ImpactType == Enums.ImactType.Direct.ToString())
                //{
                    
                //    if (_vscs.ImpactMeasure == Enums.ImactMeasure.Exceeding.ToString())
                //    {
                //        _vscsScore.Medal = "Gold"; 
                //    }
                //    else if(_vscs.ImpactMeasure == Enums.ImactMeasure.Concrete.ToString())
                //    {
                //        _vscsScore.Medal = "Silver";
                //    }
                //    else
                //    {
                //        _vscsScore.Medal = "Bronze";
                //    }                   
                //}
                //else
                //{
                //    _vscsScore.Medal = "Bronze";
                //    if (_vscs.ImpactMeasure == Enums.ImactMeasure.Exceeding.ToString())
                //    {
                //        _vscsScore.Medal = "Silver";
                //    }
                   
                //}
                //_vscsTasks.ValueCreationScore.Add(_vscsScore);
                //_activity.Tasks.Add(_vscsTasks);
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        private int CalculateScore(int type, int measure)
        {
            return (1 * type * measure);
        }


        public string GetVCSCActivity(string EmailAddress)
        {
            
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
            return userDetail.ValueCreationActivity.ToJson();
        }
    }
}
