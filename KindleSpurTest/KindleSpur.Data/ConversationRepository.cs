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

namespace KindleSpur.Data
{
    public class ConversationRepository : IConversationRepository
    {
        MongoClient _mongoClient;
        MongoServer _mongoServer;
        MongoDatabase _kindleDatabase;
        MongoCollection _logCollection;

        public ConversationRepository()
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

        public bool AddNewConversation(IConversation conversationData)
        {
            bool _transactionStatus = false;

            try
            {
                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
                var result = _conversationCollection.Find(Query.And(Query.EQ("SenderEmail", conversationData.SenderEmail), Query.EQ("ReceiverEmail", conversationData.ReceiverEmail))).ToList();

                if (result.Count() > 0 && conversationData.Content == null)
                {
                    _transactionStatus = false;
                    return false;
                }
                _conversationCollection.Insert(conversationData);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at AddNewConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
                throw new MongoException("New Conversation failure!!!");
            }

            return _transactionStatus;
        }

        public bool EditConversation(string conversationId, IConversation conversationData)
        {
            bool _transactionStatus = false;
            try
            {
                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
                var conversationDetail = _conversationCollection.FindOneAs<IConversation>(Query.EQ("_id", ObjectId.Parse(conversationId)));
                conversationDetail.SenderEmail = conversationData.SenderEmail;
                conversationDetail.ReceiverEmail = conversationData.ReceiverEmail;
                //conversationDetail.Content = conversationData.Content;
                conversationDetail.UpdateDate = DateTime.Now;
                //conversationDetail.IsVerified = true;

                _conversationCollection.Save(conversationDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at EditConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }

        public bool UpdateConversationStatus(string senderEmail, string receiverEmail, string content, bool isVerified)
        {
            bool _transactionStatus = false;
            try
            {
                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");

                var conversationDetail = _conversationCollection.FindOneAs<IConversation>(Query.And(Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail)));

                conversationDetail.IsVerified = isVerified;
                conversationDetail.Content = content;
                conversationDetail.UpdateDate = DateTime.Now;

                _conversationCollection.Save(conversationDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at UpdateConversationStatus().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
            return _transactionStatus;
        }


        public List<BsonDocument> ListConversation(string loggedEmail)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();
            List<BsonDocument> _checkUser = new List<BsonDocument>();

            try
            {
                var _query = Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true));

                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");

                _checkUser = _conversationCollection.Find(_query).ToList();
                if (_checkUser.Count() > 1)
                {
                    _categories = _conversationCollection.Find(
                        Query.And(Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true))
                        ).SetFields(Fields.Exclude("_id").Include("ReceiverEmail")).Distinct().ToList();
                }
                else
                {
                    var _query1 = //Query.Or(
                                  // Query.And(
                                  //             Query<Conversation>.EQ(p => p.SenderEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true)),
                    Query.And(
                                Query<Conversation>.EQ(p => p.ReceiverEmail, loggedEmail), Query<Conversation>.EQ(p => p.IsVerified, true))
                        ;
                    _categories = _conversationCollection.Find(
                    _query1
                    ).SetFields(Fields.Exclude("_id").Include("SenderEmail")).Distinct().ToList();
                }


                //_categories = _conversationCollection.Find().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _categories;

            //var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
            //IQueryable<BsonDocument> convEntities = default(IQueryable<BsonDocument>);

            //try
            //{
            //    var res1 = new List<BsonDocument>();

            //    convEntities = _conversationCollection.FindAll().ToList().AsQueryable();

            //}
            //catch (MongoException ex)
            //{
            //    _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            //}

            //return convEntities.ToList();
        }

        //public List<BsonDocument> ListConversation()
        //{
        //    List<BsonDocument> result = null;

        //    try
        //    {
        //        var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
        //        result = _conversationCollection.FindAll().ToList();

        //    }
        //    catch (MongoException ex)
        //    {
        //        _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
        //    }

        //    return result;
        //}

        public List<BsonDocument> GetConversation(string senderEmail, string receiverEmail)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                //var _convCollection = _kindleDatabase.GetCollection<Conversation>("Conversations");
                //var _query = Query.And(
                //            Query.Or(
                //                        Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail)),
                //            Query.Or(
                //                        Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail))
                //                );

                var _query = Query.Or(
                    Query.And(
                                Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail), Query<Conversation>.EQ(p => p.IsVerified, true)),
                    Query.And(
                                Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.IsVerified, true))
                        );

                //MongoCursor<Conversation> cursor = _convCollection.Find(_query);

                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
                //_categories = _conversationCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();

                _categories = _conversationCollection.Find(
                    _query
                    //Query.And(
                    //    Query.Or(
                    //                Query<Conversation>.EQ(p => p.SenderEmail, senderEmail), Query<Conversation>.EQ(p => p.SenderEmail, receiverEmail)),
                    //    Query.Or(
                    //                Query<Conversation>.EQ(p => p.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p => p.ReceiverEmail, receiverEmail))
                    //        )
                    ).ToList();

                //_categories = _conversationCollection.Find(Query.Or(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).ToList();

                //            var query =
                //from e in _conversationCollection.AsQueryable<Conversation>().ToList()
                //where (e.ReceiverEmail == receiverEmail || e.ReceiverEmail == senderEmail) && (e.SenderEmail == receiverEmail || e.SenderEmail == senderEmail)
                //select e;


                //_categories = _conversationCollection.Find(Query.And(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail), Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail))).ToList();

                //_categories = _conversationCollection.Find(Query.And(Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).ToList();
                //_categories = _categories.Find(Query.And((Query.EQ("SenderEmail", senderEmail), Query.EQ("ReceiverEmail", receiverEmail))).Query.And(Query.EQ("SenderEmail", receiverEmail), Query.EQ("ReceiverEmail", senderEmail)).ToList();

                //var _ctsCollection = _kindleDatabase.GetCollection("Conversations");
                //_categories = _ctsCollection.FindAll().SetFields(Fields.Exclude("_id")).ToList();
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at ListConversation().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _categories;


        }


        public List<BsonDocument> GetConversationRequest(string senderEmail,string ConversationType)
        {
            List<BsonDocument> _categories = new List<BsonDocument>();

            try
            {
                
                var _query = Query.And(Query<Conversation>.EQ(p => p.Content, null), Query<Conversation>.EQ(p1 => p1.ReceiverEmail, senderEmail), Query<Conversation>.EQ(p1 => p1.ConversationType, ConversationType));
                var _conversationCollection = _kindleDatabase.GetCollection("Conversations");

                _categories = _conversationCollection.Find(
                    _query
                    ).ToList();


            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Failed at GetConversationRequest().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }

            return _categories;


        }

        public IConversation GetConversationDetail(int conversationId)
        {
            var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
            return _conversationCollection.FindOneByIdAs<IConversation>(conversationId);
        }

        public IConversation GetConversationDetail(string message)
        {
            var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
            return _conversationCollection.FindOneAs<Conversation>(Query.EQ("message", message));
        }
        public  List<BsonDocument> GetSkillsForConversation()
        {
            List<BsonDocument> bsn = new List<BsonDocument>();
            Conversation cvrs = new Conversation();
            var _conversationCollection = _kindleDatabase.GetCollection("Conversations");
            var query = Query.EQ("skill", cvrs.skill);
            var sortBy = SortBy.Descending("skill");
            // var count = _conversationCollection.Count(Query.EQ("skill", cvrs.skill));
            bsn = _conversationCollection.FindAs<BsonDocument>(query).SetSortOrder(sortBy).SetLimit(5).ToList();
            return bsn;
        }


    }
}
