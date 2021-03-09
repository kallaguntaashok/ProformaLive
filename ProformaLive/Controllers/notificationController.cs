using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProformaLive.Controllers
{
    [AllowAnonymous]
    public class notificationController : Controller
    {
        private ProformaLiveEntities db;
        // GET: notification

        public notificationController()
        {
            db = new ProformaLiveEntities();
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult update_notification(objdata obj)
        {
            db.SP_Insert_Notification(obj.intID, obj.strTitle, obj.strNotificationdata, obj.stringStatus, obj.strUser);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete_notification(int intID)
        {
            NotificationPanel row = db.NotificationPanels.Where(x => x.Sysid == intID).SingleOrDefault();
            db.NotificationPanels.Remove(row);
            db.SaveChanges();            
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult validate_notification(string strUserID)
        {
            var obj = db.SP_Validate_Notification(strUserID);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult clear_notification(int intID, string strUserID, string strUserName)
        {
            Notification_Log obj = new Notification_Log();
            obj.UserID = strUserID;
            obj.NotificationID = intID;
            obj.UserName = strUserName;
            obj.CreatedOn = DateTime.Now;
            db.Notification_Log.Add(obj);
            db.SaveChanges();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult get_notification()
        {
            var obj = db.SP_GET_Notification().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult get_completenotification()
        {
            var npData = db.SP_GET_CompleteNotificationData().ToList();
            return Json(npData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_notificationdata(int intID)
        {
            var npData = db.SP_GET_NotificationData(intID).ToList();
            return Json(npData, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UploadImage(HttpPostedFileBase upload, string CKEditorFuncNum, string CKEditor, string langCode)
        {
            string url; // url to return
            string message; // message to display (optional)

            // path of the image
            string path = Server.MapPath("~/upload");

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            // here logic to upload image
            string ImageName = Guid.NewGuid() + Path.GetExtension(upload.FileName);            
            upload.SaveAs(System.IO.Path.Combine(path, ImageName));

            // and get file path of the image
            // will create http://localhost:9999/Content/Images/Uploads/ImageName.jpg
            url = Request.Url.GetLeftPart(UriPartial.Authority) + "/upload/" + ImageName;

            // passing message success/failure
            message = "Image was saved correctly";

            // since it is an ajax request it requires this string
            string output = @"<html><body><script>window.parent.CKEDITOR.tools.callFunction(" + CKEditorFuncNum + ", \"" + url + "\", \"" + message + "\");</script></body></html>";
            return Content(output);
        }

        public class objdata
        {
            public int intID { get; set; }
            public string strTitle { get; set; }
            public string strNotificationdata { get; set; }
            public string strUser { get; set; }
            public string stringStatus { get; set; }
        }

    }
}