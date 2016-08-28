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
        private readonly string UserId = null;
        public MentorController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }

        [HttpPost]
        public Boolean SaveTopics(List<SkillOrTopic> selectedArray)
        {
            CoachOrMentorRepository _mentorRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            try
            {
               
                _obj.UserId = UserId;
                _obj.Role = "Mentor";
                _obj.CreateDate = _obj.UpdateDate = DateTime.Now;
                if (_obj.Topics == null)
                    _obj.Topics = new List<SkillOrTopic>();
                if (selectedArray != null)
                    _obj.Topics.AddRange(selectedArray);

                _mentorRepo.AddNewCoachOrMentor(_obj);

               
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return true;

        }

        public string GetTopics()
        {
            try
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
                        BsonDocument result = _ctsRepo.GetMentorCategory(topic);
                        arr.Add(result);
                    }


                }
                doc.Add("Categories", arr);
                return doc.ToJson();
            }
            catch (Exception ex)
            {

               return "opssss Contact to Admin";
            }
           
        }

        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {
            try
            {
                CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                return _coachRepo.addFeedback(UserId, feedback, "Mentor");
            }
            catch (Exception)
            {

                throw;
            }
           

        }
        public ActionResult GetCoachingStatus()
        {
            try
            {
                CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                var filters = _coachRepo.GetCoachingStatus(UserId, "Mentor");
                return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return View("Error");
            }
            
        }

    }
}