using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Communication;
using KindleSpur.Models.Interfaces;
using KindleSpur.WebApplication.MessageHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class SchedularController : Controller
    {
        // GET: Schedular
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(Meeting _obj, string ReceiverName, string Role, string ContentText)
        {
            try
            {

                MeetingRepository _repo = new MeetingRepository();
               // _obj.CreateDate = DateTime.Now;
               // _obj.UpdateDate = DateTime.Now;
                if (_repo.AddNewMeeting(_obj))
                {
                    if (_obj.IsVerified == false)
                    {
                        string uri = Request.Url.AbsoluteUri.ToString();
                        string senderName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName + " " + ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                        string subject = "Meeting Invite from " + senderName;

                        string content = "Hello " + ReceiverName + ",";
                        if (Role == "Coach")
                            content += "You have a meeting invite from your coach, " + senderName + ", on " + _obj.StartDate + "," + _obj.From + "," + _obj.To + " hours (IST) on skill " + ContentText + ".";
                        if (Role == "Coachee")
                            content += "You have a meeting invite from your coachee, " + senderName + ", on " + _obj.StartDate + "," + _obj.From + "," + _obj.To + " hours (IST) on skill " + ContentText + ".";
                        else if (Role == "Mentee")
                            content += "You have a meeting invite from your mentee, " + senderName + ", on " + _obj.StartDate + "," + _obj.From + "," + _obj.To + " hours (IST) on topic " + ContentText + ".";
                        else if (Role == "Mentor")
                            content += "You have a meeting invite from your mentor, " + senderName + ", on " + _obj.StartDate + "," + _obj.From + "," + _obj.To + " hours (IST) on topic " + ContentText + ".";
                        else
                            content += "<br/><br/>You have a meeting invite from " + senderName + " for  '" + ContentText + "'.<br/>";

                        content += "<br/><br/>To accept or decline please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                        content += "<br /><br />Regards, <br/> KindleSpur Team.";
                       // EmailNotification EmailNotification = new EmailNotification();
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
        [HttpPost]
        public ActionResult GetAllMeetingRequest()
        {

            //MeetingSchedularRepository _repo = new MeetingSchedularRepository();
            //var result = _repo.GetAllMeetingRequest().ToJson();
            //return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            //return Content(result);

            MeetingRepository _repo = new MeetingRepository();
            List<IUser> result = new List<IUser>();
            List<UserMeetings> result1 = new List<UserMeetings>();

            UserRepository ur = new UserRepository();
            //foreach (var value in _repo.GetAllMeetingRequest(((IUser)Session["User"]).EmailAddress))
            //{
            //    var recevicedetails = ur.GetUserDetail(value["From"].ToString());
            //    result.Add((IUser)recevicedetails);
                
            //}

            foreach (var value in _repo.GetAllMeetingRequest(((IUser)Session["User"]).EmailAddress))
            {

                var recevicedetails = ur.GetUserDetail(value.From);
                UserMeetings u = new UserMeetings();
                u.Meeting = value;
                u.FirstName = recevicedetails.FirstName;
                u.LastName = recevicedetails.LastName;
                u.Photo = recevicedetails.Photo;
                u.EmailAddress = recevicedetails.EmailAddress;
                result1.Add(u);
                //result.Add((IUser)recevicedetails);
            }

            return Json(new { Result = result1 }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public bool MeetingSchedularUpdate(string MeetingId, bool flag)
        {
            MeetingRepository _repo = new MeetingRepository();
            return _repo.MeetingSchedularUpdate(MeetingId, flag);            
        }
        [HttpPost]
        public ActionResult GetAllMeetingPerMonth(DateTime FromDate, DateTime ToDate)
        {

            //MeetingSchedularRepository _repo = new MeetingSchedularRepository();
            //var result = _repo.GetAllMeetingRequest().ToJson();
            //return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            //return Content(result);

            MeetingRepository _repo = new MeetingRepository();
            //List<IUser> result = new List<IUser>();

            UserRepository ur = new UserRepository();
           var result = _repo.GetAllMeetingPerMonth(( ((IUser)Session["User"]).EmailAddress),FromDate,ToDate);           
            return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
        }



    }
}