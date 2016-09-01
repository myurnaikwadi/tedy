using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Communication
{
    public class Request : IRequest
    {
        public string Content { get; set; }
        public string RequestId { get; set; }
        public string Type { get; set; }
        public Boolean Verified { get; set; }
        public Boolean Rejected { get; set; }
    }
}
