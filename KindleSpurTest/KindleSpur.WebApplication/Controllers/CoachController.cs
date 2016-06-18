using KindleSpur.Data;
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
       
        [HttpPost]
        public Boolean SaveSkills(List<Models.Skill> selectedArray)
        {
            CTSRepository _ctsRepo = new CTSRepository();
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _obj.Role = "Coach";
            _obj.CreateDate = _obj.UpdateDate= DateTime.Now;
            if (_obj.Skills == null) _obj.Skills = new List<string>();
            foreach (Models.Skill skill in selectedArray)
            {
                _obj.Skills.Add(skill.Name);
                _obj.Proficiency = skill.profiLevel;
            }
            
            _coachRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public string GetCTS()
        {
            
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            string UserId = ((IUser)Session["User"]).EmailAddress;

            List<string> skills = _coachRepo.GetSkillsForCoach(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            BsonArray arr = new BsonArray();
            foreach (string skill in skills)
            {
                
                BsonDocument result = _ctsRepo.GetCoachTopicAndCategory(skill);
                arr.Add(result);

             
            }
            doc.Add("Categories",arr);
            return doc.ToJson();
        }
    }
}