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
    public class KSCommunicationHub : Hub
    {
        static ConcurrentDictionary<string, string> dic = new ConcurrentDictionary<string, string>();

        public void Notify(Communication _obj)
        {
            if (dic.ContainsKey(_obj.CommunicationId))
            {
                Clients.Caller.differentName();
            }
            else
            {
                dic.TryAdd(_obj.CommunicationId, _obj.CommunicationId);
                foreach (KeyValuePair<String, String> entry in dic)
                {
                    Clients.Caller.online(entry.Key);
                }
                Clients.Others.enters(_obj.CommunicationId);
            }
        }

        public void SendToSpecific(Communication _obj,IChat chat)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Caller.broadcastMessage(_obj.CommunicationId, chat.SenderName);
            Clients.Client(dic[_obj.CommunicationId]).broadcastMessage(_obj.CommunicationId, chat.Message);
            CommunicationRepository _communicationRepo = new CommunicationRepository();
            _communicationRepo.AddCommunication(_obj);
            if (_obj.Chats == null) _obj.Chats = new List<IChat>();
            _obj.Chats.Add(chat);
            _communicationRepo.Save(_obj);
        }

        public override Task OnConnected()
        {
            FetchAll();
            return Clients.All;
        }

        private void FetchAll()
        {
            CommunicationRepository _communicationRepo = new CommunicationRepository();
            List<string> commIds = _communicationRepo.GetAllOpenedCommunications();

            foreach (string id in commIds)
            {
                if (!dic.ContainsKey(id))
                    dic.TryAdd(id, id);
            }
        }

        public override Task OnReconnected()
        {
            FetchAll();
            return Clients.All;
        }

        public override Task OnDisconnected(bool stopCall)
        {
            var name = dic.FirstOrDefault(x => x.Value == Context.ConnectionId.ToString());
            string s;
            dic.TryRemove(name.Key, out s);
            return Clients.All.disconnected(name.Key);
        }
    }
}