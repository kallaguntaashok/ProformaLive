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
    public class RateCardController : Controller
    {
        private ProformaLiveEntities db;
        public RateCardController()
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
        public JsonResult getRateCard()
        {
            try
            {
                var obj = db.SP_Get_Configure_RateCard().ToList();
                return Json(new { Message = obj, responseCode = 200 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
                return Json(new { Message = "error in the system: (" + Ex.Message + ")", responseCode = 404 }, JsonRequestBehavior.AllowGet);
            }
        }

        public class objsubmit
        {
            public List<SP_Get_Configure_RateCard_Result> update { get; set; }
            public List<SP_Get_Configure_RateCard_Result> delete { get; set; }
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
                        Configure_RateCard row = new Configure_RateCard();
                        row.FisYear = item.FisYear;
                        row.FisMonth = item.FisMonth;
                        row.MonthlyProjectLaborRate = item.MonthlyProjectLaborRate;
                        row.MidOrg = item.MidOrg;
                        db.Configure_RateCard.Add(row);
                        db.SaveChanges();
                    }
                    else
                    {
                        Configure_RateCard row = db.Configure_RateCard.Single(x => x.Sysid == item.Sysid);
                        row.FisYear = item.FisYear;
                        row.FisMonth = item.FisMonth;
                        row.MonthlyProjectLaborRate = item.MonthlyProjectLaborRate;
                        row.MidOrg = item.MidOrg;
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
                        Configure_RateCard row = db.Configure_RateCard.Single(x => x.Sysid == item.Sysid);
                        db.Configure_RateCard.Remove(row);
                        db.SaveChanges();
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }
    }
}