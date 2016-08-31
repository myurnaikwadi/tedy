﻿using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace KindleSpur.WebApplication.Controllers
{
    public class ResourcesController : Controller
    {
        // GET: Resources
        readonly string UserId;
        public ResourcesController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
             // AddBookMakrs();

        }
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult getAlllFilesAndBookmarks(User user)
        {
            ConversationRepository cs = new ConversationRepository();
            Dictionary<string,object> obj = new Dictionary<string, object>();
            var files = cs.getFiles(user.EmailAddress);
            var bookmark = cs.getFilesBookmarks(user.EmailAddress);
            if (files != null)
            {
                List<FileUpload> listfile = new List<FileUpload>();
                foreach (var i in files)

                    listfile.Add(i);
                obj.Add("Artifacts",listfile);

            }
            if (bookmark != null)
            {
                List<BookMark> listbookmark = new List<BookMark>();
                foreach (var e in bookmark)
                    listbookmark.Add(e);

                obj.Add("Bookmarks",listbookmark);
            }


            return Json(obj);

        }
        [HttpPost]
        public JsonResult UploadFilesForArtiFacts(FileUpload model)
        {
            UserRepository _repo = new UserRepository();



            var filess = Request.Files;
            Dictionary<int, string> listname = new Dictionary<int, string>();
            if (filess.Count > 0)
            {
                object[] myfiles = new object[filess.Count];


                for (int i = 0; i < filess.Count; i++)
                {
                    var postfile = filess[i];
                    var fileName = Path.GetFileName(postfile.FileName);

                    listname.Add(i, fileName);
                    var ext = Path.GetExtension(postfile.FileName);

                    string name = Path.GetFileNameWithoutExtension(fileName.ToString());
                    myfiles[i] = name + ext;

                    postfile.SaveAs(Path.Combine(Server.MapPath("~/FilePath"), myfiles[i].ToString()));
                }
                if (myfiles != null)
                {
                    _repo.uploadResourceFile(UserId, myfiles, model.TagName, listname);
                }
                else
                {
                    ViewBag.message = "Please choose only Image file";
                }
            }
            else
            {
                ViewBag.message = "Please choose  file";
            }



            IUser user = _repo.GetUserDetail(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress);
            return Json(user);
        }
        [HttpPost]
        public JsonResult AddBookMakrs(string LinkUrl, string DocumnetName, string tagname)
        {
            //hardcoded value
            //string LinkUrl = "www.fb.co.in";
            //string DocumnetName = "MyPAge23";
            //string tagname = "#";


            ConversationRepository cs = new ConversationRepository();

            return Json(cs.Bookmarks(UserId, DocumnetName, LinkUrl, tagname));
        }
        [HttpPost]
        public JsonResult DeketeFiles(List<FileUpload> Obj)
        {
            UserRepository user = new UserRepository();
            return Json(user.DeleteResourceFiles(Obj));
        }
        [HttpPost]
        public JsonResult DeketeBookmarks(List<BookMark> Obj)
        {
            UserRepository user = new UserRepository();
            return Json(user.DeleteBookMarks(Obj));
        }



    }
}