using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class VSCS
    {
        public string eventTitle { get; set; }
        public string Id { get; set; }
        public List<Tasks> Tasks { get; set; }
    }
}
