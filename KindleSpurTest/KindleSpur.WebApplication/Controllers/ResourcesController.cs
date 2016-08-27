using KindleSpur.Data;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
            //UploadFilesForArtiFacts();
        }
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult UploadFilesForArtiFacts(HttpPostedFileBase model)
        {
            UserRepository _repo = new UserRepository();
            try
            {
                var allowedExtensions = new[] {
                    ".Jpg", ".png", ".jpg", "jpeg",".doc",".pdf",".txt"
                };
                var filess = Request.Files;
                if (filess.Count > 0)
                {
                    object[] myfiles = new object[filess.Count];

                    List<FileUpload> list = new List<FileUpload>();
                    for (int i = 0; i < filess.Count; i++)
                    {
                        var postfile = filess[i];
                        var fileName = Path.GetFileName(postfile.FileName);

                        var ext = Path.GetExtension(postfile.FileName);

                        string name = Path.GetFileNameWithoutExtension(fileName);
                        myfiles[i] = name + ext;

                        postfile.SaveAs(Path.Combine(Server.MapPath("~/FilePath"), myfiles[i].ToString()));
                    }
                    if (myfiles != null)
                    {
                        _repo.uploadResourceFile(UserId, myfiles);
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




    }
}