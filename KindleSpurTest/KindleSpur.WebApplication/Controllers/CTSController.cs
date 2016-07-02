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

        public ActionResult GetCTSFilters()
        {
            var filters = _ctsRepo.GetCTSFilters();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}