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
    public class CoacheeController : Controller
    {
        MongoCollection _logCollection;
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        private readonly CoacheeOrMenteeRepository _coacheeRepo = new CoacheeOrMenteeRepository();
        private readonly string UserId = null;
        public CoacheeController()
        {
          
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
        }

        [HttpPost]
        public Boolean SaveSkills(List<Models.SkillOrTopic> selectedArray)
        {
            try
            {
                KindleSpur.Models.CoacheeOrMentee _obj = new Models.CoacheeOrMentee();
                _obj.UserId = UserId;
                _obj.Role = "Coachee";
                _obj.CreateDate = _obj.UpdateDate = DateTime.Now.ToString();
                if (_obj.Skills == null) _obj.Skills = new List<SkillOrTopic>();
                if (selectedArray != null)
                    _obj.Skills.AddRange(selectedArray);
                _coacheeRepo.AddNewCoacheeOrMentee(_obj);
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
        public BsonDocument GetRecommendedCoachee()
        {
            return _coacheeRepo.GetRecommended("Coachee");

        }
        public string GetCTS()
        {
            try
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
            catch (Exception ex)
            {
                return "Opss contact to Administrator";

            }

            finally
            {

            }

        }
           
        
        public string GetCoachs(CTSFilter ctsFilter,string Role)
        {
            try
            {
                CoachOrMentorRepository _coachRep = new CoachOrMentorRepository();
                // var result = _coacheeRepo.GetAllCoacheeOrMentee(ctsFilter);
                var result = _coachRep.GetAllCoachOrMentors(ctsFilter, Role);
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
        [HttpPost]
        public int SaveFeedBack(Feedback feedback)
        {
            try
            {
                CoacheeOrMenteeRepository _coachRepo = new CoacheeOrMenteeRepository();
                return _coachRepo.addFeedback(UserId, feedback, "Coachee");
            }
            catch (Exception ex)
            {
                throw;
            }

            finally
            {

            }
            

        }
       


        // GET: Coachee
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetRecommendedCoach(UserRole UserRole)
        {
            try
            {
                if (UserRole.Role != null)
                {
                    CoacheeOrMenteeRepository _coacheeRepo = new CoacheeOrMenteeRepository();
                    if (UserRole.Role == "Coach")
                    {
                        List<SkillOrTopic> lstSkillforCochee = new List<SkillOrTopic>();
                        lstSkillforCochee = _coacheeRepo.GetSkillsForCoachee(UserId);
                        if (lstSkillforCochee != null || lstSkillforCochee.Count > 0)
                        {
                            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                            return this.Json(_coachRepo.GetRecommendedCoachList(lstSkillforCochee, UserRole.Role, UserId));
                        }
                    }
                    else if (UserRole.Role == "Mentor")
                    {
                        List<SkillOrTopic> lstTopicforMentee = new List<SkillOrTopic>();
                        lstTopicforMentee = _coacheeRepo.GetTopicsForMentee(UserId);
                        if (lstTopicforMentee != null || lstTopicforMentee.Count > 0)
                        {
                            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
                            return this.Json(_coachRepo.GetRecommendedMentorList(lstTopicforMentee, UserRole.Role, UserId));
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }


            finally
            {

            }
           
        }

        public ActionResult GetCoachingStatus()
        {
            try
            {
                CoacheeOrMenteeRepository _coachRepo = new CoacheeOrMenteeRepository();
                var filters = _coachRepo.GetCoachingStatus(UserId, "Coachee");
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