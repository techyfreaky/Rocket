/* [Ref] - Denotes Pseudo Code Reference  
 * This component is the Blastoff grid component. The component displays the data in the Grid format. 
 * App Name: Rocket
 * Author: Manish */
 import * as React from 'react';
 import { WebPartContext } from "@microsoft/sp-webpart-base";
 import Moment from 'react-moment';
 import "react-datepicker/dist/react-datepicker.css";
 import { Typeahead } from 'react-bootstrap-typeahead';
 import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
 import 'react-bootstrap-typeahead/css/Typeahead.css';
 import { Slider } from 'office-ui-fabric-react/lib/Slider';
 import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
 import SearchComponent from '../Child_Components/Search_Component';
 import SaveToReport from '../Child_Components/Save_To_Report';
 import '../css/commontheme.css';
 import '../css/style.css';
 
 const filter: string = require('../images/filter.svg');
 const searchIcon: string = require('../images/search.svg');
 const fire: string = require('../images/fire.svg');
 const fireicon: string = require('../Images/fireicon.svg');
 const addIcon: string = require('../images/add-icon.svg');
 const save: string = require('../images/save.svg');
 const edit: string = require('../Images/edit.svg');
 const Delete: string = require('../Images/trash.svg');
 const Archive: string = require('../Images/archive.svg');
 const pinbgimg: string = require('../images/pinbgimg.png');
 const searchResults: string = require('../images/search-results.svg');
 
 import * as BlastoffAction from '../Action/Blastoff_Action';
 import BlastoffStore from '../Store/Blastoff_Store';
 
 export interface BlastoffProps {
   context: WebPartContext;
   callback: any;
 }
 
 export interface BlastoffStates {
   siteUrl: string;
   currentContext: WebPartContext;
   listName: any;
   selectfields1: any;
   selectfields2: any;
   selectfields3: any;
   gridfields: any;
   displayfields: any;
   filterquery: any;
   activeTab: string;
   BlastoffGrid: any[];
   actionpopup: boolean;
   actionindex: any;
   deletepopup: boolean;
   delindex: any;
   Archivepopup: boolean;
   Archiveindex: any;
   unArchivepopup: boolean;
   unArchiveindex: any;
   filterpopup: boolean;
   Firepopup: boolean;
   searchText: any;
   MessageType: string;
   StartDateFrom: any;
   CStartDateFrom: any;
   StartDateTo: any;
   CStartDateTo: any;
   DateRangeErrorMsg: string;
   CreatedByList: any[];
   CreatedByName: any;
   ErrorMsg: string;
   DeleteTempalte: any;
   StreakValue: number;
   StreakValueERR: string;
 }
 
 export default class loopins extends React.Component<BlastoffProps, BlastoffStates>{
   constructor(props) {
     super(props);
     this.state = {
       siteUrl: this.props.context.pageContext.web.absoluteUrl,
       currentContext: this.props.context,
       listName: "Template",
       selectfields1: "TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq 1)and(TemplateFor eq 'New Hire')",
       selectfields2: "TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq 1)and(TemplateFor eq 'Manager')",
 selectfields3:"TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq -1)",
       gridfields: ['TemplateName', 'Created', 'MessageType', 'TemplateDescription', 'TemplateUsageCount'],
       displayfields: ['TemplateName', 'CreatedDate', 'MessageType', 'TemplateDescription', 'TemplateUsageCount'],
       filterquery: "",
       activeTab: "New Hire",
       BlastoffGrid: [],
       actionpopup: false,
       actionindex: null,
       deletepopup: false,
       delindex: "",
       Archivepopup: false,
       Archiveindex: "",
       unArchivepopup: false,
       unArchiveindex: "",
       filterpopup: false,
       Firepopup: false,
       searchText: "",
       MessageType: "",
       StartDateFrom: "",
       CStartDateFrom: "",
       StartDateTo: "",
       CStartDateTo: "",
       DateRangeErrorMsg: "",
       CreatedByList: [],
       CreatedByName: [],
       ErrorMsg: "",
       DeleteTempalte: "",
       StreakValue: null,
       StreakValueERR: "",
     };
   }
 
   componentWillMount() {
     BlastoffAction.getNewUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
     BlastoffAction.getCreatedBy(this.state.siteUrl, this.state.currentContext);
     BlastoffStore.on("BlastoffGrid", this.loadBlastoffGridData.bind(this));
     BlastoffStore.on("success", this.ondeleteload.bind(this));
     BlastoffStore.on("Archive", this.onArchiveload.bind(this));
     BlastoffStore.on("unArchive", this.onunArchiveload.bind(this));
     BlastoffStore.on("CreatedBy", this.loadCreatedBy.bind(this));
   }
 
   public loadBlastoffGridData = () => {
     this.setState({ BlastoffGrid: BlastoffStore.BlastoffGridData });
   }
 
     ondeleteload = () => {
     debugger;
     if (BlastoffStore.delete == "204") {
       if (this.state.activeTab == "New Hire") {
         BlastoffAction.getNewUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
       } else if (this.state.activeTab == "Manager") {
         BlastoffAction.getManagerGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
       }
       else {
         BlastoffAction.getArchiveGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
       }}
   }
 
   onArchiveload = () => {
     if (BlastoffStore.archive == "204") {
       if (this.state.activeTab == "New Hire") {
         BlastoffAction.getNewUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
       } else {
         BlastoffAction.getManagerGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
       }}
   }
 
   onunArchiveload = () => {
     if (BlastoffStore.archive == "204") {
       BlastoffAction.getArchiveGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
     }
   }
 
   public loadCreatedBy = () => {
     this.setState({ CreatedByList: BlastoffStore.CreatedBylist })
   }
 
   activeTab = (event) => {
     let activeTab = event.target.text;
     this.setState({ activeTab, BlastoffGrid: [] });
     if (event.target.text == "New Hire") {
       this.setState({
         filterquery: "", searchText: "", filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
         CreatedByName: [], StartDateFrom: "", CStartDateFrom: "",
         StartDateTo: "", CStartDateTo: "", StreakValue: null, StreakValueERR: ""
       }, () => { BlastoffAction.getNewUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery); });
     }
     else if (event.target.text == "Manager") {
       this.setState({
         filterquery: "", searchText: "", filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
         CreatedByName: [], StartDateFrom: "", CStartDateFrom: "",
         StartDateTo: "", CStartDateTo: "", StreakValue: null, StreakValueERR: ""
       }, () => { BlastoffAction.getManagerGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery); });
     }
     else {
       this.setState({
         filterquery: "", searchText: "", filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
         CreatedByName: [], StartDateFrom: "", CStartDateFrom: "",
         StartDateTo: "", CStartDateTo: "", StreakValue: null, StreakValueERR: ""
       }, () => { BlastoffAction.getArchiveGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery); });
     }
   }
 
   public deleteopen = (dindex, TemplateName) => {
    this.setState({ actionpopup: false });
     this.setState({ delindex: dindex });
     this.setState({ deletepopup: true });
     this.setState({ DeleteTempalte: TemplateName });
   }
 
   public Archiveopen = (index) => {
     this.setState({ actionpopup: false });
     this.setState({ Archiveindex: index });
     this.setState({ Archivepopup: true });
   }
     this.setState({ actionpopup: false });
     this.setState({ unArchiveindex: index });
     this.setState({ unArchivepopup: true });
   }
 
   public deleteclose = () => {
     this.setState({ deletepopup: false });
   }
 
   public ArchiveClose = () => {
     this.setState({ Archivepopup: false });
   }
 
   public unArchiveClose = () => {
    this.setState({ unArchivepopup: false });
   }
 
   public deleterecord = () => {
    BlastoffAction.postDeleteUser(this.state.siteUrl, this.state.currentContext, this.state.delindex, this.state.DeleteTempalte);
     this.deleteclose();
   }
 
   public Archiverecord = () => {
    BlastoffAction.postArchiveUser(this.state.siteUrl, this.state.currentContext, this.state.Archiveindex);
     this.ArchiveClose();
   }
 
   public unArchiverecord = () => {
    BlastoffAction.postunArchiveUser(this.state.siteUrl, this.state.currentContext, this.state.unArchiveindex);
     this.unArchiveClose();
   }
 
   public filteropen = () => {
     this.setState({ filterpopup: !this.state.filterpopup });
   }
 
   public Fireopen = () => {
     this.setState({ Firepopup: !this.state.Firepopup });
   }
 
   public FireClose = () => {
     this.setState({ Firepopup: false, StreakValue: null, StreakValueERR: "" }, () => { this.formQuery(); });
   }
 
   public handleUserType = (event) => {
    this.setState({ MessageType: event.target.value });
   }
 
   public filter = () => {
    let ErrorMsg = ""
     if (this.state.filterquery == "" && this.state.MessageType == "" && this.state.CreatedByName.length == 0 && this.state.CStartDateFrom == "" && this.state.CStartDateTo == "") {
       this.setState({ ErrorMsg: "Please select atleast one filter" });
       ErrorMsg = "validation failed";
     }
     if (ErrorMsg == "" && this.state.DateRangeErrorMsg == "") {
       this.formQuery();
       this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "" });
     }
   }
 
   public FireFilter = () => {
     if (this.state.StreakValue != null) {
       this.formQuery();
       this.setState({ Firepopup: false, StreakValueERR: "" });
     }
     else {
       this.setState({ StreakValueERR: "Please select streak" });
     }
   }
 
   public formQuery = () => {
    let filterquery = "";
     if (this.state.searchText != '') {
 filterquery = filterquery + `and(substringof('${this.state.searchText}',TemplateName))`;
     }
     if (this.state.StreakValue != null) {
 filterquery = filterquery + `and(TemplateUsageCount le '${this.state.StreakValue}')`;
     }
     if (this.state.CreatedByName.length != 0) {
 filterquery = filterquery + `and(Author/EMail eq '${this.state.CreatedByName[0].Email}')`;
     }
     if (this.state.MessageType != "") {
 filterquery = filterquery + `and(MessageType eq '${this.state.MessageType}')`;
     }
     if (this.state.CStartDateFrom != '') {
  filterquery = filterquery + `and(Created ge '${this.state.CStartDateFrom}')`;
     }
     if (this.state.CStartDateTo != '') {
       filterquery = filterquery + `and(Created le '${this.state.CStartDateTo}')`;
     }
     this.setState({ filterquery });
     if (this.state.activeTab == "New Hire") {
       BlastoffAction.getNewUserGridData(this.state.siteUrl, this.state.currentContext, filterquery);
     }
     else if (this.state.activeTab == "Manager") {
       BlastoffAction.getManagerGridData(this.state.siteUrl, this.state.currentContext, filterquery);
     }
     else {
       BlastoffAction.getArchiveGridData(this.state.siteUrl, this.state.currentContext, filterquery);
     }
   }
 
   public BlastoffSearch = (searchtext) => {
     this.setState({ searchText: searchtext }, () => {
       this.formQuery();
     });
   }
 
   public handleStartFromDatePicker = (dateVal) => {
     this.setState({ StartDateFrom: dateVal, ErrorMsg: "" });
     this.handleValidate("from", dateVal);
     this.convert("from", dateVal);
   }
 
   public handleStartToDatePicker = (dateVal) => {
     this.setState({ StartDateTo: dateVal, ErrorMsg: "" });
     this.handleValidate("to", dateVal);
     this.convert("to", dateVal);
   }
 
   public handleValidate = (type, value) => {
    var fromval = this.state.StartDateFrom, toval = this.state.StartDateTo;
     if (type == "from" && toval != "") {
       if (value > toval) {
         this.setState({ DateRangeErrorMsg: "From Date should be lesser than the to Date" });}
       else {
         this.setState({ DateRangeErrorMsg: "" });
       }}
     if (type == "to" && fromval != "") {
       if (value < fromval) {
         this.setState({ DateRangeErrorMsg: "To Date should be greater than the from Date" });
       }
       else {
         this.setState({ DateRangeErrorMsg: "" });
       }
 }}
 
   public convert = (type, date) => {
     let startdate = new Date(date),
       mnth = ("0" + (date.getMonth() + 1)).slice(-2),
       day = ("0" + date.getDate()).slice(-2);
     if (type == "from") {
       let cstartdate = [date.getFullYear(), mnth, day].join("-") + "T00:00:00.000Z";
       this.setState({ CStartDateFrom: cstartdate });
     }
     else if (type == "to") {
 let cstartdate = [date.getFullYear(), mnth, day].join("-") + "T23:59:59.000Z";
       this.setState({ CStartDateTo: cstartdate });
     }}
 
   public filterclose = () => {
     this.setState({
       searchText: "", filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
       CreatedByName: [], StartDateFrom: "", CStartDateFrom: "",
       StartDateTo: "", CStartDateTo: "", StreakValue: null, StreakValueERR: "",
     }, () => { this.formQuery(); });
   }
 
   OnStreak = (Value) => {
    this.setState({ StreakValue: Value })
    }
 
 
 
 
   bindData = () => {
     let loadcall = this.state.BlastoffGrid.length == 0 ? (this.state.filterquery == "" && this.state.searchText == "") ? "noData" : "filterNoData" : "gridData";
     if (loadcall == "noData" && this.state.activeTab != "Archived") {
       return (
         <div className="center mt-5">
           <h4 className="display-message">
             Sorry! you don't have any Template's in the Blastoff Grid
           </h4>
           <img className=" my-5 center" src={pinbgimg} alt="background" />
           <h4 className="display-message  ml-5">
             Click on the '+' icon to create New Template
           </h4>
         </div>
       ); }
     else if (loadcall == "noData" && this.state.activeTab == "Archived") {
       return (
         <div className="center mt-5">
           <h4 className="display-message">
             Sorry! You don't have any templates in the Archived tab
           </h4>
           <img className=" my-5 center" src={pinbgimg} alt="background" />
         </div>
       ); }
     else if (loadcall == "filterNoData") {
       return (
         <div className="center mt-5">
           <img
             className=" my-5 center"
             src={searchResults}
             alt="background"/>
           {this.state.searchText != "" ?
             <h4 className="display-message">Sorry we couldn't find any results matching '{this.state.searchText}'</h4> :
             <h4 className="display-message">Sorry we couldn't find any results</h4>}
           {this.state.searchText == "" ?
             <button className="user-config-create-button mt-4 center results-screen-back " onClick={this.filterclose.bind(this)}>
               Back to Blastoff Grid
             </button> : null}
         </div>
       ); }
     else if (loadcall == "gridData") {
       return this.state.BlastoffGrid.map((value, index) => {
         var CreatorProfile = this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Author.EMail;
        return (
           <div className="col- col-md-4">
             <div className="card bgimg  mb-3">
               <div className="card-header bg-transparent pt-0 mt-2"> <img className="profile float-left mr-3"
                 src={CreatorProfile} />
                 <ul className="mt-3">
                   <li className="person_info">{this.state.activeTab != "Archived" ? <a href="#" className="user-drilldown" onClick={this.editview.bind(this, value.ID, "view")}>{value.TemplateName}</a> : value.TemplateName}</li>
     <li className="date_info" ><span className="date_info"> <Moment format="LL">
                     {value.Created}
                   </Moment></span> </li>
                 </ul>
               </div>
     <div className="card-body pt-0 mt-1"> <span className="float-left w-100">
                 <label className="keyword py-1 px-2 mr-1">{value.MessageType == "Message" ? "Message" : value.MessageType == "Poll" ? "Poll" : "Document"} </label></span>
                 <div className="mt-3  float-left w-100"> <span>{value.TemplateDescription == null ? "" : value.TemplateDescription.length > 60 ? value.TemplateDescription.slice(0, 60) + "..." : value.TemplateDescription}</span> </div></div>
       <div className="card-footer footer-border-none bg-transparent mb-3 mr-2">
                 <div className="float-left">
                   <img className="fire_icon" src={fireicon} data-placement="bottom" title="Template Usage Count" /><span className="ml-1 temp-usage-count">{value.TemplateUsageCount}</span>
                 </div>
                 <div className="hover_icons float-right">
     {(this.state.activeTab == "New Hire" || this.state.activeTab == "Manager") ?
                     <a href="#" className="edit-icon-bg mr-3" onClick={this.editview.bind(this, value.ID, "edit")}><img className="footer_icon" src={edit} data-placement="bottom" title="Edit" /></a>: null}
                   {(this.state.activeTab == "New Hire" || this.state.activeTab == "Manager") ? <a href="#" className="archive-icon-bg mr-3" onClick={this.Archiveopen.bind(this, value.ID)}><img onClick={this.Archiveopen.bind(this, value.ID)} className="footer_icon" src={Archive} data-placement="bottom" title="Archive" /></a>: null}
                   {(this.state.activeTab == "Archived") ?
                     <a href="#" className="archive-icon-bg mr-3" onClick={this.unArchiveopen.bind(this, value.ID)}><img onClick={this.unArchiveopen.bind(this, value.ID)} className="footer_icon" src={Archive} data-placement="bottom" title="UnArchive" /></a> : null}
                   <a href="#" className="trash-icon-bg mr-3" onClick={this.deleteopen.bind(this, value.ID, value.TemplateName)}><img onClick={this.deleteopen.bind(this, value.ID, value.TemplateName)} className="footer_icon" src={Delete} data-placement="bottom" title="Delete" data-toggle="modal" data-target="#deleteModalCenterBlastoff" /></a>
                 </div>
               </div>
             </div>
           </div>
         )});
     }}
 
   public newform = () => {
     this.props.callback("form", "create", "", this.state.activeTab, "Blastoff");
   }
 
   public editview = (editId, evstate) => {
     this.props.callback("form", evstate, editId, this.state.activeTab, "Blastoff");
   }
 
   public render(): React.ReactElement<BlastoffProps> {
     return (
       <div >
         <div className="row m-0">
           <div className="col-md-12">
             <div className="float-left headerspacing">
               <ul className="nav tivasta-form-tab tivasta-blastoff mt-2 mar-bottom" role="tablist">
                 <li data-tab="tab-3" className={this.state.activeTab == "New Hire" ? "tivasta-current" : null}><a className="nav-link p-0  tivasta-nav-item" onClick={this.activeTab.bind(this)}>New Hire</a></li>
                 <li data-tab="tab-4" className={this.state.activeTab == "Manager" ? "tivasta-current" : null}><a className="nav-link p-0 ml-4  tivasta-nav-item" onClick={this.activeTab.bind(this)}>Manager</a></li>
                 <li data-tab="tab-5" className={this.state.activeTab == "Archived" ? "tivasta-current" : null}><a className="nav-link p-0 ml-4  tivasta-nav-item" onClick={this.activeTab.bind(this)}>Archived</a></li>
               </ul>
             </div>
             <div className="float-right headerspacing">
               <form className="form-inline float-left">
                 {this.state.BlastoffGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                   <SearchComponent searchFunc={this.BlastoffSearch}>   </SearchComponent>}
                 {this.state.BlastoffGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                   <div className="dropdown pos-inherit">{/*Streak Starts*/}
                     <button type="button" className="fire-button  btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false" onClick={this.Fireopen.bind(this)}>
                       <img src={fire} /></button>
                     <div className={this.state.Firepopup ? "dropdown-menu m-0 pb-4 advanced-filter show " : "dropdown-menu m-0 pb-4 advanced-filter"}>
                       <div className="container-fluid">
                         <div className="row">
                           <div className="col-md-12 pb-2  mt-2  mb-4">
             <span className="filter-title"> <img src={fire} /> Times</span>
       <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { this.setState({ Firepopup: false }); }}>
                               <span aria-hidden="true">×</span>
                             </button>
                           </div>
                           <div className="col-md-12 mb-4">
                             <div className="slidecontainer">
                               <Slider min={0} max={100} defaultValue={0} value={this.state.StreakValue} onChange={this.OnStreak} showValue />
                             </div>
                           </div>
                           <div className="col-md-12 mb-2">
                             <div className="float-right">
                               <a href="#" className="filter-close form-label col-gray mt-1 px-4" onClick={this.FireClose.bind(this)}>Clear</a>
                               <a href="#" className="btn btn-primary filter-close ml-2 px-4" onClick={this.FireFilter.bind(this)} >Apply</a></div>
                           </div>
                         </div>
                         <span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.StreakValueERR}</span>
                       </div>
 
                     </div>
                   </div>}
                 {this.state.BlastoffGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
       <div className="dropdown pos-inherit">{/*Advanced Filter Starts*/}
                     <  button type="button" className="btn btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false" onClick={this.filteropen.bind(this)}> <img src={filter} /></button>
                     <div className={this.state.filterpopup ? "dropdown-menu m-0 pb-4 advanced-filter show" : "dropdown-menu m-0 pb-4 advanced-filter"}>
                       <div className="container-fluid">
                         <div className="row">
                           <div className="col-md-12 pb-2 border-bottom mt-2  mb-4"> <span className="filter-title">Advanced Filter</span>
                             <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.filterclose.bind(this)}> <span aria-hidden="true">×</span> </button>
                           </div>
                           <div className="col-md-6 mb-4">
                             <div className="form-group filter-font col-gray">
                   <label htmlFor="select-createdby">Created By</label>
                               <Typeahead
                                 className="form-placeholder-font-size w-100 mt-2"
   onChange={(value) => this.setState({ CreatedByName: value })}
                                 options={this.state.CreatedByList}
                                 placeholder="Select UserName"
                                 labelKey={option => `${option.UserName}`}
                                 selected={this.state.CreatedByName}
                                 minLength='1'/>
                             </div>
                           </div>
                           <div className="col-md-6 mb-4">
                             <div className="form-group filter-font col-gray">
             <label htmlFor="select-temp-type-bl">Template Type</label>
                               <Typeahead
                   onChange={(value) => this.setState({ MessageType: value })}
                                 selected={this.state.MessageType}
                                 options={["Message", "Poll", "Document"]}
                                 placeholder="Select Message Type"
                            className="form-placeholder-font-size w-100 mt-2" />
                             </div>
                           </div>
                           <label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Date Range</label>
                           <div className="col-md-6 mb-4">
                             <div className="form-group filter-font col-gray">
                               <DatePicker
                                 className="form-placeholder-font-size w-100 mt-2"
                                 placeholder="From"
                                 value={this.state.StartDateFrom}
                   onSelectDate={this.handleStartFromDatePicker.bind(this)} />
                             </div>
                           </div>
                           <div className="col-md-6 mb-4">
                             <div className="form-group filter-font col-gray">
                               <DatePicker
                                 className="form-placeholder-font-size w-100 mt-2"
                                 placeholder="To"
                                 value={this.state.StartDateTo}
                     onSelectDate={this.handleStartToDatePicker.bind(this)} />
                             </div>
                           </div>
                           <span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.ErrorMsg}</span>
                           <span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.DateRangeErrorMsg}</span>
                           <div className="col-md-12  mt-2 mb-2">
                             <div className="float-right">
                               <a href="#" className="filter-close form-label col-gray px-4" onClick={this.filterclose.bind(this)}>Clear</a>
                               <a href="#" className="btn btn-primary filter-close ml-2 px-4" onClick={this.filter.bind(this)}>Apply Filter</a>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>}
                 {this.state.BlastoffGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                   <div>
                     {this.state.activeTab == "New Hire" ?
                       <SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields1} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
                       </SaveToReport> : null}
                     {this.state.activeTab == "Manager" ?
                       <SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields2} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
                       </SaveToReport> : null}
                     {this.state.activeTab == "Archived" ?
                       <SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields3} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
                       </SaveToReport> : null}
                   </div>}
                 <div>
                   {this.state.activeTab == "Archived" ? null :
                     <button type="button" className="btn btn-info ml-3" data-placement="bottom" title="Create New Template" onClick={this.newform.bind(this)}><img src={addIcon} /></button>}
                 </div>
               </form>
             </div>
           </div>
         </div>
         {this.state.deletepopup ?
           <div
             className="modal fade show"
             id="deleteModalCenterBlastoff"
             tabIndex={-1}
             style={{ display: "block", paddingRight: 17 }}
             role="dialog"
             aria-labelledby="exampleModalCenterTitle"
             aria-modal="true">
             <div className="modal-dialog modal-dialog-centered" role="document">
               <div className="modal-content">
                 <div className="modal-header">
                   <h5 className="modal-title" id="exampleModalLongTitle">
                     Delete Record
                   </h5>
                   <button
                     type="button"
                     className="close"
                     data-dismiss="modal"
                     aria-label="Close" onClick={this.deleteclose.bind(this)} >
                     <span aria-hidden="true">×</span>
                   </button>
                 </div>
                 <div className="modal-body">
                   <span className="delete-modal-box">
                     Are you sure you want to delete this record ?
                   </span>
                 </div>
                 <div className="modal-footer footer-border-none">
                   <button
                     type="button"
                     className="btn btn-secondary cancel-button-del-modal"
      data-dismiss="modal" onClick={this.deleteclose.bind(this)} >
                     Cancel
                   </button>
                   <button
                     type="button"
                     className="btn btn-primary del-button"
   data-dismiss="modal" onClick={this.deleterecord.bind(this)} >
                     Delete
                   </button>
                 </div>
               </div>
             </div>
           </div> : null}
         {this.state.Archivepopup ?
           <div
             className="modal fade show"
             id="deleteModalCenterBlastoff"
             tabIndex={-1}
             style={{ display: "block", paddingRight: 17 }}
             role="dialog"
             aria-labelledby="exampleModalCenterTitle"
             aria-modal="true">
             <div className="modal-dialog modal-dialog-centered" role="document">
               <div className="modal-content">
                 <div className="modal-header">
                   <h5 className="modal-title" id="exampleModalLongTitle">
                     Archive Record
                   </h5>
                   <button
                     type="button"
                     className="close"
                     data-dismiss="modal"
                     aria-label="Close"
  onClick={this.ArchiveClose.bind(this)}>
                     <span aria-hidden="true">×</span>
                   </button>
                 </div>
                 <div className="modal-body">
                   <span className="delete-modal-box">
                     Are you sure you want to Archive this record ?
                   </span>
                 </div>
                 <div className="modal-footer footer-border-none">
                   <button
                     type="button"
                     className="btn btn-secondary cancel-button-del-modal"
                     data-dismiss="modal" onClick={this.ArchiveClose.bind(this)}>
                     Cancel
                   </button>
                   <button
                     type="button"
                     className="btn btn-primary del-button"
                     data-dismiss="modal" onClick={this.Archiverecord.bind(this)} >
                     Archive
                   </button>
                 </div>
               </div>
             </div>
           </div> : null}
         {this.state.unArchivepopup ?
           <div
             className="modal fade show"
             id="deleteModalCenterBlastoff"
             tabIndex={-1}
             style={{ display: "block", paddingRight: 17 }}
             role="dialog"
             aria-labelledby="exampleModalCenterTitle"
             aria-modal="true" >
             <div className="modal-dialog modal-dialog-centered" role="document">
               <div className="modal-content">
                 <div className="modal-header">
                   <h5 className="modal-title" id="exampleModalLongTitle">
                     UnArchive Record
                   </h5>
                   <button
                     type="button"
                     className="close"
                     data-dismiss="modal"
                     aria-label="Close"
                     onClick={this.unArchiveClose.bind(this)} >
                     <span aria-hidden="true">×</span>
                   </button>
                 </div>
                 <div className="modal-body">
                   <span className="delete-modal-box">
                     Are you sure you want to UnArchive this record ?
                   </span>
                 </div>
                 <div className="modal-footer footer-border-none">
                   <button type="button"
                     className="btn btn-secondary cancel-button-del-modal"
                     data-dismiss="modal" onClick={this.unArchiveClose.bind(this)}>
                     Cancel
                   </button>
                   <button
                     type="button"
                     className="btn btn-primary del-button"
                     data-dismiss="modal" onClick={this.unArchiverecord.bind(this)}> UnArchive
                   </button>
                 </div>
               </div>
             </div>
           </div> : null}
         <div id="tab-3" className="tivasta-form-tab-content tivasta-blastoff-content col-md-12 tivasta-current mt-4">
           <div className="row card-font"> {/*First Row for cards starts here*/}
             {this.bindData()}
           </div>
         </div>
       </div>
     );
   }
 }
 
 