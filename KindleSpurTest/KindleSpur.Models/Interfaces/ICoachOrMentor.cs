using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
   public interface ICoachOrMentor
    {
        [BsonId]
         ObjectId Id
        {
            get; set;
        }
        string AdditionalRef { get; set; }
         string UserId { get; set; }
         List<SkillOrTopic> Skills { get; set; }
         List<SkillOrTopic> Topics { get; set; }
        decimal Experience { get; set; }
         string Language { get; set; }
         Boolean Published { get; set; }
         string Role { get; set; }
         string Bookmarks { get; set; }
         DateTime CreateDate { get; set; }
         DateTime UpdateDate { get; set; }
         List<IProgramConducted> ProgramsConducted { get; set; }
         List<Feedback> Feedbacks { get; set; }

    }

    public interface IProgramConducted
    {
        string Skill { get; set; }
        int Count { get; set; }
    }
}
