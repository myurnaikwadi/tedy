using KindleSpur.Data;
using KindleSpur.Models.Interfaces;
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
        public Boolean SaveTopics(List<string> selectedArray)
        {
            CoachOrMentorRepository _mentorRepo = new CoachOrMentorRepository();

            KindleSpur.Models.CoachOrMentor _obj = new Models.CoachOrMentor();
            _obj.UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            _obj.Role = "Mentor";
            _obj.CreateDate = _obj.UpdateDate = DateTime.Now;
            if (_obj.Topics == null) _obj.Topics = new List<string>();
            _obj.Topics.AddRange(selectedArray);

            _mentorRepo.AddNewCoachOrMentor(_obj);

            return true;
        }
    }
}