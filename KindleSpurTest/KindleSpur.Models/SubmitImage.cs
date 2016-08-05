using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.IO;

namespace KindleSpur.Models
{
    public class SubmitImage
    {
            public string Name { get; set; }
            public HttpPostedFileBase File { get; set; }
            public IEnumerable<HttpPostedFileBase> Files { get; set; }
    }
}
