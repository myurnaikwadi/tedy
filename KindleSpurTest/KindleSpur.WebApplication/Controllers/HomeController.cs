using KindleSpur.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ksUserDashBoard()
        {
            //ViewBag.Name = ((User)Session["User"]).FirstName;
            return View();
        }
        public ActionResult ksTopMainStrip()
        {
            return View();
        }
        public ActionResult ksCtcRole()
        {
            return View();
        }
        public ActionResult ksDashBoardCoach()
        {
            return View();
        }
        public ActionResult ksDashBoardCoachee()
        {
            return View();
        }
        public ActionResult ksDashBoardMentor()
        {
            return View();
        }
        public ActionResult ksDashBoardMentee()
        {
            return View();
        }
        public ActionResult ksProfileView()
        {
            return View();
        }
        public ActionResult ksProfileTemplate()
        {
            return View();
        }

    }
}