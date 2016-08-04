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
    public class MentorController : Controller
    {
        private readonly string UserId;
        public MentorController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }
        [HttpPost]
        public Boolean SaveTopics(List<SkillOrTopic> selectedArray)
        {
            CoachOrMentorRepository _mentorRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = UserId;
            _obj.Role = "Mentor";
            _obj.CreateDate = _obj.UpdateDate = DateTime.Now;
            if (_obj.Topics == null)
                _obj.Topics = new List<SkillOrTopic>();
            if (selectedArray != null)
                _obj.Topics.AddRange(selectedArray);

            _mentorRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public string GetTopics()
        {

            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();

            List<SkillOrTopic> topics = _coachRepo.GetTopicsForMentor(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            BsonArray arr = new BsonArray();
            foreach (SkillOrTopic topic in topics)
            {
                if (topic != null)
                {
                    BsonDocument result = _ctsRepo.GetMentorCategory(topic.Name);
                    arr.Add(result);
                }


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
        public ActionResult GetCoachingStatus()
        {
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            var filters = _coachRepo.GetCoachingStatus(UserId);
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }

    }
}