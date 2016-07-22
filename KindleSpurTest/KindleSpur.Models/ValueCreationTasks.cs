using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public class ValueCreationTasks
    {
        public string TaskName { get; set; }
        public int TaskScore { get; set; }
        public List<ValueCreationScore> ValueCreationScore { get; set; }
    }
}
