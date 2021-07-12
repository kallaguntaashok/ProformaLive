using ProformaLive;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Aspose.Cells;
using System.Data;
using System.Data.SqlClient;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using OfficeOpenXml.Table.PivotTable;
using OfficeOpenXml.Table;

namespace MECC_ReportPortal.Controllers
{

    public class ResourceController : Controller
    {
        private ProformaLiveEntities db;
        public ResourceController()
        {
            db = new ProformaLiveEntities();
        }

        [HttpPost]
        public JsonResult insert_resourcecomments(int intProjectID, int intMasterID, int intColumnID, string strComments, string userid)
        {
            ResourceInfoComment data = db.ResourceInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                data.Comments = strComments;
                data.ModifiedBy = userid;
                data.ModifiedOn = DateTime.Now;
                db.SaveChanges();
            }
            else
            {
                ResourceInfoComment obj = new ResourceInfoComment();
                obj.ProjectID = intProjectID;
                obj.MasterID = intMasterID;
                obj.ColumnID = intColumnID;
                obj.Comments = strComments;
                obj.CreatedOn = DateTime.Now;
                obj.CreatedBy = userid;
                db.ResourceInfoComments.Add(obj);
                db.SaveChanges();
            }

            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult get_completehelp()
        {
            var npData = db.SP_GET_CompleteNotificationData("Help").ToList();
            return Json(npData, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult get_defaultfisyear()
        {
            var npData = db.SP_Get_DefaultFisYear().ToList();
            return Json(npData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_help(objHelp obH)
        {
            var npData = db.SP_GET_HelpData(obH.strTitle, obH.strData).ToList();
            return Json(npData, JsonRequestBehavior.AllowGet);
        }

        public class objHelp
        {
            public string strTitle { get; set; }
            public string strData { get; set; }
        }

        [HttpPost]
        public JsonResult insert_capitalcomments(int intProjectID, int intMasterID, int intColumnID, string strComments, string userid)
        {
            CapitalInfoComment data = db.CapitalInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                data.Comments = strComments;
                data.ModifiedBy = userid;
                data.ModifiedOn = DateTime.Now;
                db.SaveChanges();
            }
            else
            {
                CapitalInfoComment obj = new CapitalInfoComment();
                obj.ProjectID = intProjectID;
                obj.MasterID = intMasterID;
                obj.ColumnID = intColumnID;
                obj.Comments = strComments;
                obj.CreatedOn = DateTime.Now;
                obj.CreatedBy = userid;
                db.CapitalInfoComments.Add(obj);
                db.SaveChanges();
            }

            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insert_capitallaborcomments(int intProjectID, int intMasterID, int intColumnID, string strComments, string userid)
        {
            CapitalLaborInfoComment data = db.CapitalLaborInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                data.Comments = strComments;
                data.ModifiedBy = userid;
                data.ModifiedOn = DateTime.Now;
                db.SaveChanges();
            }
            else
            {
                CapitalLaborInfoComment obj = new CapitalLaborInfoComment();
                obj.ProjectID = intProjectID;
                obj.MasterID = intMasterID;
                obj.ColumnID = intColumnID;
                obj.Comments = strComments;
                obj.CreatedOn = DateTime.Now;
                obj.CreatedBy = userid;
                db.CapitalLaborInfoComments.Add(obj);
                db.SaveChanges();
            }

            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insert_directexpensescomments(int intProjectID, int intMasterID, int intColumnID, string strComments, string userid)
        {
            DirectExpensesInfoComment data = db.DirectExpensesInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                data.Comments = strComments;
                data.ModifiedBy = userid;
                data.ModifiedOn = DateTime.Now;
                db.SaveChanges();
            }
            else
            {
                DirectExpensesInfoComment obj = new DirectExpensesInfoComment();
                obj.ProjectID = intProjectID;
                obj.MasterID = intMasterID;
                obj.ColumnID = intColumnID;
                obj.Comments = strComments;
                obj.CreatedOn = DateTime.Now;
                obj.CreatedBy = userid;
                db.DirectExpensesInfoComments.Add(obj);
                db.SaveChanges();
            }

            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete_resourcecomments(int intMasterID, int intColumnID)
        {
            ResourceInfoComment data = db.ResourceInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                db.ResourceInfoComments.Remove(data);
                db.SaveChanges();
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete_capitalcomments(int intMasterID, int intColumnID)
        {
            CapitalInfoComment data = db.CapitalInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                db.CapitalInfoComments.Remove(data);
                db.SaveChanges();
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete_capitallaborcomments(int intMasterID, int intColumnID)
        {
            CapitalLaborInfoComment data = db.CapitalLaborInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                db.CapitalLaborInfoComments.Remove(data);
                db.SaveChanges();
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete_directexpensescomments(int intMasterID, int intColumnID)
        {
            DirectExpensesInfoComment data = db.DirectExpensesInfoComments.Where(x => x.MasterID == intMasterID && x.ColumnID == intColumnID).SingleOrDefault();
            if (data != null)
            {
                db.DirectExpensesInfoComments.Remove(data);
                db.SaveChanges();
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_resourcecheckbook_fisyear(int intProjectID)
        {
            var obj = db.SP_Get_FiscalYear(intProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_dececheckbook_fisyear(int intProjectID)
        {
            var obj = db.SP_Get_DE_FiscalYear(intProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_capital_checkbook_fisyear(int intProjectID)
        {
            var obj = db.SP_Get_Capital_FiscalYear(intProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_decheckbook(int intProjectID, int intFisYear)
        {
            List<de_checkbook> dc = new List<de_checkbook>();
            var obj = db.SP_Get_DirectExpenses_CheckBook(intProjectID, intFisYear).ToList();
            foreach (var item in obj)
            {
                dc.Add(new de_checkbook()
                {
                    WBSNumber = item.WBSNumber,
                    ExpenseCategory = item.ExpenseCategory,
                    Description = item.Description,
                    PONumber = item.PONumber,
                    FisYear = item.FisYear,
                    MAY = Convert.ToDecimal(item.MAY),
                    JUN = Convert.ToDecimal(item.JUN),
                    JUL = Convert.ToDecimal(item.JUL),
                    AUG = Convert.ToDecimal(item.AUG),
                    SEP = Convert.ToDecimal(item.SEP),
                    OCT = Convert.ToDecimal(item.OCT),
                    NOV = Convert.ToDecimal(item.NOV),
                    DEC = Convert.ToDecimal(item.DEC),
                    JAN = Convert.ToDecimal(item.JAN),
                    FEB = Convert.ToDecimal(item.FEB),
                    MAR = Convert.ToDecimal(item.MAR),
                    APR = Convert.ToDecimal(item.APR),
                    decheckbooksubmenu = db.SP_Get_DirectExpensesInfo_CJI3_Selection(intProjectID, item.FisYear, item.WBSNumber, item.ExpenseCategory, item.Description).ToList()
                });
            }

            return Json(dc, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_capital_checkbook(int intProjectID, int intFisYear)
        {
            List<capital_checkbook> dc = new List<capital_checkbook>();
            var obj = db.SP_Get_Capital_CheckBook(intProjectID, intFisYear).ToList();
            foreach (var item in obj)
            {
                dc.Add(new capital_checkbook()
                {
                    WBSNumber = item.WBSNumber,
                    CapitalCategory = item.CapitalCategory,
                    CapitalType = item.CapitalType,
                    Description = item.Description,
                    FinYear = item.FinYear,
                    MAY = Convert.ToDecimal(item.MAY),
                    JUN = Convert.ToDecimal(item.JUN),
                    JUL = Convert.ToDecimal(item.JUL),
                    AUG = Convert.ToDecimal(item.AUG),
                    SEP = Convert.ToDecimal(item.SEP),
                    OCT = Convert.ToDecimal(item.OCT),
                    NOV = Convert.ToDecimal(item.NOV),
                    DEC = Convert.ToDecimal(item.DEC),
                    JAN = Convert.ToDecimal(item.JAN),
                    FEB = Convert.ToDecimal(item.FEB),
                    MAR = Convert.ToDecimal(item.MAR),
                    APR = Convert.ToDecimal(item.APR),
                    capitalcheckbooksubmenu = db.SP_Get_Capital_CJI3_Selection(intProjectID, item.FinYear, item.WBSNumber, item.CapitalCategory, item.CapitalType, item.Description).ToList()

                });
            }

            return Json(dc, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_de_cji3_data(int intProjectID, string strWBSNumber, string strFisYear, string strMonth, string strExpensecategory, string strDescription, bool boolstatus, string strPONumber)
        {
            if (boolstatus == false)
            {
                var obj = db.SP_Get_DE_CJI3_Data(strWBSNumber, strFisYear, strMonth, strExpensecategory, strDescription, strPONumber).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var obj = db.SP_Get_DE_CJI3_Data_SelectedList(intProjectID, strWBSNumber, strFisYear, strMonth, strExpensecategory, strDescription).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult get_capital_cji3_data(int intProjectID, string strWBSNumber, string strFisYear, string strMonth, string strCapitalCategory,string strCapitalType, string strDescription, bool boolstatus)
        {
            if (boolstatus == false)
            {
                var obj = db.SP_Get_CAPITAL_CJI3_Data(strWBSNumber, strFisYear, strMonth, strCapitalCategory, strCapitalType, strDescription).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var obj = db.SP_Get_Capital_CJI3_Data_SelectedList(intProjectID, strWBSNumber, strFisYear, strMonth, strCapitalCategory, strCapitalType, strDescription).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult get_directExpensesinfo_cji3_selection_validation(int intProjectID)
        {
            var obj = db.Get_DirectExpensesInfo_CJI3_Selection_Validation(intProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult remove_decheckbook_cji3(DEcheckbookSelectedList data)
        {
            DirectExpensesInfo_CJI3_Selection ds = db.DirectExpensesInfo_CJI3_Selection
                .Where(x => x.FiscalYear == data.item.FiscalYear
                && x.Month == data.item.Month
                && x.PostingDate == data.item.PostingDate
                && x.Object == data.item.Object
                && x.CO_Object_Name == data.item.CO_Object_Name
                && x.CostElementName == data.item.CostElementName
                && x.PurchasingDocument == data.item.PurchasingDocument
                && x.PurchaseOrderText == data.item.PurchaseOrderText
                && x.NameOfOffsettingaccount == data.item.NameOfOffsettingaccount
                && x.TotalQuantity == data.item.TotalQuantity
                && x.Val_COAreaCrcy == data.item.Val_COAreaCrcy
                && x.PO_Amount == data.item.PO_Amount
                && x.UserName == data.item.UserName
                && x.DE_ExpenseCategory == data.item.Expensecategory
                && x.Description == data.item.Description).SingleOrDefault();
            if (ds != null)
            {
                db.DirectExpensesInfo_CJI3_Selection.Remove(ds);
                db.SaveChanges();
            }

            var obj = db.SP_Get_DE_CJI3_Data_SelectedList(data.ProjectID, data.item.Object, data.item.FiscalYear, data.item.Month, data.item.Expensecategory, data.item.Description).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult remove_capitalcheckbook_cji3(CapitalcheckbookSelectedList data)
        {
            Capital_CJI3_Selection ds = db.Capital_CJI3_Selection
                .Where(x => x.FiscalYear == data.item.FiscalYear
                && x.Month == data.item.Month
                && x.PostingDate == data.item.PostingDate
                && x.Object == data.item.Object
                && x.CO_Object_Name == data.item.CO_Object_Name
                && x.CostElementName == data.item.CostElementName
                && x.PurchasingDocument == data.item.PurchasingDocument
                && x.PurchaseOrderText == data.item.PurchaseOrderText
                && x.NameOfOffsettingaccount == data.item.NameOfOffsettingaccount
                && x.TotalQuantity == data.item.TotalQuantity
                && x.Val_COAreaCrcy == data.item.Val_COAreaCrcy
                && x.PO_Amount == data.item.PO_Amount
                && x.UserName == data.item.UserName
                && x.CapitalCategory == data.item.CapitalCategory
                && x.CapitalType == data.item.CapitalType
                && x.Description == data.item.Description).SingleOrDefault();
            if (ds != null)
            {
                db.Capital_CJI3_Selection.Remove(ds);
                db.SaveChanges();
            }

            var obj = db.SP_Get_Capital_CJI3_Data_SelectedList(data.ProjectID, data.item.Object, data.item.FiscalYear, data.item.Month, data.item.CapitalCategory, data.item.CapitalType, data.item.Description).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insert_de_cji3_selection(objdecji3data data)
        {
            string strWBSNumber = "";
            string strFisyear = "";
            string strMonth = "";
            string Expensecategory = "";
            string Description = "";
            string strPONumber = "";

            if (data.insert != null)
            {
                foreach (var item in data.insert)
                {
                    if (item.FiscalYear != null)
                    {
                        strWBSNumber = item.Object;
                        strFisyear = item.FiscalYear;
                        strMonth = item.Month;
                        Expensecategory = item.Expensecategory;
                        Description = item.Description;

                        DirectExpensesInfo_CJI3_Selection DCS = new DirectExpensesInfo_CJI3_Selection();
                        DCS.ProjectID = data.ProjectID;
                        DCS.FiscalYear = item.FiscalYear;
                        DCS.Month = item.Month;
                        DCS.PostingDate = item.PostingDate;
                        DCS.Object = item.Object;
                        DCS.CO_Object_Name = item.CO_Object_Name;
                        DCS.CostElementName = item.CostElementName;
                        DCS.PurchasingDocument = item.PurchasingDocument;
                        DCS.PurchaseOrderText = item.PurchaseOrderText;
                        DCS.NameOfOffsettingaccount = item.NameOfOffsettingaccount;
                        DCS.TotalQuantity = item.TotalQuantity;
                        DCS.Val_COAreaCrcy = item.Val_COAreaCrcy;
                        DCS.PO_Amount = item.PO_Amount;
                        DCS.UserName = item.UserName;
                        DCS.DE_ExpenseCategory = item.Expensecategory;
                        DCS.Description = item.Description;
                        db.DirectExpensesInfo_CJI3_Selection.Add(DCS);
                        db.SaveChanges();
                    }
                }
            }

            var obj = db.SP_Get_DE_CJI3_Data(strWBSNumber, strFisyear, strMonth, Expensecategory, Description, strPONumber).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insert_capital_cji3_selection(objcapitalcji3data data)
        {
            string strWBSNumber = "";
            string strFisyear = "";
            string strMonth = "";
            string CapitalCategory = "";
            string CapitalType = "";
            string Description = "";
            
            if (data.insert != null)
            {
                foreach (var item in data.insert)
                {
                    if (item.FiscalYear != null)
                    {
                        strWBSNumber = item.Object;
                        strFisyear = item.FiscalYear;
                        strMonth = item.Month;
                        CapitalCategory = item.CapitalCategory;
                        CapitalType = item.CapitalType;
                        Description = item.Description;

                        Capital_CJI3_Selection DCS = new Capital_CJI3_Selection();
                        DCS.ProjectID = data.ProjectID;
                        DCS.FiscalYear = item.FiscalYear;
                        DCS.Month = item.Month;
                        DCS.PostingDate = item.PostingDate;
                        DCS.Object = item.Object;
                        DCS.CO_Object_Name = item.CO_Object_Name;
                        DCS.CostElementName = item.CostElementName;
                        DCS.PurchasingDocument = item.PurchasingDocument;
                        DCS.PurchaseOrderText = item.PurchaseOrderText;
                        DCS.NameOfOffsettingaccount = item.NameOfOffsettingaccount;
                        DCS.TotalQuantity = item.TotalQuantity;
                        DCS.Val_COAreaCrcy = item.Val_COAreaCrcy;
                        DCS.PO_Amount = item.PO_Amount;
                        DCS.UserName = item.UserName;
                        DCS.CapitalCategory = item.CapitalCategory;
                        DCS.CapitalType = item.CapitalType;
                        DCS.Description = item.Description;
                        db.Capital_CJI3_Selection.Add(DCS);
                        db.SaveChanges();
                    }
                }
            }

            var obj = db.SP_Get_CAPITAL_CJI3_Data(strWBSNumber, strFisyear, strMonth, CapitalCategory, CapitalType, Description).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getde_cji3_total_reconciliation_remaining(int intProjectID, int intFisYear)
        {
            var obj = db.SP_Get_DE_CJI3_Total_Reconciliation_Remaining(intProjectID, intFisYear).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getde_capital_total_reconciliation_remaining(int intProjectID, int intFisYear)
        {
            var obj = db.SP_Get_CAPITAL_CJI3_Total_Reconciliation_Remaining(intProjectID, intFisYear).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_directExpensesdata_forcheckbookedit(int intProjectID, string strWBSnumber, int intFisYear, string strExpensecategory, string strDescription)
        {
            var obj = db.SP_GetDirectExpensesData_forcheckbookedit(intProjectID, strWBSnumber, intFisYear, strExpensecategory, strDescription).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult get_capitaldata_forcheckbookedit(int intProjectID, string strWBSnumber, int intFisYear, string strCapitalCategory, string strCapitalType, string strDescription)
        {
            var obj = db.SP_GetCapitalData_forcheckbookedit(intProjectID, strWBSnumber, intFisYear, strCapitalCategory, strCapitalType, strDescription).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult validateDuplicateProjectnumber(string strProjectNumber)
        {
            var obj = db.SP_Validate_ProjectCode(strProjectNumber).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getlastmodifiedinfo(int ProjectID)
        {
            var obj = db.SP_Getlastmodifiedinfo(ProjectID).ToList();
            List<lastmodifeddata> data = new List<lastmodifeddata>();
            foreach (var item in obj)
            {
                lastmodifeddata ld = new lastmodifeddata();
                string strname = item.ModifiedBy;
                ld.name = strname;
                ld.source = item.Title;
                ld.date = Convert.ToString(item.ModifiedOn);
                data.Add(ld);
            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public string GetUserFromLdap(string UserName)
        {
            string ServiceAccountID = ConfigurationManager.AppSettings["ServiceAccountID"];
            string ServicePassword = ConfigurationManager.AppSettings["ServicePassword"];

            using (var context = new PrincipalContext(ContextType.Domain, "ent.core.medtronic.com", ServiceAccountID, ServicePassword))
            {
                var user = UserPrincipal.FindByIdentity(context, UserName);
                if (user != null)
                {
                    ViewBag.UserName = user.Name;
                    ViewBag.EmailAddress = user.EmailAddress;
                }
                else
                {
                    ViewBag.UserName = null;
                    ViewBag.EmailAddress = null;
                }
            }

            return ViewBag.UserName;
        }


        [HttpPost]
        public JsonResult SaveFiles(int ProjectID, string userid)
        {
            string Message, fileName, actualFileName;
            Message = fileName = actualFileName = string.Empty;
            bool flag = false;
            if (Request.Files != null)
            {
                var file = Request.Files[0];
                actualFileName = file.FileName;
                fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                int size = file.ContentLength;

                string fullfilename = Path.Combine(Server.MapPath("~/upload"), fileName);
                file.SaveAs(fullfilename);

                Aspose.Cells.License lic = new License();
                lic.SetLicense("Aspose.Cells.lic");
                Workbook workBook = new Workbook(fullfilename);
                string workSheetName = workBook.Worksheets[0].Name;

                Worksheet worksheet = workBook.Worksheets[0];
                int rows = worksheet.Cells.MaxDataRow;
                int columns = worksheet.Cells.MaxDataColumn;
                DataTable dt = new DataTable();
                dt = worksheet.Cells.ExportDataTableAsString(1, 0, rows + 1, columns + 1, true);

                if (workSheetName == "ResourceList")
                {
                    if (dt.Rows.Count > 0)
                    {
                        db.SP_Delete_ResourceData(ProjectID);
                        foreach (DataRow row in dt.Rows)
                        {
                            if (Convert.ToString(row["WBSNumber"]) != "" ||
                                Convert.ToString(row["Business"]) != "" ||
                                Convert.ToString(row["BusinessUnit"]) != "" ||
                                Convert.ToString(row["HighOrg"]) != "" ||
                                Convert.ToString(row["MidOrg"]) != "" ||
                                Convert.ToString(row["Team"]) != "" ||
                                Convert.ToString(row["RequiredSkill"]) != "" ||
                                Convert.ToString(row["Comments"]) != "" ||
                                Convert.ToString(row["FinYear"]) != "")
                            {
                                ResourceInfo obj = new ResourceInfo();
                                obj.ProjectID = ProjectID;
                                obj.Type = "Std Labor";
                                obj.WBSNumber = Convert.ToString(row["WBSNumber"]);
                                obj.Business = Convert.ToString(row["Business"]);
                                obj.BusinessUnit = Convert.ToString(row["BusinessUnit"]);
                                obj.HighOrg = Convert.ToString(row["HighOrg"]);
                                obj.MidOrg = Convert.ToString(row["MidOrg"]);
                                obj.Team = Convert.ToString(row["Team"]);
                                obj.RequiredSkill = Convert.ToString(row["RequiredSkill"]);
                                obj.Comments = Convert.ToString(row["Comments"]);
                                obj.CreatedOn = DateTime.Now;
                                obj.CreatedBy = userid;

                                db.ResourceInfoes.Add(obj);
                                db.SaveChanges();

                                int masterID = obj.MasterID;
                                string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

                                foreach (var month in months)
                                {
                                    string value = Convert.ToString(row[month]);
                                    if (value == "") value = "0";

                                    ResourceInfoList objc = new ResourceInfoList();
                                    objc.MasterID = masterID;
                                    objc.FinYear = Convert.ToString(row["FinYear"]);
                                    objc.Month = month;
                                    objc.TimeSpentInProject = Convert.ToDecimal(value);
                                    db.ResourceInfoLists.Add(objc);
                                    db.SaveChanges();
                                }

                                db.SaveChanges();
                            }
                        }
                    }
                }
                else if (workSheetName == "CapitalList")
                {
                    if (dt.Rows.Count > 0)
                    {
                        db.SP_Delete_CapitalData(ProjectID);
                        foreach (DataRow row in dt.Rows)
                        {
                            if (Convert.ToString(row["WBSNumber"]) != "" ||
                                Convert.ToString(row["Priority"]) != "" ||
                                Convert.ToString(row["Impactofnotinvesting"]) != "" ||
                                Convert.ToString(row["CapitalCategory"]) != "" ||
                                Convert.ToString(row["CapitalType"]) != "" ||
                                Convert.ToString(row["Description"]) != "" ||
                                Convert.ToString(row["FinYear"]) != "")
                            {
                                string AOPName = row["AOPProject"].ToString();
                                var AOPID = db.Master_AOPProject
                                    .Where(x => x.Name == AOPName)
                                    .Select(y => y.Sysid).ToList();

                                int AOPvalue = 0;
                                if (AOPID.Count > 0)
                                {
                                    AOPvalue = AOPID[0];
                                }

                                CapitalInfo obj = new CapitalInfo();
                                obj.ProjectID = ProjectID;
                                obj.Type = "Capital";
                                obj.WBSNumber = row["WBSNumber"].ToString();
                                obj.Priority = row["Priority"].ToString();
                                obj.Impactofnotinvesting = row["Impactofnotinvesting"].ToString();
                                obj.CapitalCategory = row["CapitalCategory"].ToString();
                                obj.CapitalType = row["CapitalType"].ToString();
                                obj.Description = row["Description"].ToString();
                                obj.AOPProject = Convert.ToInt32(AOPvalue);
                                obj.CreatedBy = userid;
                                obj.CreatedOn = DateTime.Now;

                                db.CapitalInfoes.Add(obj);
                                db.SaveChanges();

                                int masterID = obj.MasterID;
                                string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

                                foreach (var month in months)
                                {
                                    string value = Convert.ToString(row[month]);
                                    if (value == "") value = "0";

                                    CapitalInfoList objc = new CapitalInfoList();
                                    objc.MasterID = masterID;
                                    objc.FinYear = Convert.ToString(row["FinYear"]);
                                    objc.Month = month;
                                    objc.value = Convert.ToDecimal(value);
                                    db.CapitalInfoLists.Add(objc);
                                    db.SaveChanges();
                                }

                                db.SaveChanges();
                            }
                        }
                    }
                }
                else if (workSheetName == "CapitallaborList")
                {
                    if (dt.Rows.Count > 0)
                    {
                        db.SP_Delete_CapitalLaborInfo(ProjectID);
                        foreach (DataRow row in dt.Rows)
                        {
                            if (Convert.ToString(row["WBSNumber"]) != "" ||
                                Convert.ToString(row["Priority"]) != "" ||
                                Convert.ToString(row["CapitalCategory"]) != "" ||
                                Convert.ToString(row["Business"]) != "" ||
                                Convert.ToString(row["BusinessUnit"]) != "" ||
                                Convert.ToString(row["HighOrg"]) != "" ||
                                Convert.ToString(row["MidOrg"]) != "" ||
                                Convert.ToString(row["RequiredSkill"]) != "" ||
                                Convert.ToString(row["FinYear"]) != "")
                            {
                                string AOPName = row["AOPProject"].ToString();
                                var AOPID = db.Master_AOPProject
                                .Where(x => x.Name == AOPName)
                                .Select(y => y.Sysid).ToList();

                                int AOPvalue = 0;
                                if (AOPID.Count > 0)
                                {
                                    AOPvalue = AOPID[0];
                                }

                                CapitalLaborInfo obj = new CapitalLaborInfo();
                                obj.ProjectID = ProjectID;
                                obj.Type = "Capital Labor";
                                obj.WBSnumber = row["WBSNumber"].ToString();
                                obj.Priority = row["Priority"].ToString();
                                obj.CapitalCategory = row["CapitalCategory"].ToString();
                                obj.Business = row["Business"].ToString();
                                obj.BusinessUnit = row["BusinessUnit"].ToString();
                                obj.HighOrg = row["HighOrg"].ToString();
                                obj.MidOrg = row["MidOrg"].ToString();
                                obj.Team = row["Team"].ToString();
                                obj.RequiredSkill = row["RequiredSkill"].ToString();
                                obj.AOPProject = Convert.ToInt32(AOPvalue);
                                obj.CreatedBy = userid;
                                obj.CreatedOn = DateTime.Now;

                                db.CapitalLaborInfoes.Add(obj);
                                db.SaveChanges();

                                int masterID = obj.MasterID;
                                string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

                                foreach (var month in months)
                                {
                                    string value = Convert.ToString(row[month]);
                                    if (value == "") value = "0";

                                    CapitalLaborInfoList objc = new CapitalLaborInfoList();
                                    objc.MasterID = masterID;
                                    objc.FisYear = Convert.ToString(row["FinYear"]);
                                    objc.Month = month;
                                    objc.value = Convert.ToDecimal(value);
                                    db.CapitalLaborInfoLists.Add(objc);
                                    db.SaveChanges();
                                }

                                db.SaveChanges();
                            }
                        }
                    }
                }
                else if (workSheetName == "DEList")
                {
                    if (dt.Rows.Count > 0)
                    {
                        db.SP_Delete_DirectExpensesInfo(ProjectID);
                        foreach (DataRow row in dt.Rows)
                        {
                            if (Convert.ToString(row["WBSNumber"]) != "" ||
                                Convert.ToString(row["ExpenseCategory"]) != "" ||
                                Convert.ToString(row["Description"]) != "" ||
                                Convert.ToString(row["FinYear"]) != "")
                            {
                                DirectExpensesInfo obj = new DirectExpensesInfo();
                                obj.ProjectID = ProjectID;
                                obj.Type = "DE";
                                obj.WBSNumber = row["WBSNumber"].ToString();
                                obj.ExpenseCategory = row["ExpenseCategory"].ToString();
                                obj.Description = row["Description"].ToString();
                                obj.PONumber = row["PONumber"].ToString();
                                obj.CreatedBy = userid;
                                obj.CreatedOn = DateTime.Now;
                                db.DirectExpensesInfoes.Add(obj);
                                db.SaveChanges();

                                int masterID = obj.MasterID;
                                string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

                                foreach (var month in months)
                                {
                                    string value = Convert.ToString(row[month]);
                                    if (value == "") value = "0";

                                    DirectExpensesInfoList objc = new DirectExpensesInfoList();
                                    objc.MasterID = masterID;
                                    objc.FisYear = Convert.ToString(row["FinYear"]);
                                    objc.Month = month;
                                    objc.value = Convert.ToDecimal(value);
                                    db.DirectExpensesInfoLists.Add(objc);
                                    db.SaveChanges();
                                }
                                db.SaveChanges();
                            }
                        }
                    }
                }

            }
            return new JsonResult { Data = new { Message = Message, Status = flag } };
        }

        // GET: Resource
        public ActionResult Index()
        {
            //Session["CurrentPage"] = 2;
            return View();
        }

        public void pivotetable()
        {
            string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
            string FileName = "Summary" + System.DateTime.Now.ToString("yyyyMMddHHMMssfff") + ".xlsx";
            FileInfo file = new FileInfo(DestinationPath + FileName);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            //create a new ExcelPackage
            using (ExcelPackage excelPackage = new ExcelPackage(file))
            {
                //create 2 WorkSheets. One for the source data and one for the Pivot table
                ExcelWorksheet worksheetPivot = excelPackage.Workbook.Worksheets.Add("Pivot");
                ExcelWorksheet worksheetData = excelPackage.Workbook.Worksheets.Add("Data");

                //add some source data
                worksheetData.Cells["A1"].Value = "Column A";
                worksheetData.Cells["A2"].Value = "Group A";
                worksheetData.Cells["A3"].Value = "Group B";
                worksheetData.Cells["A4"].Value = "Group C";
                worksheetData.Cells["A5"].Value = "Group A";
                worksheetData.Cells["A6"].Value = "Group B";
                worksheetData.Cells["A7"].Value = "Group C";
                worksheetData.Cells["A8"].Value = "Group A";
                worksheetData.Cells["A9"].Value = "Group B";
                worksheetData.Cells["A10"].Value = "Group C";
                worksheetData.Cells["A11"].Value = "Group D";

                worksheetData.Cells["B1"].Value = "Column B";
                worksheetData.Cells["B2"].Value = "emc";
                worksheetData.Cells["B3"].Value = "fma";
                worksheetData.Cells["B4"].Value = "h2o";
                worksheetData.Cells["B5"].Value = "emc";
                worksheetData.Cells["B6"].Value = "fma";
                worksheetData.Cells["B7"].Value = "h2o";
                worksheetData.Cells["B8"].Value = "emc";
                worksheetData.Cells["B9"].Value = "fma";
                worksheetData.Cells["B10"].Value = "h2o";
                worksheetData.Cells["B11"].Value = "emc";

                worksheetData.Cells["C1"].Value = "Column C";
                worksheetData.Cells["C2"].Value = 299;
                worksheetData.Cells["C3"].Value = 792;
                worksheetData.Cells["C4"].Value = 458;
                worksheetData.Cells["C5"].Value = 299;
                worksheetData.Cells["C6"].Value = 792;
                worksheetData.Cells["C7"].Value = 458;
                worksheetData.Cells["C8"].Value = 299;
                worksheetData.Cells["C9"].Value = 792;
                worksheetData.Cells["C10"].Value = 458;
                worksheetData.Cells["C11"].Value = 299;

                worksheetData.Cells["D1"].Value = "Column D";
                worksheetData.Cells["D2"].Value = 40075;
                worksheetData.Cells["D3"].Value = 31415;
                worksheetData.Cells["D4"].Value = 384400;
                worksheetData.Cells["D5"].Value = 40075;
                worksheetData.Cells["D6"].Value = 31415;
                worksheetData.Cells["D7"].Value = 384400;
                worksheetData.Cells["D8"].Value = 40075;
                worksheetData.Cells["D9"].Value = 31415;
                worksheetData.Cells["D10"].Value = 384400;
                worksheetData.Cells["D11"].Value = 40075;

                //define the data range on the source sheet
                var dataRange = worksheetData.Cells[worksheetData.Dimension.Address];

                //create the pivot table
                var pivotTable = worksheetPivot.PivotTables.Add(worksheetPivot.Cells["B2"], dataRange, "PivotTable");

                //label field
                pivotTable.RowFields.Add(pivotTable.Fields["Column B"]);
                pivotTable.ColumnFields.Add(pivotTable.Fields["Column A"]);
                pivotTable.DataOnRows = false;

                var field = pivotTable.DataFields.Add(pivotTable.Fields["Column C"]);
                field.Name = "Sum of Column C";
                field.Function = DataFieldFunctions.Sum;
                field.Format = "0.00";
                excelPackage.Save();
            }

        }

        [HttpPost]
        public JsonResult moverows(int intFrom, int intTo, int intMasterID, string strTabname)
        {
            var obj = db.SP_Resource_Moverows(intFrom, intTo, intMasterID, strTabname);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getResourceComments(int intProjectID)
        {
            var obj = db.SP_Get_Resource_Comments(intProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getCapitalComments(int intProjectID)
        {
            var obj = db.SP_Get_Capital_Comments(intProjectID);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getCapitalLaborComments(int intProjectID)
        {
            var obj = db.SP_Get_CapitalLabor_Comments(intProjectID);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getDirectExpensesComments(int intProjectID)
        {
            var obj = db.SP_Get_DirectExpenses_Comments(intProjectID);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Obsolete]
        public JsonResult export_summarydata(int ProjectID, string ProjectNumber, string strProjectName)
        {
            //pivotetable();
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            string FileName = "";
            if (ProjectID > 0)
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(x => new { ProjectID = x.ProjectID, ProjectNumber = x.ProjectNumber }).ToList();
                var obj = db.SP_GetResourceData(Convert.ToInt32(ProjectID)).ToList();
                var obj_capital = db.SP_GetCapitalData(Convert.ToInt32(ProjectID)).ToList();
                var obj_capitallabor = db.SP_GetCapitalLaborData(Convert.ToInt32(ProjectID)).ToList();
                var obj_de = db.SP_GetDirectExpensesData(Convert.ToInt32(ProjectID)).ToList();
                var obj_summary = db.SP_GetProject_Summary(Convert.ToString(ProjectID), "", "", "").ToList();

                string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
                FileName = ProjectNumber.Replace("/", "") + "-" + strProjectName.Replace("/", "") + "-" + System.DateTime.Now.ToString("yyyy-MMM-dd-HHMMssfff") + ".xlsx";
                string Source = @System.Configuration.ConfigurationManager.AppSettings["Summarytemplate"];
                System.IO.File.Copy(Source, DestinationPath + FileName);
                FileInfo file = new FileInfo(DestinationPath + FileName);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage p = new ExcelPackage(file))
                {
                    var ws = p.Workbook.Worksheets["Resource"];
                    for (int i = 0; i < obj.Count; i++)
                    {
                        ws.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        ws.Cells["A" + (i + 3)].Value = obj[i].WBSNumber;
                        ws.Cells["B" + (i + 3)].Value = obj[i].Business;
                        ws.Cells["C" + (i + 3)].Value = obj[i].BusinessUnit;
                        ws.Cells["D" + (i + 3)].Value = obj[i].HighOrg;
                        ws.Cells["E" + (i + 3)].Value = obj[i].MidOrg;
                        ws.Cells["F" + (i + 3)].Value = obj[i].Team;
                        ws.Cells["G" + (i + 3)].Value = obj[i].RequiredSkill;
                        ws.Cells["H" + (i + 3)].Value = obj[i].FinYear;
                        ws.Cells["I" + (i + 3)].Value = obj[i].MAY;
                        ws.Cells["J" + (i + 3)].Value = obj[i].JUN;
                        ws.Cells["K" + (i + 3)].Value = obj[i].JUL;
                        ws.Cells["L" + (i + 3)].Value = obj[i].AUG;
                        ws.Cells["M" + (i + 3)].Value = obj[i].SEP;
                        ws.Cells["N" + (i + 3)].Value = obj[i].OCT;
                        ws.Cells["O" + (i + 3)].Value = obj[i].NOV;
                        ws.Cells["P" + (i + 3)].Value = obj[i].DEC;
                        ws.Cells["Q" + (i + 3)].Value = obj[i].JAN;
                        ws.Cells["R" + (i + 3)].Value = obj[i].FEB;
                        ws.Cells["S" + (i + 3)].Value = obj[i].MAR;
                        ws.Cells["T" + (i + 3)].Value = obj[i].APR;
                        ws.Cells["U" + (i + 3)].Value = obj[i].Comments;
                    }

                    var cap = p.Workbook.Worksheets["Capital"];
                    for (int i = 0; i < obj_capital.Count; i++)
                    {
                        cap.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        cap.Cells["A" + (i + 3)].Value = obj_capital[i].WBSNumber;
                        cap.Cells["B" + (i + 3)].Value = obj_capital[i].Priority;
                        cap.Cells["C" + (i + 3)].Value = obj_capital[i].Impactofnotinvesting;
                        cap.Cells["D" + (i + 3)].Value = obj_capital[i].CapitalCategory;
                        cap.Cells["E" + (i + 3)].Value = obj_capital[i].CapitalType;
                        cap.Cells["F" + (i + 3)].Value = obj_capital[i].Description;
                        cap.Cells["G" + (i + 3)].Value = obj_capital[i].AOPProject;
                        cap.Cells["H" + (i + 3)].Value = obj_capital[i].FinYear;
                        cap.Cells["I" + (i + 3)].Value = obj_capital[i].MAY;
                        cap.Cells["J" + (i + 3)].Value = obj_capital[i].JUN;
                        cap.Cells["K" + (i + 3)].Value = obj_capital[i].JUL;
                        cap.Cells["L" + (i + 3)].Value = obj_capital[i].AUG;
                        cap.Cells["M" + (i + 3)].Value = obj_capital[i].SEP;
                        cap.Cells["N" + (i + 3)].Value = obj_capital[i].OCT;
                        cap.Cells["O" + (i + 3)].Value = obj_capital[i].NOV;
                        cap.Cells["P" + (i + 3)].Value = obj_capital[i].DEC;
                        cap.Cells["Q" + (i + 3)].Value = obj_capital[i].JAN;
                        cap.Cells["R" + (i + 3)].Value = obj_capital[i].FEB;
                        cap.Cells["S" + (i + 3)].Value = obj_capital[i].MAR;
                        cap.Cells["T" + (i + 3)].Value = obj_capital[i].APR;
                    }

                    var caplabor = p.Workbook.Worksheets["CapitalLabor"];
                    for (int i = 0; i < obj_capitallabor.Count; i++)
                    {
                        caplabor.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        caplabor.Cells["A" + (i + 3)].Value = obj_capitallabor[i].WBSNumber;
                        caplabor.Cells["B" + (i + 3)].Value = obj_capitallabor[i].Business;
                        caplabor.Cells["C" + (i + 3)].Value = obj_capitallabor[i].BusinessUnit;
                        caplabor.Cells["D" + (i + 3)].Value = obj_capitallabor[i].HighOrg;
                        caplabor.Cells["E" + (i + 3)].Value = obj_capitallabor[i].MidOrg;
                        caplabor.Cells["F" + (i + 3)].Value = obj_capitallabor[i].Team;
                        caplabor.Cells["G" + (i + 3)].Value = obj_capitallabor[i].RequiredSkill;
                        caplabor.Cells["H" + (i + 3)].Value = obj_capitallabor[i].Priority;
                        caplabor.Cells["I" + (i + 3)].Value = obj_capitallabor[i].CapitalCategory;
                        caplabor.Cells["J" + (i + 3)].Value = obj_capitallabor[i].AOPProject;
                        caplabor.Cells["K" + (i + 3)].Value = obj_capitallabor[i].FisYear;
                        caplabor.Cells["L" + (i + 3)].Value = obj_capitallabor[i].MAY;
                        caplabor.Cells["M" + (i + 3)].Value = obj_capitallabor[i].JUN;
                        caplabor.Cells["N" + (i + 3)].Value = obj_capitallabor[i].JUL;
                        caplabor.Cells["O" + (i + 3)].Value = obj_capitallabor[i].AUG;
                        caplabor.Cells["P" + (i + 3)].Value = obj_capitallabor[i].SEP;
                        caplabor.Cells["Q" + (i + 3)].Value = obj_capitallabor[i].OCT;
                        caplabor.Cells["R" + (i + 3)].Value = obj_capitallabor[i].NOV;
                        caplabor.Cells["S" + (i + 3)].Value = obj_capitallabor[i].DEC;
                        caplabor.Cells["T" + (i + 3)].Value = obj_capitallabor[i].JAN;
                        caplabor.Cells["U" + (i + 3)].Value = obj_capitallabor[i].FEB;
                        caplabor.Cells["V" + (i + 3)].Value = obj_capitallabor[i].MAR;
                        caplabor.Cells["W" + (i + 3)].Value = obj_capitallabor[i].APR;
                    }

                    var de = p.Workbook.Worksheets["DirectExpenses"];
                    for (int i = 0; i < obj_de.Count; i++)
                    {
                        de.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        de.Cells["A" + (i + 3)].Value = obj_de[i].WBSNumber;
                        de.Cells["B" + (i + 3)].Value = obj_de[i].ExpenseCategory;
                        de.Cells["C" + (i + 3)].Value = obj_de[i].Description;
                        de.Cells["D" + (i + 3)].Value = obj_de[i].FisYear;
                        de.Cells["E" + (i + 3)].Value = obj_de[i].MAY;
                        de.Cells["F" + (i + 3)].Value = obj_de[i].JUN;
                        de.Cells["G" + (i + 3)].Value = obj_de[i].JUL;
                        de.Cells["H" + (i + 3)].Value = obj_de[i].AUG;
                        de.Cells["I" + (i + 3)].Value = obj_de[i].SEP;
                        de.Cells["J" + (i + 3)].Value = obj_de[i].OCT;
                        de.Cells["K" + (i + 3)].Value = obj_de[i].NOV;
                        de.Cells["L" + (i + 3)].Value = obj_de[i].DEC;
                        de.Cells["M" + (i + 3)].Value = obj_de[i].JAN;
                        de.Cells["N" + (i + 3)].Value = obj_de[i].FEB;
                        de.Cells["O" + (i + 3)].Value = obj_de[i].MAR;
                        de.Cells["P" + (i + 3)].Value = obj_de[i].APR;
                    }

                    var sd = p.Workbook.Worksheets["SummaryData"];
                    for (int i = 0; i < obj_summary.Count; i++)
                    {
                        sd.Cells["A" + (i + 2)].Value = obj_summary[i].SummaryID;
                        sd.Cells["B" + (i + 2)].Value = obj_summary[i].Name;
                        sd.Cells["C" + (i + 2)].Value = obj_summary[i].Type;
                        sd.Cells["D" + (i + 2)].Value = obj_summary[i].ProjectNumber;
                        sd.Cells["E" + (i + 2)].Value = obj_summary[i].ProjectName;
                        sd.Cells["F" + (i + 2)].Value = obj_summary[i].FisYear;
                        sd.Cells["G" + (i + 2)].Value = obj_summary[i].MID;
                        sd.Cells["H" + (i + 2)].Value = obj_summary[i].FisMonth;
                        sd.Cells["I" + (i + 2)].Value = obj_summary[i].FinYear_Month;
                        sd.Cells["J" + (i + 2)].Value = obj_summary[i].value;
                    }

                    var sp = p.Workbook.Worksheets["SummaryPivot"];

                    sp.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                    //define the data range on the source sheet
                    var dataRange = sd.Cells[sd.Dimension.Address];
                    //create the pivot table
                    var pivotTable = sp.PivotTables.Add(sp.Cells["A2"], dataRange, "PivotTable");

                    //label field
                    pivotTable.RowFields.Add(pivotTable.Fields["Name"]);
                    pivotTable.ColumnFields.Add(pivotTable.Fields["FinYear_Month"]);
                    pivotTable.DataOnRows = false;
                    pivotTable.ApplyBorderFormats = true;
                    pivotTable.TableStyle = TableStyles.Dark11;

                    var field = pivotTable.DataFields.Add(pivotTable.Fields["value"]);
                    field.Name = "Total Sum";
                    field.Function = DataFieldFunctions.Sum;
                    field.Format = "$0.00";
                    p.Save();
                }
            }

            return Json(FileName, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult export_resourcedata(int strProjectID, string strProjectNumber, string strProjectName)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            string FileName = "";
            if (strProjectName != "")
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(x => new { ProjectID = x.ProjectID, ProjectNumber = x.ProjectNumber }).ToList();
                var obj = db.SP_GetResourceData(strProjectID).ToList();

                string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
                FileName = "ResourceList" + System.DateTime.Now.ToString("yyyyMMddHHMMssfff") + ".xlsx";
                string Source = @System.Configuration.ConfigurationManager.AppSettings["Resourcetemplate"];
                System.IO.File.Copy(Source, DestinationPath + FileName);
                FileInfo file = new FileInfo(DestinationPath + FileName);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage p = new ExcelPackage(file))
                {
                    var ws = p.Workbook.Worksheets["ResourceList"];

                    for (int i = 0; i < obj.Count; i++)
                    {
                        ws.Cells["B1"].Value = strProjectNumber + " - " + strProjectName;
                        ws.Cells["A" + (i + 3)].Value = obj[i].WBSNumber;
                        ws.Cells["B" + (i + 3)].Value = obj[i].Business;

                        var drop_business = ws.DataValidations.AddListValidation("B" + (i + 3));
                        drop_business.Formula.ExcelFormula = "=NMaster!$F$2";
                        ws.Cells["B" + (i + 3)].Value = obj[i].Business;

                        var drop_businessunit = ws.DataValidations.AddListValidation("C" + (i + 3));
                        drop_businessunit.Formula.ExcelFormula = "=OFFSET(NMaster!H1,MATCH(B" + (i + 3) + ",NMaster!G2:G8,0),0,COUNTIF(NMaster!G2:G8,B" + (i + 3) + "),1)";
                        ws.Cells["C" + (i + 3)].Value = obj[i].BusinessUnit;

                        var drop_highorg = ws.DataValidations.AddListValidation("D" + (i + 3));
                        drop_highorg.Formula.ExcelFormula = "=OFFSET(NMaster!K1,MATCH(C" + (i + 3) + ",NMaster!J2:J64,0),0,COUNTIF(NMaster!J2:J64,C" + (i + 3) + "),1)";
                        ws.Cells["D" + (i + 3)].Value = obj[i].HighOrg;

                        var drop_midorg = ws.DataValidations.AddListValidation("E" + (i + 3));
                        drop_midorg.Formula.ExcelFormula = "=OFFSET(NMaster!N1,MATCH(D" + (i + 3) + ",NMaster!M2:M366,0),0,COUNTIF(NMaster!M2:M366,D" + (i + 3) + "),1)";
                        ws.Cells["E" + (i + 3)].Value = obj[i].MidOrg;

                        var drop_team = ws.DataValidations.AddListValidation("F" + (i + 3));
                        drop_team.Formula.ExcelFormula = "=OFFSET(NMaster!Q1,MATCH(E" + (i + 3) + ",NMaster!P2:P775,0),0,COUNTIF(NMaster!P2:P775,E" + (i + 3) + "),1)";
                        ws.Cells["F" + (i + 3)].Value = obj[i].Team;

                        var drop_skills = ws.DataValidations.AddListValidation("G" + (i + 3));
                        drop_skills.Formula.ExcelFormula = "=NMaster!$S$2:$S$323";
                        ws.Cells["G" + (i + 3)].Value = obj[i].RequiredSkill;

                        ws.Cells["H" + (i + 3)].Value = obj[i].FinYear;
                        ws.Cells["I" + (i + 3)].Value = obj[i].MAY;
                        ws.Cells["J" + (i + 3)].Value = obj[i].JUN;
                        ws.Cells["K" + (i + 3)].Value = obj[i].JUL;
                        ws.Cells["L" + (i + 3)].Value = obj[i].AUG;
                        ws.Cells["M" + (i + 3)].Value = obj[i].SEP;
                        ws.Cells["N" + (i + 3)].Value = obj[i].OCT;
                        ws.Cells["O" + (i + 3)].Value = obj[i].NOV;
                        ws.Cells["P" + (i + 3)].Value = obj[i].DEC;
                        ws.Cells["Q" + (i + 3)].Value = obj[i].JAN;
                        ws.Cells["R" + (i + 3)].Value = obj[i].FEB;
                        ws.Cells["S" + (i + 3)].Value = obj[i].MAR;
                        ws.Cells["T" + (i + 3)].Value = obj[i].APR;
                        ws.Cells["U" + (i + 3)].Value = obj[i].Comments;

                        //if (i == obj.Count - 1)
                        //{
                        //    for (int j = obj.Count; j < obj.Count + 100; j++)
                        //    {
                        //        var blank_business = ws.DataValidations.AddListValidation("B" + (j + 3));
                        //        blank_business.Formula.ExcelFormula = "=NMaster!$F$2";

                        //        var blank_businessunit = ws.DataValidations.AddListValidation("C" + (j + 3));
                        //        blank_businessunit.Formula.ExcelFormula = "=OFFSET(NMaster!H1,MATCH(B" + (j + 3) + ",NMaster!G2:G8,0),0,COUNTIF(NMaster!G2:G8,B" + (j + 3) + "),1)";

                        //        var blank_highorg = ws.DataValidations.AddListValidation("D" + (j + 3));
                        //        blank_highorg.Formula.ExcelFormula = "=OFFSET(NMaster!K1,MATCH(C" + (j + 3) + ",NMaster!J2:J64,0),0,COUNTIF(NMaster!J2:J64,C" + (j + 3) + "),1)";

                        //        var blank_midorg = ws.DataValidations.AddListValidation("E" + (j + 3));
                        //        blank_midorg.Formula.ExcelFormula = "=OFFSET(NMaster!N1,MATCH(D" + (j + 3) + ",NMaster!M2:M366,0),0,COUNTIF(NMaster!M2:M366,D" + (j + 3) + "),1)";

                        //        var blank_team = ws.DataValidations.AddListValidation("F" + (j + 3));
                        //        blank_team.Formula.ExcelFormula = "=OFFSET(NMaster!Q1,MATCH(E" + (j + 3) + ",NMaster!P2:P775,0),0,COUNTIF(NMaster!P2:P775,E" + (j + 3) + "),1)";

                        //        var blank_skills = ws.DataValidations.AddListValidation("G" + (j + 3));
                        //        blank_skills.Formula.ExcelFormula = "=NMaster!$S$2:$S$323";
                        //    }
                        //}

                        p.Save();
                    }

                }
            }

            return Json(FileName, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult export_capitallabordata(int ProjectID, string ProjectNumber, string strProjectName)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            string FileName = "";
            if (ProjectID > 0)
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(x => new { ProjectID = x.ProjectID, ProjectNumber = x.ProjectNumber }).ToList();
                var obj = db.SP_GetCapitalLaborData(ProjectID).ToList();

                string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
                FileName = "Capitallabor" + System.DateTime.Now.ToString("yyyyMMddHHMMssfff") + ".xlsx";
                string Source = @System.Configuration.ConfigurationManager.AppSettings["Capitallabortemplate"];
                System.IO.File.Copy(Source, DestinationPath + FileName);
                FileInfo file = new FileInfo(DestinationPath + FileName);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage p = new ExcelPackage(file))
                {
                    var ws = p.Workbook.Worksheets["CapitallaborList"];

                    for (int i = 0; i < obj.Count; i++)
                    {
                        ws.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        ws.Cells["A" + (i + 3)].Value = obj[i].WBSNumber;
                        ws.Cells["B" + (i + 3)].Value = obj[i].Business;

                        var drop_business = ws.DataValidations.AddListValidation("B" + (i + 3));
                        drop_business.Formula.ExcelFormula = "=NMaster!$F$2";
                        ws.Cells["B" + (i + 3)].Value = obj[i].Business;

                        var drop_businessunit = ws.DataValidations.AddListValidation("C" + (i + 3));
                        drop_businessunit.Formula.ExcelFormula = "=OFFSET(NMaster!H1,MATCH(B" + (i + 3) + ",NMaster!G2:G8,0),0,COUNTIF(NMaster!G2:G8,B" + (i + 3) + "),1)";
                        ws.Cells["C" + (i + 3)].Value = obj[i].BusinessUnit;

                        var drop_highorg = ws.DataValidations.AddListValidation("D" + (i + 3));
                        drop_highorg.Formula.ExcelFormula = "=OFFSET(NMaster!K1,MATCH(C" + (i + 3) + ",NMaster!J2:J64,0),0,COUNTIF(NMaster!J2:J64,C" + (i + 3) + "),1)";
                        ws.Cells["D" + (i + 3)].Value = obj[i].HighOrg;

                        var drop_midorg = ws.DataValidations.AddListValidation("E" + (i + 3));
                        drop_midorg.Formula.ExcelFormula = "=OFFSET(NMaster!N1,MATCH(D" + (i + 3) + ",NMaster!M2:M366,0),0,COUNTIF(NMaster!M2:M366,D" + (i + 3) + "),1)";
                        ws.Cells["E" + (i + 3)].Value = obj[i].MidOrg;

                        var drop_team = ws.DataValidations.AddListValidation("F" + (i + 3));
                        drop_team.Formula.ExcelFormula = "=OFFSET(NMaster!Q1,MATCH(E" + (i + 3) + ",NMaster!P2:P775,0),0,COUNTIF(NMaster!P2:P775,E" + (i + 3) + "),1)";
                        ws.Cells["F" + (i + 3)].Value = obj[i].Team;

                        var drop_skills = ws.DataValidations.AddListValidation("G" + (i + 3));
                        drop_skills.Formula.ExcelFormula = "=NMaster!$S$2:$S$323";
                        ws.Cells["G" + (i + 3)].Value = obj[i].RequiredSkill;

                        var drop_priority = ws.DataValidations.AddListValidation("H" + (i + 3));
                        drop_priority.Formula.ExcelFormula = "=MasterList!$V$2:$V$6";
                        ws.Cells["H" + (i + 3)].Value = obj[i].Priority;

                        var drop_CapitalCategory = ws.DataValidations.AddListValidation("I" + (i + 3));
                        drop_CapitalCategory.Formula.ExcelFormula = "=MasterList!$W$2:$W$9";
                        ws.Cells["I" + (i + 3)].Value = obj[i].CapitalCategory;

                        var drop_AOPProject = ws.DataValidations.AddListValidation("J" + (i + 3));
                        drop_AOPProject.Formula.ExcelFormula = "=MasterList!$X$2:$X$47";
                        ws.Cells["J" + (i + 3)].Value = obj[i].AOPProject;

                        var drop_FisYear = ws.DataValidations.AddListValidation("K" + (i + 3));
                        drop_FisYear.Formula.ExcelFormula = "=MasterList!$U$2:$U$323";
                        ws.Cells["K" + (i + 3)].Value = obj[i].FisYear;

                        ws.Cells["L" + (i + 3)].Value = obj[i].MAY;
                        ws.Cells["M" + (i + 3)].Value = obj[i].JUN;
                        ws.Cells["N" + (i + 3)].Value = obj[i].JUL;
                        ws.Cells["O" + (i + 3)].Value = obj[i].AUG;
                        ws.Cells["P" + (i + 3)].Value = obj[i].SEP;
                        ws.Cells["Q" + (i + 3)].Value = obj[i].OCT;
                        ws.Cells["R" + (i + 3)].Value = obj[i].NOV;
                        ws.Cells["S" + (i + 3)].Value = obj[i].DEC;
                        ws.Cells["T" + (i + 3)].Value = obj[i].JAN;
                        ws.Cells["U" + (i + 3)].Value = obj[i].FEB;
                        ws.Cells["V" + (i + 3)].Value = obj[i].MAR;
                        ws.Cells["W" + (i + 3)].Value = obj[i].APR;

                        if (i == obj.Count - 1)
                        {
                            for (int j = obj.Count; j < obj.Count + 100; j++)
                            {
                                var blank_business = ws.DataValidations.AddListValidation("B" + (j + 3));
                                blank_business.Formula.ExcelFormula = "=NMaster!$F$2";

                                var blank_businessunit = ws.DataValidations.AddListValidation("C" + (j + 3));
                                blank_businessunit.Formula.ExcelFormula = "=OFFSET(NMaster!H1,MATCH(B" + (j + 3) + ",NMaster!G2:G8,0),0,COUNTIF(NMaster!G2:G8,B" + (j + 3) + "),1)";

                                var blank_highorg = ws.DataValidations.AddListValidation("D" + (j + 3));
                                blank_highorg.Formula.ExcelFormula = "=OFFSET(NMaster!K1,MATCH(C" + (j + 3) + ",NMaster!J2:J64,0),0,COUNTIF(NMaster!J2:J64,C" + (j + 3) + "),1)";

                                var blank_midorg = ws.DataValidations.AddListValidation("E" + (j + 3));
                                blank_midorg.Formula.ExcelFormula = "=OFFSET(NMaster!N1,MATCH(D" + (j + 3) + ",NMaster!M2:M366,0),0,COUNTIF(NMaster!M2:M366,D" + (j + 3) + "),1)";

                                var blank_team = ws.DataValidations.AddListValidation("F" + (j + 3));
                                blank_team.Formula.ExcelFormula = "=OFFSET(NMaster!Q1,MATCH(E" + (j + 3) + ",NMaster!P2:P775,0),0,COUNTIF(NMaster!P2:P775,E" + (j + 3) + "),1)";

                                var blank_skills = ws.DataValidations.AddListValidation("G" + (j + 3));
                                blank_skills.Formula.ExcelFormula = "=NMaster!$S$2:$S$323";

                                var drop_priority_blank = ws.DataValidations.AddListValidation("H" + (j + 3));
                                drop_priority_blank.Formula.ExcelFormula = "=MasterList!$V$2:$V$6";

                                var drop_CapitalCategory_blank = ws.DataValidations.AddListValidation("I" + (j + 3));
                                drop_CapitalCategory_blank.Formula.ExcelFormula = "=MasterList!$W$2:$W$9";

                                var drop_AOPProject_blank = ws.DataValidations.AddListValidation("J" + (j + 3));
                                drop_AOPProject_blank.Formula.ExcelFormula = "=MasterList!$X$2:$X$47";

                                var drop_FisYear_blank = ws.DataValidations.AddListValidation("K" + (j + 3));
                                drop_FisYear_blank.Formula.ExcelFormula = "=MasterList!$U$2:$U$323";
                            }
                        }

                        p.Save();
                    }

                }
            }

            return Json(FileName, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult export_dedata(int ProjectID, string ProjectNumber, string strProjectName)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            string FileName = "";
            if (strProjectName != "")
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(x => new { ProjectID = x.ProjectID, ProjectNumber = x.ProjectNumber }).ToList();
                var obj = db.SP_GetDirectExpensesData(ProjectID).ToList();

                string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
                FileName = "DE" + System.DateTime.Now.ToString("yyyyMMddHHMMssfff") + ".xlsx";
                string Source = @System.Configuration.ConfigurationManager.AppSettings["DEtemplate"];
                System.IO.File.Copy(Source, DestinationPath + FileName);
                FileInfo file = new FileInfo(DestinationPath + FileName);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage p = new ExcelPackage(file))
                {
                    var ws = p.Workbook.Worksheets["DEList"];

                    for (int i = 0; i < obj.Count; i++)
                    {
                        ws.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        ws.Cells["A" + (i + 3)].Value = obj[i].WBSNumber;

                        var drop_ExpenseCategory = ws.DataValidations.AddListValidation("B" + (i + 3));
                        drop_ExpenseCategory.Formula.ExcelFormula = "=Master!$A$2:$A$8";
                        ws.Cells["B" + (i + 3)].Value = obj[i].ExpenseCategory;

                        ws.Cells["C" + (i + 3)].Value = obj[i].Description;

                        var drop_Finyear = ws.DataValidations.AddListValidation("D" + (i + 3));
                        drop_Finyear.Formula.ExcelFormula = "=Master!$B$2:$B$323";
                        ws.Cells["D" + (i + 3)].Value = obj[i].FisYear;

                        ws.Cells["E" + (i + 3)].Value = obj[i].MAY;
                        ws.Cells["F" + (i + 3)].Value = obj[i].JUN;
                        ws.Cells["G" + (i + 3)].Value = obj[i].JUL;
                        ws.Cells["H" + (i + 3)].Value = obj[i].AUG;
                        ws.Cells["I" + (i + 3)].Value = obj[i].SEP;
                        ws.Cells["J" + (i + 3)].Value = obj[i].OCT;
                        ws.Cells["K" + (i + 3)].Value = obj[i].NOV;
                        ws.Cells["L" + (i + 3)].Value = obj[i].DEC;
                        ws.Cells["M" + (i + 3)].Value = obj[i].JAN;
                        ws.Cells["N" + (i + 3)].Value = obj[i].FEB;
                        ws.Cells["O" + (i + 3)].Value = obj[i].MAR;
                        ws.Cells["P" + (i + 3)].Value = obj[i].APR;

                        if (i == obj.Count - 1)
                        {
                            for (int j = obj.Count; j < obj.Count + 100; j++)
                            {
                                var drop_ExpenseCategory_blank = ws.DataValidations.AddListValidation("B" + (j + 3));
                                drop_ExpenseCategory_blank.Formula.ExcelFormula = "=Master!$A$2:$A$8";

                                var drop_Finyear_blank = ws.DataValidations.AddListValidation("D" + (j + 3));
                                drop_Finyear_blank.Formula.ExcelFormula = "=Master!$B$2:$B$323";
                            }
                        }

                        p.Save();
                    }

                }
            }

            return Json(FileName, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult export_capitaldata(int ProjectID, string ProjectNumber, string strProjectName)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            string FileName = "";
            if (strProjectName != "")
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(x => new { ProjectID = x.ProjectID, ProjectNumber = x.ProjectNumber }).ToList();
                var obj = db.SP_GetCapitalData(ProjectID).ToList();

                string DestinationPath = @System.Configuration.ConfigurationManager.AppSettings["UploadFiles"];
                FileName = "Capital" + System.DateTime.Now.ToString("yyyyMMddHHMMssfff") + ".xlsx";
                string Source = @System.Configuration.ConfigurationManager.AppSettings["Capitaltemplate"];
                System.IO.File.Copy(Source, DestinationPath + FileName);
                FileInfo file = new FileInfo(DestinationPath + FileName);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (ExcelPackage p = new ExcelPackage(file))
                {
                    var ws = p.Workbook.Worksheets["CapitalList"];

                    for (int i = 0; i < obj.Count; i++)
                    {
                        ws.Cells["B1"].Value = ProjectNumber + " - " + strProjectName;
                        ws.Cells["A" + (i + 3)].Value = obj[i].WBSNumber;

                        var drop_priority = ws.DataValidations.AddListValidation("B" + (i + 3));
                        drop_priority.Formula.ExcelFormula = "=MasterList!$A$2:$A$6";
                        ws.Cells["B" + (i + 3)].Value = obj[i].Priority;

                        ws.Cells["C" + (i + 3)].Value = obj[i].Impactofnotinvesting;

                        var drop_CapitalCategory = ws.DataValidations.AddListValidation("D" + (i + 3));
                        drop_CapitalCategory.Formula.ExcelFormula = "=MasterList!$B$2:$B$9";
                        ws.Cells["D" + (i + 3)].Value = obj[i].CapitalCategory;

                        var drop_CapitalType = ws.DataValidations.AddListValidation("E" + (i + 3));
                        drop_CapitalType.Formula.ExcelFormula = "=MasterList!$C$2:$C$7";
                        ws.Cells["E" + (i + 3)].Value = obj[i].CapitalType;

                        ws.Cells["F" + (i + 3)].Value = obj[i].Description;

                        var drop_AOPProject = ws.DataValidations.AddListValidation("G" + (i + 3));
                        drop_AOPProject.Formula.ExcelFormula = "=MasterList!$D$2:$D$47";
                        ws.Cells["G" + (i + 3)].Value = obj[i].AOPProject;

                        var drop_Finyear = ws.DataValidations.AddListValidation("H" + (i + 3));
                        drop_Finyear.Formula.ExcelFormula = "=MasterList!$E$2:$E$323";
                        ws.Cells["H" + (i + 3)].Value = obj[i].FinYear;

                        ws.Cells["I" + (i + 3)].Value = obj[i].MAY;
                        ws.Cells["J" + (i + 3)].Value = obj[i].JUN;
                        ws.Cells["K" + (i + 3)].Value = obj[i].JUL;
                        ws.Cells["L" + (i + 3)].Value = obj[i].AUG;
                        ws.Cells["M" + (i + 3)].Value = obj[i].SEP;
                        ws.Cells["N" + (i + 3)].Value = obj[i].OCT;
                        ws.Cells["O" + (i + 3)].Value = obj[i].NOV;
                        ws.Cells["P" + (i + 3)].Value = obj[i].DEC;
                        ws.Cells["Q" + (i + 3)].Value = obj[i].JAN;
                        ws.Cells["R" + (i + 3)].Value = obj[i].FEB;
                        ws.Cells["S" + (i + 3)].Value = obj[i].MAR;
                        ws.Cells["T" + (i + 3)].Value = obj[i].APR;

                        if (i == obj.Count - 1)
                        {
                            for (int j = obj.Count; j < obj.Count + 100; j++)
                            {
                                var drop_priority_blank = ws.DataValidations.AddListValidation("B" + (j + 3));
                                drop_priority_blank.Formula.ExcelFormula = "=MasterList!$A$2:$A$6";

                                var drop_CapitalCategory_blank = ws.DataValidations.AddListValidation("D" + (j + 3));
                                drop_CapitalCategory_blank.Formula.ExcelFormula = "=MasterList!$B$2:$B$9";

                                var drop_CapitalType_blank = ws.DataValidations.AddListValidation("E" + (j + 3));
                                drop_CapitalType_blank.Formula.ExcelFormula = "=MasterList!$C$2:$C$7";

                                var drop_AOPProject_blank = ws.DataValidations.AddListValidation("G" + (j + 3));
                                drop_AOPProject_blank.Formula.ExcelFormula = "=MasterList!$D$2:$D$47";

                                var drop_Finyear_blank = ws.DataValidations.AddListValidation("H" + (j + 3));
                                drop_Finyear_blank.Formula.ExcelFormula = "=MasterList!$E$2:$E$323";
                            }
                        }

                        p.Save();
                    }

                }
            }

            return Json(FileName, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getresourcedata(int ProjectID)
        {
            var obj = db.SP_GetResourceData(ProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getresourcedata_forCheckBook(int intProjectID, string strWBSNumber, string strBU, string strHighOrg, string strMidOrg, string strTeams, int intFisYear)
        {
            var obj = db.SP_GetResourceData_forCheckBook(intProjectID, strWBSNumber, strBU, strHighOrg, strMidOrg, strTeams, intFisYear).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getcapitaldata(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            if (ProjectID > 0)
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(y => y.ProjectID).ToList();
                var obj = db.SP_GetCapitalData(ProjectID).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getcapitallabourdata(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            if (ProjectID > 0)
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(y => y.ProjectID).ToList();
                var obj = db.SP_GetCapitalLaborData(ProjectID).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getDirectExpensedata(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            if (ProjectID > 0)
            {
                //var projectid = db.Configure_Project
                //.Where(x => x.ProjectName == strProjectName)
                //.Select(y => y.ProjectID).ToList();

                var obj = db.SP_GetDirectExpensesData(ProjectID).ToList();
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getskillmaster()
        {
            var obj = db.SP_Get_Skillmaster().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getprojectname(int ProjectID)
        {
            //string strprojectname = Convert.ToString(Session["ProjectName"]);
            var projectinfo = db.Configure_Project.Where(x => x.ProjectID == ProjectID)
                .Select(x => new { x.ProjectNumber, x.ProjectName, x.VersionNumber }).ToList();
            return Json(projectinfo, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getsummary_getfisyear(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var obj = db.SP_Filter_GetFinYear(ProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getsummary_getmonths(string strFinYear, int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var obj = db.SP_Filter_GetMonths(ProjectID, strFinYear);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getsummary_getqtr(string strmonths)
        {
            var obj = db.SP_Filter_GetQuarter(strmonths);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getversiondetails(string strProjectID)
        {
            var projectinfo = db.Configure_Project.Where(x => x.ProjectNumber == strProjectID).Select(x => new { x.ProjectNumber, x.ProjectName, x.VersionNumber }).ToList();
            return Json(projectinfo, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getsummarydata(string strFisyear, string strMonth, string strQtr, string ProjectID)
        {
            if (strFisyear.Length > 0)
            {
                strFisyear = strFisyear.Replace(";", ",");
            }

            if (strMonth.Length > 0)
            {
                strMonth = strMonth.Replace(";", ",");
            }

            if (strQtr.Length > 0)
            {
                //test commit.
                strQtr = strQtr.Replace(";", ",");
            }

            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var obj = db.SP_GetProject_Summary(ProjectID, strFisyear, strMonth, strQtr).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        //public string getsdata(int ProjectID)
        //{
        //    DataTable table = new DataTable();
        //    using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["Connectionstring"].ConnectionString))
        //    using (var cmd = new SqlCommand("SP_GetNewSummary", con))
        //    using (var da = new SqlDataAdapter(cmd))
        //    {
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.Parameters.AddWithValue("@ProjectID", SqlDbType.VarChar).Value = ProjectID;
        //        cmd.Parameters.AddWithValue("@FisYear", SqlDbType.VarChar).Value = "";
        //        cmd.Parameters.AddWithValue("@Month", SqlDbType.VarChar).Value = "";
        //        cmd.Parameters.AddWithValue("@Qtr", SqlDbType.VarChar).Value = "";
        //        da.Fill(table);
        //    }

        //    string strTabledata = ConvertDataTableToHTML(table);
        //    return strTabledata;
        //}

        //public static string ConvertDataTableToHTML(DataTable dt)
        //{
        //    string html = "<table class='table table-bordered table-striped'>";
        //    //add header row
        //    html += "<tr class='table-primary'>";
        //    for (int i = 0; i < dt.Columns.Count; i++)
        //    {
        //        html += "<td>" + dt.Columns[i].ColumnName + "</td>";
        //    }

        //    html += "</tr>";
        //    //add rows
        //    for (int i = 0; i < dt.Rows.Count; i++)
        //    {
        //        html += "<tr>";
        //        for (int j = 0; j < dt.Columns.Count; j++)
        //        {
        //            html += "<td>" + dt.Rows[i][j].ToString() + "</td>";
        //        }

        //        html += "</tr>";
        //    }
        //    html += "</table>";
        //    return html;
        //}

        [HttpGet]
        public JsonResult getCapitalCategory()
        {
            var obj = db.Configure_App_Master.Where(x => x.type == "Capital Category").Select(y => y.name).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getCapitalType()
        {
            var obj = db.Configure_App_Master.Where(x => x.type == "Capital Type").Select(y => y.name).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getpriority()
        {
            var obj = db.Configure_App_Master.Where(x => x.type == "priority").Select(y => y.name).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAOPProject()
        {
            var obj = db.Master_AOPProject.OrderBy(z => z.Name).Select(y => y.Name).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getexpensecategory()
        {
            var obj = db.Configure_App_Master.Where(x => x.type == "Expense Category").Select(y => y.name).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getBusiness()
        {
            var obj = db.SP_Get_Business().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getOperatingExpenseWBS(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var obj = db.SP_Get_OperatingExpenseWBS(ProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getCapitalExpenditureWBS(int ProjectID)
        {
            //string strProjectName = Convert.ToString(Session["ProjectName"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var obj = db.SP_Get_CapitalExpenditureWBS(ProjectID).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getBU(string strBusiness)
        {
            var obj = db.SP_Get_BusinessUnit(strBusiness).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getHighOrg(string strBusiness, string strBU)
        {
            var obj = db.SP_Get_HighOrg(strBusiness, strBU).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getTeamData(
            string strBusiness,
            string strBU,
            string strHighOrg,
            string strMidOrg)
        {
            var obj = db.SP_Get_Team(strBusiness, strBU, strHighOrg, strMidOrg).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getMidOrgData(
            string strBusiness,
            string strBU,
            string strHighOrg)
        {
            var obj = db.SP_Get_MidOrg(strBusiness, strBU, strHighOrg).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getRequiredSkillData(
            string strBusiness,
            string strBU,
            string strHighOrg,
            string strMidOrg,
            string strTeam)
        {
            var obj = db.SP_Get_RequiredSkills(strBusiness, strBU, strHighOrg, strMidOrg, strTeam).ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SkillData()
        {
            var obj = db.Configure_Skill.Select(y => y.RequiredSkills).Distinct();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getprojectlist()
        {
            var obj = db.SP_Get_Projects().ToList();
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult addCapitalInfo(string strProjectName, string strWBSNumber,
                string strPriority,
                string strImpactofnotinvesting,
                string strCapitalCategory,
                string strCapitalType,
                string strDescription,
                string strAOPProject, string userid, int ProjectID)
        {
            //string userid = Convert.ToString(Session["userid"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            //var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == strAOPProject).Select(y => y.Sysid).ToList();

            int AOPID = 0;
            var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == strAOPProject).Select(y => y.Sysid).ToList();
            if (AOPProjectID.Count >= 1)
                AOPID = AOPProjectID[0];

            var tabledata = new CapitalInfo
            {
                ProjectID = Convert.ToInt32(ProjectID),
                Type = " Std Labor",
                WBSNumber = strWBSNumber,
                Priority = strPriority,
                Impactofnotinvesting = strImpactofnotinvesting,
                CapitalCategory = strCapitalCategory,
                CapitalType = strCapitalType,
                Description = strDescription,
                AOPProject = AOPID,
                CreatedBy = userid,
                CreatedOn = DateTime.Now
            };

            db.CapitalInfoes.Add(tabledata);
            db.SaveChanges();

            int masterID = tabledata.MasterID;

            CapitalInfo result = (from p in db.CapitalInfoes
                                  where p.MasterID == masterID
                                  select p).SingleOrDefault();
            if (result != null)
            {
                result.RowID = masterID;
                db.SaveChanges();
            }

            string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

            foreach (var month in months)
            {
                CapitalInfoList obj = new CapitalInfoList();
                obj.MasterID = masterID;
                obj.FinYear = "2022";
                obj.Month = month;
                obj.value = 0;
                db.CapitalInfoLists.Add(obj);
                db.SaveChanges();
            }

            return Json("success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult addCapitalLaborInfo(string strWBSNumber,
                string strPriority,
                string strCapitalCategory, string strbusiness,
                string strbu,
                string strhighorg,
                string strmidorg,
                string strteam,
                string strrequiredskills, string strAOPProject, string userid, int ProjectID, string strComments)
        {
            //string userid = Convert.ToString(Session["userid"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();

            int AOPID = 0;
            var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == strAOPProject).Select(y => y.Sysid).ToList();
            if (AOPProjectID.Count >= 1)
                AOPID = AOPProjectID[0];

            var tabledata = new CapitalLaborInfo
            {
                ProjectID = ProjectID,
                Type = " Std Labor",
                WBSnumber = strWBSNumber,
                Priority = strPriority,
                CapitalCategory = strCapitalCategory,
                Business = strbusiness,
                BusinessUnit = strbu,
                HighOrg = strhighorg,
                MidOrg = strmidorg,
                Team = strteam,
                AOPProject = AOPID,
                Comments = strComments,
                RequiredSkill = strrequiredskills,
                CreatedBy = userid,
                CreatedOn = DateTime.Now
            };

            db.CapitalLaborInfoes.Add(tabledata);
            db.SaveChanges();

            int masterID = tabledata.MasterID;

            CapitalLaborInfo result = (from p in db.CapitalLaborInfoes
                                       where p.MasterID == masterID
                                       select p).SingleOrDefault();
            if (result != null)
            {
                result.RowID = masterID;
                db.SaveChanges();
            }

            string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

            foreach (var month in months)
            {
                CapitalLaborInfoList obj = new CapitalLaborInfoList();
                obj.MasterID = masterID;
                obj.FisYear = "2022";
                obj.Month = month;
                obj.value = 0;
                db.CapitalLaborInfoLists.Add(obj);
                db.SaveChanges();
            }

            return Json("success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult adddirectexpenseInfo(string strWBSNumber, string strProjectName, string strExpensecategory,
                string strdescription, string userid, int ProjectID)
        {
            //string userid = Convert.ToString(Session["userid"]);
            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();

            var tabledata = new DirectExpensesInfo
            {
                WBSNumber = strWBSNumber,
                ProjectID = ProjectID,
                Type = " Std Labor",
                ExpenseCategory = strExpensecategory,
                Description = strdescription,
                CreatedBy = userid,
                CreatedOn = DateTime.Now
            };

            db.DirectExpensesInfoes.Add(tabledata);
            db.SaveChanges();

            int masterID = tabledata.MasterID;

            DirectExpensesInfo result = (from p in db.DirectExpensesInfoes
                                         where p.MasterID == masterID
                                         select p).SingleOrDefault();

            if (result != null)
            {
                result.RowID = masterID;
                db.SaveChanges();
            }

            string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

            foreach (var month in months)
            {
                DirectExpensesInfoList obj = new DirectExpensesInfoList();
                obj.MasterID = masterID;
                obj.FisYear = "2022";
                obj.Month = month;
                obj.value = 0;
                db.DirectExpensesInfoLists.Add(obj);
                db.SaveChanges();
            }

            return Json("success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult addResourceInfo(
            string strWBSNumber,
            string strbusiness,
            string strbu,
            string strhighorg,
            string strmidorg,
            string strteam,
            string strrequiredskills,
            string strcomments, string userid, int ProjectID)
        {

            //var projectid = db.Configure_Project.Where(x => x.ProjectName == strProjectName).Select(y => y.ProjectID).ToList();
            var tabledata = new ResourceInfo
            {

                ProjectID = ProjectID,
                Type = " Std Labor",
                WBSNumber = strWBSNumber,
                Business = strbusiness,
                BusinessUnit = strbu,
                HighOrg = strhighorg,
                MidOrg = strmidorg,
                Team = strteam,
                RequiredSkill = strrequiredskills,
                Comments = strcomments,
                CreatedBy = userid,
                CreatedOn = DateTime.Now,
            };

            db.ResourceInfoes.Add(tabledata);
            db.SaveChanges();

            int masterID = tabledata.MasterID;

            ResourceInfo result = (from p in db.ResourceInfoes
                                   where p.MasterID == masterID
                                   select p).SingleOrDefault();

            if (result != null)
            {
                result.RowID = masterID;
                db.SaveChanges();
            }

            string[] months = { "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR" };

            foreach (var month in months)
            {
                ResourceInfoList obj = new ResourceInfoList();
                obj.MasterID = masterID;
                obj.FinYear = "2022";
                obj.Month = month;
                obj.TimeSpentInProject = 0;
                db.ResourceInfoLists.Add(obj);
                db.SaveChanges();
            }

            return Json("success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult submitcapitallaborchanges(objcapitallabor obj)
        {
            //string userid = Convert.ToString(Session["userid"]);
            if (obj.duplicate != null)
            {
                foreach (var item in obj.duplicate)
                {
                    db.SP_Duplicate_CapitallaborRows(item.MasterID, obj.userid);
                }
            }

            if (obj.update != null)
            {
                foreach (var item in obj.update)
                {
                    //var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == item.AOPProject).Select(y => y.Sysid).ToList();

                    int AOPID = 0;
                    var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == item.AOPProject).Select(y => y.Sysid).ToList();
                    if (AOPProjectID.Count >= 1)
                        AOPID = AOPProjectID[0];

                    CapitalLaborInfo row = db.CapitalLaborInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                    if (row != null)
                    {
                        row.Type = item.Type;
                        row.WBSnumber = item.WBSNumber;
                        row.Priority = item.Priority;
                        row.CapitalCategory = item.CapitalCategory;
                        row.Business = item.Business;
                        row.BusinessUnit = item.BusinessUnit;
                        row.HighOrg = item.HighOrg;
                        row.MidOrg = item.MidOrg;
                        row.Team = item.Team;
                        row.RequiredSkill = item.RequiredSkill;
                        row.Comments = item.Comments;
                        row.AOPProject = AOPID;
                        row.ModifiedBy = obj.userid;
                        row.ModifiedOn = DateTime.Now;

                        //MAY
                        CapitalLaborInfoList row_may = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAY");

                        if (row_may == null)
                        {
                            CapitalLaborInfoList insert_row_may = new CapitalLaborInfoList();
                            insert_row_may.MasterID = item.MasterID;
                            insert_row_may.FisYear = item.FisYear;
                            insert_row_may.Month = "MAY";
                            insert_row_may.value = item.MAY;
                            db.CapitalLaborInfoLists.Add(insert_row_may);
                        }
                        else
                        {
                            row_may.FisYear = item.FisYear;
                            row_may.value = item.MAY;
                        }

                        //JUN
                        CapitalLaborInfoList row_june = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUN");

                        if (row_june == null)
                        {
                            CapitalLaborInfoList insert_row_june = new CapitalLaborInfoList();
                            insert_row_june.MasterID = item.MasterID;
                            insert_row_june.FisYear = item.FisYear;
                            insert_row_june.Month = "JUN";
                            insert_row_june.value = item.JUN;
                            db.CapitalLaborInfoLists.Add(insert_row_june);
                        }
                        else
                        {
                            row_june.FisYear = item.FisYear;
                            row_june.value = item.JUN;
                        }

                        //JUL
                        CapitalLaborInfoList row_july = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUL");

                        if (row_july == null)
                        {
                            CapitalLaborInfoList insert_row_july = new CapitalLaborInfoList();
                            insert_row_july.MasterID = item.MasterID;
                            insert_row_july.FisYear = item.FisYear;
                            insert_row_july.Month = "JUL";
                            insert_row_july.value = item.JUL;
                            db.CapitalLaborInfoLists.Add(insert_row_july);
                        }
                        else
                        {
                            row_july.FisYear = item.FisYear;
                            row_july.value = item.JUL;
                        }

                        //AUG
                        CapitalLaborInfoList row_aug = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "AUG");

                        if (row_aug == null)
                        {
                            CapitalLaborInfoList insert_row_aug = new CapitalLaborInfoList();
                            insert_row_aug.MasterID = item.MasterID;
                            insert_row_aug.FisYear = item.FisYear;
                            insert_row_aug.Month = "AUG";
                            insert_row_aug.value = item.AUG;
                            db.CapitalLaborInfoLists.Add(insert_row_aug);
                        }
                        else
                        {
                            row_aug.FisYear = item.FisYear;
                            row_aug.value = item.AUG;
                        }

                        //SEP
                        CapitalLaborInfoList row_sep = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "SEP");

                        if (row_sep == null)
                        {
                            CapitalLaborInfoList insert_row_sep = new CapitalLaborInfoList();
                            insert_row_sep.MasterID = item.MasterID;
                            insert_row_sep.FisYear = item.FisYear;
                            insert_row_sep.Month = "SEP";
                            insert_row_sep.value = item.SEP;
                            db.CapitalLaborInfoLists.Add(insert_row_sep);
                        }
                        else
                        {
                            row_sep.FisYear = item.FisYear;
                            row_sep.value = item.SEP;
                        }


                        //OCT
                        CapitalLaborInfoList row_oct = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "OCT");

                        if (row_oct == null)
                        {
                            CapitalLaborInfoList insert_row_oct = new CapitalLaborInfoList();
                            insert_row_oct.MasterID = item.MasterID;
                            insert_row_oct.FisYear = item.FisYear;
                            insert_row_oct.Month = "OCT";
                            insert_row_oct.value = item.OCT;
                            db.CapitalLaborInfoLists.Add(insert_row_oct);
                        }
                        else
                        {
                            row_oct.FisYear = item.FisYear;
                            row_oct.value = item.OCT;
                        }

                        //NOV
                        CapitalLaborInfoList row_nov = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "NOV");

                        if (row_nov == null)
                        {
                            CapitalLaborInfoList insert_row_nov = new CapitalLaborInfoList();
                            insert_row_nov.MasterID = item.MasterID;
                            insert_row_nov.FisYear = item.FisYear;
                            insert_row_nov.Month = "NOV";
                            insert_row_nov.value = item.NOV;
                            db.CapitalLaborInfoLists.Add(insert_row_nov);
                        }
                        else
                        {
                            row_nov.FisYear = item.FisYear;
                            row_nov.value = item.NOV;
                        }

                        //DEC
                        CapitalLaborInfoList row_dec = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "DEC");

                        if (row_dec == null)
                        {
                            CapitalLaborInfoList insert_row_dec = new CapitalLaborInfoList();
                            insert_row_dec.MasterID = item.MasterID;
                            insert_row_dec.FisYear = item.FisYear;
                            insert_row_dec.Month = "DEC";
                            insert_row_dec.value = item.DEC;
                            db.CapitalLaborInfoLists.Add(insert_row_dec);
                        }
                        else
                        {
                            row_dec.FisYear = item.FisYear;
                            row_dec.value = item.DEC;
                        }

                        //JAN
                        CapitalLaborInfoList row_jan = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JAN");

                        if (row_jan == null)
                        {
                            CapitalLaborInfoList insert_row_jan = new CapitalLaborInfoList();
                            insert_row_jan.MasterID = item.MasterID;
                            insert_row_jan.FisYear = item.FisYear;
                            insert_row_jan.Month = "JAN";
                            insert_row_jan.value = item.JAN;
                            db.CapitalLaborInfoLists.Add(insert_row_jan);
                        }
                        else
                        {
                            row_jan.FisYear = item.FisYear;
                            row_jan.value = item.JAN;
                        }

                        //FEB
                        CapitalLaborInfoList row_feb = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "FEB");

                        if (row_feb == null)
                        {
                            CapitalLaborInfoList insert_row_feb = new CapitalLaborInfoList();
                            insert_row_feb.MasterID = item.MasterID;
                            insert_row_feb.FisYear = item.FisYear;
                            insert_row_feb.Month = "FEB";
                            insert_row_feb.value = item.FEB;
                            db.CapitalLaborInfoLists.Add(insert_row_feb);
                        }
                        else
                        {
                            row_feb.FisYear = item.FisYear;
                            row_feb.value = item.FEB;
                        }

                        //MAR
                        CapitalLaborInfoList row_mar = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAR");

                        if (row_mar == null)
                        {
                            CapitalLaborInfoList insert_row_mar = new CapitalLaborInfoList();
                            insert_row_mar.MasterID = item.MasterID;
                            insert_row_mar.FisYear = item.FisYear;
                            insert_row_mar.Month = "MAR";
                            insert_row_mar.value = item.MAR;
                            db.CapitalLaborInfoLists.Add(insert_row_mar);
                        }
                        else
                        {
                            row_mar.FisYear = item.FisYear;
                            row_mar.value = item.MAR;
                        }

                        //APR
                        CapitalLaborInfoList row_apr = db.CapitalLaborInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "APR");

                        if (row_apr == null)
                        {
                            CapitalLaborInfoList insert_row_apr = new CapitalLaborInfoList();
                            insert_row_apr.MasterID = item.MasterID;
                            insert_row_apr.FisYear = item.FisYear;
                            insert_row_apr.Month = "APR";
                            insert_row_apr.value = item.APR;
                            db.CapitalLaborInfoLists.Add(insert_row_apr);
                        }
                        else
                        {
                            row_apr.FisYear = item.FisYear;
                            row_apr.value = item.APR;
                        }

                        db.SaveChanges();
                    }
                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    List<CapitalLaborInfoList> row = db.CapitalLaborInfoLists.Where(x => x.MasterID == item.MasterID).ToList();
                    foreach (var item_2 in row)
                    {
                        db.CapitalLaborInfoLists.Remove(item_2);
                    }
                    db.SaveChanges();

                    int getchildcount = db.CapitalLaborInfoLists.Where(x => x.MasterID == item.MasterID).ToList().Count();
                    if (getchildcount == 0)
                    {
                        CapitalLaborInfo master = db.CapitalLaborInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                        if (master != null)
                        {
                            db.CapitalLaborInfoes.Remove(master);
                            db.SaveChanges();
                        }
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult submitcapitalchanges(objcapital obj)
        {
            //string userid = Convert.ToString(Session["userid"]);

            if (obj.duplicate != null)
            {
                foreach (var item in obj.duplicate)
                {
                    db.SP_Duplicate_CapitalRows(item.MasterID, obj.userid);
                }
            }

            if (obj.update != null)
            {
                foreach (var item in obj.update)
                {
                    int AOPID = 0;
                    var AOPProjectID = db.Master_AOPProject.Where(x => x.Name == item.AOPProject).Select(y => y.Sysid).ToList();
                    if (AOPProjectID.Count >= 1)
                        AOPID = AOPProjectID[0];

                    CapitalInfo row = db.CapitalInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                    if (row != null)
                    {
                        row.Type = item.Type;
                        row.WBSNumber = item.WBSNumber;
                        row.Priority = item.Priority;
                        row.Impactofnotinvesting = item.Impactofnotinvesting;
                        row.CapitalCategory = item.CapitalCategory;
                        row.CapitalType = item.CapitalType;
                        row.AOPProject = AOPID;
                        row.Description = item.Description;
                        row.ModifiedBy = obj.userid;
                        row.ModifiedOn = DateTime.Now;

                        //MAY
                        CapitalInfoList row_may = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAY");

                        if (row_may == null)
                        {
                            CapitalInfoList insert_row_may = new CapitalInfoList();
                            insert_row_may.MasterID = item.MasterID;
                            insert_row_may.FinYear = item.FinYear;
                            insert_row_may.Month = "MAY";
                            insert_row_may.value = item.MAY;
                            db.CapitalInfoLists.Add(insert_row_may);
                        }
                        else
                        {
                            row_may.FinYear = item.FinYear;
                            row_may.value = item.MAY;
                        }

                        //JUN
                        CapitalInfoList row_june = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUN");

                        if (row_june == null)
                        {
                            CapitalInfoList insert_row_june = new CapitalInfoList();
                            insert_row_june.MasterID = item.MasterID;
                            insert_row_june.FinYear = item.FinYear;
                            insert_row_june.Month = "JUN";
                            insert_row_june.value = item.JUN;
                            db.CapitalInfoLists.Add(insert_row_june);
                        }
                        else
                        {
                            row_june.FinYear = item.FinYear;
                            row_june.value = item.JUN;
                        }

                        //JUL
                        CapitalInfoList row_july = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUL");

                        if (row_july == null)
                        {
                            CapitalInfoList insert_row_july = new CapitalInfoList();
                            insert_row_july.MasterID = item.MasterID;
                            insert_row_july.FinYear = item.FinYear;
                            insert_row_july.Month = "JUL";
                            insert_row_july.value = item.JUL;
                            db.CapitalInfoLists.Add(insert_row_july);
                        }
                        else
                        {
                            row_july.FinYear = item.FinYear;
                            row_july.value = item.JUL;
                        }

                        //AUG
                        CapitalInfoList row_aug = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "AUG");

                        if (row_aug == null)
                        {
                            CapitalInfoList insert_row_aug = new CapitalInfoList();
                            insert_row_aug.MasterID = item.MasterID;
                            insert_row_aug.FinYear = item.FinYear;
                            insert_row_aug.Month = "AUG";
                            insert_row_aug.value = item.AUG;
                            db.CapitalInfoLists.Add(insert_row_aug);
                        }
                        else
                        {
                            row_aug.FinYear = item.FinYear;
                            row_aug.value = item.AUG;
                        }

                        //SEP
                        CapitalInfoList row_sep = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "SEP");

                        if (row_sep == null)
                        {
                            CapitalInfoList insert_row_sep = new CapitalInfoList();
                            insert_row_sep.MasterID = item.MasterID;
                            insert_row_sep.FinYear = item.FinYear;
                            insert_row_sep.Month = "SEP";
                            insert_row_sep.value = item.SEP;
                            db.CapitalInfoLists.Add(insert_row_sep);
                        }
                        else
                        {
                            row_sep.FinYear = item.FinYear;
                            row_sep.value = item.SEP;
                        }

                        //OCT
                        CapitalInfoList row_oct = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "OCT");

                        if (row_oct == null)
                        {
                            CapitalInfoList insert_row_oct = new CapitalInfoList();
                            insert_row_oct.MasterID = item.MasterID;
                            insert_row_oct.FinYear = item.FinYear;
                            insert_row_oct.Month = "OCT";
                            insert_row_oct.value = item.OCT;
                            db.CapitalInfoLists.Add(insert_row_oct);
                        }
                        else
                        {
                            row_oct.FinYear = item.FinYear;
                            row_oct.value = item.OCT;
                        }

                        //NOV
                        CapitalInfoList row_nov = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "NOV");

                        if (row_nov == null)
                        {
                            CapitalInfoList insert_row_nov = new CapitalInfoList();
                            insert_row_nov.MasterID = item.MasterID;
                            insert_row_nov.FinYear = item.FinYear;
                            insert_row_nov.Month = "NOV";
                            insert_row_nov.value = item.NOV;
                            db.CapitalInfoLists.Add(insert_row_nov);
                        }
                        else
                        {
                            row_nov.FinYear = item.FinYear;
                            row_nov.value = item.NOV;
                        }

                        //DEC
                        CapitalInfoList row_dec = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "DEC");

                        if (row_dec == null)
                        {
                            CapitalInfoList insert_row_dec = new CapitalInfoList();
                            insert_row_dec.MasterID = item.MasterID;
                            insert_row_dec.FinYear = item.FinYear;
                            insert_row_dec.Month = "DEC";
                            insert_row_dec.value = item.DEC;
                            db.CapitalInfoLists.Add(insert_row_dec);
                        }
                        else
                        {
                            row_dec.FinYear = item.FinYear;
                            row_dec.value = item.DEC;
                        }

                        //JAN
                        CapitalInfoList row_jan = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JAN");

                        if (row_jan == null)
                        {
                            CapitalInfoList insert_row_jan = new CapitalInfoList();
                            insert_row_jan.MasterID = item.MasterID;
                            insert_row_jan.FinYear = item.FinYear;
                            insert_row_jan.Month = "JAN";
                            insert_row_jan.value = item.JAN;
                            db.CapitalInfoLists.Add(insert_row_jan);
                        }
                        else
                        {
                            row_jan.FinYear = item.FinYear;
                            row_jan.value = item.JAN;
                        }

                        //FEB
                        CapitalInfoList row_feb = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "FEB");

                        if (row_feb == null)
                        {
                            CapitalInfoList insert_row_feb = new CapitalInfoList();
                            insert_row_feb.MasterID = item.MasterID;
                            insert_row_feb.FinYear = item.FinYear;
                            insert_row_feb.Month = "FEB";
                            insert_row_feb.value = item.FEB;
                            db.CapitalInfoLists.Add(insert_row_feb);
                        }
                        else
                        {
                            row_feb.FinYear = item.FinYear;
                            row_feb.value = item.FEB;
                        }

                        //MAR
                        CapitalInfoList row_mar = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAR");

                        if (row_mar == null)
                        {
                            CapitalInfoList insert_row_mar = new CapitalInfoList();
                            insert_row_mar.MasterID = item.MasterID;
                            insert_row_mar.FinYear = item.FinYear;
                            insert_row_mar.Month = "MAR";
                            insert_row_mar.value = item.MAR;
                            db.CapitalInfoLists.Add(insert_row_mar);
                        }
                        else
                        {
                            row_mar.FinYear = item.FinYear;
                            row_mar.value = item.MAR;
                        }

                        //APR
                        CapitalInfoList row_apr = db.CapitalInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "APR");

                        if (row_apr == null)
                        {
                            CapitalInfoList insert_row_apr = new CapitalInfoList();
                            insert_row_apr.MasterID = item.MasterID;
                            insert_row_apr.FinYear = item.FinYear;
                            insert_row_apr.Month = "APR";
                            insert_row_apr.value = item.APR;
                            db.CapitalInfoLists.Add(insert_row_apr);
                        }
                        else
                        {
                            row_apr.FinYear = item.FinYear;
                            row_apr.value = item.APR;
                        }

                        db.SaveChanges();
                    }
                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    List<CapitalInfoList> row = db.CapitalInfoLists.Where(x => x.MasterID == item.MasterID).ToList();
                    foreach (var item_2 in row)
                    {
                        db.CapitalInfoLists.Remove(item_2);
                    }
                    db.SaveChanges();

                    int getchildcount = db.CapitalInfoLists.Where(x => x.MasterID == item.MasterID).ToList().Count();
                    if (getchildcount == 0)
                    {
                        CapitalInfo master = db.CapitalInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                        if (master != null)
                        {
                            db.CapitalInfoes.Remove(master);
                            db.SaveChanges();
                        }
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult submitdechanges(objde obj)
        {
            //string userid = Convert.ToString(Session["userid"]);
            if (obj.duplicate != null)
            {
                foreach (var item in obj.duplicate)
                {
                    db.SP_Duplicate_Directexpenses(item.MasterID, obj.userid);
                }
            }

            if (obj.update != null)
            {
                foreach (var item in obj.update)
                {
                    DirectExpensesInfo row = db.DirectExpensesInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                    if (row != null)
                    {
                        row.WBSNumber = item.WBSNumber;
                        row.Type = item.Type;
                        row.ExpenseCategory = item.ExpenseCategory;
                        row.Description = item.Description;
                        row.PONumber = item.PONumber;
                        row.ModifiedBy = obj.userid;
                        row.ModifiedOn = DateTime.Now;

                        //MAY
                        DirectExpensesInfoList row_may = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAY");

                        if (row_may == null)
                        {
                            DirectExpensesInfoList insert_row_may = new DirectExpensesInfoList();
                            insert_row_may.MasterID = item.MasterID;
                            insert_row_may.FisYear = item.FisYear;
                            insert_row_may.Month = "MAY";
                            insert_row_may.value = item.MAY;
                            db.DirectExpensesInfoLists.Add(insert_row_may);
                        }
                        else
                        {
                            row_may.FisYear = item.FisYear;
                            row_may.value = item.MAY;
                        }

                        //JUN
                        DirectExpensesInfoList row_june = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUN");

                        if (row_june == null)
                        {
                            DirectExpensesInfoList insert_row_june = new DirectExpensesInfoList();
                            insert_row_june.MasterID = item.MasterID;
                            insert_row_june.FisYear = item.FisYear;
                            insert_row_june.Month = "JUN";
                            insert_row_june.value = item.JUN;
                            db.DirectExpensesInfoLists.Add(insert_row_june);
                        }
                        else
                        {
                            row_june.FisYear = item.FisYear;
                            row_june.value = item.JUN;
                        }

                        //JUL
                        DirectExpensesInfoList row_july = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUL");

                        if (row_july == null)
                        {
                            DirectExpensesInfoList insert_row_july = new DirectExpensesInfoList();
                            insert_row_july.MasterID = item.MasterID;
                            insert_row_july.FisYear = item.FisYear;
                            insert_row_july.Month = "JUL";
                            insert_row_july.value = item.JUL;
                            db.DirectExpensesInfoLists.Add(insert_row_july);
                        }
                        else
                        {
                            row_july.FisYear = item.FisYear;
                            row_july.value = item.JUL;
                        }

                        //AUG
                        DirectExpensesInfoList row_aug = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "AUG");

                        if (row_aug == null)
                        {
                            DirectExpensesInfoList insert_row_aug = new DirectExpensesInfoList();
                            insert_row_aug.MasterID = item.MasterID;
                            insert_row_aug.FisYear = item.FisYear;
                            insert_row_aug.Month = "AUG";
                            insert_row_aug.value = item.AUG;
                            db.DirectExpensesInfoLists.Add(insert_row_aug);
                        }
                        else
                        {
                            row_aug.FisYear = item.FisYear;
                            row_aug.value = item.AUG;
                        }

                        //SEP
                        DirectExpensesInfoList row_sep = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "SEP");

                        if (row_sep == null)
                        {
                            DirectExpensesInfoList insert_row_sep = new DirectExpensesInfoList();
                            insert_row_sep.MasterID = item.MasterID;
                            insert_row_sep.FisYear = item.FisYear;
                            insert_row_sep.Month = "SEP";
                            insert_row_sep.value = item.SEP;
                            db.DirectExpensesInfoLists.Add(insert_row_sep);
                        }
                        else
                        {
                            row_sep.FisYear = item.FisYear;
                            row_sep.value = item.SEP;
                        }

                        //OCT
                        DirectExpensesInfoList row_oct = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "OCT");

                        if (row_oct == null)
                        {
                            DirectExpensesInfoList insert_row_oct = new DirectExpensesInfoList();
                            insert_row_oct.MasterID = item.MasterID;
                            insert_row_oct.FisYear = item.FisYear;
                            insert_row_oct.Month = "OCT";
                            insert_row_oct.value = item.OCT;
                            db.DirectExpensesInfoLists.Add(insert_row_oct);
                        }
                        else
                        {
                            row_oct.FisYear = item.FisYear;
                            row_oct.value = item.OCT;
                        }

                        //NOV
                        DirectExpensesInfoList row_nov = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "NOV");

                        if (row_nov == null)
                        {
                            DirectExpensesInfoList insert_row_nov = new DirectExpensesInfoList();
                            insert_row_nov.MasterID = item.MasterID;
                            insert_row_nov.FisYear = item.FisYear;
                            insert_row_nov.Month = "NOV";
                            insert_row_nov.value = item.NOV;
                            db.DirectExpensesInfoLists.Add(insert_row_nov);
                        }
                        else
                        {
                            row_nov.FisYear = item.FisYear;
                            row_nov.value = item.NOV;
                        }

                        //DEC
                        DirectExpensesInfoList row_dec = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "DEC");

                        if (row_dec == null)
                        {
                            DirectExpensesInfoList insert_row_dec = new DirectExpensesInfoList();
                            insert_row_dec.MasterID = item.MasterID;
                            insert_row_dec.FisYear = item.FisYear;
                            insert_row_dec.Month = "DEC";
                            insert_row_dec.value = item.DEC;
                            db.DirectExpensesInfoLists.Add(insert_row_dec);
                        }
                        else
                        {
                            row_dec.FisYear = item.FisYear;
                            row_dec.value = item.DEC;
                        }

                        //JAN
                        DirectExpensesInfoList row_jan = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JAN");

                        if (row_jan == null)
                        {
                            DirectExpensesInfoList insert_row_jan = new DirectExpensesInfoList();
                            insert_row_jan.MasterID = item.MasterID;
                            insert_row_jan.FisYear = item.FisYear;
                            insert_row_jan.Month = "JAN";
                            insert_row_jan.value = item.JAN;
                            db.DirectExpensesInfoLists.Add(insert_row_jan);
                        }
                        else
                        {
                            row_jan.FisYear = item.FisYear;
                            row_jan.value = item.JAN;
                        }

                        //FEB
                        DirectExpensesInfoList row_feb = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "FEB");

                        if (row_feb == null)
                        {
                            DirectExpensesInfoList insert_row_feb = new DirectExpensesInfoList();
                            insert_row_feb.MasterID = item.MasterID;
                            insert_row_feb.FisYear = item.FisYear;
                            insert_row_feb.Month = "FEB";
                            insert_row_feb.value = item.FEB;
                            db.DirectExpensesInfoLists.Add(insert_row_feb);
                        }
                        else
                        {
                            row_feb.FisYear = item.FisYear;
                            row_feb.value = item.FEB;
                        }

                        //MAR
                        DirectExpensesInfoList row_mar = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAR");

                        if (row_mar == null)
                        {
                            DirectExpensesInfoList insert_row_mar = new DirectExpensesInfoList();
                            insert_row_mar.MasterID = item.MasterID;
                            insert_row_mar.FisYear = item.FisYear;
                            insert_row_mar.Month = "MAR";
                            insert_row_mar.value = item.MAR;
                            db.DirectExpensesInfoLists.Add(insert_row_mar);
                        }
                        else
                        {
                            row_mar.FisYear = item.FisYear;
                            row_mar.value = item.MAR;
                        }

                        //APR
                        DirectExpensesInfoList row_apr = db.DirectExpensesInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "APR");

                        if (row_apr == null)
                        {
                            DirectExpensesInfoList insert_row_apr = new DirectExpensesInfoList();
                            insert_row_apr.MasterID = item.MasterID;
                            insert_row_apr.FisYear = item.FisYear;
                            insert_row_apr.Month = "APR";
                            insert_row_apr.value = item.APR;
                            db.DirectExpensesInfoLists.Add(insert_row_apr);
                        }
                        else
                        {
                            row_apr.FisYear = item.FisYear;
                            row_apr.value = item.APR;
                        }

                        db.SaveChanges();
                    }

                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    List<DirectExpensesInfoList> row = db.DirectExpensesInfoLists.Where(x => x.MasterID == item.MasterID).ToList();
                    foreach (var item_2 in row)
                    {
                        db.DirectExpensesInfoLists.Remove(item_2);
                    }
                    db.SaveChanges();

                    int getchildcount = db.DirectExpensesInfoLists.Where(x => x.MasterID == item.MasterID).ToList().Count();
                    if (getchildcount == 0)
                    {
                        DirectExpensesInfo master = db.DirectExpensesInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                        if (master != null)
                        {
                            db.DirectExpensesInfoes.Remove(master);
                            db.SaveChanges();
                        }
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult submitchanges(objsubmit obj)
        {
            if (obj.duplicate != null)
            {
                foreach (var item in obj.duplicate)
                {
                    db.SP_DuplicateRows(item.MasterID);
                }
            }

            if (obj.update != null)
            {
                foreach (var item in obj.update)
                {

                    ResourceInfo row = db.ResourceInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                    if (row != null)
                    {
                        row.Type = item.Type;
                        row.WBSNumber = item.WBSNumber;
                        row.Business = item.Business;
                        row.BusinessUnit = item.BusinessUnit;
                        row.HighOrg = item.HighOrg;
                        row.MidOrg = item.MidOrg;
                        row.Team = item.Team;
                        row.RequiredSkill = item.RequiredSkill;
                        row.Comments = item.Comments;
                        row.ModifiedBy = obj.userid;
                        row.ModifiedOn = DateTime.Now;

                        //MAY
                        ResourceInfoList row_may = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAY");

                        if (row_may == null)
                        {
                            ResourceInfoList insert_row_may = new ResourceInfoList();
                            insert_row_may.MasterID = item.MasterID;
                            insert_row_may.FinYear = item.FinYear;
                            insert_row_may.Month = "MAY";
                            insert_row_may.TimeSpentInProject = item.MAY;
                            db.ResourceInfoLists.Add(insert_row_may);
                        }
                        else
                        {
                            row_may.FinYear = item.FinYear;
                            row_may.TimeSpentInProject = item.MAY;
                        }

                        //JUN
                        ResourceInfoList row_june = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUN");

                        if (row_june == null)
                        {
                            ResourceInfoList insert_row_june = new ResourceInfoList();
                            insert_row_june.MasterID = item.MasterID;
                            insert_row_june.FinYear = item.FinYear;
                            insert_row_june.Month = "JUN";
                            insert_row_june.TimeSpentInProject = item.JUN;
                            db.ResourceInfoLists.Add(insert_row_june);
                        }
                        else
                        {
                            row_june.FinYear = item.FinYear;
                            row_june.TimeSpentInProject = item.JUN;
                        }

                        //JUL
                        ResourceInfoList row_july = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JUL");

                        if (row_july == null)
                        {
                            ResourceInfoList insert_row_july = new ResourceInfoList();
                            insert_row_july.MasterID = item.MasterID;
                            insert_row_july.FinYear = item.FinYear;
                            insert_row_july.Month = "JUL";
                            insert_row_july.TimeSpentInProject = item.JUL;
                            db.ResourceInfoLists.Add(insert_row_july);
                        }
                        else
                        {
                            row_july.FinYear = item.FinYear;
                            row_july.TimeSpentInProject = item.JUL;
                        }

                        //AUG
                        ResourceInfoList row_aug = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "AUG");

                        if (row_aug == null)
                        {
                            ResourceInfoList insert_row_aug = new ResourceInfoList();
                            insert_row_aug.MasterID = item.MasterID;
                            insert_row_aug.FinYear = item.FinYear;
                            insert_row_aug.Month = "AUG";
                            insert_row_aug.TimeSpentInProject = item.AUG;
                            db.ResourceInfoLists.Add(insert_row_aug);
                        }
                        else
                        {
                            row_aug.FinYear = item.FinYear;
                            row_aug.TimeSpentInProject = item.AUG;
                        }

                        //SEP
                        ResourceInfoList row_sep = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "SEP");

                        if (row_sep == null)
                        {
                            ResourceInfoList insert_row_sep = new ResourceInfoList();
                            insert_row_sep.MasterID = item.MasterID;
                            insert_row_sep.FinYear = item.FinYear;
                            insert_row_sep.Month = "SEP";
                            insert_row_sep.TimeSpentInProject = item.SEP;
                            db.ResourceInfoLists.Add(insert_row_sep);
                        }
                        else
                        {
                            row_sep.FinYear = item.FinYear;
                            row_sep.TimeSpentInProject = item.SEP;
                        }

                        //OCT
                        ResourceInfoList row_oct = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "OCT");

                        if (row_oct == null)
                        {
                            ResourceInfoList insert_row_oct = new ResourceInfoList();
                            insert_row_oct.MasterID = item.MasterID;
                            insert_row_oct.FinYear = item.FinYear;
                            insert_row_oct.Month = "OCT";
                            insert_row_oct.TimeSpentInProject = item.OCT;
                            db.ResourceInfoLists.Add(insert_row_oct);
                        }
                        else
                        {
                            row_oct.FinYear = item.FinYear;
                            row_oct.TimeSpentInProject = item.OCT;
                        }

                        //NOV
                        ResourceInfoList row_nov = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "NOV");

                        if (row_nov == null)
                        {
                            ResourceInfoList insert_row_nov = new ResourceInfoList();
                            insert_row_nov.MasterID = item.MasterID;
                            insert_row_nov.FinYear = item.FinYear;
                            insert_row_nov.Month = "NOV";
                            insert_row_nov.TimeSpentInProject = item.NOV;
                            db.ResourceInfoLists.Add(insert_row_nov);
                        }
                        else
                        {
                            row_nov.FinYear = item.FinYear;
                            row_nov.TimeSpentInProject = item.NOV;
                        }

                        //DEC
                        ResourceInfoList row_dec = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "DEC");

                        if (row_dec == null)
                        {
                            ResourceInfoList insert_row_dec = new ResourceInfoList();
                            insert_row_dec.MasterID = item.MasterID;
                            insert_row_dec.FinYear = item.FinYear;
                            insert_row_dec.Month = "DEC";
                            insert_row_dec.TimeSpentInProject = item.DEC;
                            db.ResourceInfoLists.Add(insert_row_dec);
                        }
                        else
                        {
                            row_dec.FinYear = item.FinYear;
                            row_dec.TimeSpentInProject = item.DEC;
                        }

                        //JAN
                        ResourceInfoList row_jan = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "JAN");

                        if (row_jan == null)
                        {
                            ResourceInfoList insert_row_jan = new ResourceInfoList();
                            insert_row_jan.MasterID = item.MasterID;
                            insert_row_jan.FinYear = item.FinYear;
                            insert_row_jan.Month = "JAN";
                            insert_row_jan.TimeSpentInProject = item.JAN;
                            db.ResourceInfoLists.Add(insert_row_jan);
                        }
                        else
                        {
                            row_jan.FinYear = item.FinYear;
                            row_jan.TimeSpentInProject = item.JAN;
                        }

                        //FEB
                        ResourceInfoList row_feb = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "FEB");


                        if (row_feb == null)
                        {
                            ResourceInfoList insert_row_feb = new ResourceInfoList();
                            insert_row_feb.MasterID = item.MasterID;
                            insert_row_feb.FinYear = item.FinYear;
                            insert_row_feb.Month = "FEB";
                            insert_row_feb.TimeSpentInProject = item.FEB;
                            db.ResourceInfoLists.Add(insert_row_feb);
                        }
                        else
                        {
                            row_feb.FinYear = item.FinYear;
                            row_feb.TimeSpentInProject = item.FEB;
                        }

                        //MAR
                        ResourceInfoList row_mar = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "MAR");

                        if (row_mar == null)
                        {
                            ResourceInfoList insert_row_mar = new ResourceInfoList();
                            insert_row_mar.MasterID = item.MasterID;
                            insert_row_mar.FinYear = item.FinYear;
                            insert_row_mar.Month = "MAR";
                            insert_row_mar.TimeSpentInProject = item.MAR;
                            db.ResourceInfoLists.Add(insert_row_mar);
                        }
                        else
                        {
                            row_mar.FinYear = item.FinYear;
                            row_mar.TimeSpentInProject = item.MAR;
                        }

                        //APR
                        ResourceInfoList row_apr = db.ResourceInfoLists
                            .SingleOrDefault(x => x.MasterID == item.MasterID && x.Month == "APR");

                        if (row_apr == null)
                        {
                            ResourceInfoList insert_row_apr = new ResourceInfoList();
                            insert_row_apr.MasterID = item.MasterID;
                            insert_row_apr.FinYear = item.FinYear;
                            insert_row_apr.Month = "APR";
                            insert_row_apr.TimeSpentInProject = item.APR;
                            db.ResourceInfoLists.Add(insert_row_apr);
                        }
                        else
                        {
                            row_apr.FinYear = item.FinYear;
                            row_apr.TimeSpentInProject = item.APR;
                        }

                        db.SaveChanges();
                    }

                }
            }

            if (obj.delete != null)
            {
                foreach (var item in obj.delete)
                {
                    List<ResourceInfoList> row = db.ResourceInfoLists.Where(x => x.MasterID == item.MasterID).ToList();
                    foreach (var item_2 in row)
                    {
                        db.ResourceInfoLists.Remove(item_2);
                    }
                    db.SaveChanges();

                    int getchildcount = db.ResourceInfoLists.Where(x => x.MasterID == item.MasterID).ToList().Count();
                    if (getchildcount == 0)
                    {
                        ResourceInfo master = db.ResourceInfoes.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                        if (master != null)
                        {
                            db.ResourceInfoes.Remove(master);
                            db.SaveChanges();
                        }

                        ResourceInfoComment data = db.ResourceInfoComments.Where(x => x.MasterID == item.MasterID).SingleOrDefault();
                        if (data != null)
                        {
                            db.ResourceInfoComments.Remove(data);
                            db.SaveChanges();
                        }
                    }
                }
            }

            return Json("data has been updated successfully", JsonRequestBehavior.AllowGet);
        }

        public class lastmodifeddata
        {
            public string source { get; set; }
            public string name { get; set; }
            public string date { get; set; }
        }

        public class objsubmit
        {
            public List<SP_GetResourceData_Result> update { get; set; }
            public List<SP_GetResourceData_Result> delete { get; set; }
            public List<SP_GetResourceData_Result> duplicate { get; set; }
            public string userid { get; set; }
        }

        public class objcapital
        {
            public List<SP_GetCapitalData_Result> update { get; set; }
            public List<SP_GetCapitalData_Result> delete { get; set; }
            public List<SP_GetCapitalData_Result> duplicate { get; set; }
            public string userid { get; set; }
        }

        public class objdecji3data
        {
            public List<SP_Get_DE_CJI3_Data_Result> insert { get; set; }
            public int ProjectID { get; set; }
        }

        public class objcapitalcji3data
        {
            public List<SP_Get_CAPITAL_CJI3_Data_Result> insert { get; set; }
            public int ProjectID { get; set; }
        }

        public class objcapitallabor
        {
            public List<SP_GetCapitalLaborData_Result> update { get; set; }
            public List<SP_GetCapitalLaborData_Result> delete { get; set; }
            public List<SP_GetCapitalLaborData_Result> duplicate { get; set; }
            public string userid { get; set; }
        }

        public class objde
        {
            public List<SP_GetDirectExpensesData_Result> update { get; set; }
            public List<SP_GetDirectExpensesData_Result> delete { get; set; }
            public List<SP_GetDirectExpensesData_Result> duplicate { get; set; }
            public string userid { get; set; }
        }

        [HttpPost]
        public JsonResult getResourceCheckBook_Summary(int intProjectID, int intFisYear)
        {
            List<ResourceCheckbookChar> objCC = new List<ResourceCheckbookChar>();
            List<ResourceCheckBookSummary> objCS = new List<ResourceCheckBookSummary>();
            var obj = db.SP_Get_ResourceCheckBook_Summary(intProjectID, intFisYear).ToList();
            foreach (var item in obj)
            {
                objCS.Add(new ResourceCheckBookSummary()
                {
                    ID = item.ID,
                    Name = item.Name,
                    MAY = Convert.ToDecimal(item.MAY),
                    JUN = Convert.ToDecimal(item.JUN),
                    JUL = Convert.ToDecimal(item.JUL),
                    AUG = Convert.ToDecimal(item.AUG),
                    SEP = Convert.ToDecimal(item.SEP),
                    OCT = Convert.ToDecimal(item.OCT),
                    NOV = Convert.ToDecimal(item.NOV),
                    DEC = Convert.ToDecimal(item.DEC),
                    JAN = Convert.ToDecimal(item.JAN),
                    FEB = Convert.ToDecimal(item.FEB),
                    MAR = Convert.ToDecimal(item.MAR),
                    APR = Convert.ToDecimal(item.APR),
                    ResourceCheckBookSummaryResult = db.SP_Get_DeltaSummary(intProjectID, intFisYear, item.Name).ToList()
                });

                if (item.Name == "AOP Forecast" || item.Name == "Running Total" || item.Name == "Current FY Total")
                {
                    List<decimal> objmonths = new List<decimal>();
                    objmonths.Add(Convert.ToDecimal(item.MAY));
                    objmonths.Add(Convert.ToDecimal(item.JUN));
                    objmonths.Add(Convert.ToDecimal(item.JUL));
                    objmonths.Add(Convert.ToDecimal(item.AUG));
                    objmonths.Add(Convert.ToDecimal(item.SEP));
                    objmonths.Add(Convert.ToDecimal(item.OCT));
                    objmonths.Add(Convert.ToDecimal(item.NOV));
                    objmonths.Add(Convert.ToDecimal(item.DEC));
                    objmonths.Add(Convert.ToDecimal(item.JAN));
                    objmonths.Add(Convert.ToDecimal(item.FEB));
                    objmonths.Add(Convert.ToDecimal(item.MAR));
                    objmonths.Add(Convert.ToDecimal(item.APR));
                    objCC.Add(new ResourceCheckbookChar()
                    {
                        name = item.Name,
                        data = objmonths
                    });
                }
            }

            return new JsonResult { Data = new { summarydata = objCS, summaryChart = objCC } };
        }

        [HttpPost]
        public JsonResult getResourceCheckBookData(int intProjectID, int intFisYear)
        {
            List<ResourceCheckBook_MainList> objM = new List<ResourceCheckBook_MainList>();
            var objMainCheckBook = db.SP_Get_ResourceCheckBook_MainList(intProjectID, intFisYear);

            foreach (var item in objMainCheckBook)
            {
                var objCBData = db.SP_Get_ResourceCheckBook(intProjectID, item.WBSNumber, item.BusinessUnit, item.HighOrg, item.MidOrg, item.Team, Convert.ToInt32(item.FinYear)).ToList();
                List<ResourceCheckBook> objCB = new List<ResourceCheckBook>();
                foreach (var Res_CB in objCBData)
                {
                    if (Res_CB.Type == "F")
                    {
                        objCB.Add(new ResourceCheckBook()
                        {
                            ProjectID = Convert.ToInt32(Res_CB.ProjectID),
                            Type = Res_CB.Type,
                            WBSNumber = Res_CB.WBSNumber,
                            BusinessUnit = Res_CB.BusinessUnit,
                            HighOrg = Res_CB.HighOrg,
                            MidOrg = Res_CB.MidOrg,
                            Team = Res_CB.Team,
                            FinYear = Convert.ToInt32(Res_CB.FinYear),
                            MAY = Math.Round(Convert.ToDecimal(Res_CB.MAY), 2),
                            JUN = Math.Round(Convert.ToDecimal(Res_CB.JUN), 2),
                            JUL = Math.Round(Convert.ToDecimal(Res_CB.JUL), 2),
                            AUG = Math.Round(Convert.ToDecimal(Res_CB.AUG), 2),
                            SEP = Math.Round(Convert.ToDecimal(Res_CB.SEP), 2),
                            OCT = Math.Round(Convert.ToDecimal(Res_CB.OCT), 2),
                            NOV = Math.Round(Convert.ToDecimal(Res_CB.NOV), 2),
                            DEC = Math.Round(Convert.ToDecimal(Res_CB.DEC), 2),
                            JAN = Math.Round(Convert.ToDecimal(Res_CB.JAN), 2),
                            FEB = Math.Round(Convert.ToDecimal(Res_CB.FEB), 2),
                            MAR = Math.Round(Convert.ToDecimal(Res_CB.MAR), 2),
                            APR = Math.Round(Convert.ToDecimal(Res_CB.APR), 2),
                            ResourceCheckBookData = null                           
                        });
                    }
                    else
                    {
                        var objresource = db.SP_Get_ResourceCheckBookData(Res_CB.WBSNumber, Res_CB.BusinessUnit, Res_CB.HighOrg, Res_CB.MidOrg, Res_CB.Team, Convert.ToInt32(Res_CB.FinYear)).ToList();
                        objCB.Add(new ResourceCheckBook()
                        {
                            ProjectID = Convert.ToInt32(Res_CB.ProjectID),
                            Type = Res_CB.Type,
                            WBSNumber = Res_CB.WBSNumber,
                            BusinessUnit = Res_CB.BusinessUnit,
                            HighOrg = Res_CB.HighOrg,
                            MidOrg = Res_CB.MidOrg,
                            Team = Res_CB.Team,
                            FinYear = Convert.ToInt32(Res_CB.FinYear),
                            MAY = Math.Round(Convert.ToDecimal(Res_CB.MAY), 2),
                            JUN = Math.Round(Convert.ToDecimal(Res_CB.JUN), 2),
                            JUL = Math.Round(Convert.ToDecimal(Res_CB.JUL), 2),
                            AUG = Math.Round(Convert.ToDecimal(Res_CB.AUG), 2),
                            SEP = Math.Round(Convert.ToDecimal(Res_CB.SEP), 2),
                            OCT = Math.Round(Convert.ToDecimal(Res_CB.OCT), 2),
                            NOV = Math.Round(Convert.ToDecimal(Res_CB.NOV), 2),
                            DEC = Math.Round(Convert.ToDecimal(Res_CB.DEC), 2),
                            JAN = Math.Round(Convert.ToDecimal(Res_CB.JAN), 2),
                            FEB = Math.Round(Convert.ToDecimal(Res_CB.FEB), 2),
                            MAR = Math.Round(Convert.ToDecimal(Res_CB.MAR), 2),
                            APR = Math.Round(Convert.ToDecimal(Res_CB.APR), 2),
                            ResourceCheckBookData = objresource
                        });
                    }
                }

                objM.Add(new ResourceCheckBook_MainList()
                {
                    WBSNumber = item.WBSNumber,
                    BusinessUnit = item.BusinessUnit,
                    HighOrg = item.HighOrg,
                    MidOrg = item.MidOrg,
                    Team = item.Team,
                    FinYear = Convert.ToInt32(item.FinYear),
                    MAY = Math.Round(Convert.ToDecimal(item.MAY), 2),
                    JUN = Math.Round(Convert.ToDecimal(item.JUN), 2),
                    JUL = Math.Round(Convert.ToDecimal(item.JUL), 2),
                    AUG = Math.Round(Convert.ToDecimal(item.AUG), 2),
                    SEP = Math.Round(Convert.ToDecimal(item.SEP), 2),
                    OCT = Math.Round(Convert.ToDecimal(item.OCT), 2),
                    NOV = Math.Round(Convert.ToDecimal(item.NOV), 2),
                    DEC = Math.Round(Convert.ToDecimal(item.DEC), 2),
                    JAN = Math.Round(Convert.ToDecimal(item.JAN), 2),
                    FEB = Math.Round(Convert.ToDecimal(item.FEB), 2),
                    MAR = Math.Round(Convert.ToDecimal(item.MAR), 2),
                    APR = Math.Round(Convert.ToDecimal(item.APR), 2),
                    ResourceCheckBook = objCB.ToList()
                });
            }

            return Json(objM, JsonRequestBehavior.AllowGet);
        }

        public class ResourceCheckBookSummary
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public Decimal MAY { get; set; }

            public Decimal JUN { get; set; }

            public Decimal JUL { get; set; }

            public Decimal AUG { get; set; }

            public Decimal SEP { get; set; }

            public Decimal OCT { get; set; }

            public Decimal NOV { get; set; }

            public Decimal DEC { get; set; }

            public Decimal JAN { get; set; }

            public Decimal FEB { get; set; }

            public Decimal MAR { get; set; }

            public Decimal APR { get; set; }

            public List<SP_Get_DeltaSummary_Result> ResourceCheckBookSummaryResult { get; set; }
        }

        public class ResourceCheckBook_MainList
        {
            public string WBSNumber { get; set; }
            public string BusinessUnit { get; set; }
            public string HighOrg { get; set; }
            public string MidOrg { get; set; }
            public string Team { get; set; }
            public string RequiredSkill { get; set; }
            public int FinYear { get; set; }

            public Decimal MAY { get; set; }

            public Decimal JUN { get; set; }

            public Decimal JUL { get; set; }

            public Decimal AUG { get; set; }

            public Decimal SEP { get; set; }

            public Decimal OCT { get; set; }

            public Decimal NOV { get; set; }

            public Decimal DEC { get; set; }

            public Decimal JAN { get; set; }

            public Decimal FEB { get; set; }

            public Decimal MAR { get; set; }

            public Decimal APR { get; set; }

            public List<ResourceCheckBook> ResourceCheckBook { get; set; }
        }

        public class de_checkbook
        {
            public string WBSNumber { get; set; }
            public string ExpenseCategory { get; set; }
            public string Description { get; set; }
            public string PONumber { get; set; }
            public string FisYear { get; set; }
            public decimal MAY { get; set; }
            public decimal JUN { get; set; }
            public decimal JUL { get; set; }
            public decimal AUG { get; set; }
            public decimal SEP { get; set; }
            public decimal OCT { get; set; }
            public decimal NOV { get; set; }
            public decimal DEC { get; set; }
            public decimal JAN { get; set; }
            public decimal FEB { get; set; }
            public decimal MAR { get; set; }
            public decimal APR { get; set; }
            public List<SP_Get_DirectExpensesInfo_CJI3_Selection_Result> decheckbooksubmenu { get; set; }
        }

        public class capital_checkbook
        {
            public string WBSNumber { get; set; }
            public string CapitalCategory { get; set; }
            public string CapitalType { get; set; }
            public string Description { get; set; }
            public string FinYear { get; set; }
            public decimal MAY { get; set; }
            public decimal JUN { get; set; }
            public decimal JUL { get; set; }
            public decimal AUG { get; set; }
            public decimal SEP { get; set; }
            public decimal OCT { get; set; }
            public decimal NOV { get; set; }
            public decimal DEC { get; set; }
            public decimal JAN { get; set; }
            public decimal FEB { get; set; }
            public decimal MAR { get; set; }
            public decimal APR { get; set; }

            public List<SP_Get_Capital_CJI3_Selection_Result> capitalcheckbooksubmenu { get; set; }
        }

        public class ResourceCheckbookChar
        {
            public string name { get; set; }
            public List<decimal> data { get; set; }
        }

        public class DEcheckbookSelectedList
        {
            public int ProjectID { get; set; }
            public SP_Get_DE_CJI3_Data_Result item { get; set; }
        }

        public class CapitalcheckbookSelectedList
        {
            public int ProjectID { get; set; }
            public SP_Get_CAPITAL_CJI3_Data_Result item { get; set; }
        }

        public class ResourceCheckBook
        {
            public string Type { get; set; }
            public int ProjectID { get; set; }
            public string WBSNumber { get; set; }
            public string BusinessUnit { get; set; }
            public string HighOrg { get; set; }
            public string MidOrg { get; set; }
            public string Team { get; set; }
            public int FinYear { get; set; }
            public Nullable<decimal> MAY { get; set; }
            public Nullable<decimal> JUN { get; set; }
            public Nullable<decimal> JUL { get; set; }
            public Nullable<decimal> AUG { get; set; }
            public Nullable<decimal> SEP { get; set; }
            public Nullable<decimal> OCT { get; set; }
            public Nullable<decimal> NOV { get; set; }
            public Nullable<decimal> DEC { get; set; }
            public Nullable<decimal> JAN { get; set; }
            public Nullable<decimal> FEB { get; set; }
            public Nullable<decimal> MAR { get; set; }
            public Nullable<decimal> APR { get; set; }
            public List<SP_Get_ResourceCheckBookData_Result> ResourceCheckBookData { get; set; }
        }


    }
}