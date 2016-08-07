using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public class Request
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string skill { get; set; }
        public string ConversationType { get; set; }

        public string ConversationId { get; set; }
        public string ConversationParentId { get; set; }
    }
}
