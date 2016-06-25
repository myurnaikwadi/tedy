﻿using KindleSpur.Data;
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
    public class MentorController : Controller
    {
        [HttpPost]
        public Boolean SaveTopics(List<Skill> selectedArray)
        {
            CoachOrMentorRepository _mentorRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _obj.Role = "Mentor";
            _obj.CreateDate = _obj.UpdateDate = DateTime.Now;
            if (_obj.Topics == null) _obj.Topics = new List<string>();

            var topicsList = selectedArray.Select(x => x.Name).ToList();
           _obj.Topics.AddRange(topicsList);

            _mentorRepo.AddNewCoachOrMentor(_obj);

            return true;
        }

        public string GetTopics()
        {

            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();
            string UserId = ((IUser)Session["User"]).EmailAddress;

            List<string> topics = _coachRepo.GetTopicsForMentor(UserId);
            CTSRepository _ctsRepo = new CTSRepository();
            BsonDocument doc = new BsonDocument();
            BsonArray arr = new BsonArray();
            foreach (string topic in topics)
            {

                BsonDocument result = _ctsRepo.GetMentorCategory(topic);
                arr.Add(result);

            }
            doc.Add("Categories", arr);
            return doc.ToJson();
        }
    }
}