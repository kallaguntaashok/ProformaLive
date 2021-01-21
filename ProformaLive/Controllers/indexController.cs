using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Principal;
using System.Web.Security;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using ProformaLive.Authorization;
using static ProformaLive.Authorization.AuthorizeADAttribute;

namespace ProformaLive.Controllers
{
    [Authorize]
    public class indexController : Controller
    {
        private ProformaLiveEntities db;
        public indexController()
        {
            db = new ProformaLiveEntities();
        }
        // GET: index
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult updateprojectname(int strProjectID)
        {
            var objProjectData = db.Configure_Project.Where(x => x.ProjectID == strProjectID)
                .Select(i => new { i.ProjectID, i.ProjectNumber, i.ProjectName }).ToList();

            Session["ProjectName"] = objProjectData[0].ProjectName;
            return Json(objProjectData, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Authorize]
        public JsonResult getprojectlist()
        {
            var obj = db.SP_Get_Projects().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Authorize]
        [AuthorizeAD(Groups = Constants.PAdminUsers)]
        public JsonResult CreateUserProfile()
        {
            try
            {
                //initialize domain variables.
                string domain = ConfigurationManager.AppSettings["Domain"];
                string adminUserProfileid = ConfigurationManager.AppSettings["AdminUserRoles"];

                userProfile up = new userProfile();
                string userID = User.Identity.Name;
                var userProfile = GetUserFromLdap();

                if (userProfile != null)
                {
                    up.isAdmin = userProfile.Item2;
                    up.userID = userID.Replace(domain, "");
                    up.userName = userProfile.Item1;

                    //will remove this code------------------------
                    Session["username"] = userProfile.Item1;
                    Session["userid"] = userID.Replace(domain, "");
                    //---------------------------------------------
                }

                return Json(new { Message = up, responseCode = 200 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
                return Json(new { Message = "error in the system: (" + Ex.Message + ")", responseCode = 404 }, JsonRequestBehavior.AllowGet);
            }
        }

        public Tuple<string, bool> GetUserFromLdap()
        {
            //initialize service account variables.
            string serviceAccountID = ConfigurationManager.AppSettings["ServiceAccountID"];
            string servicePassword = ConfigurationManager.AppSettings["ServicePassword"];
            string serviceDomain = ConfigurationManager.AppSettings["ServiceDomain"];
            string adminUserProfileid = ConfigurationManager.AppSettings["AdminUserRoles"];

            using (var context = new PrincipalContext(ContextType.Domain, serviceDomain, serviceAccountID, servicePassword))
            {
                var user = UserPrincipal.FindByIdentity(context, User.Identity.Name);

                var userPrincipal = UserPrincipal.FindByIdentity(
                                       context,
                                       IdentityType.SamAccountName,
                                       User.Identity.Name);

                bool isAdminUser = userPrincipal.IsMemberOf(context, IdentityType.Name, adminUserProfileid);

                if (user != null)
                {
                    var userProfile = new Tuple<string, bool>(user.Name, isAdminUser);
                    return userProfile;
                }
            }
            return null;
        }

        //initialize user profile.
        public class userProfile
        {
            public bool isAdmin { get; set; }
            public string userID { get; set; }
            public string userName { get; set; }
        }

    }
}