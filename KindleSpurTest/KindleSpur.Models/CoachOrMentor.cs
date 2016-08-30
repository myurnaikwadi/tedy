using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KindleSpur.Models
{
    
    public class CoachOrMentor  : ICoachOrMentor
    {
       public string AdditionalRef { get; set; }
        public string UserId { get; set; }
        public List<SkillOrTopic> Skills { get; set; }
        public List<SkillOrTopic> Topics { get; set; }
        public decimal Experience { get; set; }
        public string Language { get; set; }
        public Boolean Published { get; set; }
        public string Role { get; set; }
        public string Bookmarks { get; set; }
        public List<IFeedback> Feedbacks { get; set; }
        public int RewardPointsGained { get; set; }
        public int FeedbackPoints { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public List<IProgramConducted> ProgramsConducted { get; set; }
        [BsonId]
        public ObjectId Id
        {
            get; set;
        }
    }
}
