using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.WebApplication.MessageHelper;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace KindleSpur.WebApplication.Controllers
{
    public class UserController : Controller
    {
        private ResponseMessage response;
        // GET: User

        public ActionResult Login()
        {
            Session.Abandon();
            return View();
        }

        [HttpPost]
        public string Login(User signupObject)
        {
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            try
            {
                if (_repo.AddNewUser(signupObject))
                {
                    string uri = Request.Url.AbsoluteUri.Replace("/User/Login", "/User/PasswordPromp?UserId=" + signupObject.Id);
                    EmailNotification.SendEmail(signupObject, uri);
                }
                else
                {
                    response.FailureCallBack("User is already registered!!!");
                }
            }
            catch (Exception ex)
            {
                response.FailureCallBack(ex.Message);
            }
            return response.ToJson();
        }

        public ActionResult PasswordPromp(int? UserId)
        {
            TempData["UserId"] = Request["UserId"].ToString();
            TempData.Keep("UserId");
            return View();
        }

        public ActionResult ForgotPasswordEmail()
        {
            return View();
        }

        [HttpPost]
        public string ForgotPasswordEmail(User signupObject)
        {
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            try
            {
                User u = (User)_repo.GetUserDetail(signupObject.EmailAddress);
               
                if (u != null)
                {
                    u.FirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(u.FirstName.ToLower());
                    u.LastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(u.LastName.ToLower());
                    string uri = Request.Url.AbsoluteUri.Replace("/User/ForgotPasswordEmail", "/User/PasswordPromp?UserId=" + u.Id);
                    EmailNotification.SendEmailForgotPassword(u, uri);
                }
                else
                {
                    response.FailureCallBack("UserId does not exists!!!");
                }
            }
            catch (Exception ex)
            {
                response.FailureCallBack(ex.Message);
            }
            return response.ToJson();
        }

      [HttpPost]
        public ActionResult SavePassword(User signupObject)
        {
            UserRepository _repo = new UserRepository();
            User obj = new User();

            string Id = Request.UrlReferrer.Query.TrimStart('?').Split('=')[1];
            if (Id != null)
                obj = _repo.SavePassword(Id, signupObject);
           else
                obj = _repo.SavePassword(((IUser)System.Web.HttpContext.Current.Session["User"]).Id.ToString(), signupObject);
             
            return View();
        }


        //This method to be tested after AngularJS code written
        [HttpPost]
        public List<List<IFeedback>> GetFeedback()
        {
                UserRepository _userRepo = new UserRepository();
                string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                return(_userRepo.GetFeedback(emailAddress));
        }


        [HttpPost]
        public ActionResult linkedIn(User _obj)
        {
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            if (!_repo.AddNewUser(_obj))
            {
                response.FailureCallBack("User already exists!!!");
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
        public string LoginResult(User signupObject)
         {
            
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            HttpCookie cookie = new HttpCookie("ksUser");
            try
            {
                IUser u = _repo.GetUserDetail(signupObject.EmailAddress);

                if (u != null)
                {
                    if (u.Password == signupObject.Password)
                    {
                        cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                        Response.SetCookie(cookie);

                        Session["User"] = u;
                    }
                    else if (u.IsExternalAuthentication)
                    {
                        cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                        Response.SetCookie(cookie);

                        Session["User"] = u;
                    }
                    else
                    {
                        response.FailureCallBack("Wrong Password!!!");
                    }
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
            return response.ToJson();
        }

        // POST: api/UpdateUserDetails
        [HttpPost]
        public void UpdateUserDetails(User _obj)
        {
            UserRepository _repo = new UserRepository();
            string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            if (_repo.UpdateUserDetails(emailAddress, _obj))
            {
                response = new ResponseMessage();
                HttpCookie cookie = new HttpCookie("ksUser");
                try
                {
                    IUser u = _repo.GetUserDetail(emailAddress);

                    if (u != null)
                    {

                        cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                        Response.SetCookie(cookie);

                        Session["User"] = u;
                       
                        if (u.IsExternalAuthentication)
                        {
                            cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                            Response.SetCookie(cookie);

                            Session["User"] = u;
                        }

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
        [HttpPost]
        public void UpdateUserDesc(User _obj)
        {
            UserRepository _repo = new UserRepository();
            if (_repo.UpdateUserDesc(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress, _obj.description))
            {

            }

        }

        [HttpPost]
        public void UpdatePassword(User _obj)
        {
            UserRepository _repo = new UserRepository();
            string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            if (_repo.UpdatePassword(emailAddress, _obj.Password))
            {
                response = new ResponseMessage();
                HttpCookie cookie = new HttpCookie("ksUser");
                try
                {
                    IUser u = _repo.GetUserDetail(emailAddress);
                    if (u != null)
                    {

                        cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                        Response.SetCookie(cookie);

                        Session["User"] = u;

                        if (u.IsExternalAuthentication)
                        {
                            cookie[u.EmailAddress] = new JavaScriptSerializer().Serialize(u);
                            Response.SetCookie(cookie);

                            Session["User"] = u;
                        }

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


        public string UnlockGame()
        {
            UserRepository _repo = new UserRepository();
            ObjectId userId = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            return _repo.GamesUnLocked(userId);

        }

        public string UnlockPSR()
        {
            UserRepository _repo = new UserRepository();
            ObjectId userId = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            return _repo.PSRUnLocked(userId);
        }


        public string GetRewardPoints()
        {
            Reward reward = new Reward();
            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo.GetRewardPoints(EmailAddress, ref reward);

            CoachOrMentorRepository _coachOrMentorRepo = new CoachOrMentorRepository();
            _coachOrMentorRepo.GetRewardPoints(EmailAddress, ref reward);

            CoacheeOrMenteeRepository _coacheeOrMenteeRepo = new CoacheeOrMenteeRepository();
            _coacheeOrMenteeRepo.GetRewardPoints(EmailAddress, ref reward);
            return reward.ToJson();
        }

        [HttpPost]
        public void AddVSCSActivity(VSCS _vscs)
        {

            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo.SaveVCSCActivity(EmailAddress, _vscs);
        }

        public string GetVSCSActivity()
        {

            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            return (_userRepo.GetVCSCActivity(EmailAddress));
        }

        [HttpPost]
        public void RemoveVCSCActivity(VSCS _vscs)
        {
            UserRepository _userRepo = new UserRepository();
            string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo.RemoveVCSCActivity(EmailAddress, _vscs);
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
        public JsonResult GetSkills()
        {
            ConversationRepository repo = new ConversationRepository();
            return this.Json(repo.GetSkillsForConversation());
        }

        [HttpPost]
        public string SendEmailOnInvitation(Invitation signupObject)
        {
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            bool status = false;
            try
            {
                string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                User userDetails = (User)_repo.GetUserDetail(EmailAddress);
                Invitation invitation = new Invitation();
                invitation.Description = signupObject.Description;
                invitation.Invites = signupObject.Invites;

                if (userDetails != null)
                {
                    userDetails.FirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(userDetails.FirstName.ToLower());
                    userDetails.LastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(userDetails.LastName.ToLower());
                    string uri = "www.kindlespur.com";
                    status = _repo.SaveInviteEmailAddresses(userDetails, invitation);
                    if (status == true)
                        EmailNotification.SendEmailOnInvitation(userDetails, invitation, uri);
                    else
                        response.FailureCallBack("Unfortunately unable to send email, try again ");

                }
                else
                {
                    response.FailureCallBack("UserId does not exists!!!");
                }
            }
            catch (Exception ex)
            {
                return "Opss contact to Administrator";


            }
            return response.ToJson();
        }


    }
}