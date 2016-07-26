using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class MenteeController : Controller
    {
        private readonly string UserId;
        public MenteeController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }

        [HttpPost]
        public Boolean SaveTopics(List<Skill> selectedArray)

        {
            CoacheeOrMenteeRepository _menteeRepo = new Data.CoacheeOrMenteeRepository();

            KindleSpur.Models.CoacheeOrMentee _obj = new Models.CoacheeOrMentee();
            _obj.UserId = UserId;
            _obj.Role = "Mentee";
            _obj.CreateDate = _obj.UpdateDate = DateTime.Today.ToShortDateString();//Convert.ToDateTime(DateTime.Today.ToShortDateString());
            if (_obj.Topics == null) _obj.Topics = new List<string>();

            var topicsList = selectedArray.Select(x => x.Name).ToList();
           _obj.Topics.AddRange(topicsList);

            _menteeRepo.AddNewCoacheeOrMentee(_obj);

            return true;
        }

        public string GetTopics()
        {

            CoacheeOrMenteeRepository _coacheeRepo = new CoacheeOrMenteeRepository();

            List<string> topics = _coacheeRepo.GetTopicsForMentee(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            BsonArray arr = new BsonArray();
            foreach (string topic in topics)
            {

                BsonDocument result = _ctsRepo.GetMentorCategory(topic);
                arr.Add(result);

            }
            doc.Add("Categories", arr);
            return doc.ToJson();
        }

        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            return _coachRepo.addFeedback(UserId, feedback);

        }

    }
}