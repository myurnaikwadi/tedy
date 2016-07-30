using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public class ResponseMessage
    {
        private string _message = string.Empty;
        private bool _result = true;
        public bool Result
        {
            get { return _result; }
            set { _result = value; }
        }
        public string Message
        {
            get { return _message; }
            set { _message = value; }
        }

        public void FailureCallBack(string message)
        {
            _result = false;
            _message = message;
        }
    }
}
