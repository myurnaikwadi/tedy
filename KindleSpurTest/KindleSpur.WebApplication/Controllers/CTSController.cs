using KindleSpur.Data;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CTSController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();
        string uid;
        public CTSController()
        {
            GetRecordsOfSkillAndTopics(uid);
        }
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
            var filters = _ctsRepo.GetCTSFilters(Role);
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTrendingTopics()
        {
            var filters = _ctsRepo.GetTrendingTopics();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRecordsOfSkillAndTopics(string userID)
        {
        
            uid=((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;

            CTSRepository repo = new CTSRepository();

            return this.Json(repo.GetAllSkillAndTopics(uid));
        }
    }
}