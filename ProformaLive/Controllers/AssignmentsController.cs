using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProformaLive.Controllers
{
    public class AssignmentsController : Controller
    {
        private ProformaLiveEntities db;
        public AssignmentsController()
        {
            db = new ProformaLiveEntities();
        }

        // GET: Assignments
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult getfisyear()
        {
            var obj = db.SP_Get_Year().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getTeams()
        {
            var obj = db.Configure_Skill.Select(x => x.Team).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getassignmentdata(int intFisYear, string strTeam)
        {
            var obj = db.SP_Get_Assignments(intFisYear, strTeam).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }
    }
}