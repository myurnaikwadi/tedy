using KindleSpur.Data;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CTSController : Controller
    {
        private readonly CTSRepository _ctsRepo = new CTSRepository();

        public ActionResult GetCTS()
        {
            var filters = _ctsRepo.GetCTS();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult GetCTSFilters()
        {
            var filters = _ctsRepo.GetCTSFilters();
            return Json(new { Filters = filters, Success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}