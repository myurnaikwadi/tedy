﻿using KindleSpur.Data;
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
    public class CoacheeController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        private readonly CoacheeOrMenteeRepository _coacheeRepo = new CoacheeOrMenteeRepository();
        private readonly string UserId;
        public CoacheeController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }
        [HttpPost]
        public Boolean SaveSkills(List<Models.SkillOrTopic> selectedArray)
        {
            KindleSpur.Models.CoacheeOrMentee _obj = new Models.CoacheeOrMentee();
            _obj.UserId = UserId;
            _obj.Role = "Coachee";
            _obj.CreateDate = _obj.UpdateDate = DateTime.Now.ToString();
            if (_obj.Skills == null) _obj.Skills = new List<SkillOrTopic>();
            _obj.Skills.AddRange(selectedArray);

            _coacheeRepo.AddNewCoacheeOrMentee(_obj);

            return true;
        }
        public List<BsonDocument> GetRecommendedCoachee()
        {
            return _coacheeRepo.GetRecommended("Coachee");

        }
        public string GetCTS()
        {

            List<SkillOrTopic> skills = _coacheeRepo.GetSkillsForCoachee(UserId);
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
            var result = _coacheeRepo.GetAllCoacheeOrMentee(ctsFilter);
            return result.ToJson();
        }
        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {
            CoacheeOrMenteeRepository _coachRepo = new CoacheeOrMenteeRepository();
            return _coachRepo.addFeedback(UserId, feedback);

        }
       


        // GET: Coachee
        public ActionResult Index()
        {
            return View();
        }
    }
}