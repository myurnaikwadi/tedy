using KindleSpur.Data;
using KindleSpur.Models.Interfaces;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class CoachController : Controller
    {
       
        [HttpPost]
        public Boolean SaveSkills(List<string> selectedArray)
        {
            CTSRepository _ctsRepo = new CTSRepository();
            CoachOrMentorRepository _coachRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _obj.Role = "Coach";
            _obj.CreateDate = _obj.UpdateDate= DateTime.Now;
            if (_obj.Skills == null) _obj.Skills = new List<string>();
            _obj.Skills.AddRange(selectedArray);

            _coachRepo.AddNewCoachOrMentor(_obj);

            return true;
        }
    }
}