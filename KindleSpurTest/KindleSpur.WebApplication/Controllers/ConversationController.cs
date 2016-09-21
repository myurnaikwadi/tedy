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
using MongoDB.Driver.Builders;

namespace KindleSpur.WebApplication.Controllers
{
    public class ConversationController : Controller
    {
        private readonly string UserId;
        Connection con = new Connection();
        public ConversationController()
        {
            //UserId = ((IUser)Session["User"]).EmailAddress;
        }
        //
        // GET: /Coversation/
        public ActionResult Index()
        {
            ConversationRepository _repo = new ConversationRepository();
           _repo.ListConversationForSender(((IUser)Session["User"]).EmailAddress, "Coaching", "Coachee");
           _repo.ListConversationForReceiver(((IUser)Session["User"]).EmailAddress, "Coaching", "Coach");
            return View();
        }

        //
        // GET: /Coversation/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }
        public ActionResult ksMeetingSchdule()
        {
            return View();
        }
        //public ActionResult GetConversation(string loggedEmail)
        //{
        //    ConversationRepository _repo = new ConversationRepository();
        //    var result = _repo.ListConversation(((IUser)Session["User"]).EmailAddress).ToJson();
        //    return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
        //}


        //Coachee or Mentee list in the communication window
        public ActionResult GetConversationForSender(string loggedEmail, string ConversationType, string role)
        {
            try
            {
                ConversationRepository _repo = new ConversationRepository();
                List<Request> result = new List<Request>();

                UserRepository ur = new UserRepository();
                foreach (var value in _repo.ListConversationForSender(((IUser)Session["User"]).EmailAddress, ConversationType, role))
                {
                    var recevicedetails = ur.GetUserDetail(value[0].ToString());
                    Request req = new Models.Request();
                    req.FirstName = recevicedetails.FirstName;
                    req.LastName = recevicedetails.LastName;
                    req.EmailAddress = recevicedetails.EmailAddress;
                    req.Photo = recevicedetails.Photo;
                    if (req.EmailAddress == loggedEmail)
                    {
                        User swapUserDetails = (User)ur.GetUserDetail(value["ReceiverEmail"].ToString());
                        req.Photo = swapUserDetails.Photo;
                        req.FirstName = swapUserDetails.FirstName;
                        req.LastName = swapUserDetails.LastName;
                    }
                   
                    req.SenderEmail = value["SenderEmail"].ToString();
                    req.ReceiverEmail = value["ReceiverEmail"].ToString();
                    req.skill = value["skill"].ToString();
                    req.ConversationType = value["ConversationType"].ToString();
                    if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                    if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }

                    result.Add(req);
                }
                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return View("Error");
            }



        }

        public ActionResult ListConversationForReceiver(string loggedEmail, string ConversationType, string role)
        {
            try
            {
               
                ConversationRepository _repo = new ConversationRepository();
                List<Request> result = new List<Request>();

                UserRepository ur = new UserRepository();
                foreach (var value in _repo.ListConversationForReceiver(((IUser)Session["User"]).EmailAddress, ConversationType, role))
                {
                    var recevicedetails = ur.GetUserDetail(value[0].ToString());
                    Request req = new Models.Request();
                    req.FirstName = recevicedetails.FirstName;
                    req.LastName = recevicedetails.LastName;
                    req.EmailAddress = recevicedetails.EmailAddress;
                    req.Photo = recevicedetails.Photo;
                    req.SenderEmail = value["SenderEmail"].ToString();
                    req.ReceiverEmail = value["ReceiverEmail"].ToString();
                    req.skill = value["skill"].ToString();
                    req.ConversationType = value["ConversationType"].ToString();
                    if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                    if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }

                    result.Add(req);
                }

                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return View("Error");
            }


        }

        //This method is used to retrieve the chat
        public ActionResult GetConversationDetails(string ParentId, string ConversationType, string Role)
        {
            try
            {

                ConversationRepository _repo = new ConversationRepository();
                var result = _repo.GetConversation(ParentId, ConversationType, Role, ((IUser)Session["User"]).EmailAddress).ToJson();
                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return View("Error");
            }

            //return Content(result);
        }
        public ActionResult getAllConversationRequest(string conversationType)
        {
            ConversationRepository _repo = new ConversationRepository();
            //var result = _repo.GetConversationRequest(((IUser)Session["User"]).EmailAddress).ToJson();
            List<Request> result = new List<Request>();

            UserRepository ur = new UserRepository();
            try
            {
                foreach (var value in _repo.GetAllConversationRequest(((IUser)Session["User"]).EmailAddress))
                {
                    IUser recevicedetails = ur.GetUserDetail(value["SenderEmail"].ToString());
                    Request req = new Models.Request();
                    req.FirstName = recevicedetails.FirstName;
                    req.LastName = recevicedetails.LastName;
                    req.EmailAddress = recevicedetails.EmailAddress;
                    req.skill = value["skill"].ToString();
                    req.SenderEmail = value["SenderEmail"].ToString();
                    req.ReceiverEmail = value["ReceiverEmail"].ToString();
                    req.ConversationType = value["ConversationType"].ToString();
                    string date = value["CreateDate"].ToString();
                    if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                    if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }
                    //req.ConversationType = value["ConversationType"].ToString();
                    //recevicedetails.Add(new BsonElement("skill", value["skill"].ToString()));
                    //recevicedetails.Add(new BsonElement("ConversationType", value["ConversationType"].ToString()));    
                    req.CreateDate = DateTime.Parse(date);
                    result.Add(req);

                }
                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
                //return Content(result);
            }
            catch (Exception)
            {

                return View("Error");
            }

        }
        public ActionResult getConversationRequest(string ConversationType)
        {
            ConversationRepository _repo = new ConversationRepository();
            //var result = _repo.GetConversationRequest(((IUser)Session["User"]).EmailAddress).ToJson();
            List<Request> result = new List<Request>();

            UserRepository ur = new UserRepository();
            try
            {
                foreach (var value in _repo.GetConversationRequest(((IUser)Session["User"]).EmailAddress, ConversationType))
                {
                    IUser recevicedetails = ur.GetUserDetail(value["SenderEmail"].ToString());
                    Request req = new Models.Request();
                    req.FirstName = recevicedetails.FirstName;
                    req.LastName = recevicedetails.LastName;
                    req.EmailAddress = recevicedetails.EmailAddress;
                    req.skill = value["skill"].ToString();
                    req.SenderEmail = value["SenderEmail"].ToString();
                    req.ReceiverEmail = value["ReceiverEmail"].ToString();
                    req.ConversationType = value["ConversationType"].ToString();
                    string date = value["CreateDate"].ToString();
                   
                    if (value["ConversationId"] == null) { req.ConversationId = null; } else { req.ConversationId = value["ConversationId"].ToString(); }
                    if (value["ConversationParentId"] == null) { req.ConversationParentId = null; } else { req.ConversationParentId = value["ConversationParentId"].ToString(); }
                    //req.ConversationType = value["ConversationType"].ToString();
                    //recevicedetails.Add(new BsonElement("skill", value["skill"].ToString()));
                    //recevicedetails.Add(new BsonElement("ConversationType", value["ConversationType"].ToString()));   
                    req.CreateDate = DateTime.Parse(date); 
                    result.Add(req);

                }
                return Json(new { Result = result }, JsonRequestBehavior.AllowGet);
                //return Content(result);
            }
            catch (Exception)
            {

                return View("Error");
            }

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
        public JsonResult MentoringCoachingInvite(Conversation _obj, string receiverName, string role)
        {
            ResponseMessage response = new ResponseMessage();
            UserRepository userRepo = new UserRepository();
            //var _conversationCollection = con.GetCollection("Conversations");
            //  var userDetail = _conversationCollection.FindOneAs<Conversation>(Query.EQ("_id", _obj.Id));
            try
            {
                User receiverUserDetails = (User)userRepo.GetUserDetail(_obj.ReceiverEmail);
                ConversationRepository _repo = new ConversationRepository();

                List<ResourceFileLink> resourcelist = new List<ResourceFileLink>();
                if (_obj.FilesURLlink != null)
                {

                    foreach (var file in _obj.FilesURLlink)
                    {
                        ResourceFileLink link = new ResourceFileLink();
                       // link.Id = ObjectId.GenerateNewId();
                        link.FileId = Guid.NewGuid().ToString();
                        link.FileName = file.FileName;
                        link.FilePath = file.FilePath;
                        link.Filesize = file.Filesize;
                        link.ContentType = file.ContentType;
                        resourcelist.Add(link);
                    }


                    if (_obj.FilesURLlink == null)
                        _obj.FilesURLlink = new List<ResourceFileLink>();

                    _obj.FilesURLlink.Clear();
                    _obj.FilesURLlink.AddRange(resourcelist.ToList());
                    // _conversationCollection.Save(userDetail);
                }


                _obj.CreateDate = DateTime.Now.ToShortDateString();
                _obj.UpdateDate = DateTime.Now;
               
                if (_repo.AddNewInvite(_obj))
                {
                    if (_obj.Content == null)
                    {
                        string senderFirstName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName;
                        string senderLastName = ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                        string uri = Request.Url.AbsoluteUri.ToString();
                        var list = new List<KeyValuePair<string, string>>()
                        {
                            new KeyValuePair<string, string>("SenderFirstName", senderFirstName),
                            new KeyValuePair<string, string>("SenderLastName", senderLastName),
                            new KeyValuePair<string, string>("ReceiverName", receiverUserDetails.FirstName),
                            new KeyValuePair<string, string>("Uri", uri),
                            new KeyValuePair<string, string>("Role",role),
                        };
                        EmailNotification.MentoringCoachingInviteEmail(_obj, list);
                        TempData["StatusMessage"] = "Please check your mail to start conversation!!!";
                    }
                    else
                    {
                        if (role == "Coachee")
                            response.FailureCallBack("Request pending with Coach!!!");
                        else if (role == "Mentee")
                            response.FailureCallBack("Request pending with Mentor!!!");
                    }
                }
                else
                {
                    if (role == "Coachee")
                        response.FailureCallBack("Request already sent to Coach!!!");
                    else if (role == "Mentee")
                        response.FailureCallBack("Request already sent to Mentor!!!");
                }
            }
            catch (Exception Ex)
            {

                //return View();
            }
            return this.Json(response);
        }

        [HttpPost]
        public JsonResult ConversationExchanged(Conversation _obj, string receiverName, string role)
        {
            ResponseMessage response = new ResponseMessage();
            UserRepository userRepo = new UserRepository();
            //var _conversationCollection = con.GetCollection("Conversations");
            //  var userDetail = _conversationCollection.FindOneAs<Conversation>(Query.EQ("_id", _obj.Id));
            try
            {
                User receiverUserDetails = (User)userRepo.GetUserDetail(_obj.ReceiverEmail);
                ConversationRepository _repo = new ConversationRepository();

                List<ResourceFileLink> resourcelist = new List<ResourceFileLink>();
                if (_obj.FilesURLlink != null)
                {

                    foreach (var file in _obj.FilesURLlink)
                    {
                        ResourceFileLink link = new ResourceFileLink();
                        // link.Id = ObjectId.GenerateNewId();
                        link.FileId =file.FileId;
                        link.FileName = file.FileName;
                        link.FilePath = file.FilePath;
                        link.Filesize = file.Filesize;
                        link.ContentType = file.ContentType;
                        resourcelist.Add(link);
                    }


                    if (_obj.FilesURLlink == null)
                        _obj.FilesURLlink = new List<ResourceFileLink>();

                    _obj.FilesURLlink.Clear();
                    _obj.FilesURLlink.AddRange(resourcelist.ToList());
                    
                }


                _obj.CreateDate = DateTime.Now.ToShortDateString();
                _obj.UpdateDate = DateTime.Now;

                bool transactionStatus = _repo.AddNewConversation(_obj, role);
            }
            catch (Exception Ex)
            {

            }
            return this.Json(response);
        }

        // POST: Coversation/UpdateConversationStatus
        [HttpPost]
        public bool CoachingMentoringInvite(Conversation _obj, string ReceiverName, string Role)
       {
            ResponseMessage response = new ResponseMessage();
            UserRepository userRepo = new UserRepository();
            ConversationRepository _repo = new ConversationRepository();
            bool emailStatus = true;
            try
            {
                User receiverUserDetails = (User)userRepo.GetUserDetail(_obj.ReceiverEmail);
                if (_repo.UpdateConversationStatus(_obj.SenderEmail, _obj.ReceiverEmail, _obj.Content, _obj.IsVerified,_obj.IsRejected, _obj.ConversationType, _obj.ConversationParentId, _obj.skill))
                {
                    string senderFirstName = ((IUser)System.Web.HttpContext.Current.Session["User"]).FirstName;
                    string senderLastName = ((IUser)System.Web.HttpContext.Current.Session["User"]).LastName;
                    string uri = Request.Url.AbsoluteUri.ToString();
                    var list = new List<KeyValuePair<string, string>>()
                        {
                            new KeyValuePair<string, string>("SenderFirstName", senderFirstName),
                            new KeyValuePair<string, string>("SenderLastName", senderLastName),
                            new KeyValuePair<string, string>("ReceiverName", receiverUserDetails.FirstName),
                            new KeyValuePair<string, string>("Uri", uri),
                            new KeyValuePair<string, string>("Role",_obj.ConversationType),
                        };
                    emailStatus = EmailNotification.MentoringCoachingAcceptDeclineEmail(_obj, list);
                    TempData["StatusMessage"] = "Please check your mail for status of conversation!!!";
                }
            }
            catch (Exception ex)
            {
                throw;
                // return View("Error");
            }
            return emailStatus;
        }

     
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
                return View("Error");
            }
        }

        //
        // GET: /Coversation/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }


     
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }

            catch (Exception ex)
            {
                return View("Error");
            }
            finally
            {

            }
        }
    }
}
