using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.WebApplication.MessageHelper;
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
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Login()
        {
            Session.Abandon();
            return View();
        }

        [HttpPost]
        public ActionResult Login(User signupObject)
        {
            UserRepository _repo = new UserRepository();
            if (_repo.AddNewUser(signupObject))
            {
                string uri = Request.Url.AbsoluteUri.Replace("/User/Login", "/User/PasswordPromp?UserId=" + signupObject.Id);
                EmailNotification.SendEmail(signupObject, uri);
                TempData["StatusMessage"] = "Please check your mail to activate account!!!";
            }
            else
            {
                TempData["ErrorMessage"] = "User is already registered!!!";
            }
            return View();
        }

        public ActionResult PasswordPromp(int? UserId)
        {
            //RedirectToAction("", "Home");
            TempData["UserId"] = Request["UserId"].ToString();
            return View();
        }

        public ActionResult ForgotPasswordEmail()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ForgotPasswordEmail(User signupObject)
        {
            UserRepository _repo = new UserRepository();
            IUser u = _repo.GetUserDetail(signupObject.EmailAddress);
            if (u != null)
            {
               
                string uri =  Request.Url.AbsoluteUri.Replace("/User/ForgotPasswordEmail", "/User/PasswordPromp?UserId=" + u.Id);
                EmailNotification.SendEmail(signupObject, uri);
            }
            else
            {

            }
            return View();
        }

        [HttpPost]
        public ActionResult SavePassword(User signupObject)
        {
            UserRepository _repo = new UserRepository();
        
            User obj= _repo.SavePassword(TempData["UserId"].ToString(), signupObject);
            
            return View();
        }

        [HttpPost]
        public ActionResult linkedIn(User _obj)
        {
            UserRepository _repo = new UserRepository();
            if (!_repo.AddNewUser(_obj))
            {
                ViewBag.ErrorMessage = "User already exists.";
            }
            else
            {
                Session["User"] = _obj;
            }
            return View();
        }

        public ActionResult Error()
        {
            return View();
        }

        [HttpPost]
        public Object LoginResult(User signupObject)
        {
            UserRepository _repo = new UserRepository();
            HttpCookie cookie = new HttpCookie("ksUser");
            IUser u = _repo.GetUserDetail(signupObject.EmailAddress);

            if (u != null && u.Password==signupObject.Password)
            {
                           
                cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                Response.SetCookie(cookie);

                Session["User"] = u;
                return Session["User"];
            }
            else
            {
               
                return null;

            }

        }

        // POST: api/UpdateUserDetails
        [HttpPost]
        public void UpdateUserDetails(User _obj)
        {
            UserRepository _repo = new UserRepository();
            if (_repo.UpdateUserDetails(((IUser)System.Web.HttpContext.Current.Session["User"]).Id, _obj))
            {
            }
        }
        [HttpPost]
        public void UpdateUserDesc(User _obj)
        {
            ObjectId id = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            UserRepository _repo = new UserRepository();
            if (_repo.UpdateUserDesc(((IUser)System.Web.HttpContext.Current.Session["User"]).Id, _obj))
            {
            }
        }

        [HttpPost]
        public ActionResult UpdateUserPhoto(HttpPostedFileBase file)
        {
            UserRepository _repo = new UserRepository();
            var allowedExtensions = new[] {
                    ".Jpg", ".png", ".jpg", "jpeg"
                };
            var fileName = Path.GetFileName(file.FileName); //getting only file name(ex-ganesh.jpg)  
            var ext = Path.GetExtension(file.FileName); //getting the extension(ex-.jpg)  
            if (allowedExtensions.Contains(ext)) //check what type of extension  
            {
                string name = Path.GetFileNameWithoutExtension(fileName); //getting file name without extension  
                string myfile = name + ext; //appending the name with id  
                                            // store the file inside ~/project folder(Img)  
                var path = Path.Combine(Server.MapPath("~/Img"), myfile);
                file.SaveAs(path);
                if (_repo.UpdateUserPhoto(((IUser)System.Web.HttpContext.Current.Session["User"]).Id, path))
                {
                }
            }
            else
            {
                ViewBag.message = "Please choose only Image file";
            }
            return View();
        }
                
        public string UnlockGame()
        {
            UserRepository _repo = new UserRepository();
            ObjectId userId = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            return _repo.GamesUnLocked(userId);
        }
       

        public string GetRewardPoints()
        {
            Reward reward = new Reward();
            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo.GetRewardPoints(EmailAddress, ref reward);

            CoachOrMentorRepository _coachOrMentorRepo = new CoachOrMentorRepository();
            _coachOrMentorRepo.GetRewardPoints(EmailAddress, ref reward);

            reward.CoacheeRewardPoints = 0;
            reward.MenteeRewardPoints = 0;
            return reward.ToJson();
        }

        [HttpPost]
        public void AddVSCSActivity(VSCS _vscs)
        {
            
            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo.SaveVCSCActivity(EmailAddress);
        }

        //[HttpPost]
        //public ActionResult ForgotPassword(string EmailAddress)
        //{            
        //    UserRepository _repo = new UserRepository();
        //    IUser u = _repo.GetUserDetail(EmailAddress);
        //    if (u != null)
        //    {
        //        User signupObject = new User();
        //        string uri = Request.Url.AbsoluteUri.Replace("/User/Login", "/User/PasswordPromp?UserId=" + signupObject.Id);
        //        EmailNotification.SendEmail(signupObject, uri);
        //        ViewBag.message = "Please check your e-Mail for further procedure..";
        //    }
        //    else
        //    {
        //        ViewBag.Error = "UserName doesnot Exists!!! Please SignUp";
        //    }
            
        //    return PartialView();
        //}

    }
}