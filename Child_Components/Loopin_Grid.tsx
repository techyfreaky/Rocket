/**[Ref] - Denotes Pseudo Code Reference  
 * This component is the Loopin grid component. The component displays the data in the Grid format. 
 * App Name: Rocket
 * Author: Manish */
import * as React from 'react';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import Moment from 'react-moment';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import "react-datepicker/dist/react-datepicker.css";
import { Typeahead } from 'react-bootstrap-typeahead';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import SearchComponent from '../Child_Components/Search_Component';
import SaveToReport from '../Child_Components/Save_To_Report';
import '../css/commontheme.css';
import '../css/style.css';
import * as LooinAction from '../Action/Loopin_Action';
import LoopinStore from '../Store/Loopin_Store';

const filter: string = require('../images/filter.svg');
const save: string = require('../images/save.svg');
const addIcon: string = require('../images/add-icon.svg');
const searchIcon: string = require('../images/search.svg');
const Actionimage: string = require('../images/actions.svg');
const edit: string = require('../images/pen.svg');
const Delete: string = require('../images/empty-trash.svg');
const Archive: string = require('../images/archive-dropdown.svg');
const Message: string = require('../images/message.svg');
const Document: string = require('../images/document.svg');
const Polls: string = require('../images/poll.svg');
const pinbgimg: string = require('../images/pinbgimg.png');
const searchResults: string = require('../images/search-results.svg');

export interface LoopinProps {
  context: WebPartContext;
  callback: any;
}

export interface LoopinStates {
  siteUrl: string;
  currentContext: WebPartContext;
  listName: any;
  selectfields1: any;
  selectfields2: any;
  gridfields: any;
  displayfields: any;
  activeTab: string;
  LoopinGrid: any[];
  filterquery: any;
  actionpopup: boolean;
  actionindex: any;
  deletepopup: boolean;
  delindex: any;
  Archivepopup: boolean;
  Archiveindex: any;
  unArchivepopup: boolean;
  unArchiveindex: any;
  searchText: any;
  filterpopup: boolean;
  MessageType: string;
  StartDateFrom: any;
  CStartDateFrom: any;
  StartDateTo: any;
  CStartDateTo: any;
  DateRangeErrorMsg: string;
  ErrorMsg: string;
  CreatedByNamelist: any[];
  CreatedByName: any;
  DeleteTempalte: any;
}

export default class loopins extends React.Component<LoopinProps, LoopinStates>{
  constructor(props) {
    super(props);
    this.state = {
      siteUrl: this.props.context.pageContext.web.absoluteUrl,
      currentContext: this.props.context,
      listName: "Template",
selectfields1: "TemplateName,TemplateDescription,MessageType,Created&$filter=(TemplateType eq 'LoopIn')and(IsActive eq 1)",
selectfields2: "TemplateName,TemplateDescription,MessageType,Created&$filter=(TemplateType eq 'LoopIn')and(IsActive eq -1)",
gridfields: ['TemplateName', 'Created', 'MessageType', 'TemplateDescription'],
displayfields: ['TemplateName', 'CreatedDate', 'MessageType', 'TemplateDescription'],
      activeTab: "Loopins",
      LoopinGrid: [],
      actionpopup: false,
      actionindex: "",
      filterquery: "",
      deletepopup: false,
      delindex: "",
      Archivepopup: false,
      Archiveindex: "",
      unArchivepopup: false,
      unArchiveindex: "",
      searchText: "",
      filterpopup: false,
      MessageType: "",
      StartDateFrom: "",
      CStartDateFrom: "",
      StartDateTo: "",
      CStartDateTo: "",
      DateRangeErrorMsg: "",
      ErrorMsg: "",
      CreatedByNamelist: [],
      CreatedByName: [],
      DeleteTempalte: "",
    };
  }

   componentWillMount() {
    LooinAction.getLoopinGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
    LooinAction.getCreatedByNameLoopin(this.state.siteUrl, this.state.currentContext);
    LoopinStore.on("LoopinGrid", this.loadLoopinGridData.bind(this));
    LoopinStore.on("success", this.ondeleteload.bind(this));
    LoopinStore.on("Archive", this.onArchiveload.bind(this));
    LoopinStore.on("unArchive", this.onunArchiveload.bind(this));
    LoopinStore.on("createdByNameListLoopin", this.loadUserName.bind(this));
  }

  public loadLoopinGridData = () => {
    this.setState({ LoopinGrid: LoopinStore.LoopinGridData });
  }

   ondeleteload = () => {
    if (LoopinStore.delete == "204") {
      if (this.state.activeTab == "Archived") {
        LooinAction.getLoopinArchiveData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
      } else {
        LooinAction.getLoopinGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
      }}
  }

  onArchiveload = () => {
    if (LoopinStore.archive == "204") {
LooinAction.getLoopinGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
    }
  }

  onunArchiveload = () => {
    if (LoopinStore.unarchive == "204") {
      LooinAction.getLoopinArchiveData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
    }
  }

  public loadUserName = () => {
    this.setState({ CreatedByNamelist: LoopinStore.createdByNameListLoopin })
  }

  activeTab = (event) => {
    let activeTab = event.target.text;
    this.setState({ activeTab, LoopinGrid: [] });
    if (event.target.text == "Archived") {
      this.setState({
        filterquery: "", searchText: "", filterpopup: false, CreatedByName: "", ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
        StartDateFrom: "", CStartDateFrom: "",
        StartDateTo: "", CStartDateTo: ""
      }, () => { LooinAction.getLoopinArchiveData(this.state.siteUrl, this.state.currentContext, this.state.filterquery); });
    }
    else {
      this.setState({
        filterquery: "", searchText: "", filterpopup: false, CreatedByName: "", ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
        StartDateFrom: "", CStartDateFrom: "",
        StartDateTo: "", CStartDateTo: ""
      }, () => { LooinAction.getLoopinGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery); });
    }
  }

/*** Function which invokes the action column visible to user to perform action*/
  public action = (index) => {
    this.setState({ actionpopup: !this.state.actionpopup });
    this.setState({ actionindex: index });
  }

  /**Function which invokes the confirmation popup message to user to perform deletion*/
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

  public unArchiveopen = (index) => {
    this.setState({ actionpopup: false });
    this.setState({ unArchiveindex: index });
    this.setState({ unArchivepopup: true });
  }

  /** The deleterecord() method is called when the user clicks on the Delete inside the delete popup */
  public deleterecord = () => {
    LooinAction.postDeleteUser(this.state.siteUrl, this.state.currentContext, this.state.delindex, this.state.DeleteTempalte);
    this.deleteclose();
  }

  /** Archiverecord() method is called when the user clicks on the Archiverecord inside the Archive popup. */
  public Archiverecord = () => {
    LooinAction.postArchiveUser(this.state.siteUrl, this.state.currentContext, this.state.Archiveindex);
    this.ArchiveClose();
  }

  /** The unArchiverecord() method is called when the user clicks on the unArchiverecord inside the unArchive popup.*/
  public unArchiverecord = () => {
    LooinAction.postunArchiveUser(this.state.siteUrl, this.state.currentContext, this.state.unArchiveindex);
    this.unArchiveClose();
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

  public filteropen = () => {
    this.setState({ filterpopup: !this.state.filterpopup });
  }

  public filter = () => {
    let ErrorMsg = ""
    if (this.state.filterquery == "" && this.state.MessageType == "" && this.state.CreatedByName.length == 0 && this.state.CStartDateFrom == "" && this.state.CStartDateTo == "") {
      this.setState({ ErrorMsg: "Please select atleast one filter" });
      ErrorMsg = "validation failed";
    }
    if (ErrorMsg == ""&&this.state.DateRangeErrorMsg=="") {
      this.formQuery();
      this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "" });
    }
  }

  public formQuery = () => {
    let filterquery = "";
    if (this.state.searchText != '') {
      filterquery = filterquery + `and(substringof('${this.state.searchText}',TemplateName))`;
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
    if (this.state.activeTab == "Loopins") {
      LooinAction.getLoopinGridData(this.state.siteUrl, this.state.currentContext, filterquery);
    }
    else {
      LooinAction.getLoopinArchiveData(this.state.siteUrl, this.state.currentContext, filterquery);
    }
  }

  public filterclose = () => {
    this.setState({
      searchText: "", filterpopup: false, CreatedByName: [], ErrorMsg: "", DateRangeErrorMsg: "", MessageType: "",
      StartDateFrom: "", CStartDateFrom: "",
      StartDateTo: "", CStartDateTo: ""
    }, () => { this.formQuery(); });
  }

  public LoopinSearch = (searchtext) => {
    this.setState({ searchText: searchtext }, () => {
      this.formQuery();
    });
  }

  /**The handleUserType() method is used to setState the value for MessageType.*/
  public handleUserType = (event) => {
    this.setState({ MessageType: event.target.value });
  }

  public handleStartFromDatePicker = (dateVal) => {
    this.setState({ StartDateFrom: dateVal,ErrorMsg:"" });
    this.handleValidate("from", dateVal);
    this.convert("from", dateVal);
  }

  public handleStartToDatePicker = (dateVal) => {
    this.setState({ StartDateTo: dateVal,ErrorMsg:"" });
    this.handleValidate("to", dateVal);
    this.convert("to", dateVal);
  }

  public handleValidate = (type, value) => {
    var fromval = this.state.StartDateFrom, toval = this.state.StartDateTo;
    if (type == "from" && toval != "") {
      if (value > toval) {
        this.setState({ DateRangeErrorMsg: "From Date should be lesser than the to Date" });      }
      else {
        this.setState({ DateRangeErrorMsg: "" });}
    }
    if (type == "to" && fromval != "") {
      if (value < fromval) {
        this.setState({ DateRangeErrorMsg: "To Date should be greater than the from Date" });
      }
      else {
        this.setState({ DateRangeErrorMsg: "" });
      }}
  }

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
    }
  }

  bindData = () => {
    let loadcall = this.state.LoopinGrid.length == 0 ? (this.state.filterquery == "" && this.state.searchText == "") ? "noData" : "filterNoData" : "gridData";
    if (loadcall == "noData" && this.state.activeTab != "Archived") {
      return (
        <div className="center mt-5">
          <h4 className="display-message">
            Sorry! you don't have any Template's in the Loopin Grid </h4>
          <img className=" my-5 center" src={pinbgimg} alt="background" />
          <h4 className="display-message  ml-5">
            Click on the '+' icon to create New Template
              </h4>
        </div>
      );
    }
    else if (loadcall == "noData" && this.state.activeTab == "Archived") {
      return (
        <div className="center mt-5">
          <h4 className="display-message">
            Sorry! You don't have any templates in the Archived tab </h4>
          <img className=" my-5 center" src={pinbgimg} alt="background" />
        </div>
      );
    }
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
              Back to Loopin Grid
          </button> : null}
        </div>
      );
    }
    else if (loadcall == "gridData") {
      return this.state.LoopinGrid.map((value, index) => {
        var action = "dropdown-menu position";
        if (this.state.actionindex == index) {
          var action = "dropdown-menu position show";
        }
        return (
          <div className="col- col-md-3">
            <div className="card card-sizing card-image">
              <div className="pos-rel ">
                <img src={this.state.siteUrl + "/LoopInsLibrary/" + value.TemplateName + ".png"} className="card-img-top" alt="..." />
                <span className="linear-gradient-bg" />
                <div className="bottom-left"><a className="user-drilldown white" href="#" onClick={this.editview.bind(this, value.ID, "view")}>{value.TemplateName}</a> <span className="float-right dropdown show">
                  <label className="table-actions dropdown" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="actions-cursor mr-3" src={Actionimage} onClick={this.action.bind(this, index)} /></label>
                  <div className={this.state.actionpopup ? action : "dropdown-menu position"} aria-labelledby="dropdownMenuButton">
                    {(this.state.activeTab == "Loopins") ?
                      <a className="dropdown-item" href="#" onClick={this.editview.bind(this, value.ID, "edit")}><img className="dropdown-icon" src={edit} />Edit</a>: null}
                    {value.Predefined != "Yes" ?
                      <a className="dropdown-item" href="#" data-toggle="modal" data-target="#deleteModalCenterLoopins" onClick={this.deleteopen.bind(this, value.ID, value.TemplateName)}><img className="dropdown-icon" src={Delete} />Delete</a>: null}
                    {(this.state.activeTab == "Loopins") ?
                      <a className="dropdown-item archive-loopins" href="#" onClick={this.Archiveopen.bind(this, value.ID)}><img className="dropdown-schedule-icon " src={Archive} />Archive</a>: null}
                    {(this.state.activeTab == "Archived") ?
                      <a className="dropdown-item archive-loopins" href="#" onClick={this.unArchiveopen.bind(this, value.ID)}><img className="dropdown-schedule-icon " src={Archive} />UnArchive</a>
                      : null} </div>
                </span> </div>
              </div>
              <div className="card-body float-left px-0 mb-0">
                <p className="card-text">{value.TemplateDescription == null ? "" : value.TemplateDescription.length > 60 ? value.TemplateDescription.slice(0, 60) + "..." : value.TemplateDescription}</p>
                <img data-placement="bottom" src={value.MessageType == "Message" ? Message : value.MessageType == "Poll" ? Polls : Document} /><span className="ml-2 date-font col-gray"> <Moment format="LL"> {value.Created}
                </Moment></span> </div>
            </div>
          </div>
        ) });}
  }

  public newform = () => {
    this.props.callback("form", "create", "", this.state.activeTab, "LoopIn");
  }

  public editview = (editId, evstate) => {
    this.props.callback("form", evstate, editId, this.state.activeTab, "LoopIn");
  }

  public render(): React.ReactElement<LoopinProps> {
    return (
      <div>
        <div className="row m-0">
          <div className="col-md-12 mb-2">
            <div className="float-left headerspacing">
              <ul className="nav tivasta-form-tab tivasta-loopins mt-3 mar-bottom" role="tablist">
                <li data-tab="tab-6" className={this.state.activeTab == "Loopins" ? "tivasta-current" : null}><a onClick={this.activeTab.bind(this)} className="tivasta-nav-item tivasta-nav-link p-0" >Loopins</a></li>
                <li data-tab="tab-7" className={this.state.activeTab == "Archived" ? "tivasta-current" : null}><a onClick={this.activeTab.bind(this)} className="tivasta-nav-item tivasta-nav-link p-0 ml-4">Archived</a></li>
              </ul>
            </div>
            <div className="float-right headerspacing">
              <form className="form-inline float-left">
                {this.state.LoopinGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                  <SearchComponent searchFunc={this.LoopinSearch}>   </SearchComponent>}
                {this.state.LoopinGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                  <div className="dropdown pos-inherit">
                    <button type="button" className="btn btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false" onClick={this.filteropen.bind(this)}> <img src={filter} /></button>
                    <div className={this.state.filterpopup ? "dropdown-menu m-0 pb-4 advanced-filter show" : "dropdown-menu m-0 pb-4 advanced-filter"}>
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-md-12 pb-2 border-bottom mt-2  mb-4"> <span className="filter-title">Advanced Filter</span>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.filterclose.bind(this)}> <span aria-hidden="true">×</span> </button>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="form-group filter-font col-gray">
              <label htmlFor="select-createdby-lp">Created By</label>
                                <Typeahead
                                className="form-placeholder-font-size w-100 mt-2"
    onChange={(value) => this.setState({ CreatedByName: value })}
                                options={this.state.CreatedByNamelist}
                                placeholder="Select UserName"
                                labelKey={option => `${option.UserName}`}
                                selected={this.state.CreatedByName}
                                minLength='1'/>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="form-group filter-font col-gray">
              <label htmlFor="select-temp-type-lp">Template Type</label>
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
                              <a href="#" className="btn btn-primary filter-close ml-2 px-4" onClick={this.filter.bind(this)}>Apply Filter</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                {this.state.LoopinGrid.length == 0 && this.state.filterquery == "" && this.state.searchText == "" ? null :
                  <div>
                    {this.state.activeTab == "Loopins" ?
                      <SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields1} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
                      </SaveToReport> : null}
                    {this.state.activeTab == "Archived" ?
                      <SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields2} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
                      </SaveToReport> : null}
                  </div>}
                {this.state.activeTab == "Archived" ? null :
                  <button type="button" className="btn btn-info ml-3" data-placement="bottom" title="Create New Template" onClick={this.newform.bind(this)}><img src={addIcon} /></button>}
              </form>
            </div>
          </div>
        </div>
        <div id="tab-6" className="tivasta-form-tab-content tivasta-loopins-content col-md-12 mt-4 tivasta-current">
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
                      aria-label="Close"
                      onClick={this.deleteclose.bind(this)} >
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
                      onClick={this.ArchiveClose.bind(this)} >
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
data-dismiss="modal" onClick={this.ArchiveClose.bind(this)} >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary del-button"
data-dismiss="modal" onClick={this.Archiverecord.bind(this)}
                    >
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
              aria-modal="true">
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
                    <button
                      type="button"
                      className="btn btn-secondary cancel-button-del-modal"
                      data-dismiss="modal" onClick={this.unArchiveClose.bind(this)} >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary del-button"
                      data-dismiss="modal" onClick={this.unArchiverecord.bind(this)} >
                      unArchive
                    </button>
                  </div>
                </div>
              </div>
            </div> : null}
          <div className="row">
            {this.bindData()}
          </div>
        </div>
      </div>
    );}
}
