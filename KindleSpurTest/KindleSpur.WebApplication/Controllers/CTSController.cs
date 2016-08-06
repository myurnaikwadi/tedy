using KindleSpur.Data;
using MongoDB.Bson;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CTSController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();

        public string GetCTS()
        {
            return _ctsRepo.GetCTS().ToJson();

        }

        public string GetTopics()
        {
            return _ctsRepo.GetTopics().ToJson();

        }

        public ActionResult GetCTSFilters()
        {
            var filters = _ctsRepo.GetCTSFilters();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTrendingTopics()
        {
            var filters = _ctsRepo.GetTrendingTopics();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}