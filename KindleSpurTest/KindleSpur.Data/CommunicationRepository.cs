using System;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using KindleSpur.Models.Interfaces;
using KindleSpur.Models;
using System.Linq;
using System.Collections.Generic;
using KindleSpur.Models.Communication;

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
                var result = _communicationCollection.FindAs<BsonArray>(Query.EQ("CommunicationId", communication.CommunicationId));

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

        public void Save(Communication _obj)
        {
            _communicationCollection.Save(_obj);
        }

        public List<string> GetAllOpenedCommunications()
        {
          return  _communicationCollection.FindAllAs<ICommunication>().Select(x=>x.CommunicationId).ToList();                
        }

        public List<ICommunication> GetAllOpenedRequest(string Receiver)
        {
            return _communicationCollection.FindAs<ICommunication>(Query.And(Query.EQ("Requests.Verified", false), Query.EQ("Requests.Rejected", false), Query.EQ("To", Receiver))).ToList();
        }

        public List<ICommunication> GetAllOpenedCommunicationForUser(string Sender)
        {
            return _communicationCollection.FindAllAs<ICommunication>().Where(x=>x.SenderName == Sender).ToList();
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

        public ICommunication UpdateCommunicationRequestStatus(string CommunicationId, bool flag)
        {
            ICommunication communication = _communicationCollection.FindOneAs<ICommunication>(Query.EQ("CommunicationId", CommunicationId));
            if (flag)
                communication.Requests.Verified = flag;
            else
                communication.Requests.Rejected = flag;

            _communicationCollection.Save(communication);

            return communication;
        }
    }
}
