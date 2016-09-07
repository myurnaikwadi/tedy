using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using KindleSpur.Models.Communication;
using KindleSpur.Models.Interfaces;
using KindleSpur.Data;

namespace KindleSpur.WebApplication.KSHub
{
    public class KSRequestHub : Hub 
    {
        static readonly HashSet<string> Rooms = new HashSet<string>();
        static List<ICommunication> loggedInUsers = new List<ICommunication>();

        public string Login()
        {
            try
            {
                string UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                CommunicationRepository repo = new CommunicationRepository();
                var communications = repo.GetAllOpenedRequest(UserId);
                Clients.Caller.rooms(Rooms.ToArray());
                Clients.Caller.setInitial(Context.ConnectionId, UserId);
                loggedInUsers.AddRange(communications);
                var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                string sJSON = oSerializer.Serialize(loggedInUsers);
                Clients.Caller.getPendingRequests(sJSON);
                foreach (var item in communications)
                {
                    Clients.Others.newOnlineUser(item);

                }
                return UserId;
            }
            catch (Exception)
            {

                throw;
            }
            
        }


        public void SendNewRequest(string sender, string receiver,string skillOrTopic, Models.Interfaces.IRequest request)
        {
            string fromUserId = Context.ConnectionId;
            UserRepository userRepo = new UserRepository();
            CommunicationRepository communicationRepo = new CommunicationRepository();
            ICommunication communication = new Communication();
            communication.CommunicationId = request.RequestId;
            communication.From = sender;
            communication.To = receiver;
            communication.SenderName = userRepo.GetFullName(sender);
            communication.ReceiverName = userRepo.GetFullName(receiver);
            try
            {
                
                if (request.Type.ToLower() == "coaching")
                {
                    request.Content = string.Format("You have Coaching invite for {0} from {1}", skillOrTopic, sender);
                    communication.SkillName = skillOrTopic;
                }
                else
                {
                    request.Content = string.Format("You have Mentoring invite for {0} from {1}", skillOrTopic, sender);
                    communication.TopicName = skillOrTopic;
                }
                if (communication.Requests == null) communication.Requests = (Models.Interfaces.IRequest)new Models.Request();
                communication.Requests = request;
                loggedInUsers.Add(communication);
                Clients.Client(receiver).sendRequest(communication);
                Clients.Caller.sendRequest(communication);
                communicationRepo.AddCommunication(communication);
            }
            catch (Exception)
            {

                throw;
            }
            
            
        }

        public void UpdateRequest(Models.Interfaces.IRequest request,Boolean flag)
        {
            CommunicationRepository communicationRepo = new CommunicationRepository();
            ICommunication communication = communicationRepo.UpdateCommunicationRequestStatus(request.RequestId, flag);
            try
            {
                if (!flag) loggedInUsers.Remove(communication);
                Clients.Client(communication.To).RequestStatus(communication);
            }
            catch (Exception)
            {

                throw;
            }
            
        }

    }
}