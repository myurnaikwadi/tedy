using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public  class HandleErrorInfo
    {
        public string ControllerName { get; set; }
        public string ActionInfo { get; set; }
        public string Exception { get; set; }
    }
}
