using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CTSController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        string uid;
        //public CTSController()
        //{
        //    GetRecordsOfSkillAndTopics(uid);
        //}
        public string GetCTS()
        {

            return _ctsRepo.GetCTS().ToJson();

        }

        public string GetTopics()
        {
            return _ctsRepo.GetTopics().ToJson();

        }

        [HttpPost]
        public ActionResult GetCTSFilters(string Role)
        {
            try
            {
                var filters = _ctsRepo.GetCTSFilters(Role);
                return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return View("Error");
            }
           
        }

        public ActionResult GetTrendingTopics()
        {
            try
            {
                var filters = _ctsRepo.GetTrendingTopics();
                return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return View("Error");
            }

        }
        public JsonResult GetRecordsOfSkillAndTopics(User user)
        {
            try
            {
             

                CTSRepository repo = new CTSRepository();

                return this.Json(repo.GetAllSkillAndTopics(user.EmailAddress));
            }
            catch (Exception ex)
            {

                throw;
            }
          
        }
    }
}