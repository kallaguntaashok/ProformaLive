using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Oracle.ManagedDataAccess.Client;

namespace ProformaLive.Controllers
{
    public class Config_SnapshotController : Controller
    {
        //App settings
        string conMAKEDW = ConfigurationManager.ConnectionStrings["MAKEDW"].ToString();
        string conPROFORMALIVE = ConfigurationManager.ConnectionStrings["PROFORMALIVE"].ToString();        
        string sqlQuery = ConfigurationManager.AppSettings["SQL"].ToString();
        
        private ProformaLiveEntities db;
        // GET: Config_Snapshot

        public Config_SnapshotController()
        {
            db = new ProformaLiveEntities();
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult insert_snapshot(int intFisYear, string strTitle, string strDesc, string strDate)
        {
            Master_Snapshot_Config obj = new Master_Snapshot_Config();
            obj.FisYear = intFisYear;
            obj.Title = strTitle;
            obj.Description = strDesc;
            obj.Date = Convert.ToDateTime(strDate);
            obj.DataRefreshStatus = "updating....";
            db.Master_Snapshot_Config.Add(obj);
            db.SaveChanges();
            update_snapshot(Convert.ToDateTime(strDate), obj.Sysid);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult update_snapshot(int intFisYear, string strTitle, string strDesc, string strDate, int intsysid)
        {            
            Master_Snapshot_Config row = db.Master_Snapshot_Config.Where(x => x.Sysid == intsysid).SingleOrDefault();
            row.FisYear = intFisYear;
            row.Title = strTitle;
            row.Description = strDesc;
            row.Date = Convert.ToDateTime(strDate);
            row.DataRefreshStatus = "updating....";            
            db.SaveChanges();
            update_snapshot(Convert.ToDateTime(strDate), intsysid);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult updatesnapshot(DateTime snapshotdate, int Master_SnapshotID)
        {
            update_snapshot(snapshotdate, Master_SnapshotID);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult deletesnapshot(int intsysid)
        {
            Master_Snapshot_Config data = db.Master_Snapshot_Config.Where(x => x.Sysid == intsysid).SingleOrDefault();
            if (data != null)
            {
                db.Master_Snapshot_Config.Remove(data);
                db.SaveChanges();
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public void update_snapshot(DateTime snapshotdate, int Master_SnapshotID)
        {
            DataTable dt = new DataTable();
            
            using (OracleConnection ocn = new OracleConnection(conMAKEDW))
            {                
                ocn.Open();                
                using (OracleCommand ocmd = new OracleCommand(sqlQuery + " where SNAPSHOT_DT= TO_DATE('" + snapshotdate.ToString("dd-MMM-yyyy") + "','dd-mon-yy')", ocn))
                {
                    OracleDataAdapter oda = new OracleDataAdapter(ocmd);
                    oda.Fill(dt);                    
                    using (SqlConnection con = new SqlConnection(conPROFORMALIVE))
                    {
                        con.Open();                        
                        SqlCommand sqlcmd = new SqlCommand("SP_APP_PFL_RESOURCES_SS_V_BulkInsert", con);
                        sqlcmd.CommandType = CommandType.StoredProcedure;
                        sqlcmd.Parameters.AddWithValue("@RESOURCESSNAPSHOT", dt);
                        sqlcmd.Parameters.AddWithValue("@date", snapshotdate);
                        sqlcmd.ExecuteNonQuery();                        
                    }
                }

                using (OracleCommand ocmd = new OracleCommand("SELECT COUNT(*) FROM APP_MAIN.APP_PFL_RESOURCES_SS_V where SNAPSHOT_DT= TO_DATE('" + snapshotdate.ToString("dd-MMM-yyyy") + "','dd-mon-yy')", ocn))
                {
                    DataTable dtcount = new DataTable();
                    OracleDataAdapter oda = new OracleDataAdapter(ocmd);
                    oda.Fill(dtcount);

                    foreach (DataRow item in dtcount.Rows)
                    {
                        int count = Convert.ToInt32(item.ItemArray[0]);
                        string strStatus = "";
                        if(count == 0)
                        {
                            strStatus = "Records not found.";
                        }
                        else
                        {
                            strStatus = count.ToString();
                        }
                        using (SqlConnection connection = new SqlConnection(conPROFORMALIVE))
                        {


                            string sql = $"UPDATE [dbo].[Master_Snapshot_Config] SET [DataCount]='{strStatus}', [DataRefreshStatus]='Completed', [RefreshDate]=getdate() Where [Sysid]='{Master_SnapshotID}'";
                            using (SqlCommand command = new SqlCommand(sql, connection))
                            {
                                connection.Open();
                                command.ExecuteNonQuery();
                                connection.Close();
                            }
                        }

                    }
                }
            }
        }

        [HttpGet]
        public JsonResult get_snapshotdata()
        {
            var obj = db.SP_Get_Master_Snapshot_Config().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult get_snapshottitle()
        {
            var obj = db.SP_GET_SnapshotTitle().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }
    }
}