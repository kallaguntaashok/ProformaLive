using ProformaLive;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Configuration;
using System.Security.Principal;
using ProformaLive.Authorization;
using static ProformaLive.Authorization.AuthorizeADAttribute;

namespace MECC_ReportPortal.Controllers
{
    [Authorize]
    public class ProjectsController : Controller
    {
        private ProformaLiveEntities db;
        public ProjectsController()
        {
            db = new ProformaLiveEntities();
        }
        // GET: Projects
        public ActionResult Index()
        {
            //Session["CurrentPage"] = 3;
            return View();
        }

        [HttpGet]
        public ActionResult validateLogin()
        {
            if (Session["username"] == null)
            {
                if (User.Identity.IsAuthenticated)
                {
                    string userID = User.Identity.Name;
                    string username = GetUserFromLdap(userID);
                    Session["username"] = username;
                    Session["userid"] = userID.Replace("ENT\\", "");
                    return Json(username, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("invalid user", JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(Convert.ToString(Session["username"]), JsonRequestBehavior.AllowGet);
            }
        }

        public class objclone
        {
            public List<SP_Config_Projects_Result> clone { get; set; }
            public string ID { get; set; }
            public string Name { get; set; }

        }

        [HttpPost]
        public JsonResult cloneproformaproject_fromproforma(string strNewProjectName, string strNewProjectID)
        {
            string strProjectName = Convert.ToString(Session["ProjectName"]);
            var projectid = db.Configure_Project
                .Where(x => x.ProjectName == strProjectName)
                .Select(y => y.ProjectID).ToList();

            string userid = Convert.ToString(Session["userid"]);
            if (projectid.Count > 0)
            {
                db.SP_Clone_Proforma(Convert.ToInt32(projectid[0]), strNewProjectID, strNewProjectName, userid);
            }

            return Json("cloning has been done successfully!", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult cloneproformaproject(objclone obj)
        {
            string userid = Convert.ToString(Session["userid"]);

            if (obj.clone != null)
            {
                foreach (var item in obj.clone)
                {
                    db.SP_Clone_Proforma(item.ProjectID, obj.ID, obj.Name, userid);
                }
            }

            return Json("cloning has been done successfully!", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult validateuser(string strUserID)
        {
            string username = GetUserFromLdap(strUserID);
            return Json(username, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AuthorizeAD(Groups = Constants.PAdmin)]
        public JsonResult getProjects()
        {
            try
            {
                var obj = db.SP_Config_Projects().ToList();
                return Json(new { Message = obj, responseCode = 200 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
                return Json(new { Message = "error in the system: (" + Ex.Message + ")", responseCode = 404 }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult updatemasterdata(string strtype, string strvalue)
        {
            Temp_ProjectMaster tp = new Temp_ProjectMaster();
            tp.Type = strtype;
            tp.Value = strvalue;
            db.Temp_ProjectMaster.Add(tp);
            db.SaveChanges();
            return Json("success", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getCapitalGRPType()
        {
            var obj = db.SP_Config_Projects_CapitalGRPType().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getFunded()
        {
            var obj = db.SP_Config_Projects_Funded().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getInPLAN()
        {
            var obj = db.SP_Config_Projects_InPLAN().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getParentChild()
        {
            var obj = db.SP_Config_Projects_ParentChild().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getProjectCategory()
        {
            var obj = db.SP_Config_Projects_ProjectCategory().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult submitchanges(objsubmit obj)
        {
            string userID = Convert.ToString(Session["userid"]);

            if (obj.update != null)
            {
                var projectdata = obj.update;

                var subquery = projectdata.Select(y => new { ProjectNumber = y.ProjectNumber, ProjectName = y.ProjectNumber }).ToList();
                var query = subquery.GroupBy(x => x.ProjectNumber)
                            .Where(g => g.Count() > 1)
                            .Select(y => new { Element = y.Key, Counter = y.Count() })
                            .ToList();

                if (projectdata.Select(x => x.ProjectNumber).Distinct().Count() != projectdata.Count)
                {
                    string strDuplicateString = "";
                    foreach (var item in query)
                    {
                        strDuplicateString = strDuplicateString + "," + item.Element;
                    }

                    return Json(new { Message = strDuplicateString.Substring(1) + " - Project number already used, please enter different project number", responseCode = 404 }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    foreach (var item in obj.update)
                    {
                        if (item.ProjectID == 0)
                        {
                            Configure_Project row = new Configure_Project();
                            row.ProjectName = item.ProjectName;
                            row.ProjectNumber = item.ProjectNumber;
                            row.PMNetworkID = item.PMNetworkID;
                            row.PMName = GetUserFromLdap(item.PMNetworkID);
                            row.ProjectCategory = item.ProjectCategory;
                            row.ParentChild = item.ParentChild;
                            row.WBSElement = item.WBSElement;
                            row.CapitalExpenditureWBS = item.CapitalExpenditureWBS;
                            row.GPSProjectNumber = item.GPSProjectNumber;
                            row.Program = item.Program;
                            row.BusinessUnit = item.BusinessUnit;
                            row.PeriodBurdenExpense = item.PeriodBurdenExpense;
                            row.SettlementCostCenter = item.SettlementCostCenter;
                            row.SettlementCostCenterName = item.SettlementCostCenterName;
                            row.SettlemnetSummary = item.SettlemnetSummary;
                            row.EndingBusinessUnit = item.EndingBusinessUnit;
                            row.FundingSource = item.FundingSource;
                            row.SourceCard = item.SourceCard;
                            row.InPLAN = item.InPLAN;
                            row.Function = item.Function;
                            row.CapitalGRPType = item.CapitalGRPType;
                            row.Funded = item.Funded;
                            row.PercentFunded = item.PercentFunded;
                            row.PCTPropabiltyFunded = item.PCTPropabiltyFunded;
                            row.CreatedBy = userID;
                            row.CreatedOn = DateTime.Now.Date;
                            db.Configure_Project.Add(row);
                            db.SaveChanges();
                        }
                        else
                        {
                            Configure_Project row = db.Configure_Project.Single(x => x.ProjectID == item.ProjectID);
                            row.ProjectName = item.ProjectName;
                            row.ProjectNumber = item.ProjectNumber;
                            row.PMNetworkID = item.PMNetworkID;
                            row.PMName = GetUserFromLdap(item.PMNetworkID);
                            row.ProjectCategory = item.ProjectCategory;
                            row.ParentChild = item.ParentChild;
                            row.WBSElement = item.WBSElement;
                            row.CapitalExpenditureWBS = item.CapitalExpenditureWBS;
                            row.GPSProjectNumber = item.GPSProjectNumber;
                            row.Program = item.Program;
                            row.BusinessUnit = item.BusinessUnit;
                            row.PeriodBurdenExpense = item.PeriodBurdenExpense;
                            row.SettlementCostCenter = item.SettlementCostCenter;
                            row.SettlementCostCenterName = item.SettlementCostCenterName;
                            row.SettlemnetSummary = item.SettlemnetSummary;
                            row.EndingBusinessUnit = item.EndingBusinessUnit;
                            row.FundingSource = item.FundingSource;
                            row.SourceCard = item.SourceCard;
                            row.InPLAN = item.InPLAN;
                            row.Function = item.Function;
                            row.CapitalGRPType = item.CapitalGRPType;
                            row.Funded = item.Funded;
                            row.PercentFunded = item.PercentFunded;
                            row.PCTPropabiltyFunded = item.PCTPropabiltyFunded;
                            row.CreatedBy = item.CreatedBy;
                            row.CreatedOn = item.CreatedOn;
                            row.ModifiedBy = userID;
                            row.ModifiedOn = DateTime.Now.Date;
                            db.SaveChanges();
                        }
                    }
                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    Configure_Project row = db.Configure_Project.Single(x => x.ProjectID == item.ProjectID);
                    db.Configure_Project.Remove(row);
                    db.SaveChanges();
                }
            }

            return Json(new { Message = " data has been updated successfully", responseCode = 200 }, JsonRequestBehavior.AllowGet);            
        }

        public string GetUserFromLdap(string UserName)
        {
            string sRetVal = string.Empty;

            string ServiceAccountID = ConfigurationManager.AppSettings["ServiceAccountID"];
            string ServicePassword = ConfigurationManager.AppSettings["ServicePassword"];

            using (var context = new PrincipalContext(ContextType.Domain, "ent.core.medtronic.com", ServiceAccountID, ServicePassword))
            {
                if(UserName == "" || UserName == null)
                {
                    ViewBag.UserName = "";
                    ViewBag.EmailAddress = null;
                }
                else
                {
                    var user = UserPrincipal.FindByIdentity(context, UserName);
                    if (user != null)
                    {
                        ViewBag.UserName = user.Name;
                        ViewBag.EmailAddress = user.EmailAddress;
                    }
                    else
                    {
                        ViewBag.UserName = "Invalid Id";
                        ViewBag.EmailAddress = null;
                    }
                }                
            }
            return ViewBag.UserName;
        }
        public class objsubmit
        {
            public List<SP_Config_Projects_Result> update { get; set; }
            public List<SP_Config_Projects_Result> delete { get; set; }
        }
    }
}