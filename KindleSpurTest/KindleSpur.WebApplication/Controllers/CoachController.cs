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
    public class CoachController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        private readonly CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
        private readonly string UserId;
        public CoachController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }

        [HttpPost]
        public Boolean SaveSkills(List<Models.SkillOrTopic> selectedArray)
        {
            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = UserId;
            _obj.Role = "Coach";
            _obj.CreateDate = _obj.UpdateDate= DateTime.Now;
            if (_obj.Skills == null) _obj.Skills = new List<SkillOrTopic>();
            if(selectedArray!=null)
            _obj.Skills.AddRange(selectedArray);
           // if (selectedArray != null)
                _coachRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public BsonDocument  GetRecommendedCoach()
        {
            return _coachRepo.GetRecommended("Coach");
            
        }

        public string GetCTS()
        {

            List<SkillOrTopic> skills = _coachRepo.GetSkillsForCoach(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            if (skills != null)
            {
                BsonArray arr = new BsonArray();
                foreach (SkillOrTopic skill in skills)
                {

                    BsonDocument result = _ctsRepo.GetCoachTopicAndCategory(skill);
                    arr.Add(result);

                }
                doc.Add("Categories", arr);
            }
            return doc.ToJson();
        }

        public string GetCoachs(CTSFilter ctsFilter)
        {
            var result = _coachRepo.GetAllCoachOrMentors(ctsFilter, "Role");
            return result.ToJson();
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
            var filters = _coachRepo.GetCoachingStatus(UserId,"Coach");
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}