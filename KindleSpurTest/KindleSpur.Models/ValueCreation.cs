using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class ValueCreationActivity
    {
        public string ActivityName { get; set; }
        public List<ValueCreationTasks> Tasks { get; set; }
        public int ActivityScore { get; set; }
    }
}
