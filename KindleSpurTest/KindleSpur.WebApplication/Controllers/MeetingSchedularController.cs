using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using KindleSpur.Data;
using System.Net.Mail;
using KindleSpur.WebApplication.MessageHelper;
using MongoDB.Bson;
using MongoDB.Driver;

namespace KindleSpur.WebApplication.Controllers
{
    public class MeetingSchedularController : Controller
    {
        // GET: MeetingSchedular
        public ActionResult Index()
        {
            return View();
        }

        // GET: MeetingSchedular/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: MeetingSchedular/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: MeetingSchedular/Create
        [HttpPost]
        public ActionResult Create(MeetingSchedular _obj, string ReceiverName, string Role, string ContentText)
        {
            try
            {
                //MeetingSchedularRepository _repo = new MeetingSchedularRepository();
                //_obj.CreateDate = _obj.UpdateDate = DateTime.Now;
                //_repo.AddNewMeeting(_obj);

                //return RedirectToAction("Index");
                MeetingSchedularRepository _repo = new MeetingSchedularRepository();
                _obj.CreateDate = DateTime.Now;
                _obj.UpdateDate = DateTime.Now;
                if (_repo.AddNewMeeting(_obj))
                {
                    if (_obj.IsVerified == false)
                    {
                        string uri = Request.Url.AbsoluteUri.ToString();
                        string senderName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName + " " + ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                        string subject = "Meeting Invite from " + senderName;

                        string content = "Hello " + ReceiverName + ",";
                        if (Role == "Coach")
                            content += "You have a meeting invite from your coach, " + senderName + ", on " + _obj.MeetingDate + "," + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on skill " + ContentText + ".";
                        if (Role == "Coachee")
                            content += "You have a meeting invite from your coachee, " + senderName + ", on " + _obj.MeetingDate + "," + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on skill " + ContentText + ".";
                        else if (Role == "Mentee")
                            content += "You have a meeting invite from your mentee, " + senderName + ", on " + _obj.MeetingDate + "," + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on topic " + ContentText + ".";
                        else if (Role == "Mentor")
                            content += "You have a meeting invite from your mentor, " + senderName + ", on " + _obj.MeetingDate + "," + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on topic " + ContentText + ".";
                        else
                            content += "<br/><br/>You have a meeting invite from " + senderName + " for  '" + ContentText + "'.<br/>";

                        content += "<br/><br/>To accept or decline please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                        content += "<br /><br />Regards, <br/> KindleSpur Team.";
                        EmailNotification.SendMeetingEmail(_obj, uri, subject, content);
                        TempData["StatusMessage"] = "Please check your mail for meeting request!!!";
                    }
                }
                else
                {
                    TempData["ErrorMessage"] = "Meeting Schedular is already initiated!!!";
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }


        public ActionResult GetAllMeetingRequest()
        {

            //MeetingSchedularRepository _repo = new MeetingSchedularRepository();
            //var result = _repo.GetAllMeetingRequest().ToJson();
            //return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            //return Content(result);

            MeetingSchedularRepository _repo = new MeetingSchedularRepository();
            try
            {
                List<IUser> result = new List<IUser>();

                UserRepository ur = new UserRepository();
                foreach (var value in _repo.GetAllMeetingRequest(((IUser)Session["User"]).EmailAddress))
                {
                    var recevicedetails = ur.GetUserDetail(value["SenderEmail"].ToString());
                    result.Add((IUser)recevicedetails);
                }
                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {

                throw;
            }
           

        }

        //Update Meeting Schedular Status MeetingSchedular/UpdateConversationStatus
        [HttpPost]
        public void UpdateMeetingStatus(MeetingSchedular _obj, string ReceiverName, string Reason)
        {
            MeetingSchedularRepository _repo = new MeetingSchedularRepository();
            try
            {
                if (_repo.UpdateMeetingStatus(_obj.SenderEmail, _obj.ReceiverEmail, _obj.IsVerified, _obj.Role))
                {
                    string uri = Request.Url.AbsoluteUri.ToString();
                    string senderName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName + " " + ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                    string subject = "";

                    string content = "Hello " + ReceiverName + ",";

                    if (_obj.IsVerified == true && (_obj.Role == "Coach" || _obj.Role == "Coachee"))
                    {
                        subject = "Meeting invite is accepted";
                        content += senderName + " has accepted your meeting invite on " + _obj.MeetingDate + ", " + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on Topic " + Reason + ". You can start communicating with your Coach via KindleSpur platform.";
                        content += "<br/><br/>Have a successful discussion!";
                    }
                    else if (_obj.IsVerified == false && (_obj.Role == "Coach" || _obj.Role == "Coachee"))
                    {
                        subject = "Meeting invite is declined";
                        content += senderName + " has declined  your meeting invite on " + _obj.MeetingDate + ", " + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on Topic " + Reason + ". You can start communicating with your Coach via KindleSpur platform.";

                        content += "<br/></br>Discuss with " + senderName + " via KindleSpur platform and schedule a new meeting.";
                        content += "<br/><br/>Please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                    }
                    else if (_obj.IsVerified == true && (_obj.Role == "Mentor" || _obj.Role == "Mentee"))
                    {
                        subject = "Meeting invite is accepted";
                        content += senderName + " has accepted your meeting invite on " + _obj.MeetingDate + ", " + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on Skill " + Reason + ". You can start communicating with your Coach via KindleSpur platform.";
                        content += "<br/><br/>Have a successful discussion!";
                    }
                    else if (_obj.IsVerified == false && (_obj.Role == "Mentor" || _obj.Role == "Mentee"))
                    {
                        subject = "Meeting invite is declined";
                        content += senderName + " has declined  your meeting invite on " + _obj.MeetingDate + ", " + _obj.FromTime + "," + _obj.ToTime + " hours (IST) on Skill " + Reason + ". You can start communicating with your Coach via KindleSpur platform.";

                        content += "<br/></br>Discuss with " + senderName + " via KindleSpur platform and schedule a new meeting.";
                        content += "<br/><br/>Please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                    }
                    else
                    {
                        subject = "Meeting Status";
                        content += senderName + "has taken action on your request. Search via KindleSpur.";
                    }

                    //
                    content += "<br /><br />Regards, <br/> KindleSpur Team.";
                    EmailNotification.SendMeetingEmail(_obj, uri, subject, content);
                    TempData["StatusMessage"] = "Please check your mail for status of conversation!!!";
                }
            }
            catch (Exception)
            {

                throw;
            }
            
            }
        

        // GET: MeetingSchedular/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: MeetingSchedular/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: MeetingSchedular/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: MeetingSchedular/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
