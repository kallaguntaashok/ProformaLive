﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProformaLive
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class ProformaLiveEntities : DbContext
    {
        public ProformaLiveEntities()
            : base("name=ProformaLiveEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<CapitalInfo> CapitalInfoes { get; set; }
        public virtual DbSet<CapitalInfoList> CapitalInfoLists { get; set; }
        public virtual DbSet<CapitalLaborInfo> CapitalLaborInfoes { get; set; }
        public virtual DbSet<CapitalLaborInfoList> CapitalLaborInfoLists { get; set; }
        public virtual DbSet<Configure_App_Master> Configure_App_Master { get; set; }
        public virtual DbSet<Configure_Project> Configure_Project { get; set; }
        public virtual DbSet<Configure_RateCard> Configure_RateCard { get; set; }
        public virtual DbSet<Configure_Skill> Configure_Skill { get; set; }
        public virtual DbSet<DirectExpensesInfo> DirectExpensesInfoes { get; set; }
        public virtual DbSet<DirectExpensesInfoList> DirectExpensesInfoLists { get; set; }
        public virtual DbSet<Master_AOPProject> Master_AOPProject { get; set; }
        public virtual DbSet<Master_CJI3> Master_CJI3 { get; set; }
        public virtual DbSet<Master_Months> Master_Months { get; set; }
        public virtual DbSet<Master_ProjectChargeBack> Master_ProjectChargeBack { get; set; }
        public virtual DbSet<Master_Qtr> Master_Qtr { get; set; }
        public virtual DbSet<Master_SAP_PO_Data> Master_SAP_PO_Data { get; set; }
        public virtual DbSet<Master_Summary> Master_Summary { get; set; }
        public virtual DbSet<Master_VendorList> Master_VendorList { get; set; }
        public virtual DbSet<Proforma_DataFrasfer_DuplicateData> Proforma_DataFrasfer_DuplicateData { get; set; }
        public virtual DbSet<ProjectMaster> ProjectMasters { get; set; }
        public virtual DbSet<Resource_TempData> Resource_TempData { get; set; }
        public virtual DbSet<ResourceInfo> ResourceInfoes { get; set; }
        public virtual DbSet<ResourceInfoList> ResourceInfoLists { get; set; }
        public virtual DbSet<Temp_ProjectMaster> Temp_ProjectMaster { get; set; }
        public virtual DbSet<ResourceInfo_old> ResourceInfo_old { get; set; }
        public virtual DbSet<ResourceInfoList_old> ResourceInfoList_old { get; set; }
    
        public virtual int SP_Clone_Proforma(Nullable<int> projectID, string clonedProjectID, string clonedProjectName, string createdBy)
        {
            var projectIDParameter = projectID.HasValue ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(int));
    
            var clonedProjectIDParameter = clonedProjectID != null ?
                new ObjectParameter("ClonedProjectID", clonedProjectID) :
                new ObjectParameter("ClonedProjectID", typeof(string));
    
            var clonedProjectNameParameter = clonedProjectName != null ?
                new ObjectParameter("ClonedProjectName", clonedProjectName) :
                new ObjectParameter("ClonedProjectName", typeof(string));
    
            var createdByParameter = createdBy != null ?
                new ObjectParameter("CreatedBy", createdBy) :
                new ObjectParameter("CreatedBy", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Clone_Proforma", projectIDParameter, clonedProjectIDParameter, clonedProjectNameParameter, createdByParameter);
        }
    
        public virtual ObjectResult<SP_Config_Projects_Result> SP_Config_Projects()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Config_Projects_Result>("SP_Config_Projects");
        }
    
        public virtual ObjectResult<string> SP_Config_Projects_CapitalGRPType()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Config_Projects_CapitalGRPType");
        }
    
        public virtual ObjectResult<string> SP_Config_Projects_Funded()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Config_Projects_Funded");
        }
    
        public virtual ObjectResult<string> SP_Config_Projects_InPLAN()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Config_Projects_InPLAN");
        }
    
        public virtual ObjectResult<string> SP_Config_Projects_ParentChild()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Config_Projects_ParentChild");
        }
    
        public virtual ObjectResult<string> SP_Config_Projects_ProjectCategory()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Config_Projects_ProjectCategory");
        }
    
        public virtual int SP_Delete_CapitalData(Nullable<int> iD)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Delete_CapitalData", iDParameter);
        }
    
        public virtual int SP_Delete_CapitalLaborInfo(Nullable<int> iD)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Delete_CapitalLaborInfo", iDParameter);
        }
    
        public virtual int SP_Delete_DirectExpensesInfo(Nullable<int> iD)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Delete_DirectExpensesInfo", iDParameter);
        }
    
        public virtual int SP_Delete_ResourceData(Nullable<int> iD)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Delete_ResourceData", iDParameter);
        }
    
        public virtual int SP_Duplicate_CapitallaborRows(Nullable<int> iD, string userID)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Duplicate_CapitallaborRows", iDParameter, userIDParameter);
        }
    
        public virtual int SP_Duplicate_CapitalRows(Nullable<int> iD, string userID)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Duplicate_CapitalRows", iDParameter, userIDParameter);
        }
    
        public virtual int SP_Duplicate_Directexpenses(Nullable<int> iD, string userID)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            var userIDParameter = userID != null ?
                new ObjectParameter("UserID", userID) :
                new ObjectParameter("UserID", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Duplicate_Directexpenses", iDParameter, userIDParameter);
        }
    
        public virtual int SP_DuplicateRows(Nullable<int> iD)
        {
            var iDParameter = iD.HasValue ?
                new ObjectParameter("ID", iD) :
                new ObjectParameter("ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_DuplicateRows", iDParameter);
        }
    
        public virtual ObjectResult<SP_EXPORT_ResourceData_Result> SP_EXPORT_ResourceData(Nullable<int> projectid)
        {
            var projectidParameter = projectid.HasValue ?
                new ObjectParameter("projectid", projectid) :
                new ObjectParameter("projectid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_EXPORT_ResourceData_Result>("SP_EXPORT_ResourceData", projectidParameter);
        }
    
        public virtual ObjectResult<string> SP_Filter_GetFinYear(Nullable<int> projectID)
        {
            var projectIDParameter = projectID.HasValue ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Filter_GetFinYear", projectIDParameter);
        }
    
        public virtual ObjectResult<string> SP_Filter_GetMonths(Nullable<int> projectID, string fisYear)
        {
            var projectIDParameter = projectID.HasValue ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(int));
    
            var fisYearParameter = fisYear != null ?
                new ObjectParameter("FisYear", fisYear) :
                new ObjectParameter("FisYear", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Filter_GetMonths", projectIDParameter, fisYearParameter);
        }
    
        public virtual ObjectResult<string> SP_Filter_GetQuarter(string month)
        {
            var monthParameter = month != null ?
                new ObjectParameter("Month", month) :
                new ObjectParameter("Month", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Filter_GetQuarter", monthParameter);
        }
    
        public virtual ObjectResult<string> SP_Get_Business()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_Business");
        }
    
        public virtual ObjectResult<string> SP_Get_BusinessUnit(string business)
        {
            var businessParameter = business != null ?
                new ObjectParameter("Business", business) :
                new ObjectParameter("Business", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_BusinessUnit", businessParameter);
        }
    
        public virtual ObjectResult<string> SP_Get_CapitalExpenditureWBS(Nullable<int> pROJECTID)
        {
            var pROJECTIDParameter = pROJECTID.HasValue ?
                new ObjectParameter("PROJECTID", pROJECTID) :
                new ObjectParameter("PROJECTID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_CapitalExpenditureWBS", pROJECTIDParameter);
        }
    
        public virtual ObjectResult<SP_Get_Configure_RateCard_Result> SP_Get_Configure_RateCard()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Get_Configure_RateCard_Result>("SP_Get_Configure_RateCard");
        }
    
        public virtual ObjectResult<string> SP_Get_HighOrg(string business, string businessUnit)
        {
            var businessParameter = business != null ?
                new ObjectParameter("Business", business) :
                new ObjectParameter("Business", typeof(string));
    
            var businessUnitParameter = businessUnit != null ?
                new ObjectParameter("BusinessUnit", businessUnit) :
                new ObjectParameter("BusinessUnit", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_HighOrg", businessParameter, businessUnitParameter);
        }
    
        public virtual ObjectResult<SP_Get_Master_AOPProject_Result> SP_Get_Master_AOPProject()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Get_Master_AOPProject_Result>("SP_Get_Master_AOPProject");
        }
    
        public virtual ObjectResult<SP_Get_Master_ProjectChargeBack_Result> SP_Get_Master_ProjectChargeBack()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Get_Master_ProjectChargeBack_Result>("SP_Get_Master_ProjectChargeBack");
        }
    
        public virtual ObjectResult<string> SP_Get_MidOrg(string business, string businessUnit, string highOrg)
        {
            var businessParameter = business != null ?
                new ObjectParameter("Business", business) :
                new ObjectParameter("Business", typeof(string));
    
            var businessUnitParameter = businessUnit != null ?
                new ObjectParameter("BusinessUnit", businessUnit) :
                new ObjectParameter("BusinessUnit", typeof(string));
    
            var highOrgParameter = highOrg != null ?
                new ObjectParameter("HighOrg", highOrg) :
                new ObjectParameter("HighOrg", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_MidOrg", businessParameter, businessUnitParameter, highOrgParameter);
        }
    
        public virtual ObjectResult<string> SP_Get_OperatingExpenseWBS(Nullable<int> pROJECTID)
        {
            var pROJECTIDParameter = pROJECTID.HasValue ?
                new ObjectParameter("PROJECTID", pROJECTID) :
                new ObjectParameter("PROJECTID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_OperatingExpenseWBS", pROJECTIDParameter);
        }
    
        public virtual ObjectResult<SP_Get_Projects_Result> SP_Get_Projects()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Get_Projects_Result>("SP_Get_Projects");
        }
    
        public virtual ObjectResult<string> SP_Get_RequiredSkills(string business, string businessUnit, string highOrg, string midOrg, string team)
        {
            var businessParameter = business != null ?
                new ObjectParameter("Business", business) :
                new ObjectParameter("Business", typeof(string));
    
            var businessUnitParameter = businessUnit != null ?
                new ObjectParameter("BusinessUnit", businessUnit) :
                new ObjectParameter("BusinessUnit", typeof(string));
    
            var highOrgParameter = highOrg != null ?
                new ObjectParameter("HighOrg", highOrg) :
                new ObjectParameter("HighOrg", typeof(string));
    
            var midOrgParameter = midOrg != null ?
                new ObjectParameter("MidOrg", midOrg) :
                new ObjectParameter("MidOrg", typeof(string));
    
            var teamParameter = team != null ?
                new ObjectParameter("Team", team) :
                new ObjectParameter("Team", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_RequiredSkills", businessParameter, businessUnitParameter, highOrgParameter, midOrgParameter, teamParameter);
        }
    
        public virtual ObjectResult<SP_Get_Skillmaster_Result> SP_Get_Skillmaster()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Get_Skillmaster_Result>("SP_Get_Skillmaster");
        }
    
        public virtual ObjectResult<string> SP_Get_Team(string business, string businessUnit, string highOrg, string midOrg)
        {
            var businessParameter = business != null ?
                new ObjectParameter("Business", business) :
                new ObjectParameter("Business", typeof(string));
    
            var businessUnitParameter = businessUnit != null ?
                new ObjectParameter("BusinessUnit", businessUnit) :
                new ObjectParameter("BusinessUnit", typeof(string));
    
            var highOrgParameter = highOrg != null ?
                new ObjectParameter("HighOrg", highOrg) :
                new ObjectParameter("HighOrg", typeof(string));
    
            var midOrgParameter = midOrg != null ?
                new ObjectParameter("MidOrg", midOrg) :
                new ObjectParameter("MidOrg", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Get_Team", businessParameter, businessUnitParameter, highOrgParameter, midOrgParameter);
        }
    
        public virtual ObjectResult<SP_GetCapitalData_Result> SP_GetCapitalData(Nullable<int> projectid)
        {
            var projectidParameter = projectid.HasValue ?
                new ObjectParameter("projectid", projectid) :
                new ObjectParameter("projectid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetCapitalData_Result>("SP_GetCapitalData", projectidParameter);
        }
    
        public virtual ObjectResult<SP_GetCapitalLaborData_Result> SP_GetCapitalLaborData(Nullable<int> projectid)
        {
            var projectidParameter = projectid.HasValue ?
                new ObjectParameter("projectid", projectid) :
                new ObjectParameter("projectid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetCapitalLaborData_Result>("SP_GetCapitalLaborData", projectidParameter);
        }
    
        public virtual ObjectResult<SP_GetDirectExpensesData_Result> SP_GetDirectExpensesData(Nullable<int> projectid)
        {
            var projectidParameter = projectid.HasValue ?
                new ObjectParameter("projectid", projectid) :
                new ObjectParameter("projectid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetDirectExpensesData_Result>("SP_GetDirectExpensesData", projectidParameter);
        }
    
        public virtual ObjectResult<SP_Getlastmodifiedinfo_Result> SP_Getlastmodifiedinfo(Nullable<int> projectID)
        {
            var projectIDParameter = projectID.HasValue ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_Getlastmodifiedinfo_Result>("SP_Getlastmodifiedinfo", projectIDParameter);
        }
    
        public virtual ObjectResult<SP_GetNewSummary_Result> SP_GetNewSummary(string projectID, string fisYear, string month, string qtr)
        {
            var projectIDParameter = projectID != null ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(string));
    
            var fisYearParameter = fisYear != null ?
                new ObjectParameter("FisYear", fisYear) :
                new ObjectParameter("FisYear", typeof(string));
    
            var monthParameter = month != null ?
                new ObjectParameter("Month", month) :
                new ObjectParameter("Month", typeof(string));
    
            var qtrParameter = qtr != null ?
                new ObjectParameter("Qtr", qtr) :
                new ObjectParameter("Qtr", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetNewSummary_Result>("SP_GetNewSummary", projectIDParameter, fisYearParameter, monthParameter, qtrParameter);
        }
    
        public virtual ObjectResult<SP_GetProject_Summary_Result> SP_GetProject_Summary(string projectID, string fisYear, string month, string qtr)
        {
            var projectIDParameter = projectID != null ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(string));
    
            var fisYearParameter = fisYear != null ?
                new ObjectParameter("FisYear", fisYear) :
                new ObjectParameter("FisYear", typeof(string));
    
            var monthParameter = month != null ?
                new ObjectParameter("Month", month) :
                new ObjectParameter("Month", typeof(string));
    
            var qtrParameter = qtr != null ?
                new ObjectParameter("Qtr", qtr) :
                new ObjectParameter("Qtr", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetProject_Summary_Result>("SP_GetProject_Summary", projectIDParameter, fisYearParameter, monthParameter, qtrParameter);
        }
    
        public virtual ObjectResult<SP_GetResourceData_Result> SP_GetResourceData(Nullable<int> projectid)
        {
            var projectidParameter = projectid.HasValue ?
                new ObjectParameter("projectid", projectid) :
                new ObjectParameter("projectid", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetResourceData_Result>("SP_GetResourceData", projectidParameter);
        }
    
        public virtual ObjectResult<SP_GetSummary_Result> SP_GetSummary(string projectID, string fisYear, string month, string qtr)
        {
            var projectIDParameter = projectID != null ?
                new ObjectParameter("ProjectID", projectID) :
                new ObjectParameter("ProjectID", typeof(string));
    
            var fisYearParameter = fisYear != null ?
                new ObjectParameter("FisYear", fisYear) :
                new ObjectParameter("FisYear", typeof(string));
    
            var monthParameter = month != null ?
                new ObjectParameter("Month", month) :
                new ObjectParameter("Month", typeof(string));
    
            var qtrParameter = qtr != null ?
                new ObjectParameter("Qtr", qtr) :
                new ObjectParameter("Qtr", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<SP_GetSummary_Result>("SP_GetSummary", projectIDParameter, fisYearParameter, monthParameter, qtrParameter);
        }
    
        public virtual int SP_GetSummaryData()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_GetSummaryData");
        }
    
        public virtual int SP_InsertResourcedata()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_InsertResourcedata");
        }
    
        public virtual int SP_Resource_Moverows(Nullable<int> fROM, Nullable<int> tO, Nullable<int> masterID, string tabName)
        {
            var fROMParameter = fROM.HasValue ?
                new ObjectParameter("FROM", fROM) :
                new ObjectParameter("FROM", typeof(int));
    
            var tOParameter = tO.HasValue ?
                new ObjectParameter("TO", tO) :
                new ObjectParameter("TO", typeof(int));
    
            var masterIDParameter = masterID.HasValue ?
                new ObjectParameter("MasterID", masterID) :
                new ObjectParameter("MasterID", typeof(int));
    
            var tabNameParameter = tabName != null ?
                new ObjectParameter("TabName", tabName) :
                new ObjectParameter("TabName", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("SP_Resource_Moverows", fROMParameter, tOParameter, masterIDParameter, tabNameParameter);
        }
    
        public virtual ObjectResult<string> SP_Validate_ProjectCode(string projectNumber)
        {
            var projectNumberParameter = projectNumber != null ?
                new ObjectParameter("ProjectNumber", projectNumber) :
                new ObjectParameter("ProjectNumber", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("SP_Validate_ProjectCode", projectNumberParameter);
        }
    }
}
