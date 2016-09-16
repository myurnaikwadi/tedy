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
        ConversationRepository _conversationrepo = new ConversationRepository();

        // GET: Schedular
        public ActionResult Index()
        {
            return View();
        }

        public SchedularController()
        {
           
        }

        [HttpPost]
        public ActionResult Create(Meeting _obj, string ReceiverName, string Role, string ContentText)
        {
            try
            {

                MeetingRepository _repo = new MeetingRepository();
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
        public JsonResult GetAllMeetingRequest(string role)
        {

            MeetingRepository _repo = new MeetingRepository();
            List<IUser> result = new List<IUser>();
            List<UserMeetings> result1 = new List<UserMeetings>();

            UserRepository ur = new UserRepository();
            try
            {
                foreach (var value in _repo.GetAllMeetingRequest(role,((IUser)Session["User"]).EmailAddress))
                {

                    var recevicedetails = ur.GetUserDetail(value.From);
                    UserMeetings u = new UserMeetings();
                    u.Meeting = value;
                    u.FirstName = recevicedetails.FirstName;
                    u.LastName = recevicedetails.LastName;
                    u.Photo = recevicedetails.Photo;
                    u.EmailAddress = recevicedetails.EmailAddress;
                    result1.Add(u);
                }

                return Json(new { Result = result1 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return null;
            }
            return null;
           
        }
        [HttpPost]
        public bool MeetingSchedularUpdate(string MeetingId, bool flag)
        {
            MeetingRepository _repo = new MeetingRepository();
            try
            {
                return _repo.MeetingSchedularUpdate(MeetingId, flag);

            }
            catch (Exception)
            {

                return true;
            }
        }

        [HttpPost]
        public ActionResult GetAllMeetingPerMonth(DateTime FromDate, DateTime ToDate, string Value)
        {

            MeetingRepository _repo = new MeetingRepository();
            UserRepository ur = new UserRepository();
            try
            {
                string userId = (((IUser)Session["User"]).EmailAddress);
                object result3 = null;
                object meeting = null;
                object invite = null;

                if (Value == "Meeting")
                {
                    meeting = _repo.GetAllMeetingPerMonth(userId, FromDate, ToDate);
                    result3 = new { meeting};
                }
                else if (Value == "Invite")
                {
                    invite = _conversationrepo.GetAllConversationRequestPerMonth(userId, FromDate, ToDate);
                    result3 = new {invite};
                }
                else if (Value == "All")
                {
                    meeting = _repo.GetAllMeetingPerMonth(userId, FromDate, ToDate);
                    invite = _conversationrepo.GetAllConversationRequestPerMonth(userId, FromDate, ToDate);
                    result3 = new { meeting, invite };
                }
                
                return Json(result3, JsonRequestBehavior.AllowGet);
               
            }
            catch (Exception)
            {

                return null;
            }
        }
        
    }
}