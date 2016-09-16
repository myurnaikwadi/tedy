using KindleSpur.Models;
using KindleSpur.Models.Communication;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Data
{
    public class MeetingRepository
    {
        Connection con = new Connection();
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection _meetingCollection;
     

        public MeetingRepository()
        {

            try
            {
                _meetingCollection = con.GetCollection("Meeting");
                _logCollection = con.GetCollection("ErrorLogs");
            
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public bool AddNewMeeting(IMeeting meetingSchedularData)
        {
            bool _transactionStatus = false;

            try
            {
                _meetingCollection.Insert(meetingSchedularData);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddNewMeeting().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddNewMeeting()";
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

        public bool MeetingSchedularUpdate(string MeetingId,bool flag)
        {
            Meeting result = _meetingCollection.FindOneAs<Meeting>(Query.EQ("MeetingId", MeetingId));
            result.IsVerified = flag;
            _meetingCollection.Save(result);
            return true;
        }

        public List<Meeting> GetAllMeetingRequest(string role, string userId)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<Meeting> _categories1 = new List<Meeting>();
           
           
            try
            {
                IMongoQuery  _query= Query.And(Query<Meeting>.EQ(p => p.IsVerified, false), Query<Meeting>.EQ(p => p.To, userId));
                if (role != null)
                {
                     _query = Query.And(_query, Query<Meeting>.EQ(p => p.Role, role));                  
                }

                _categories1 = _meetingCollection.FindAs<Meeting>(
                    _query
                    ).SetFields(Fields.Exclude("_id")).ToList();
                
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetAllMeetingRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllMeetingRequest()";
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
            return _categories1;
        }

        public bool UpdateMeetingStatus(string From, string To, bool isVerified, string Role)
        {
            bool _transactionStatus = false;
            try
            {

                var meetingDetail = _meetingCollection.FindOneAs<IMeetingSchedular>(Query.And(Query.EQ("From", From), Query.EQ("To", To)));

                meetingDetail.Role = Role;
                meetingDetail.IsVerified = isVerified;
                meetingDetail.UpdateDate = DateTime.Now;

                _meetingCollection.Save(meetingDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at UpdateMeetingStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public List<Meeting> GetAllMeetingPerMonth(string userId,DateTime FromDate,DateTime ToDate )
        {
            
            List<Meeting> _categories = new List<Meeting>();
            UserRepository userRepo = new Data.UserRepository();
            BsonDateTime newFromDate = BsonDateTime.Create(FromDate);
            BsonDateTime newToDate = BsonDateTime.Create(ToDate);

            
            try
            {
                var _query = Query.And(Query<Meeting>.GTE(p => p.StartDate, newFromDate.ToUniversalTime()), Query<Meeting>.LTE(p => p.EndDate, newToDate.ToUniversalTime()), Query.Or(Query<Meeting>.EQ(p => p.From, userId), Query<Meeting>.EQ(p => p.To, userId)));
               
                _categories = _meetingCollection.FindAs<Meeting>(
                    _query
                    ).ToList();
                for(int count =0;count<_categories.Count; count++)
                {
                    User userDetails = (User)userRepo.GetUserDetail(_categories[count].To);
                    User userDetails1 = (User)userRepo.GetUserDetail(_categories[count].From);

                    _categories[count].ToFirstName = userDetails.FirstName;
                    _categories[count].ToLastName = userDetails.LastName;
                    _categories[count].ToPhoto = userDetails.Photo;

                    _categories[count].FromFirstName = userDetails1.FirstName;
                    _categories[count].FromLastName = userDetails1.LastName;
                    _categories[count].FromPhoto = userDetails1.Photo;
                }

               

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetAllMeetingRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetAllMeetingRequest()";
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


    }
}
