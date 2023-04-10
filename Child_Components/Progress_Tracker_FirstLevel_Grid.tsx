/** [Ref] - Denotes Pseudo Code Reference
* This Component is First Level of Progress Tracker
* App Name: Rocket
* Author: Giftson
* Created Date: 06/02/2020 */
import * as React from 'react';
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import Moment from 'react-moment';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Pagination } from '@material-ui/lab';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import ProgressCard from "./Progress_Cards_Component";
import Search from "./Search_Component";
import SaveToReport from './Save_To_Report';
import MultipleTemplateAssign from './Multiple_User_Template_Assign';

const up: string = require('../images/up.svg');
const down: string = require('../images/down.svg');
const add: string = require('../images/add-icon.svg');
const filter: string = require('../images/filter.svg');
const pen: string = require('../images/pen.svg');
const action: string = require('../images/table-actions.svg');
const trash: string = require('../images/empty-trash.svg');
const search: string = require('../images/search-results.svg')
const pinbgimg: string = require('../images/pinbgimg.png');

import '../css/commontheme.css';
import '../css/style.css';
import * as ProgressAction from '../webports/rocketWebport/Action/Progress_Action';
import ProgressStore from '../Store/Progress_Store';

export interface ProgressCardState {
siteUrl: string;
currentcontext: any;
listName: string;
selectfields1: any;
gridfields1: any;
displayfields1: any;
selectfields2: any;
gridfields2: any;
displayfields2: any;
tab: any;
contentArray: any;
actionIndex: any;
actionOpen: Boolean;
deleteOpen: Boolean;
actionEmail: any;
filterOpen: any;
searchText: any;
filterManager: any;
filterTeam: any;
selectedManager: any;
selectedTeam: any;
selectedToDate: any;
selectedFromDate: any;
convertedToDate: any;
convertedFromDate: any;
errorToDate: any;
errorFromDate: any;
sortingColumn: any;
sortingOrder: any;
filterQuery: any;
errorFilter: any;
tabDetailsCount: any;
currentPage: any;
postperPage: any;
indexofFirstPage: any;
indexofLastPage: any;
currentPosts: any;
top: any;
pageCount: any;
editId: any;
emptyRecordsCount: any;
}

export interface ProgressCardProps {
context: IWebPartContext;
callbackUser: any;
callback1: any;
tab: any;
}

export default class ProgressTrackerFirstLevel extends React.Component<ProgressCardProps, ProgressCardState> {
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentcontext: this.props.context,
listName: "UserDetails",
selectfields1: `UserName,Email,ID,User/EMail,Manager/FirstName,Manager/LastName,Manager/EMail,Team/Team,StartDate,NeedsAttention,OnTrack,Completed&$expand=User/Id,Manager/Id,Team/Id&$filter=(UserType eq 'New Hire') and (Scheduled eq 1) and (IsActive eq 1)`,
gridfields1: ['UserName', '/Manager/FirstName/', '/Manager/LastName/', '/Team/Team/', 'StartDate'],
displayfields1: ['UserName', 'ManagerName', 'Team', 'StartDate'],
selectfields2: `UserName,Email,ID,User/EMail,Team/Team,NeedsAttention,OnTrack,Completed,NoOfHires,NoOfTemplates&$expand=User/Id,Team/Id&$filter=(UserType eq 'Manager') and (Scheduled eq 1) and (IsActive eq 1)`,
gridfields2: ['UserName', '/Team/Team/', 'NoOfHires', 'NoOfTemplates'],
displayfields2: ['UserName', 'Team', 'NoOfHires', 'NoOfTemplates'],
tab: this.props.tab,
contentArray: [],
actionIndex: '',
actionOpen: false,
deleteOpen: false,
actionEmail: "",
filterOpen: false,
searchText: "",
filterManager: [],
filterTeam: [],
selectedManager: [],
selectedTeam: [],
selectedFromDate: "",
selectedToDate: "",
convertedFromDate: "",
convertedToDate: "",
errorToDate: '',
errorFromDate: '',
sortingColumn: '',
sortingOrder: '',
filterQuery: '',
errorFilter: '',
tabDetailsCount: '',
currentPage: 1,
postperPage: 10,
indexofFirstPage: 0,
indexofLastPage: 10,
currentPosts: [],
top: 10,
pageCount: '',
editId: '',
emptyRecordsCount: ''
}
}

componentWillMount() {
ProgressStore.on("tabDetails", this.getDetails.bind(this));
ProgressStore.on("successDelete", this.deleteConfirm.bind(this));
ProgressStore.on("FilterManager", this.getFilterManager.bind(this));
ProgressStore.on("FilterTeam", this.getFilterTeam.bind(this));
ProgressStore.on("tabDetailsCount", this.getTabCount.bind(this));
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.tab, this.state.filterQuery, this.state.top);
}

public getDetails = () => {
const contentDetails1 = ProgressStore.tabDetails;
let currentPosts = contentDetails1.slice(this.state.indexofFirstPage, this.state.indexofLastPage);
this.setState({ contentArray: ProgressStore.tabDetails, emptyRecordsCount: 10 - currentPosts.length, currentPosts: currentPosts });
}

public getTabCount = () => {
let pageCount = Math.ceil(ProgressStore.tabCount / this.state.postperPage);
this.setState({ tabDetailsCount: ProgressStore.tabCount, pageCount });
}

public getFilterManager = () => {
this.setState({ filterManager: ProgressStore.filterManager });
}

public deleteConfirm = () => {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.tab, this.state.filterQuery, this.state.top);
}

public getFilterTeam = () => {
this.setState({ filterTeam: ProgressStore.filterTeam });
}

public setSort = (sortColumn, sortOrder, event) => {
this.setState({ sortingColumn: sortColumn, sortingOrder: sortOrder }, () => {
this.formQuery();
});
}

public handleDateChange = (dateSelected, dateType) => {
let state = this.state;
state[dateType] = dateSelected;
this.setState(state);
this.setState({ errorFilter: "" });
this.convertDate(dateSelected, dateType);
this.validateDate(dateSelected, dateType);
}

public clearFilter = () => {
this.setState({ selectedManager: [], selectedTeam: [], selectedFromDate: "", selectedToDate: "", convertedToDate: "", convertedFromDate: "", filterOpen: false, errorFilter: '', errorFromDate: '', errorToDate: '' }, () => {
this.formQuery();
});
}

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

public applyFilter = () => {
let error = '';
if (this.state.tab == "New Hire") {
if (this.state.selectedFromDate == "" && this.state.selectedToDate == "" && this.state.selectedManager.length == 0 && this.state.selectedTeam.length == 0) {
error = "Please select atleast one field"
this.setState({ errorFilter: error });
}
else if (this.state.errorFromDate == "" && this.state.errorToDate == "") {
this.setState({ errorFilter: '', filterOpen: false });
this.formQuery();
}
}
else if (this.state.tab == "Manager") {
if (this.state.selectedFromDate == "" && this.state.selectedToDate == "" && this.state.selectedTeam.length == 0) {
error = "Please select atleast one field"
this.setState({ errorFilter: error });
}
else if (this.state.errorFromDate == "" && this.state.errorToDate == "") {
this.setState({ errorFilter: '', filterOpen: false });
this.formQuery();
}
}
}

public formQuery = () => {
let filterQuery = "";
if (this.state.searchText != '') {
filterQuery = filterQuery + `and(substringof('${this.state.searchText}',UserName))`;
}
if (this.state.selectedManager.length != 0) {
filterQuery = filterQuery + `and(User/EMail eq '${this.state.selectedManager[0].User.EMail}')`;
}
if (this.state.selectedTeam.length != 0) {
filterQuery = filterQuery + `and(Team/Team eq '${this.state.selectedTeam[0].Team}')`;
}
if (this.state.convertedFromDate != '') {
filterQuery = filterQuery + `and(StartDate ge '${this.state.convertedFromDate}')`;
}
if (this.state.convertedToDate != '') {
filterQuery = filterQuery + `and(StartDate le '${this.state.convertedToDate}')`;
}
if (this.state.sortingColumn != '' && this.state.sortingOrder != '') {
filterQuery = filterQuery + `&$orderby=${this.state.sortingColumn} ${this.state.sortingOrder}`;
}
this.setState({ filterQuery, currentPage: 1, indexofFirstPage: 0, indexofLastPage: 10, top: 15 }, () => {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.tab, filterQuery, this.state.top);
});
}

public getFilterData = () => {
this.setState({ filterOpen: !this.state.filterOpen });
if (!this.state.filterOpen == true) {
this.setState({ filterManager: [], filterTeam: [] });
ProgressAction.getFilterDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.tab);
}
}

public callbackSearch = (searchTxt) => {
this.setState({ searchText: searchTxt }, () => {
this.formQuery();
});
}

public callback = () => {
if (this.state.tab == "New Hire") {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, "New Hire", this.state.filterQuery, this.state.top);
}
else if (this.state.tab == "Manager") {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, "Manager", this.state.filterQuery, this.state.top);
}
}

public tabChange = (tabClicked, event) => {
this.clearFilter();
this.setState({ tab: tabClicked, contentArray: [], filterOpen: false, actionOpen: false, currentPage: 1, top: 10 }, () => {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, tabClicked, this.state.filterQuery, this.state.top);
});

}

/* Callback Function to get the user to the second level of the progress tracker */
public callbackUser = (user, tab, event) => {
this.props.callbackUser(user, tab, "grid", this.state.editId);
}

public deleteRecord = () => {
ProgressAction.postDelete(this.state.siteUrl, this.state.currentcontext, this.state.actionIndex, this.state.actionEmail);
this.setState({ deleteOpen: false, actionIndex: "", actionEmail: "" });
}

public pageChange = (event, page) => {
let postperPage = this.state.postperPage;
let indexofLastPage = page * postperPage;
let indexofFirstPage = indexofLastPage - postperPage;
let top = page * postperPage;
this.setState({ indexofLastPage, indexofFirstPage, top, currentPage: page, filterOpen: false, actionOpen: false }, () => {
ProgressAction.getProgressTabDetails(this.state.siteUrl, this.state.currentcontext, this.state.listName, this.state.tab, this.state.filterQuery, this.state.top);
})
}

public edit = (editindex) => {
this.setState({ editId: editindex }, () => { this.props.callback1("form", editindex, "edit"); });
}

public scheduleform = () => {
this.props.callback1("form", this.state.editId, '');
}

public contentGrid = (event, tab) => {
if (this.state.currentPosts.length != 0) {
return this.state.currentPosts.map((value, index) => {
console.log("currentPosts:",this.state.currentPosts);
var max = value.Completed + value.OnTrack + value.NeedsAttention;
var danger = ((value.NeedsAttention / max) * 100) + "%";
var success = ((value.Completed / max) * 100) + "%";
var inprogress = ((value.OnTrack / max) * 100) + "%";
var Manager = value.Manager;
var ManagerName = null, ManagerEmail = null, Team = null;
if (Manager != null) {
ManagerEmail = Manager.EMail;
if (Manager.FirstName != null && Manager.FirstName != '') {
ManagerName = Manager.FirstName;
ManagerName += ' ' + Manager.LastName;
}
else if(Manager.Title != null){
ManagerName = Manager.Title;
}
else{
ManagerName="";
}
}
if (value.Team != null){
if (value.Team.Team != null&&value.Team.Team!="") {
Team = value.Team.Team;
}
}
if (tab == "New Hire") {
return (
<tr className={index % 2 == 0 ? "table-content" : "table-content table-row-gray"}>
<td><a href="#" className="user-drilldown" onClick={this.callbackUser.bind(this, value.Email, this.state.tab)}><img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Email} />{value.UserName}</a></td>
{(ManagerName != null && ManagerName != "" )?
<td>
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + ManagerEmail} />
{ManagerName}
</td>:
<td>No Manager Assigned</td>}
{Team != null ?
<td>{value.Team.Team}</td> :
<td>No Team Assigned</td>}
<td> <Moment format="LL">
{value.StartDate}
</Moment></td>
<td className="progress-bar-width"><div className="progress progress-bar-height">
<div className="progress-bar col-red" role="progressbar" style={{ width: danger }} data-placement="bottom" title="Needs Attention" />
<div className="progress-bar col-yellow" role="progressbar" style={{ width: inprogress }} data-placement="bottom" title="On Track" />
<div className="progress-bar col-green" role="progressbar" style={{ width: success }} data-placement="bottom" title="Completed" />
</div></td>
<td className="text-center"><div className="dropdown"> <img className="table-actions dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" src={action} onClick={() => this.setState({ actionIndex: value.ID, actionOpen: !this.state.actionOpen, actionEmail: value.User.EMail })} />
<div className={(value.ID == this.state.actionIndex && this.state.actionOpen == true) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton">
<a className="dropdown-item" href="#" onClick={this.edit.bind(this, value.ID)}><img className="dropdown-icon" src={pen} />Edit</a>
<a className="dropdown-item" href="#" data-toggle="modal" data-target="#deleteModalCenter" onClick={() => this.setState({ deleteOpen: true, actionOpen: false })}><img className="dropdown-icon" src={trash} />Delete</a> </div>
</div></td></tr>
)
}
else if (tab == "Manager") {
return (
<tr className={index % 2 == 0 ? "table-content" : "table-content table-row-gray"}>
<td><a href="#" className="user-drilldown" onClick={this.callbackUser.bind(this, value.Email, this.state.tab)}><img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.User.EMail} />{value.UserName}</a></td>
{Team != null ?
<td>{Team}</td> :
<td>No Team Assigned</td>}
<td className="text-center align-issue">{value.NoOfHires}</td>
<td className="text-center ">{value.NoOfTemplates}</td>
<td className="progress-bar-width"><div className="progress progress-bar-height">
<div className="progress-bar col-red" role="progressbar" style={{ width: danger }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} data-placement="bottom" title="Needs Attention" />
<div className="progress-bar col-yellow" role="progressbar" style={{ width: inprogress }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} data-placement="bottom" title="On Track" />
<div className="progress-bar col-green" role="progressbar" style={{ width: success }} aria-valuenow={20} aria-valuemin={0} aria-valuemax={100} data-placement="bottom" title="Completed" />
</div></td>
<td className="text-center"><div className="dropdown"> <img className="table-actions  dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" src={action} onClick={() => this.setState({ actionIndex: value.ID, actionOpen: !this.state.actionOpen, actionEmail: value.User.EMail })} />
<div className={(value.ID == this.state.actionIndex && this.state.actionOpen == true) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton">
<a className="dropdown-item" href="#" onClick={this.edit.bind(this, value.ID)}><img className="dropdown-icon" src={pen} />Edit</a>
<a className="dropdown-item" href="#" data-toggle="modal" data-target="#deleteModalCenter" onClick={() => this.setState({ deleteOpen: true, actionOpen: false })}><img className="dropdown-icon" src={trash} />Delete</a> </div>
</div></td></tr>
);}})
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
<h4 className="display-message ml-5">Click on the '...' icon to import multiple task</h4>
</div></td></tr>
);}
}

public empty = () => {
let array = [];
for (var i = 0; i < this.state.emptyRecordsCount; i++) {
array.push([""]);
}
return array.map((value, index) => {
let gridrowcolor;
if (this.state.emptyRecordsCount % 2 == 0) {
gridrowcolor = index % 2 == 0 ? "table-content" : "table-content table-row-gray";
}
else {
gridrowcolor = index % 2 == 0 ? "table-content table-row-gray" : "table-content";
}
return (
<tr className={gridrowcolor}>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td></tr>
);});
}

public render(): React.ReactElement<ProgressCardProps> {
return (
<div className="tab-pane fade show active" id="pills-onboarding" role="tabpanel" aria-labelledby="pills-onboarding-tab">

<ul className="nav tivasta-form-tab tivasta-onboarding mt-4 pl-3 headerspacing" role="tablist">
<li data-tab="tab-1" className={this.state.tab == "New Hire" ? "tivasta-current" : ""}><span className="nav-link p-0 resp-font tivasta-nav-item " onClick={this.tabChange.bind(this, "New Hire")}>Progress Tracker - New Hire</span></li>
<li data-tab="tab-2" className={this.state.tab == "Manager" ? "tivasta-current" : ""}><span className="nav-link p-0 ml-4 resp-font tivasta-nav-item " onClick={this.tabChange.bind(this, "Manager")}>Progress Tracker - Manager</span></li></ul>
{this.state.tab == "New Hire" ?
<div id="tab-1" className={this.state.tab == "New Hire" ? "tivasta-form-tab-content tivasta-onboarding-content tivasta-current mt-4" : "tivasta-form-tab-content tivasta-onboarding-content mt-4"}>
{/*Progress Tracker-New Hire Content*/}
<div className="container-fluid float-left">
<ProgressCard context={this.state.currentcontext} user={null} callbackType={null} tab={"New Hire"}></ProgressCard>
<div className="row">
<div className="col-md-12 mt-4 mb-2">
<div className="float-left mt-2">
<h6 className="float-left table-header">New Hires</h6>
</div>
<div className="float-right">
<form className="form-inline float-left">
{(this.state.currentPosts.length == 0 && this.state.filterQuery == "") ? null :
<Search searchFunc={this.callbackSearch}></Search>}
{(this.state.currentPosts.length == 0 && this.state.filterQuery == "") ? null :
<div className="dropdown pos-inherit">
<button type="button" className="btn btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false" onClick={this.getFilterData.bind(this)}> <img src={filter} /></button>
<div className={((this.state.filterOpen == true) && (this.state.tab == "New Hire")) ? "dropdown-menu m-0 pb-4 advanced-filter show" : "dropdown-menu m-0 pb-4 advanced-filter"}>
<div className="container-fluid">
<div className="row">
<div className="col-md-12 pb-2 border-bottom mt-2  mb-3"> <span className=" ">Advanced Filter</span>
<button type="button" onClick={() => this.setState({ filterOpen: false })} className="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-manager-pt">Manager Name</label>
<Typeahead
onChange={(value) => this.setState({ selectedManager: value })}
options={this.state.filterManager}
labelKey="UserName"
selected={this.state.selectedManager}
minLength="1"
placeholder="Select Manager"
className="form-placeholder-font-size w-100 mt-2" />
</div>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-team-pt">Team</label>
<Typeahead
onChange={(value) => this.setState({ selectedTeam: value })}
options={this.state.filterTeam}
selected={this.state.selectedTeam}
labelKey="Team"
minLength="1"
placeholder="Select Team"
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
placeholder="From Start Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFromDate}</span>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
value={this.state.selectedToDate}
onSelectDate={(value) => this.handleDateChange(value, "selectedToDate")}
className="form-placeholder-font-size w-100 mt-2"
placeholder="To Start Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorToDate}</span>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFilter}</span>
<div className="col-md-12 mar-0 col-sm-12 mt-2 mar-0 mb-2">
<div className="float-right"> <a href="#" onClick={this.clearFilter} className="filter-close form-label col-gray   px-4">Clear</a> <a href="#" className="btn btn-primary filter-close  ml-2  px-4" onClick={this.applyFilter}>Apply Filter</a></div>
</div>
</div>
</div>
</div>
</div>}
{(this.state.currentPosts.length == 0) ? null :
<SaveToReport siteUrl={this.state.siteUrl} context={this.state.currentcontext} listname={this.state.listName} selectfields={this.state.selectfields1} gridfields={this.state.gridfields1} displayfields={this.state.displayfields1} filterquery={this.state.filterQuery}>
</SaveToReport>}
<button type="button" className="btn btn-info ml-3" onClick={this.scheduleform.bind(this)}><img src={add} data-placement="bottom"/></button>
<MultipleTemplateAssign callback={this.callback} callfrom={"ProgressTracker"} context={this.state.currentcontext}></MultipleTemplateAssign>
</form>
</div>
</div>
{/*New Hire Tab-Table*/}
<div className="col-md-12 overlay-resp col-sm-12 mt-4">
<table className="table table-border table-border ">
<thead className="table-content-header "><tr>
<th >NEW HIRE
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "UserName", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "UserName", "desc")}><img src={down} /></a></span></th>
<th >MANAGER
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "Manager", "asc")}><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "Manager", "desc")}><img src={down} /></a></span></th>
<th >TEAM
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "Team", "asc")}><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "Team", "desc")}><img src={down} /></a></span></th>
<th >START DATE
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "StartDate", "asc")}><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "StartDate", "desc")}><img src={down} /></a></span></th>
<th >PROGRESS</th>
<th className="text-center">ACTION</th></tr></thead>
<tbody>
{this.contentGrid(this, "New Hire")}
{this.state.currentPosts.length > 0 && this.empty()}</tbody></table>
{this.state.currentPosts.length != 0 ?
<div className="col-md-12 pad-0 col- float-left mt-2">
<div className="float-left  col-gray"># Records :<span>{this.state.currentPosts.length} </span> out of <span> {this.state.tabDetailsCount}</span>
</div>
<div className="float-right ">
<Pagination count={this.state.pageCount} shape="rounded" page={this.state.currentPage} onChange={this.pageChange} />
</div>
</div>: null}
</div>
</div>
</div>
</div>: null}
{this.state.tab == "Manager" ?
<div id="tab-2" className={this.state.tab == "Manager" ? "tivasta-form-tab-content tivasta-onboarding-content tivasta-current mt-4" : "tivasta-form-tab-content tivasta-onboarding-content mt-4"}>
{/*Progress Tracker- Manager Content*/}
<div className="container-fluid float-left">
<ProgressCard context={this.state.currentcontext} user={null} callbackType={null} tab={"Manager"}></ProgressCard>
<div className="row">
<div className="col-md-12 mt-4 mb-2">
<div className="float-left mt-2">
<h6 className="float-left table-header">Managers</h6>
</div>
<div className="float-right">
<form className="form-inline float-left">
{(this.state.currentPosts.length == 0 && this.state.filterQuery == "") ? null :
<Search searchFunc={this.callbackSearch}></Search>}
{(this.state.currentPosts.length == 0 && this.state.filterQuery == "") ? null :
<div className="dropdown pos-inherit">
<button type="button" className="btn btn-info ml-3" title="Advanced Filter" data-toggle="dropdown" aria-expanded="false" onClick={this.getFilterData.bind(this)}> <img src={filter} /></button>
<div className={((this.state.filterOpen == true) && (this.state.tab == "Manager")) ? "dropdown-menu m-0 pb-4 advanced-filter show" : "dropdown-menu m-0 pb-4 advanced-filter"}>
<div className="container-fluid">
<div className="row">
<div className="col-md-12 pb-2 border-bottom mt-2  mb-3"> <span className="filter-title">Advanced Filter</span>
<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({ filterOpen: false })}> <span aria-hidden="true">×</span> </button>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-team-ptm">Team</label>
<Typeahead
onChange={(value) => this.setState({ selectedTeam: value })}
options={this.state.filterTeam}
selected={this.state.selectedTeam}
labelKey="Team"
minLength="1"
placeholder="Select Team"
className="form-placeholder-font-size w-100 mt-2" />                      </div>
</div>
<label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Date Range</label>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
value={this.state.selectedFromDate}
onSelectDate={(value) => this.handleDateChange(value, "selectedFromDate")}
className="form-placeholder-font-size w-100 mt-2"
placeholder="From Start Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFromDate}</span>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFilter}</span>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
value={this.state.selectedToDate}
onSelectDate={(value) => this.handleDateChange(value, "selectedToDate")}
className="form-placeholder-font-size w-100 mt-2"
placeholder="To Start Date"/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorToDate}</span>
</div>
<div className="col-md-12  mt-2 mb-2">
<div className="float-right"> <a href="#" className="filter-close form-label col-gray px-4" onClick={this.clearFilter.bind(this)}>Clear</a> <a href="#" className="btn btn-primary filter-close ml-2 px-4" onClick={this.applyFilter}>Apply Filter</a></div>
</div>
</div>
</div>
</div>
</div>}
{(this.state.currentPosts.length == 0) ? null :
<SaveToReport siteUrl={this.state.siteUrl} context={this.state.currentcontext} listname={this.state.listName} selectfields={this.state.selectfields2} gridfields={this.state.gridfields2} displayfields={this.state.displayfields2} filterquery={this.state.filterQuery}>
</SaveToReport>}
<button type="button" className="btn btn-info ml-3" data-placement="bottom" title="Add New Manager" onClick={this.scheduleform.bind(this)}><img src={add} /></button>
<MultipleTemplateAssign callback={this.callback} callfrom={"ProgressTracker"} context={this.state.currentcontext}></MultipleTemplateAssign>
</form>
</div>
</div>
<div className="col-md-12 mt-4">
<table className="table table-border overlay-resp table-border">
<thead className="table-content-header">
<tr>
<th >MANAGER
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "UserName", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "UserName", "desc")} ><img src={down} /></a></span></th>
<th >TEAM
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "Team", "asc")} ><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "Team", "desc")} ><img src={down} /></a></span> </th>
<th ># HIRES ASSIGNED
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "NoOfHires", "asc")}><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "NoOfHires", "desc")} ><img src={down} /></a></span> </th>
<th ># TEMPLATES
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.setSort.bind(this, "NoOfTemplates", "asc")}><img src={up} /></a></span>
<span className="sorting"><a className={this.state.currentPosts.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.setSort.bind(this, "NoOfTemplates", "desc")} ><img src={down} /></a></span> </th>
<th >PROGRESS </th>
<th className="text-center">ACTIONS</th></tr></thead>
<tbody>
{this.contentGrid(this, "Manager")}
{this.state.currentPosts.length > 0 && this.empty()}</tbody></table>
{this.state.currentPosts.length != 0 ?
<div className="col-md-12 pad-0 col- float-left mt-2">
<div className="float-left  col-gray"># Records :<span>{this.state.currentPosts.length} </span> out of <span> {this.state.tabDetailsCount}</span>
</div>
<div className="float-right ">
<Pagination count={this.state.pageCount} shape="rounded" page={this.state.currentPage} onChange={this.pageChange} />
</div>
</div>: null}
</div>
</div>
</div>
</div>: null}
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
<span className="delete-modal-box">Are you sure you want to delete this record ?</span>
</div>
<div className="modal-footer footer-border-none">
<button type="button" className="btn btn-secondary cancel-button-del-modal" data-dismiss="modal" onClick={() => this.setState({ deleteOpen: false })}>Cancel</button>
<button type="button" className="btn btn-primary del-button" data-dismiss="modal" onClick={this.deleteRecord.bind(this)}>Delete</button>
</div>
</div>
</div>
</div> : null}
</div>
);}
}
