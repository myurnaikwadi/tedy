using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CoachController : Controller
    {
        Connection con = new Connection();
        MongoCollection _logCollection;
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        private readonly CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
        private readonly string UserId ;
        public CoachController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }
        [HandleError]
        [HttpPost]
        public Boolean SaveSkills(List<Models.SkillOrTopic> selectedArray)
        {
            try
            {
                KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
                _obj.UserId = UserId;
                _obj.Role = "Coach";
                _obj.CreateDate = _obj.UpdateDate = DateTime.Now;
                if (_obj.Skills == null) _obj.Skills = new List<SkillOrTopic>();
                if (selectedArray != null)
                    _obj.Skills.AddRange(selectedArray);
            
                _coachRepo.AddNewCoachOrMentor(_obj);
            }
            catch (Exception ex)
            {
                throw;
            }
           
            finally
            {

            }
            return true;
        }
        [HandleError]
        public BsonDocument  GetRecommendedCoach()
        {
            return _coachRepo.GetRecommended("Coach");
            
        }
        [HandleError]
        public string GetCTS()
        {
            try
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
            catch (Exception ex)
            {
                return "Opss contact to Administrator";
            }

            finally
            {

            }



        }
        [HandleError]
        public string GetCoachs(CTSFilter ctsFilter)
        {
            try
            {
                var result = _coachRepo.GetAllCoachOrMentors(ctsFilter, "Role", UserId);
                return result.ToJson();

            }
           
            catch (Exception ex)
            {
                return "Opss contact to Administrator";
            }
            finally
            {

            }


        }

      
        public ActionResult GenerateGarden()
        {
            try
            {
                CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                var filters = _coachRepo.GenerateGarden(UserId, "Coach");
                return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return View("Error");
            }

            finally
            {

            }

        }

        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {

            try
            {
                CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            }
            
            catch (Exception ex)
            {
                throw new Exception("system error");
            }

            finally
            {

            }
            return _coachRepo.addFeedback(UserId, feedback, "Coach");
        }
        [HandleError]
        public ActionResult GetCoachingStatus()
        {
            try
            {
                CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                var filters = _coachRepo.GetCoachingStatus(UserId, "Coach");
                return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
            }
           
            catch (Exception ex)
            {
                return View("Error");
            }
            finally
            {

            }

        }
        
    }
}