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
        Connection con = new Connection();
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;
        MongoCollection _meetingCollection;

        public MeetingSchedularRepository()
        {

            try
            {
                _meetingCollection = con.GetCollection("MeetingSchedulars");
                _logCollection = con.GetCollection("ErrorLogs");
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
                var result = _meetingCollection.FindAs<MeetingSchedular>(Query.And(Query.EQ("SenderEmail", meetingSchedularData.SenderEmail), Query.EQ("ReceiverEmail", meetingSchedularData.ReceiverEmail))).ToList();

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

                _categories = _meetingCollection.FindAs<BsonDocument>(
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
                _meeting = _meetingCollection.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToList();
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
                

                var _conversationCollection = con.GetCollection("Conversations");

                _meeting = _conversationCollection.FindAs<BsonDocument>(
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
