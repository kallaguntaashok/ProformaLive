using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProformaLive.Controllers
{
    [Authorize]
    public class ConfigureRateCardController : Controller
    {
        // GET: ConfigureRateCard
        public ActionResult Index()
        {
            return View();
        }
    }
}