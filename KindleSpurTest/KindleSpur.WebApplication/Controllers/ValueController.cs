using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class ValueController : Controller
    {
        private readonly UserRepository _userRepo;
        private readonly string UserId;
        public ValueController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _userRepo = new UserRepository(UserId);
        }

        // GET: Value
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string SaveValueFeedStory(ValueFeedStory story)
        {
            ResponseMessage response = new ResponseMessage();
            if(!_userRepo.SaveValueFeedStory(story))
            {
                 response.FailureCallBack("Unable to create your story");
            }
            return response.ToJson();
        }

        public JsonResult GetValueFeedStories(ValueFeedStorySearch search)
        {
            return this.Json(_userRepo.GetValueFeedStories(search.ImpactZone));
        }
    }
}