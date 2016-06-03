using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.Data;
using System.Net.Mail;

namespace KindleSpur.WebApplication.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(User signupObject)
        {
            UserRepository _repo = new UserRepository();
            try
            {

                if (_repo.AddNewUser(signupObject))
                {
                    MailMessage message = new MailMessage("proxyserver.myur@gmail.com", signupObject.EmailAddress);
                    message.Subject = "Account Activation";
                    string body = "Hello " + signupObject.FirstName + ",";
                    body += "<br/><br/>Please click the following link to activate your account<br/>";
                    body += "<br/><br/><a style='background:#000000; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none; font-weight:bold; font-size:20px;' href = '" + Request.Url.AbsoluteUri.Replace("/User/Login", "/User/PasswordPromp?UserId=" + 1) + "'>Click here to activate your account.</a>";
                    body += "<br /><br />Thanks, <br/> KindleSpur Team.";
                    message.Body = body;
                    message.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
                    smtp.Credentials = new System.Net.NetworkCredential("proxyserver.myur@gmail.com", "mayu3337sis");
                    smtp.EnableSsl = true;
                    smtp.Send(message);
                }
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "User already exists!!";
                throw ex;
            }
            return View();
        }

        //public ActionResult PasswordPromp()
        //{
        //    return View();
        //}


        public ActionResult PasswordPromp(int UserId)
        {
            return View();
        }

        [HttpPost]
        public ActionResult SavePassword(User signupObject)
        {
            return View();
        }
        public ActionResult ksUserDashBoard()
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
        [HttpPost]
        public ActionResult linkedIn(User _obj)
        {

            UserRepository _repo = new UserRepository();
            if (!_repo.AddNewUser(_obj))
            {
                throw new Exception();
            }
            return View();
        }

        public ActionResult Error()
        {
            ViewBag.ErrorMessage = "User already exists.";

            return View();
        }

    }
}