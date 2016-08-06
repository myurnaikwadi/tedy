using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
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
        public ActionResult ksVcs()
        {
            return View();
        }
        public ActionResult ksRssFeed()
        {
            return View();
        }
        public ActionResult ksVCGameView()
        {
            return View();
        }
        public ActionResult ksLandingPage()
        {
            return View();
        }
        [HttpPost]
        public ActionResult UpdateUserPhoto(SubmitImage model)
        {
            UserRepository _repo = new UserRepository();
            var allowedExtensions = new[] {
                    ".Jpg", ".png", ".jpg", "jpeg"
                };
            var file = Request.Files[0];
            var fileName = Path.GetFileName(file.FileName); //getting only file name(ex-ganesh.jpg)  
            var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
            if (allowedExtensions.Contains(ext)) //check what type of extension  
            {
                string name = Path.GetFileNameWithoutExtension(fileName); //getting file name without extension  
                string myfile = name + ext; //appending the name with id  
                                            // store the file inside ~/project folder(Img)  
                var path = Path.Combine(Server.MapPath("~/Img"), myfile);
                file.SaveAs(path);
                if (_repo.UpdateUserPhoto(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress, string.Format("~/Img/{0}", myfile)))
                {
                }
            }
            else
            {
                ViewBag.message = "Please choose only Image file";
            }
            return View();
        }

    }
}