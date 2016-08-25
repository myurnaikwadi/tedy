using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
    public interface IInvitation
    {
       
        string Description { get; set; }
       List<string> Invites { get; set; }
     
    }
}
