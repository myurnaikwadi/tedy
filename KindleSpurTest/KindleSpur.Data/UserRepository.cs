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
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("Signup failure!!!");
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
            var _userCollection = _kindleDatabase.GetCollection("UserDetails");
            return _userCollection.FindOneByIdAs<IUser>(userId);
        }
        public IUser GetUserDetail(string EmailAddress)
        {
            var _userCollection = _kindleDatabase.GetCollection("UserDetails");
            return _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
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
                        objGamesAndPSR.Key = userDetail.Games[index].Key;
                        objGamesAndPSR.date = userDetail.Games[index].UnlockedDate;
                        objGamesAndPSR.PSR = false;

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
                
                Game _game = UnlockGames(userDetail.TotalRewardPoints);
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

        private Game UnlockGames(int RewardPointsGained)
        {
            var _gamesCollection = _kindleDatabase.GetCollection("BrainGames");
     
            if(RewardPointsGained < 10)
            {
                throw new Exception("You do not have sufficient points to unlock games!!!");
            }

            // RewardPointsGained = (RewardPointsGained - (RewardPointsGained % 10))/10;
            string Id = (RewardPointsGained / 10).ToString();
            return _gamesCollection.FindOneAs<Game>(Query.EQ("GameId", Id));
        }

        
        public Boolean SaveVCSCActivity(string userId)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                ValueCreationActivity _activity = new ValueCreationActivity();
                _userCollection.Save(_activity);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }
    }
}
