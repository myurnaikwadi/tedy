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

        public string GamesUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                
                Game _game = UnlockGames(userDetail.RewardPointsGained);
                if (_game != null)
                {
                    //_game.ExpirationDate = DateTime.Now.AddDays(7);
                    if (userDetail.Games == null) userDetail.Games = new List<Game>();
                    userDetail.Games.Add(_game);
                   // userDetail.RewardPointsGained -= (_game.GameId * 10);
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
    }
}
