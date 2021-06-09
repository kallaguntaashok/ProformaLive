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
        public JsonResult getResourceList(string strTeam, int intFisYear)
        {
            var obj = db.SP_Get_TeamResourceInfo(strTeam, intFisYear);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getassignmentdata(int intFisYear, string strTeam)
        {
            var obj = db.SP_Get_Assignments(intFisYear, strTeam).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult saveassignmentdata(objsubmit submit)
        {
            foreach (var item in submit.update)
            {
                if (item.ID > 0)
                {
                    //MAY
                    AssignmentsList row_may = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "MAY");

                    if (row_may == null)
                    {
                        AssignmentsList insert_row_may = new AssignmentsList();
                        insert_row_may.MasterID = item.ID;
                        insert_row_may.FisYear = "2022";
                        insert_row_may.Month = "MAY";
                        insert_row_may.value = item.MAY;
                        db.AssignmentsLists.Add(insert_row_may);
                    }
                    else
                    {
                        row_may.FisYear = "2022";
                        row_may.value = item.MAY;
                    }

                    //JUN
                    AssignmentsList row_june = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "JUN");

                    if (row_june == null)
                    {
                        AssignmentsList insert_row_june = new AssignmentsList();
                        insert_row_june.MasterID = item.ID;
                        insert_row_june.FisYear = "2022";
                        insert_row_june.Month = "JUN";
                        insert_row_june.value = item.JUN;
                        db.AssignmentsLists.Add(insert_row_june);
                    }
                    else
                    {
                        row_june.FisYear = "2022";
                        row_june.value = item.JUN;
                    }

                    //JUL
                    AssignmentsList row_july = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "JUL");

                    if (row_july == null)
                    {
                        AssignmentsList insert_row_july = new AssignmentsList();
                        insert_row_july.MasterID = item.ID;
                        insert_row_july.FisYear = "2022";
                        insert_row_july.Month = "JUL";
                        insert_row_july.value = item.JUL;
                        db.AssignmentsLists.Add(insert_row_july);
                    }
                    else
                    {
                        row_july.FisYear = "2022";
                        row_july.value = item.JUL;
                    }

                    //AUG
                    AssignmentsList row_aug = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "AUG");

                    if (row_aug == null)
                    {
                        AssignmentsList insert_row_aug = new AssignmentsList();
                        insert_row_aug.MasterID = item.ID;
                        insert_row_aug.FisYear = "2022";
                        insert_row_aug.Month = "AUG";
                        insert_row_aug.value = item.AUG;
                        db.AssignmentsLists.Add(insert_row_aug);
                    }
                    else
                    {
                        row_aug.FisYear = "2022";
                        row_aug.value = item.AUG;
                    }

                    //SEP
                    AssignmentsList row_sep = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "SEP");

                    if (row_sep == null)
                    {
                        AssignmentsList insert_row_sep = new AssignmentsList();
                        insert_row_sep.MasterID = item.ID;
                        insert_row_sep.FisYear = "2022";
                        insert_row_sep.Month = "SEP";
                        insert_row_sep.value = item.SEP;
                        db.AssignmentsLists.Add(insert_row_sep);
                    }
                    else
                    {
                        row_sep.FisYear = "2022";
                        row_sep.value = item.SEP;
                    }

                    //OCT
                    AssignmentsList row_oct = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "OCT");

                    if (row_oct == null)
                    {
                        AssignmentsList insert_row_oct = new AssignmentsList();
                        insert_row_oct.MasterID = item.ID;
                        insert_row_oct.FisYear = "2022";
                        insert_row_oct.Month = "OCT";
                        insert_row_oct.value = item.OCT;
                        db.AssignmentsLists.Add(insert_row_oct);
                    }
                    else
                    {
                        row_oct.FisYear = "2022";
                        row_oct.value = item.OCT;
                    }

                    //NOV
                    AssignmentsList row_nov = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "NOV");

                    if (row_nov == null)
                    {
                        AssignmentsList insert_row_nov = new AssignmentsList();
                        insert_row_nov.MasterID = item.ID;
                        insert_row_nov.FisYear = "2022";
                        insert_row_nov.Month = "NOV";
                        insert_row_nov.value = item.NOV;
                        db.AssignmentsLists.Add(insert_row_nov);
                    }
                    else
                    {
                        row_nov.FisYear = "2022";
                        row_nov.value = item.NOV;
                    }

                    //DEC
                    AssignmentsList row_dec = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "DEC");

                    if (row_dec == null)
                    {
                        AssignmentsList insert_row_dec = new AssignmentsList();
                        insert_row_dec.MasterID = item.ID;
                        insert_row_dec.FisYear = "2022";
                        insert_row_dec.Month = "DEC";
                        insert_row_dec.value = item.DEC;
                        db.AssignmentsLists.Add(insert_row_dec);
                    }
                    else
                    {
                        row_dec.FisYear = "2022";
                        row_dec.value = item.DEC;
                    }

                    //JAN
                    AssignmentsList row_jan = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "JAN");

                    if (row_jan == null)
                    {
                        AssignmentsList insert_row_jan = new AssignmentsList();
                        insert_row_jan.MasterID = item.ID;
                        insert_row_jan.FisYear = "2022";
                        insert_row_jan.Month = "JAN";
                        insert_row_jan.value = item.JAN;
                        db.AssignmentsLists.Add(insert_row_jan);
                    }
                    else
                    {
                        row_jan.FisYear = "2022";
                        row_jan.value = item.JAN;
                    }

                    //FEB
                    AssignmentsList row_feb = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "FEB");


                    if (row_feb == null)
                    {
                        AssignmentsList insert_row_feb = new AssignmentsList();
                        insert_row_feb.MasterID = item.ID;
                        insert_row_feb.FisYear = "2022";
                        insert_row_feb.Month = "FEB";
                        insert_row_feb.value = item.FEB;
                        db.AssignmentsLists.Add(insert_row_feb);
                    }
                    else
                    {
                        row_feb.FisYear = "2022";
                        row_feb.value = item.FEB;
                    }

                    //MAR
                    AssignmentsList row_mar = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "MAR");

                    if (row_mar == null)
                    {
                        AssignmentsList insert_row_mar = new AssignmentsList();
                        insert_row_mar.MasterID = item.ID;
                        insert_row_mar.FisYear = "2022";
                        insert_row_mar.Month = "MAR";
                        insert_row_mar.value = item.MAR;
                        db.AssignmentsLists.Add(insert_row_mar);
                    }
                    else
                    {
                        row_mar.FisYear = "2022";
                        row_mar.value = item.MAR;
                    }

                    //APR
                    AssignmentsList row_apr = db.AssignmentsLists
                        .SingleOrDefault(x => x.MasterID == item.ID && x.Month == "APR");

                    if (row_apr == null)
                    {
                        AssignmentsList insert_row_apr = new AssignmentsList();
                        insert_row_apr.MasterID = item.ID;
                        insert_row_apr.FisYear = "2022";
                        insert_row_apr.Month = "APR";
                        insert_row_apr.value = item.APR;
                        db.AssignmentsLists.Add(insert_row_apr);
                    }
                    else
                    {
                        row_apr.FisYear = "2022";
                        row_apr.value = item.APR;
                    }

                    db.SaveChanges();

                }

            }           
            return Json("success", JsonRequestBehavior.AllowGet);
        }

        public class objsubmit
        {
            public List<SP_Get_Assignments_Result> update { get; set; }
        }

        [HttpGet]
        public JsonResult getunassignedremaining(int intFisYear, string strTeam)
        {
            var obj = db.SP_Get_UnassignedRemaining(strTeam, intFisYear).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAssignlivemainview(int intFisYear, string strTeam)
        {
            var obj = db.SP_Get_Assign_Live_MainView(intFisYear, strTeam).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insert_Assignment(int strProjectID, string strTeam, string strRequiredSkills, string strResourcename, string defaultYear)
        {
            var tabledata = new Assignment
            {
                ProjectID = strProjectID,
                ResourceName = strResourcename,
                Team = strTeam,
                RequiredSkills = strRequiredSkills,
                RequestType = "Assigned"
            };

            db.Assignments.Add(tabledata);
            db.SaveChanges();

            int masterID = tabledata.Sysid;

            string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

            foreach (var month in months)
            {
                AssignmentsList obj = new AssignmentsList();
                obj.MasterID = masterID;
                obj.FisYear = defaultYear;
                obj.Month = month;
                obj.value = 0;
                db.AssignmentsLists.Add(obj);
                db.SaveChanges();
            }

            return Json("success", JsonRequestBehavior.AllowGet);
        }
    }
}