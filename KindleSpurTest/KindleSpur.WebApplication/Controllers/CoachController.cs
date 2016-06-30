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
        public Boolean SaveSkills(List<Models.Skill> selectedArray)
        {
            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = UserId;
            _obj.Role = "Coach";
            _obj.CreateDate = _obj.UpdateDate= DateTime.Now;
            if (_obj.Skills == null) _obj.Skills = new List<Skill>();
            _obj.Skills.AddRange(selectedArray);

            _coachRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public string GetCTS()
        {

            List<Skill> skills = _coachRepo.GetSkillsForCoach(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            BsonArray arr = new BsonArray();
            foreach (Skill skill in skills)
            {

                BsonDocument result = _ctsRepo.GetCoachTopicAndCategory(skill);
                arr.Add(result);

            }
            doc.Add("Categories",arr);
            return doc.ToJson();
        }

        public ActionResult GetCoachs(CTSFilter ctsFilter)
        {
            var result = _coachRepo.GetAllCoachOrMentors(ctsFilter);
            return Json(new { Coaches = result.ToString(), Success = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public Boolean SaveFeedBack(Feedback feedback)
        {
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            return _coachRepo.addFeedback(UserId, feedback);

        }
    }
}