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

namespace KindleSpur.Data
{
    public class UserRepository : IUserRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        //MongoCollection _userCollection;
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
                //_userCollection = _kindleDatabase.GetCollection("UserDetails");
            }
            catch (Exception ex)
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
                //var result = _userCollection.Find(Query.And(
                //                        Query.EQ("EmailAddress", userData.EmailAddress),
                //                        Query.EQ("IsExternalAuthentication", true)
                //                       ));

                if (result.Count() > 0)
                    throw new Exception("User already registered");

                

                _userCollection.Insert(userData);
                
                _transactionStatus = true;
            }
            catch (WriteConcernException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new Exception();
            }
            catch(Exception e)
            {
                throw new Exception();
            }

            return _transactionStatus;

        }

        public bool EditUser(int userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var _userCollection = _kindleDatabase.GetCollection("UserDetails");
                var userDetail = _userCollection.FindOneByIdAs<IUser>(userId);
                userDetail.EmailAddress = userData.EmailAddress;
                userDetail.FirstName = userData.FirstName;
                userDetail.LastName = userData.LastName;
                userDetail.Password = userData.Password;
                userDetail.Mobile = userData.Mobile;
                //userDetail.Photo = userData.Photo;
                userDetail.IsExternalAuthentication = userData.IsExternalAuthentication;
                //userDetail.UpdateDate = userData.UpdateDate;
                //userDetail.Country = userData.Country;
                //userDetail.Region = userData.Region;

                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (Exception ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public IUser GetUserDetail(int userId)
        {
            var _userCollection = _kindleDatabase.GetCollection("UserDetails");
            return _userCollection.FindOneByIdAs<IUser>(userId);
        }
    }
}
