using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Communication
{
    public class Communication : ICommunication
    {
        public List<IChat> Chats { get; set; }
        public string CommunicationId { get; set; }
        public List<IDocument> Documents { get; set; }
        public string From { get; set; }
        public List<IMeeting> Meetings { get; set; }
        public IRequest Requests { get; set; }
        public string SkillName { get; set; }
        public string Status { get; set; }
        public string SenderName { get; set; }
        public string SenderProfilePhoto { get; set; }
        public string To { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverProfilePhoto { get; set; }
        public string TopicName { get; set; }
        public string Type { get; set; }
    }
}
