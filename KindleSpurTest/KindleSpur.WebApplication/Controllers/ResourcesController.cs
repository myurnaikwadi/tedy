using KindleSpur.Data;
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
            try
            {
                Dictionary<string, object> obj = new Dictionary<string, object>();
                var files = cs.getFiles(user.EmailAddress);
                var bookmark = cs.getFilesBookmarks(user.EmailAddress);
                if (files != null)
                {
                    List<FileUpload> listfile = new List<FileUpload>();
                    foreach (var i in files)

                        listfile.Add(i);
                    obj.Add("Artifacts", listfile);

                }
                if (bookmark != null)
                {
                    List<BookMark> listbookmark = new List<BookMark>();
                    foreach (var e in bookmark)
                        listbookmark.Add(e);

                    obj.Add("Bookmarks", listbookmark);
                }
                return Json(obj);

            }
            catch (Exception)
            {

                return null;
            }
            



        }
        [HttpPost]
        public JsonResult UploadFilesForArtiFacts(FileUpload model)
        {
            UserRepository _repo = new UserRepository();

            try
            {
                var filess = Request.Files;
                Dictionary<int, List<string>> listname = new Dictionary<int, List<string>>();
                if (filess.Count > 0)
                {

                    object[] myfiles = new object[filess.Count];


                    for (int i = 0; i < filess.Count; i++)
                    {
                        List<string> filedata = new List<string>();
                        var postfile = filess[i];
                        var fileName = Path.GetFileName(postfile.FileName);
                        var contenttype = postfile.ContentType;
                        var Filesize = postfile.ContentLength;
                        //filedata is must  add 0 th index fileName
                        filedata.Add(fileName);
                        //filedata is must  add 1 th index contenttype
                        filedata.Add(contenttype);
                        //filedata is must  add 2 th index Filesize
                        filedata.Add(Filesize.ToString());
                        //Cannot change Sequence
                        listname.Add(i, filedata);
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
            catch (Exception)
            {

                throw;
            }

            



           
        }

        [HttpPost]
        public JsonResult AddBookMakrs(User user)
        {
           


            ConversationRepository cs = new ConversationRepository();
            try
            {
                return Json(cs.Bookmarks(UserId,user.BookMarks));

            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public JsonResult DeleteFiles(List<Models.FileUpload> Obj)
        {
            UserRepository user = new UserRepository();
            try
            {
                return Json(user.DeleteResourceFiles(Obj, UserId));

            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public JsonResult DeleteBookmarks(List<Models.BookMark> Obj)
        {
            UserRepository user = new UserRepository();
            try
            {
                return Json(user.DeleteBookMarks(Obj, UserId));

            }
            catch (Exception)
            {

                throw;
            }
        }



    }
}