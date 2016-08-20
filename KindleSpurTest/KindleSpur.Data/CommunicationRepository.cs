using System;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using KindleSpur.Models.Interfaces;

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
                 throw new MongoException("New communication failure!!!");
            }
            catch(Exception ex)
            {
                throw new Exception("New communication failure!!!");
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
                throw new MongoException("New communication failure!!!");
            }
            catch (Exception ex)
            {
                throw new Exception("New communication failure!!!");
            }
            return _transactionStatus;
        }
        }
}
