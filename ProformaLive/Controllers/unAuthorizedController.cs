using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProformaLive.Controllers
{
    public class unAuthorizedController : Controller
    {
        // GET: unAuthorized
        public ActionResult Index()
        {
            return View();
        }
    }
}