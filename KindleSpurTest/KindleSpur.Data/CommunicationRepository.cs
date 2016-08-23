using System;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using KindleSpur.Models.Interfaces;
using KindleSpur.Models;

namespace KindleSpur.Data
{
   public class CommunicationRepository
    {
        Connection connection = new Connection();
        MongoCollection _logCollection;
        MongoCollection _communicationCollection;

        public CommunicationRepository()
        {
            _logCollection = connection.GetCollection("ErrorLogs");
            _communicationCollection = connection.GetCollection("Communication");
        }

        public Boolean AddCommunication(ICommunication communication)
        {
            bool _transactionStatus = false;
            try
            {
                var result = _communicationCollection.FindAs<BsonArray>(Query.And(Query.EQ("From", communication.From), Query.EQ("To", communication.To)));

                if (result.Count() > 0) return _transactionStatus;

                _communicationCollection.Insert(communication);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddCommunication().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddCommunication()";
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

        public Boolean UpsertRequest(IRequest request)
        {
            bool _transactionStatus = false;
            try
            {
                var result = _communicationCollection.FindAs<BsonArray>(Query.EQ("RequestId", request.RequestId));

                if (result.Count() > 0) return _transactionStatus;

            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpsertRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("New Conversation failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpsertRequest()";
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
        }
}
