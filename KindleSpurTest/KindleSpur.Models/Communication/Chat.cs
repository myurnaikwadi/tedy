using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Communication
{
    public class Chat : IChat
    {
        public string ChatId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Message { get; set; }
        public string Progress { get; set; }
        public bool ReadStatus { get; set; }
        public string RequestId { get; set; }
        public string Role { get; set; }
        public string SenderName { get; set; }
        public string ReceiverName { get; set; }
        public DateTime StartDate { get; set; }
    }
}
