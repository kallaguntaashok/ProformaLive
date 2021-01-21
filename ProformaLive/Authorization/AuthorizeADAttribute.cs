using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Principal;
using System.Configuration;
using System.DirectoryServices.AccountManagement;

namespace ProformaLive.Authorization
{
    public class AuthorizeADAttribute : AuthorizeAttribute
    {
        public string Groups { get; set; }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (base.AuthorizeCore(httpContext))
            {
                /* Return true immediately if the authorization is not 
                locked down to any particular AD group */
                if (String.IsNullOrEmpty(Groups))
                    return true;

                // Get the AD groups
                var groups = Groups.Split(',').ToList();

                // Verify that the user is in the given AD group(if any)
                //var context = new PrincipalContext(
                //                      ContextType.Domain,
                //                      "ent.core.medtronic.com");

                //var userPrincipal = UserPrincipal.FindByIdentity(
                //                       context,
                //                       IdentityType.SamAccountName,
                //                       httpContext.User.Identity.Name);

                string serviceAccountID = ConfigurationManager.AppSettings["ServiceAccountID"];
                string servicePassword = ConfigurationManager.AppSettings["ServicePassword"];
                string serviceDomain = ConfigurationManager.AppSettings["ServiceDomain"];
                string adminUserProfileid = ConfigurationManager.AppSettings["AdminUserRoles"];

                using (var context = new PrincipalContext(ContextType.Domain, serviceDomain, serviceAccountID, servicePassword))
                {                    
                    var userPrincipal = UserPrincipal.FindByIdentity(
                                           context,
                                           IdentityType.SamAccountName,
                                           httpContext.User.Identity.Name);
                                        
                    foreach (var group in groups)
                        if (userPrincipal.IsMemberOf(context,
                             IdentityType.Name,
                             group))
                            return true;
                }

                
            }
            return false;
        }

        protected override void HandleUnauthorizedRequest(
        AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                filterContext.HttpContext.Response.StatusCode = 403;
            }
            else
                base.HandleUnauthorizedRequest(filterContext);
        }
        public static class Constants
        {
            /// <summary>
            /// CS - Customer support and customer support leads
            /// </summary>
            public const string PAdmin = "ProFormaLive–Admin–SECURE";
            public const string PUser = "ProFormaLive–Basic–SECURE";
            public const string PAdminUsers = "ProFormaLive–Admin–SECURE, ProFormaLive–Basic–SECURE";
        }
    }
}