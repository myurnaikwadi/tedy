using KindleSpur.Models.Interfaces;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using System.Diagnostics;

namespace KindleSpur.Data
{
    public class MeetingSchedularRepository : IMeetingSchedularRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;

        public MeetingSchedularRepository()
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

        public bool AddNewMeeting(IMeetingSchedular meetingSchedularData)
        {
            bool _transactionStatus = false;

            try
            {
                var _meetingCollection = _kindleDatabase.GetCollection("MeetingSchedulars");
                var result = _meetingCollection.Find(Query.And(Query.EQ("SenderEmail", meetingSchedularData.SenderEmail), Query.EQ("ReceiverEmail", meetingSchedularData.ReceiverEmail))).ToList();

                //if (result.Count() > 0)
                //    return false;

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

        public List<BsonDocument> GetAllMeetingRequest(string userId)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                var _query = Query.And(Query<MeetingSchedular>.EQ(p => p.IsVerified, false), Query<MeetingSchedular>.NE(p => p.SenderEmail, userId), Query<MeetingSchedular>.EQ(p => p.ReceiverEmail, userId));
                var _meetingCollection = _kindleDatabase.GetCollection("MeetingSchedulars");

                _categories = _meetingCollection.Find(
                    _query
                    ).ToList();

            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetConversationRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _categories;


        }

        public bool UpdateMeetingStatus(string senderEmail, string receiverEmail, bool isVerified, string Role)
        {
            bool _transactionStatus = false;
            try
            {
                var _meetingCollection = _kindleDatabase.GetCollection("MeetingSchedulars");

                var meetingDetail = _meetingCollection.FindOneAs<IMeetingSchedular>(Query.And(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail)));

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

        public List<BsonDocument> ListMeetingSchedular()
        {
            List<BsonDocument> _meeting = new List<BsonDocument>();

            try
            {
                var _ctsCollection = _kindleDatabase.GetCollection("MeetingSchedulars");
                _meeting = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at ListMeetingSchedular().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _meeting;
            
        }

        public List<BsonDocument> GetMeetingSchedular(string senderEmail, string receiverEmail)
        {
            List<BsonDocument> _meeting = new List<BsonDocument>();

            try
            {
                var _query = Query.And(
                    Query.Or(
                                Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail)),
                    Query.Or(
                                Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail))
                        );
                

                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");

                _meeting = _conversationCollection.Find(
                    _query
                    ).ToList();

               
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetMeetingSchedular().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _meeting;


        }
    }
}
