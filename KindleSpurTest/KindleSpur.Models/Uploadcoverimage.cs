using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace KindleSpur.Models
{
  public  class Uploadcoverimage
    {
        public string name { get; set; }
        public HttpPostedFileBase File { get; set; }
        public IEnumerable<HttpPostedFileBase> Files { get; set; }
    }
}
