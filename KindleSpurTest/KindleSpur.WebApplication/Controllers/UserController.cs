﻿using KindleSpur.Data;
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
                IUser u = _repo.GetUserDetail(signupObject.EmailAddress);
                if (u != null)
                {
                    string uri = Request.Url.AbsoluteUri.Replace("/User/ForgotPasswordEmail", "/User/PasswordPromp?UserId=" + u.Id);
                    EmailNotification.SendEmail(signupObject, uri);
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

            User obj = _repo.SavePassword(TempData["UserId"].ToString(), signupObject);

            return View();
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
            if (_repo.UpdateUserDetails(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress, _obj))
            {
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

            reward.CoacheeRewardPoints = 0;
            reward.MenteeRewardPoints = 0;
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

    }
}