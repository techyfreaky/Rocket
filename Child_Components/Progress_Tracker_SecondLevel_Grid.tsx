/**[Ref] - Denotes Pseudo Code Reference
* This Component is First Level of Progress Tracker
* App Name: Rocket
* Author: Giftson
* Created Date: 06/02/2020*/
import * as React from 'react';
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import ProgressCard from "./Progress_Cards_Component"
import Search from "./Search_Component"
import Moment from 'react-moment';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Pagination } from '@material-ui/lab';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

const save: string = require('../images/save.svg');
const up: string = require('../images/up.svg');
const down: string = require('../images/down.svg');
const add: string = require('../images/add-icon.svg');
const filter: string = require('../images/filter.svg');
const back: string = require('../images/user-drill-back-image.svg');
const trash: string = require('../images/empty-trash.svg');
const pinbgimg: string = require('../images/pinbgimg.png');
const search: string = require('../images/search-results.svg')

import '../css/commontheme.css';
import '../css/style.css';
import SaveToReport from './Save_To_Report';
import * as ProgressAction from '../webports/rocketWebport/Action/Progress_Action';
import ProgressStore from '../Store/Progress_Store';

let ManagerName = "";

export interface ProgressSecondLevelState {
siteUrl: string;
currentcontext: any;
listName: string;
selectfields: any;
gridfields: any;
displayfields: any;
searchText: any;
user: any;
tab: any;
top: any;
filterQuery: any;
tabMsgCount: any;
tabMsgDetails: any;
tabUserDetail: any;
filterOpen: any;
deleteOpen: any;
deleteIndex: any;
selectedMsgType: any;
selectedResponse: any;
selectedFromDate: any;
selectedToDate: any;
convertedFromDate: any;
convertedToDate: any;
errorFromDate: any;
errorToDate: any;
errorFilter: any;
sortingColumn: any;
sortingOrder: any;
currentPage: any;
postperPage: any;
indexofFirstPage: any;
indexofLastPage: any;
currentPosts: any;
pageCount: any;
pollDetail: any;
pollOpen: any;
pollIndex: any;
statusType: any;
emptyRecordsCount: any;
}

export interface ProgressSecondLevelProps {
context: IWebPartContext;
user: any;
callback: any;
tab: any;
callback1: any;
}

export default class ProgressTrackerSecondLevel extends React.Component<ProgressSecondLevelProps, ProgressSecondLevelState> {
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentcontext: this.props.context,
listName: "ScheduledTemplate",
selectfields: `TemplateName/TemplateName,TemplateName/MessageType,ScheduledDateAndTime,Status,Response,Email/Email&$expand=TemplateName/Id,Email/Id&$filter=(Email/Email eq '${this.props.user}')and(IsActive eq 1)`,
gridfields: ['/TemplateName/TemplateName/', '/TemplateName/MessageType/', 'ScheduledDateAndTime', 'Status', 'Response'],
displayfields: ['TemplateName', 'MessageType', 'ScheduledDate', 'Status', 'Response'],
searchText: '',
user: this.props.user,
tab: this.props.tab,
top: 10,
filterQuery: '',
tabMsgCount: '',
tabMsgDetails: [],
tabUserDetail: [],
filterOpen: false,
deleteOpen: false,
deleteIndex: "",
selectedMsgType: [],
selectedResponse: [],
selectedFromDate: "",
selectedToDate: "",
convertedFromDate: "",
convertedToDate: "",
errorFromDate: "",
errorToDate: "",
errorFilter: '',
sortingColumn: '',
sortingOrder: '',
currentPage: 1,
postperPage: 10,
indexofFirstPage: 0,
indexofLastPage: 10,
currentPosts: [],
pageCount: '',
pollDetail: [],
pollOpen: false,
pollIndex: '',
statusType: '',
emptyRecordsCount: ''
}
}

componentWillMount() {
ProgressAction.getProgressMsgDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.user, this.state.filterQuery, this.state.top);
ProgressStore.on("tabMsgCount", this.getCount.bind(this));
ProgressStore.on("tabMsgDetails", this.getDetails.bind(this));
ProgressStore.on("tabMsgUser", this.getUserDetails.bind(this));
ProgressStore.on("pollDetail", this.getPollDetail.bind(this));
ProgressStore.on("successMsgDelete", this.deleteConfirm.bind(this));
}

public getPollDetail = () => {
this.setState({ pollDetail: ProgressStore.pollDetail });
}

public getCount = () => {
let pageCount = Math.ceil(ProgressStore.tabMsgCount / this.state.postperPage);
this.setState({ tabMsgCount: ProgressStore.tabMsgCount, pageCount });
}

public getDetails = () => {
let currentDetails = ProgressStore.tabMsgDetails;
let currentPosts = currentDetails.slice(this.state.indexofFirstPage, this.state.indexofLastPage);
this.setState({ tabMsgDetails: ProgressStore.tabMsgDetails, emptyRecordsCount: 10 - currentPosts.length, currentPosts });
}

public getUserDetails = () => {
this.setState({ tabUserDetail: ProgressStore.tabUserDetail });
}

public callbackSearch = (searchTxt) => {
this.setState({ searchText: searchTxt }, () => {
this.formQuery();
});
}

public callbackType = (type) => {
this.setState({ statusType: type }, () => {
this.formQuery();
});
}

public handleDateChange = (dateSelected, dateType) => {
let state = this.state;
state[dateType] = dateSelected;
this.setState(state);
this.setState({errorFilter:""});
this.convertDate(dateSelected, dateType);
this.validateDate(dateSelected, dateType);

}

public pageChange = (event, page) => {
let postperPage = this.state.postperPage;
let indexofLastPage = page * postperPage;
let indexofFirstPage = indexofLastPage - postperPage;
let top = page * postperPage;
this.setState({ indexofLastPage, indexofFirstPage, top, currentPage: page, filterOpen: false, pollOpen: false }, () => {
ProgressAction.getProgressMsgDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.user, this.state.filterQuery, this.state.top);
})
}

/**Function to validate the filter*/
public applyFilter = () => {
let error = '';
if (this.state.selectedFromDate == "" && this.state.selectedToDate == "" && this.state.selectedMsgType.length == 0 && this.state.selectedResponse.length == 0) {
error = "Please select atleast one field"
this.setState({ errorFilter: error });
}
else if(this.state.errorFromDate==""&&this.state.errorToDate==""){
this.setState({ errorFilter: '', filterOpen: false }, () => {
this.formQuery();
});}
}

public formQuery = () => {
let filterQuery = "";
if (this.state.searchText != '') {
filterQuery = filterQuery + `and(substringof('${this.state.searchText}',TemplateName/TemplateName))`;
}
if (this.state.selectedMsgType.length != 0) {
filterQuery = filterQuery + `and(TemplateName/MessageType eq '${this.state.selectedMsgType[0]}')`;
}
if (this.state.statusType != "") {
filterQuery = filterQuery + `and(Status eq '${this.state.statusType}')`;
}
if (this.state.selectedResponse.length != 0) {
if (this.state.selectedResponse[0] == "No Response")
filterQuery = filterQuery + `and(Response eq '${this.state.selectedResponse[0]}')`;
else
filterQuery = filterQuery + `and(Response ne 'No Response')`;
}
if (this.state.convertedFromDate != '') {
filterQuery = filterQuery + `and(ScheduledDateAndTime ge '${this.state.convertedFromDate}')`;
}
if (this.state.convertedToDate != '') {
filterQuery = filterQuery + `and(ScheduledDateAndTime le '${this.state.convertedToDate}')`;
}
if (this.state.sortingColumn != '' && this.state.sortingOrder != '') {
filterQuery = filterQuery + `&$orderby=${this.state.sortingColumn} ${this.state.sortingOrder}`;
}
this.setState({ filterQuery, currentPage: 1, top: 15, pollOpen: false }, () => {
ProgressAction.getProgressMsgDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.user, this.state.filterQuery, this.state.top);
});
}

/** Function to convert the selected date to suitable format for SP List */
public convertDate = (dateSelected, dateType) => {
var date = new Date(dateSelected),
mnth = ("0" + (date.getMonth() + 1)).slice(-2),
day = ("0" + date.getDate()).slice(-2);
if (dateType == "selectedFromDate") {
let conv = [date.getFullYear(), mnth, day].join("-") + "T00:00:00.000Z";
this.setState({ convertedFromDate: conv.toString() });
}
else if (dateType == "selectedToDate") {
let conv = [date.getFullYear(), mnth, day].join("-") + "T23:59:59.000Z";
this.setState({ convertedToDate: conv.toString() });
}
}

/**Function to the date range in the filter*/
public validateDate = (dateSelected, dateType) => {
let toDate = this.state.selectedToDate;
let fromDate = this.state.selectedFromDate;
let errorToDate = "";
let errorFromDate = "";
if (dateType == "selectedFromDate" && toDate != "" && toDate != null) {
if (dateSelected > toDate) {
errorFromDate = "From Date should not be greater than the To Date";
}
}
else if (dateType = "selectedToDate" && fromDate != "" && fromDate != null) {
if (dateSelected < fromDate) {
errorToDate = "To date should not be lesser than the From Date"
}
}
this.setState({ errorFromDate, errorToDate });
}

/** Function to delete the message by using delMsg from action*/
public delMsg = () => {
ProgressAction.postDeleteMsg(this.state.siteUrl, this.state.currentcontext, this.state.deleteIndex, this.state.user);
}

/** Function to re-render the grid on successful delete*/
public deleteConfirm = () => {
this.setState({ deleteOpen: false, deleteIndex: '' });
ProgressAction.getProgressMsgDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.user, this.state.filterQuery, this.state.top);
}

/**Callback Function to go to the first level of the grid*/
public callback = () => {
this.props.callback(this.state.tab);
}

/** Function to set answer give in the response of the grid*/
public pollAns = (event, value) => {
let res = value.Response;
let ans = res.split(":");
return ans[1];
}

/** Function to set sort column name and type to state*/
public setSort = (sortColumn, sortOrder, event) => {
this.setState({ sortingColumn: sortColumn, sortingOrder: sortOrder }, () => {
this.formQuery();
});
}

/** Function to get poll details*/
public getPollDetails = (tempId, msgId, event) => {
this.setState({ pollOpen: !this.state.pollOpen, pollIndex: msgId });
ProgressAction.getPollDetails(this.state.siteUrl, this.state.currentcontext, tempId);
}

/** Function to clear all the values in the filter*/
public clearFilter = () => {
this.setState({ selectedResponse: [], selectedMsgType: [], selectedFromDate: "", selectedToDate: "", convertedToDate: "", convertedFromDate: "", filterOpen: false, errorFilter: '', errorFromDate: '', errorToDate: '',statusType:"" }, () => {
this.formQuery();
});
}

/**Function to form the grid in the page*/
public contentGrids = () => {
if (this.state.currentPosts.length != 0) {
return this.state.currentPosts.map((value, index) => {
return (
<tr className="table-content">
<td>{value.TemplateName.TemplateName}</td>
<td>{value.TemplateName.MessageType}</td>
<td><Moment format="LL">{value.ScheduledDateAndTime}</Moment></td>
<td>
<span className={value.Status == "On Track" ? "status-icon on-track ml-3" : value.Status == "Completed" ? "status-icon scheduled ml-3" : "status-icon needs-attention ml-3"} /></td>
{value.TemplateName.MessageType == "Poll" && value.Response != "No Response" ?
<td>
<div className="dropdown ">
<a href="#" className="dropdown user-drilldown" onClick={this.getPollDetails.bind(this, value.TemplateName.ID, value.Id)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
Response Received
{this.state.pollOpen == true && this.state.pollIndex == value.Id && this.state.pollDetail.length != 0 ?
<div className="dropdown-menu mr-2 show"> <span className="w-100 float-left m-2 font-medium">{this.state.pollDetail[0].PollValue}</span> <span className="w-100 float-left pl-2 pr-2 mb-2 text-center">{this.pollAns(this, value)}</span> </div>:null}
</a></div><a href="#" className="dropdown user-drilldown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a></td>:
<td>{value.Response == "No Response" ? "No Response" : "Response Received"}</td>}
<td className="text-center">
<a href="#" data-toggle="modal" data-target="#deleteModalCenterReports" onClick={() => this.setState({ deleteOpen: true, deleteIndex: value.ID })} className="delete-action-icon" /></td>
</tr>
);})
}
else if (this.state.currentPosts.length == 0 && this.state.filterQuery != "" && this.state.searchText != "") {
return (
<tr>
<td colSpan={6}>
<div className="center col-md-6 mt-5">
<img className=" my-5 center" src={search} alt="background" />
<h4 className="display-message">Sorry we couln't find any search results</h4>
<h4 className="display-message">matching <span className="person_info">'{this.state.searchText}'</span></h4>
</div></td></tr>
);
}
else if (this.state.currentPosts.length == 0 && this.state.filterQuery != "" && this.state.searchText == "") {
return (
<tr>
<td colSpan={6}>
<div className="center col-md-6 mt-5">
<img className=" my-5 center" src={search} alt="background" />
<h4 className="display-message">Sorry we couln't find any search results</h4>
<button type="button" className="user-config-create-button mt-4 center results-screen-back" onClick={this.clearFilter.bind(this)}>
Back to Progress Tracker</button>
</div></td></tr>
);
}
else if (this.state.currentPosts.length == 0 && this.state.filterQuery == "") {
return (
<tr>
<td colSpan={6}>
<div className="center col-md-6 mt-5">
<h4 className="display-message">Sorry! you don't have any task assigned to the user</h4>
<img className=" my-5 center" src={pinbgimg} alt="background" />
<h4 className="display-message  ml-5">Click on the '+' icon to create new task</h4>
</div></td></tr>
);}
}

public empty = () => {
let array = [];
for (var i = 0; i < this.state.emptyRecordsCount; i++) {
array.push([""]);
}
return array.map((value, index) => {
return (
<tr className="table-content">
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td></tr>
);});
}

public scheduleform = () => {
this.props.callback1("form", "", '');
}

public render(): React.ReactElement<ProgressSecondLevelProps> {
if(ProgressStore.tabUserDetail.length != 0){
if(this.state.tabUserDetail[0] != undefined){
if(this.state.tabUserDetail[0].Manager.FirstName !=null && this.state.tabUserDetail[0].Manager.FirstName != ""){
ManagerName = this.state.tabUserDetail[0].Manager.FirstName + " " + this.state.tabUserDetail[0].Manager.LastName;
}
else if(this.state.tabUserDetail[0].Manager.Title != null && this.state.tabUserDetail[0].Manager.Title != ""){
ManagerName = this.state.tabUserDetail[0].Manager.Title;
}
else{
ManagerName = "";
}}
}
return (
<div className="col-md-12   mt-4 mb-2 float-left">
{((this.state.tab == "New Hire") && (this.state.tabUserDetail.length != 0)) ?
<div className="float-left mar-bottom col-md-12 pad-0 p-0 mcol-sm-12 headerspacing">
<a href="#" className="actions-cursor" onClick={this.callback}><img className="back-arrow-resp pad-0 mt-3 float-left" src={back} /></a>
<img className="user-drill float-left drilldown-resp-mar-left  ml-3" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + this.state.tabUserDetail[0].Email} />
<ul className="float-left p-0 drilldown-resp-mar-left ml-3">
<li className="todo-person-info resp-font">{this.state.tabUserDetail[0].UserName}</li>
<li className="date_info resp-font">New Hire</li></ul>
<ul className="float-left p-0 mar-0 drilldown-resp-mar-left ml-5">
<li className="todo-person-info resp-font">Start Date</li>
<li className="date_info resp-font"><Moment format="LL">{this.state.tabUserDetail[0].StartDate}</Moment></li></ul>
{this.state.tabUserDetail[0].Manager != null ?
this.state.tabUserDetail[0].Manager.Title != null ?
<img className="user-drill float-left drilldown-resp-mar-left  ml-5" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + this.state.tabUserDetail[0].Manager.EMail} />: null :null}
{this.state.tabUserDetail[0].Manager != null ? ManagerName != ""?
<ul className="float-left p-0 drilldown-resp-mar-left ml-3">
<li className="todo-person-info resp-font">{ManagerName}</li>
<li className="date_info resp-font">Manager</li></ul>: null:null}
</div>: (this.state.tab == "Manager" && this.state.tabUserDetail.length != 0) ?
<div className="float-left mar-bottom col-md-12 pad-0 p-0 mcol-sm-12 headerspacing">
<a href="#" className="actions-cursor" onClick={this.callback}><img className="back-arrow-resp pad-0 mt-3 float-left" src={back} /></a>
<img className="user-drill float-left drilldown-resp-mar-left  ml-3" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + this.state.tabUserDetail[0].Email} />
<ul className="float-left p-0 drilldown-resp-mar-left ml-3">
<li className="todo-person-info resp-font">{this.state.tabUserDetail[0].UserName}</li>
<li className="date_info resp-font">Manager</li></ul>
<ul className="float-left p-0 mar-0 drilldown-resp-mar-left ml-5">
<li className="todo-person-info resp-font">#New Hires</li>
<li className="date_info resp-font">{this.state.tabUserDetail[0].NoOfHires}</li></ul>
</div>: null}
<div className="float-right mar-bottom ">
<form className="form-inline float-left">
<Search searchFunc={this.callbackSearch}></Search>
<div className="dropdown pos-inherit">
<button type="button" onClick={() => this.setState({ filterOpen: !this.state.filterOpen })} className="btn btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false">
<img src={filter} /></button>
<div className={this.state.filterOpen == true ? "dropdown-menu m-0 pb-4 advanced-filter show" : "dropdown-menu m-0 pb-4 advanced-filter"}>
<div className="container-fluid">
<div className="row">
<div className="col-md-12 pb-2 border-bottom mt-2  mb-3">
<span className="filter-title">Advanced Filter</span>
<button type="button" className="close" onClick={() => this.setState({ filterOpen: false })} data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">×</span></button>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-temp-type-lp">Message Type</label>
<Typeahead
onChange={(value) => this.setState({ selectedMsgType: value })}
selected={this.state.selectedMsgType}
options={["Message", "Poll", "Document"]}
placeholder="Select Message Type"
className="form-placeholder-font-size w-100 mt-2" />
</div>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-temp-type-lp">Response</label>
<Typeahead
onChange={(value) => this.setState({ selectedResponse: value })}
selected={this.state.selectedResponse}
options={["No Response", "Response Received"]}
placeholder="Select Response"
className="form-placeholder-font-size w-100 mt-2" />
</div>
</div>
<label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Date Range</label>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
value={this.state.selectedFromDate}
onSelectDate={(value) => this.handleDateChange(value, "selectedFromDate")}
className="form-placeholder-font-size w-100 mt-2"
placeholder="From Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFromDate}</span>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
value={this.state.selectedToDate}
onSelectDate={(value) => this.handleDateChange(value, "selectedToDate")}
className="form-placeholder-font-size w-100 mt-2"
placeholder="To Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorToDate}</span>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFilter}</span>
<div className="col-md-12 mb-4">
<div className="float-right">
<a href="#" className="filter-close form-label col-gray px-4" onClick={this.clearFilter}>Clear</a>
<a href="#" className="btn btn-primary filter-close ml-2 px-4" onClick={this.applyFilter}>Apply Filter</a></div>
</div>
</div>
</div>
</div>
</div>
<SaveToReport siteUrl={this.state.siteUrl} context={this.state.currentcontext} listname={this.state.listName} selectfields={this.state.selectfields} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterQuery}></SaveToReport>
<button type="button" className="btn btn-info ml-3" onClick={this.scheduleform.bind(this)}><img src={add} /></button>
</form>
</div>
<ProgressCard context={this.state.currentcontext} user={this.state.user} callbackType={this.callbackType} tab={"New Hire"}></ProgressCard>
<div className="col-md-12 col- overlay-resp float-left p-0 mt-4">
<table className="table table-border table-border">
<thead className="table-content-header">
<tr>
<th >TEMPLATE
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "TemplateName/TemplateName", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "TemplateName/TemplateName", "desc")}><img src={down} /></a></span></th>
<th >TEMPLATE TYPE
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "TemplateName/MessageType", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "TemplateName/MessageType", "desc")}><img src={down} /></a></span></th>
<th >DATE SCHEDULED
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "ScheduledDateAndTime", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "ScheduledDateAndTime", "desc")}><img src={down} /></a></span></th>
<th >STATUS</th>
<th >RESPONSE
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "Response", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "Response", "desc")}><img src={down} /></a></span></th>
<th className="text-center">ACTION</th></tr>
</thead>
<tbody>
{this.contentGrids()}
{this.state.currentPosts.length > 0 && this.empty()}
</tbody>
</table>
<div className="col-md-12 pad-0 col- float-left mt-2">
<div className="float-left  col-gray"># Records : <span>{this.state.currentPosts.length} </span> out of <span> {this.state.tabMsgCount}</span>
</div>
<div className="float-right ">
<Pagination count={this.state.pageCount} shape="rounded" page={this.state.currentPage} onChange={this.pageChange} />
</div>
</div>
{/* Delete Modal Popup Box */}
{this.state.deleteOpen == true ?
<div className="modal fade show" id="deleteModalCenter" tabIndex={-1} role="dialog" style={{ display: "block", paddingRight: 17 }} aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title" id="exampleModalLongTitle">Delete Record</h5>
<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({ deleteOpen: false })}>
<span aria-hidden="true" >×</span></button>
</div>
<div className="modal-body">
<span className="delete-modal-box">Are you sure you want to delete this record?</span>
</div>
<div className="modal-footer footer-border-none">
<button type="button" className="btn btn-secondary cancel-button-del-modal" data-dismiss="modal" onClick={() => this.setState({ deleteOpen: false })} >Cancel</button>
<button type="button" className="btn btn-primary del-button" data-dismiss="modal" onClick={this.delMsg.bind(this)} >Delete</button>
</div>
</div>
</div>
</div> : null}
</div>
</div>
);}
}
