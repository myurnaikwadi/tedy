using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using MongoDB.Driver;
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
        private ResponseMessage response;
        private MongoCollection _userCollection;
        private Connection con = new Connection();
        public ResourcesController()
        {
            UserId = ((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress;
            // AddBookMakrs();
            _userCollection = con.GetCollection("UserDetails");

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
                GetFillesAnBookmarks(user, cs, obj);
                return Json(obj);

            }
            catch (Exception)
            {

                return null;
            }




        }

        private static void GetFillesAnBookmarks(User user, ConversationRepository cs, Dictionary<string, object> obj)
        {
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
        }

        [HttpPost]
        public JsonResult UploadFilesForArtiFacts(FileUpload iObj)
        {
            UserRepository _repo = new UserRepository();
            ConversationRepository cs = new ConversationRepository();

            try
            {

                var filess = Request.Files;
                var id = HttpContext.Request.Params["FileId"];
                string[] FilesId = id.Split(',');
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
                        var FileID = FilesId[i];
                        filedata.Add(FileID);
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
                        _repo.uploadResourceFile(UserId, myfiles, listname);
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
                //Dictionary<string, object> obj = new Dictionary<string, object>();
                //User getUser = (User)(_repo.GetUserDetail(UserId));
                //GetFillesAnBookmarks(getUser, cs, obj);
                IUser user = _repo.GetUserDetail(((IUser)System.Web.HttpContext.Current.Session["User"]).EmailAddress);
                var UserRecord = (from x in user.Files select x).ToList();
                return Json(UserRecord);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        public JsonResult AddBookMakrs(User user)
        {



            ConversationRepository cs = new ConversationRepository();
            UserRepository _repo = new UserRepository();

            try
            {
                //  Dictionary<string, object> obj = new Dictionary<string, object>();
                //  User getUser = (User)(_repo.GetUserDetail(UserId));
                //GetFillesAnBookmarks(getUser, cs, obj);

                cs.Bookmarks(UserId, user.BookMarks);
                User book =(User)(_repo.GetUserDetail(UserId));
                var BookRecord = (from x in book.BookMarks select x).ToList();
                return Json(BookRecord);


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        public JsonResult DeleteFiles(List<Models.FileUpload> Obj)
        {
            UserRepository user = new UserRepository();
            ConversationRepository cs = new ConversationRepository();
            //User getUser = (User)(user.GetUserDetail(UserId));
            try
            {
                if (Obj != null)
                {
                    //foreach (var list2 in Obj)
                    //{
                    //    if (list2.FileId == null)
                    //    {
                    //        foreach (var fileid in getUser.Files.Where(w => w.FileId == list2.FileId))
                    //        {
                    //            list2.FileId = fileid.FileId;
                    //        }

                    //    }


                    //}
                    user.DeleteResourceFiles(Obj, UserId);
                }

            }
            catch (Exception ex)
            {

                response.FailureCallBack(ex.Message);
            }
            return Json(user);
        }
        [HttpPost]
        public JsonResult DeleteBookmarks(List<Models.BookMark> Obj)
        {
            UserRepository user = new UserRepository();
            ConversationRepository cs = new ConversationRepository();
            User getUser = (User)(user.GetUserDetail(UserId));

            try
            {
                if (Obj != null)
                    user.DeleteBookMarks(Obj, UserId);



            }
            catch (Exception ex)
            {

                response.FailureCallBack(ex.Message);
            }
            return Json(user);
        }



    }
}