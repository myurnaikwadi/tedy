using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace KindleSpur.WebApplication.Controllers
{
    public class HomeController : Controller
    {
        //protected override void OnException(ExceptionContext filterContext)
        //{
        //    Exception ex = filterContext.Exception;
        //    filterContext.ExceptionHandled = true;

        //    var model = new HandleErrorInfo(filterContext.Exception, "Home", "error");

        //    filterContext.Result = new ViewResult()
        //    {
        //        ViewName = "Error",
        //        ViewData = new ViewDataDictionary(model)
        //    };

        //}
        public ActionResult error()
        {
          
            return View();
        }
        public ActionResult Index()


        {
            return View();
        }
        public ActionResult ksUserDashBoard()
        {
            //ViewBag.Name = ((User)Session["User"]).FirstName;
            return View();
        }
        public ActionResult ksParentState()
        {
           return View();
        }
        public ActionResult ksTopMainStrip()
        {
            return View();
        }
        public ActionResult ksInboxView()
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
        public ActionResult ksMyReward()
        {
            return View();
        }
        public ActionResult ksMonthlyView()
        {
            return View();
        }
        public ActionResult ksMonthlyTemplate()
        {
            return View();
        }
        public ActionResult ksCommonRepository()
        {
            return View();
        }
        public ActionResult ksAutoSuggest()
        {
            return View();
        }
        public ActionResult ksAutoSuggestSuggestion()
        {
            return View();
        }
        [HttpPost]
        public JsonResult UpdateUserPhoto(SubmitImage model)
        {
            UserRepository _repo = new UserRepository();
            try
            {
                var allowedExtensions = new[] {
                    ".Jpg", ".png", ".jpg", "jpeg"
                };
                var file = Request.Files[0];
                var fileName = Path.GetFileName(file.FileName); //getting only file name(ex-ganesh.jpg)  
                var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
                var path = "";
                if (allowedExtensions.Contains(ext)) //check what type of extension  
                {
                    string name = Path.GetFileNameWithoutExtension(fileName); //getting file name without extension  
                    string myfile = name + ext; //appending the name with id  
                                                // store the file inside ~/project folder(Img)  
                    path = Path.Combine(Server.MapPath("~/Img"), myfile);
                    file.SaveAs(path);
                    string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                    if (_repo.UpdateUserPhoto(emailAddress, string.Format("Img/{0}", myfile)))
                    {
                        ResponseMessage response = new ResponseMessage();
                        HttpCookie cookie = new HttpCookie("ksUser");
                        try
                        {
                            IUser u = _repo.GetUserDetail(emailAddress);

                            if (u != null)
                            {

                                cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                                Response.SetCookie(cookie);

                                Session["User"] = u;

                            }
                            else
                            {
                                response.FailureCallBack("User does not exists, Please Sign up!!!");

                            }
                        }
                        catch (Exception ex)
                        {
                            response.FailureCallBack(ex.Message);
                        }
                        // return response.ToJson();

                    }
                }
                else
                {
                    ViewBag.message = "Please choose only Image file";
                }

                IUser user = _repo.GetUserDetail(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress);
                return Json(user);
            }
            catch (Exception)
            {

                return Json("Error");
            }
           

        }
        public ActionResult ksAboutUs()
        {
            return View();
        }
        public ActionResult ksPrivacyPolicy()
        {
            return View();
        }
        public ActionResult ksTermsCondition()
        {

            return View();
        }
        public ActionResult ksFeedBackPanel()
        {
            return View();
        }
        [HttpPost]
        public JsonResult UpdatecoverPhoto(Uploadcoverimage model)
        {
            UserRepository _repo = new UserRepository();
            try
            {
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
                    var path = Path.Combine(Server.MapPath("~/coverimg"), myfile);
                    file.SaveAs(path);
                    if (_repo.UpdatecoverPhoto(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress, string.Format("img/{0}", myfile)))
                    {
                    }
                }
                else
                {
                    ViewBag.message = "Please choose only Image file";
                }
                IUser user = _repo.GetUserDetail(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress);
                return Json(user);
            }
            catch (Exception)
            {

                return Json("Error");
            }
           
            
        }



    }
}