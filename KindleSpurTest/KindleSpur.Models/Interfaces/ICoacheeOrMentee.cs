using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
    public interface ICoacheeOrMentee
    {
        [MongoDB.Bson.Serialization.Attributes.BsonId]
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
        string CreateDate { get; set; }/**/
        string UpdateDate { get; set; }/**/
        List<IProgramConducted> ProgramsConducted { get; set; }
        List<IFeedback> Feedback { get; set; }
        List<IFeedback> Feedbacks { get; set; }


        //string Brief { get; set; }
        //string AdditionRef { get; set; }
        //int LoginUserId { get; set; }
        //string Skill { get; set; }
        //string Role { get; set; }
        //string Bookmarks { get; set; }
        //DateTime CreateDate { get; set; }
        //DateTime UpdateDate { get; set; }
        //List<IProgramConducted> ProgramsConducted { get; set; }
        //List<Interfaces.IFeedback> Feedbacks { get; set; }

    }
}
