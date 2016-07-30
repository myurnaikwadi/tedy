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
            _obj.Skills.AddRange(selectedArray);

            _coachRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public string GetRecommendedCoach()
        {
            return _coachRepo.GetRecommended("Coach").ToJson();
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
            var result = _coachRepo.GetAllCoachOrMentors(ctsFilter);
            return result.ToList().ToJson();
        }

        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            return _coachRepo.addFeedback(UserId, feedback);

        }
    }
}