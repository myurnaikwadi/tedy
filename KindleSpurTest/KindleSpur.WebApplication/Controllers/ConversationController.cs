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
using MongoDB.Bson.Serialization;

namespace KindleSpur.WebApplication.Controllers
{
    public class ConversationController : Controller
    {
        private readonly string UserId;
        public ConversationController()
        {
            //UserId = ((IUser)Session["User"]).EmailAddress;
        }
        //
        // GET: /Coversation/
        public ActionResult Index()
        {
            ConversationRepository _repo = new ConversationRepository();
            _repo.ListConversation(((IUser)Session["User"]).EmailAddress,"Coaching");
            return View();
        }

        //
        // GET: /Coversation/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        //public ActionResult GetConversation(string loggedEmail)
        //{
        //    ConversationRepository _repo = new ConversationRepository();
        //    var result = _repo.ListConversation(((IUser)Session["User"]).EmailAddress).ToJson();
        //    return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
        //}

        public ActionResult GetConversation(string loggedEmail,string ConversationType)
        {

            ConversationRepository _repo = new ConversationRepository();
            List<Request> result = new List<Request>(); 

            UserRepository ur = new UserRepository();
            foreach (var value in _repo.ListConversation(((IUser)Session["User"]).EmailAddress, ConversationType))
            {
                var recevicedetails = ur.GetUserDetail(value[0].ToString());
                Request req = new Models.Request();
                req.FirstName = recevicedetails.FirstName;
                req.LastName = recevicedetails.LastName;
                req.EmailAddress = recevicedetails.EmailAddress;
                req.skill = value["skill"].ToString();
                req.ConversationType = value["ConversationType"].ToString();
                if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }

                result.Add(req);
            }
            
            return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetConversationDetails(string senderEmail, string receiverEmail, string ConversationType)
        {

            ConversationRepository _repo = new ConversationRepository();
            var result = _repo.GetConversation(senderEmail, receiverEmail, ConversationType).ToJson();
            return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            //return Content(result);
        }

        public ActionResult getConversationRequest(string ConversationType)
        {
            ConversationRepository _repo = new ConversationRepository();
            //var result = _repo.GetConversationRequest(((IUser)Session["User"]).EmailAddress).ToJson();
            List<Request> result = new List<Request>();

            UserRepository ur = new UserRepository();
            foreach (var value in _repo.GetConversationRequest(((IUser)Session["User"]).EmailAddress,ConversationType))
            {
                IUser recevicedetails = ur.GetUserDetail(value["SenderEmail"].ToString());
                Request req = new Models.Request();
                req.FirstName = recevicedetails.FirstName;
                req.LastName = recevicedetails.LastName;
                req.EmailAddress = recevicedetails.EmailAddress;
                req.skill = value["skill"].ToString();
                req.ConversationType = value["ConversationType"].ToString();
                if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }   
                //req.ConversationType = value["ConversationType"].ToString();
                //recevicedetails.Add(new BsonElement("skill", value["skill"].ToString()));
                //recevicedetails.Add(new BsonElement("ConversationType", value["ConversationType"].ToString()));    
                result.Add(req);
                
            }
            return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            //return Content(result);
        }

        public ActionResult ksConversationDashBoard()
        {
            return View();
        }

        //
        // GET: /Coversation/Create
        //public ActionResult Create(Conversation _obj)
        //{
        //    ConversationRepository _repo = new ConversationRepository();
        //    //KindleSpur.Models.Conversation _obj = new Models.Conversation();
        //    //_obj.SenderEmail = "test@test.com"; // UserId;
        //    //_obj.ReceiverEmail = "vilasmuthal@gmail.com";
        //    //var messageList = selectedArray.Select(x => x.).ToList(); ;
        //    //_obj.Content.AddRange(selectedArray);
        //    //_obj.CreateDate = _obj.UpdateDate = DateTime.Now;

        //    _repo.AddNewConversation(_obj);
        //    return View();
        //}

        //
        // POST: /Coversation/Create
        [HttpPost]
        public ActionResult Create(Conversation _obj, string ReceiverName, string Role)
        {

            try
            {
                //ConversationRepository _repo = new ConversationRepository();
                //_obj.CreateDate = _obj.UpdateDate = DateTime.Now;
                //_repo.AddNewConversation(_obj);

                //return RedirectToAction("Index");

                ConversationRepository _repo = new ConversationRepository();
                _obj.CreateDate = DateTime.Now.ToShortDateString();
                _obj.UpdateDate = DateTime.Now;
                if (_repo.AddNewConversation(_obj))
                {
                    if(_obj.Content == null) {

                        string uri = Request.Url.AbsoluteUri.ToString();
                        string senderName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName + " " + ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                        string subject = "Communication Request from " + senderName;

                        string content = "Hello " + ReceiverName + ",";
                        if (Role == "Coachee")
                            content += "<br/><br/>You have a coaching invite from " + senderName + " for Skill '" + _obj.skill + "'.<br/>";
                        else if (Role == "Mentee")
                            content += "<br/><br/>You have a mentoring invite from " + senderName + " for Topic '" + _obj.skill + "'.<br/>";
                        else
                            content += "<br/><br/>You have a mentoring invite from " + senderName + " for Topic '" + _obj.skill + "'.<br/>";

                        content += "<br/><br/>To accept or decline please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                        content += "<br /><br />Regards, <br/> KindleSpur Team.";
                        EmailNotification.SendConversationEmail(_obj, uri, subject, content);
                        TempData["StatusMessage"] = "Please check your mail to start conversation!!!";
                    }
                }
                else
                {
                    TempData["ErrorMessage"] = "Conversation is already initiated!!!";
                }
                return RedirectToAction("Index");
            }
            catch (Exception Ex)
            {
                throw Ex;

                //return View();
            }
        }

        // POST: Coversation/UpdateConversationStatus
        [HttpPost]
        public void UpdateConversationStatus(Conversation _obj, string ReceiverName, string Role)
        {
            ConversationRepository _repo = new ConversationRepository();
            if (_repo.UpdateConversationStatus(_obj.SenderEmail, _obj.ReceiverEmail, _obj.Content, _obj.IsVerified,_obj.ConversationType))
            {
                string uri = Request.Url.AbsoluteUri.ToString();
                string senderName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName + " " + ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                string subject = "";

                string content = "Hello " + ReceiverName + ",";
                content += "<br/><br/>Congratulations!<br/><br/>";

                if (_obj.IsVerified == true && Role == "Coach")
                {
                    subject = "Coaching invite is accepted by the Coach";
                    content += senderName + "has accepted your coaching request. You can start communicating with your Coach via KindleSpur platform.";
                }
                else if (_obj.IsVerified == false && Role == "Coach")
                {
                    subject = "Coaching invite is declined by the Coach";
                    content += senderName + "has declined your coaching request. You can search for other coaches via KindleSpur.";
                }
                else if (_obj.IsVerified == true && Role == "Mentor")
                {
                    subject = "Mentoring invite is accepted by the Mentor";
                    content += senderName + "has accepted your mentoring request. You can start communicating with your Mentor via KindleSpur platform.";
                }
                else if (_obj.IsVerified == false && Role == "Mentor")
                {
                    subject = "Mentoring invite is declined by the Mentor";
                    content += senderName + "has declined your mentoring request. Search for other mentors via KindleSpur.";
                }
                else
                { 
                    subject = "Request accepted";
                    content += senderName + "has taken action on your request. Search via KindleSpur.";
                }
                
                content += "<br/><br/>Please click on the following link - <a href = '" + uri + "'>" + uri + "</a>";
                content += "<br /><br />Regards, <br/> KindleSpur Team.";
                EmailNotification.SendConversationEmail(_obj, uri, subject, content);
                TempData["StatusMessage"] = "Please check your mail for status of conversation!!!";
            }
        }

        //
        // GET: /Coversation/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Coversation/Edit/5
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

        //
        // GET: /Coversation/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Coversation/Delete/5
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
