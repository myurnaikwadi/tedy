using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class Invitation : IInvitation
    {
     
        public string Description { get; set; }
        public List<string> Email { get; set; }
        public IUser UserDetails { get; set; }
    }
}
