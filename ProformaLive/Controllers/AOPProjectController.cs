using ProformaLive.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ProformaLive.Authorization.AuthorizeADAttribute;

namespace ProformaLive.Controllers
{
    [Authorize]
    public class AOPProjectController : Controller
    {

        private ProformaLiveEntities db;
        public AOPProjectController()
        {
            db = new ProformaLiveEntities();
        }

        // GET: AOPProject
        public ActionResult Index()
        {
            //Session["CurrentPage"] = 3;
            return View();
        }

        [HttpGet]
        [AuthorizeAD(Groups = Constants.PAdmin)]
        public JsonResult getAOPProject()
        {
            try
            {
                var obj = db.SP_Get_Master_AOPProject().ToList();
                return Json(new { Message = obj, responseCode = 200 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
                return Json(new { Message = "error in the system: (" + Ex.Message + ")", responseCode = 404 }, JsonRequestBehavior.AllowGet);
            }           
        }

        public class objsubmit
        {
            public List<SP_Get_Master_AOPProject_Result> update { get; set; }
            public List<SP_Get_Master_AOPProject_Result> delete { get; set; }
        }

        [HttpPost]
        public JsonResult submitchanges(objsubmit obj)
        {          

            if (obj.update != null)
            {
                foreach (var item in obj.update)
                {
                    if (item.Sysid == 0)
                    {
                        Master_AOPProject row = new Master_AOPProject();
                        row.Name = item.Name;
                        db.Master_AOPProject.Add(row);
                        db.SaveChanges();
                    }
                    else
                    {
                        Master_AOPProject row = db.Master_AOPProject.Single(x => x.Sysid == item.Sysid);
                        row.Name = item.Name;
                        db.SaveChanges();
                    }
                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    if (item.Sysid != 0)
                    {
                        Master_AOPProject row = db.Master_AOPProject.Single(x => x.Sysid == item.Sysid);
                        db.Master_AOPProject.Remove(row);
                        db.SaveChanges();
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }
    }
}