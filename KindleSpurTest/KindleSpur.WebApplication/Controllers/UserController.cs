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

            //GET:Login Page 
        public ActionResult Login()
        {
            Session.Abandon();
            return View();
        }

        //GET Login Page
        //User Login and check user registered or not
        //User can set password when link send to his/her mail address
        //Notification Also sent to user
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

        //GET:PasswordPromp Page
        //Set Password for login page 
        public ActionResult PasswordPromp(int? UserId)
        {
            TempData["UserId"] = Request["UserId"].ToString();
            UserRepository _repo = new UserRepository();
            User u = (User)_repo.GetUserDetails(TempData["UserId"].ToString());

            if (u != null && !u.IsVerified)
            {
                TempData.Keep("UserId");
                return View();
            }
            else
            {
                return RedirectToLogin(u);
            }

        }

        //When password saved from PasswordPromp it Will redirect to login page
        public ActionResult RedirectToLogin(IUser user)
        {
            return View(user);
        }

        //Login Page Click on ForgetPassword Mail Sent to user Mail Id
        public ActionResult ForgotPasswordEmail()
        {
            return View();
        }

        //Business Logic
        //Login Page Click on ForgetPassword Mail Sent to user Mail Id
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
        public string SendEmailForCategorySuggestion(List<Suggestion> suggestion)
        {
            response = new ResponseMessage();
            UserRepository _repo = new UserRepository();
            try
            {

                string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                User u = (User)_repo.GetUserDetail(emailAddress);

                if (u != null)
                {
                    u.FirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(u.FirstName.ToLower());
                    u.LastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(u.LastName.ToLower());
                    EmailNotification.SendEmailForCategorySuggestion(u, suggestion);
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

        //Used to save password for user in PasswordPromp page
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
        public JsonResult GetFeedback(string senderEmail, string role, string skill)
        {
            UserRepository _userRepo = new UserRepository();
            string receiverEmail = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            return this.Json(_userRepo.GetFeedback(senderEmail, receiverEmail, role, skill));
        }

        //This Method Use For Direct linkedIn Login
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

        //
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
        // POST: api/UpdateUserDetails
        //save user details
        [HttpPost]
        public void UpdateUserDesc(User _obj)
        {
            UserRepository _repo = new UserRepository();
            string emailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            if (_repo.UpdateUserDesc(emailAddress, _obj.description))
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

            }
        }

        //Save new password from userprofile page
        //Call go to UserRepository for search UpdatePassword method
        //Afetr that Profile page called
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
            }

        }

        //Logout From Application
        [HttpPost]
        public int logout()
        {
            if (Request.Cookies["ksUser"] != null)
            {
                HttpCookie cookie = new HttpCookie("ksUser");
                cookie.Expires = DateTime.Now.AddDays(-1d);
                Response.Cookies.Add(cookie);
            }
            return 1;

        }

        //After giving Feedback points will incress and then GAME will unloack.
        //Reedme points
        public string UnlockGame()
        {
            UserRepository _repo = new UserRepository();
            ObjectId userId = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            return _repo.GamesUnLocked(userId);

        }

        //After giving Feedback points will incress and then PSR will unloack.
        //Reedme points
        public string UnlockPSR()
        {
            UserRepository _repo = new UserRepository();
            ObjectId userId = ((IUser)System.Web.HttpContext.Current.Session["User"]).Id;
            return _repo.PSRUnLocked(userId);
        }

        //Points will display role wise on myrewards
        //Call Get from UserRepository
        public string GetRewardPoints()
        {
            Reward reward = new Reward();
            UserRepository _userRepo = new UserRepository();
            try
            {
                string EmailAddress = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
                _userRepo.GetRewardPoints(EmailAddress, ref reward);

                CoachOrMentorRepository _coachOrMentorRepo = new CoachOrMentorRepository();
                _coachOrMentorRepo.GetRewardPoints(EmailAddress, ref reward);

                CoacheeOrMenteeRepository _coacheeOrMenteeRepo = new CoacheeOrMenteeRepository();
                _coacheeOrMenteeRepo.GetRewardPoints(EmailAddress, ref reward);
            }
            catch (Exception ex)
            {
                response.FailureCallBack(ex.Message);
            }

            return reward.ToJson();
        }

        [HttpPost]
        public JsonResult GetMostRatedFeedback(string role, string emailAddress)
        {
            UserRepository _userRepo = new UserRepository();
            return this.Json(_userRepo.GetMostRatedFeedback(role, emailAddress));
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

        //The method call (GetSkillsForConversation) this method from Conversation Repo
        //Skill you get Role wise
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
                response.FailureCallBack(ex.Message);
            }
            return response.ToJson();
        }


    }
}