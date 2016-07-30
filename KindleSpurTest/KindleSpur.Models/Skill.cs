using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace KindleSpur.Models
{
    public class SkillOrTopic : ISkill
    {
        public string Id
        {
            get; set;
        }

        public string Name
        {
            get; set;
        }

        public string profiLevel
        {
            get; set;
        }
    }
}
