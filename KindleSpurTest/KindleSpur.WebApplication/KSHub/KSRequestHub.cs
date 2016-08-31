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
        static ConcurrentDictionary<string, string> dic = new ConcurrentDictionary<string, string>();
        public void Notify(ICommunication Communication)
        {
            if (dic.ContainsKey(Communication.From))
            {
                Clients.Caller.differentName();
            }
            else
            {
                dic.TryAdd(Communication.From, Communication.CommunicationId);
                dic.TryAdd(Communication.To, Communication.CommunicationId);
                foreach (KeyValuePair<String, String> entry in dic)
                {
                    Clients.Caller.online(entry.Key);
                }
                Clients.Others.enters(Communication.From);
            }
        }

        public void SendToSpecific(ICommunication Communication, IChat chat)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Caller.broadcastMessage(chat.SenderName, chat.Message);
            Clients.Client(dic[chat.ReceiverName]).broadcastMessage(chat.SenderName, chat.Message);
        }

    }
}