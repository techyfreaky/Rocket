/**[Ref] - Denotes Pseudo Code Reference
* This component is the userconfig grid component. The component displays the data in the Grid format.
* App Name: Rocket
* Author: Praveen Kumar
* Created Date: 05/28/2020 */
import * as React from 'react';
import { IRocketAppProps } from '../../../components/IRocketAppProps';
import { escape, assign } from '@microsoft/sp-lodash-subset';
import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import Moment from 'react-moment';
import Pagination from '@material-ui/lab/Pagination';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import SearchComponent from './Search_Component';
import SaveToReport from './Save_To_Report';
import MultipleUserCreation from './Multiple_User_Creation';
import '../css/commontheme.css';
import '../css/style.css';

const filter: string = require('../images/filter.svg');
const up: string = require('../images/up.svg');
const down: string = require('../images/down.svg');
const addIcon: string = require('../images/add-icon.svg');
const threedots: string = require('../images/threedots.svg');
const pen: string = require('../images/pen.svg');
const emptyTrash: string = require('../images/empty-trash.svg');
const tableActions: string = require('../images/table-actions.svg');
const backicon: string = require('../images/backicon.svg');
const downicon: string = require('../images/down-icon.svg');
const upload: string = require('../images/upload.svg');
const pinbgimg: string = require('../images/pinbgimg.png');
const searchResults: string = require('../images/search-results.svg');
const greentick: string = require('../images/greentick.svg');

import * as UserConfigAction from '../Action/UserConfig_Action';
import UserConfigStore from '../Store/UserConfig_Store';

export interface IUserConfigProps {
context: WebPartContext;
callback: any;
}

export interface IUserConfigStates {
siteUrl: string;
currentContext: WebPartContext;
listName: string;
selectfields: any;
gridfields: any;
displayfields: any;
UserConfigGrid: any[];
UserConfigGridCount: any;
Scheduled: any;
Todo: any;
manageremail: any;
UserNameList: any[];
UserType: string;
UserTypeSelected: any;
ManagerName: any;
ManagerDetails: string;
StartDateFrom: any;
CStartDateFrom: any;
StartDateTo: any;
CStartDateTo: any;
sortquery: any;
searchquery: any;
searchtext: any;
filterquery: any;
filterpopup: boolean;
actionpopup: boolean;
actionindex: any;
deletepopup: boolean;
deletetoast: boolean;
delindex: any;
delemail: any;
delUserType: any;
ErrorMsg: string;
DateRangeErrorMsg: string;
top: any;
currentPage: any;
postperPage: any;
indexofFirstPage: any;
indexofLastPage: any;
emptyPostsCount: any;
pageCount: any;
gridLength: any;
}

export default class UserConfigGrid extends React.Component<IUserConfigProps, IUserConfigStates>{
constructor(props) {
super(props);
/** Set the values of the state variables.*/
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
listName: "UserDetails",
selectfields: `Scheduled,Todo,UserName,User/EMail,Manager/FirstName,Manager/LastName,Manager/EMail,UserType,StartDate,ID,Email&$expand=User/UserId,Manager/ManagerId&$filter=(IsActive eq 1)`,
gridfields: ['UserName', '/Manager/FirstName/', '/Manager/LastName/', 'UserType', 'StartDate'],
displayfields: ['UserName', 'ManagerName', 'UserType', 'StartDate'],
UserConfigGrid: [],
UserConfigGridCount: '',
Scheduled: '',
Todo: '',
manageremail: '',
UserNameList: [],
UserType: "",
UserTypeSelected: [],
ManagerName: [],
ManagerDetails: "",
StartDateFrom: null,
CStartDateFrom: null,
StartDateTo: null,
CStartDateTo: null,
sortquery: "",
searchquery: "",
searchtext: "",
filterquery: "",
filterpopup: false,
actionpopup: false,
actionindex: null,
deletepopup: false,
deletetoast: false,
delindex: "",
delemail: "",
delUserType: "",
ErrorMsg: "",
DateRangeErrorMsg: "",
top: 10,
currentPage: 1,
postperPage: 10,
indexofFirstPage: 0,
indexofLastPage: 10,
emptyPostsCount: 0,
pageCount: '',
gridLength: ''
};
}

/**Ref: UC_PC_06 Load event of the grid component.*/
public componentWillMount() {
/** Invoke the grid action to get the userconfig grid Data.*/
UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top);
/** Invoke the action to get all the UserName from the UserDetails List.*/
UserConfigAction.getManagerName(this.state.siteUrl, this.state.currentContext);
/**Define the listener methods*/
UserConfigStore.on("userconfig", this.loadUserGridData.bind(this));
UserConfigStore.on("gridcount", this.loadUserGridCount.bind(this));
UserConfigStore.on("managername", this.loadManagerName.bind(this));
UserConfigStore.on("success", this.ondeleteload.bind(this));
UserConfigStore.on("successPostUserMultiple", this.onmultiplePost.bind(this));
}

public loadUserGridData = () => {
let currentPosts = UserConfigStore.UserGridData.slice(this.state.indexofFirstPage, this.state.indexofLastPage);
let gridLength = UserConfigStore.UserGridData.length;
this.setState({ UserConfigGrid: currentPosts, gridLength, emptyPostsCount: 10 - currentPosts.length }, () => { UserConfigAction.getUserGridCount(this.state.siteUrl, this.state.currentContext,this.state.filterquery) });
}

public loadUserGridCount = () => {
let pageCount = Math.ceil(UserConfigStore.UserGridCount.length / this.state.postperPage);
this.setState({ UserConfigGridCount: UserConfigStore.UserGridCount.length, pageCount });
}

public onmultiplePost=()=>{
UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext,"",10);
}

public loadManagerName = () => {
this.setState({ UserNameList: UserConfigStore.managernamelist })
}

public sort = (order, columnName) => {
let sort = "&$orderby=" + columnName + " " + order;
this.setState({ sortquery: sort }, () => { this.formquery(); });
}

public userconfigsearch = (searchtext) => {
let searchquery = "";
if (searchtext != "") {
searchquery = ` and (substringof('${searchtext}',UserName))`;
}
this.setState({ searchtext });
this.setState({ searchquery: searchquery }, () => { this.formquery(); });
}

renderTypeaheadItems = (options, props, index) => {
return (
<div>
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + options.User.EMail} ></img>
<span>{options.UserName}</span>
</div>
)
}

public setTypeahead = (mname) => {
this.setState({ ManagerName: mname });
if (mname.length > 0) {
this.setState({ ManagerDetails: mname[0].User.EMail });
}
}

public handleUserType = (usertype) => {
this.setState({ UserTypeSelected: usertype });
this.setState({ UserType: usertype[0] });
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
let fromval = this.state.StartDateFrom, toval = this.state.StartDateTo;
if (type == "from" && toval != null) {
if (value > toval) {
this.setState({ DateRangeErrorMsg: "From Date should be lesser than the to Date" });
}
else {
this.setState({ DateRangeErrorMsg: "" });
}
}
if (type == "to" && fromval != null) {
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

public filteropen = () => {
this.setState({ filterpopup: !this.state.filterpopup });
}

public filter = () => {
let errormsg = ""
if (this.state.filterquery == "" && this.state.UserType == "" && this.state.ManagerName.length == 0 && this.state.CStartDateFrom == null && this.state.CStartDateTo == null) {
this.setState({ ErrorMsg: "Please select atleast one filter" });
errormsg = "validation failed";
}
if (this.state.filterquery != "" && this.state.UserType == "" && this.state.ManagerName.length == 0 && this.state.CStartDateFrom == null && this.state.CStartDateTo == null) {
this.setState({ filterpopup: false });
UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, "", this.state.top);
}
if (errormsg == ""&&this.state.DateRangeErrorMsg=="") {
this.formquery();
this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "" });
}
}

public formquery = () => {
let filter = "";
if (this.state.UserType != "" && this.state.UserType != "Select") {
filter += ` and (UserType eq '${this.state.UserType}')`;
}
if (this.state.ManagerName.length != 0) {
filter += ` and (ManagerId/EMail eq '${this.state.ManagerDetails}')`;
}
if (this.state.CStartDateFrom != null) {
filter += ` and (StartDate ge '${this.state.CStartDateFrom}')`;
}
if (this.state.CStartDateTo != null) {
filter += ` and (StartDate le '${this.state.CStartDateTo}')`;
}
if (this.state.searchquery != "") {
filter += this.state.searchquery;
}
if (this.state.sortquery != "") {
filter += this.state.sortquery;
}
this.setState({ filterquery: filter, currentPage: 1, indexofFirstPage: 0, indexofLastPage: 10, top: 10 }, () => { UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, filter, this.state.top) });
}

public filterclose = () => {
this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", UserType: "", UserTypeSelected: [], ManagerName: [], ManagerDetails: "", StartDateFrom: null, CStartDateFrom: null, StartDateTo: null, CStartDateTo: null,top:10 }, () => { this.formquery(); });
}

public action = (index) => {
this.setState({ actionpopup: !this.state.actionpopup });
this.setState({ actionindex: index });
}

public deleteopen = (dindex, email, UserType, scheduled, todo, manageremail) => {
this.setState({ Scheduled: scheduled, Todo: todo });
this.setState({ delindex: dindex, delemail: email, delUserType: UserType, manageremail });
this.setState({ deletepopup: true });
this.setState({ actionpopup: false });
}

public deleterecord = () => {
UserConfigAction.postDeleteUser(this.state.siteUrl, this.state.currentContext, this.state);
this.setState({ deletetoast: true });
this.deleteclose();
}

public ondeleteload = () => {
if (UserConfigStore.delete == "204") {
UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top);
UserConfigAction.getUserGridCount(this.state.siteUrl, this.state.currentContext,this.state.filterquery);
}
}

public deleteclose = () => {
this.setState({ deletepopup: false });
setTimeout(function () { this.setState({ deletetoast: false }); }.bind(this), 2000);
}

public handlePage = (event, pageNumber) => {
let postperPage = this.state.postperPage;
let indexofLastPage = pageNumber * postperPage;
let indexofFirstPage = indexofLastPage - postperPage;
let top = pageNumber * postperPage;
this.setState({ indexofLastPage, indexofFirstPage, top, currentPage: pageNumber }, () => {
UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top)
});
}

public edit = (editId, evstate) => {
if (evstate == "edit") {
this.props.callback("form", "edit", editId);
}
if (evstate == "view") {
this.props.callback("form", "view", editId);
}
}

public bindData = () => {
let loadcall = this.state.UserConfigGrid.length == 0 ? (this.state.filterquery == "" && this.state.searchquery == "") ? "noData" : "filterNoData" : "gridData";
if (loadcall == "noData") {
return (
<tr>
<td colSpan={5}>
<div className="center mt-5">
<h4 className="display-message">Sorry! You don't have any Users so far</h4>
<img className=" my-5 center" src={pinbgimg} alt="background" />
<h4 className="display-message  ml-5">Click on the '+' icon to add a new user</h4>
<h4 className="display-message ml-5">Click on the '...' icon to add multiple users</h4>
</div></td></tr>
);
}
else if (loadcall == "filterNoData") {
return (
<tr>
<td colSpan={5}>
<div className="center mt-5">
<img className=" my-5 center" src={searchResults} alt="background" />
{this.state.searchquery == "" && this.state.filterquery != "" ?
<h4 className="display-message">No Results found</h4> : null}
{this.state.searchquery != "" ?
<div>
<h4 className="display-message">Sorry, we couldn't find any results</h4>
<h4 className="display-message">matching '{this.state.searchtext}'</h4>
</div> : null}
{this.state.searchquery == "" && this.state.filterquery != "" ?
<button type="button" className="user-config-create-button mt-4 center results-screen-back" onClick={this.filterclose.bind(this)}>Back to User Config</button> :null}
</div></td></tr>
);
}
else if (loadcall == "gridData") {
return this.state.UserConfigGrid.map((value, index) => {
/** The gridrowcolor is used to change the color of each row dynamically*/
let gridrowcolor = index % 2 == 0 ? "table-content" : "table-content table-row-gray";
let userprofilepic = this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Email;
let manageremail = "";
let ManagerName = "";
if (value.Manager != null) {
if (value.Manager.EMail != null) {
manageremail = value.Manager.EMail;
}
if(value.Manager.FirstName != null && value.Manager.FirstName != ""){
ManagerName = value.Manager.FirstName + " " + value.Manager.LastName;
}
else if(value.Manager.Title !=null && value.Manager.Title != ""){
ManagerName = value.Manager.Title;
}
else{
ManagerName = "";
}
}
return (
<tr className={gridrowcolor}>
<td>{value.UserType}</td>
<td>
<img className="table-person-image" src={userprofilepic} />
<a className="user-drilldown" href="#" onClick={this.edit.bind(this, value.ID, "view")}>{value.UserName}</a>
</td>
{value.Manager != null ?
ManagerName != "" ?
<td>
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Manager.EMail} />{ManagerName}</td>:
<td>No Manager Assigned</td>:
<td>No Manager Assigned</td>}
<td><Moment format="LL">{value.StartDate}</Moment></td>
<td className="text-center">
<div className="dropdown">
<img
className="table-actions dropdown-toggle"
id="dropdownMenuButton"
data-toggle="dropdown"
aria-haspopup="true"
aria-expanded="true"
src={tableActions}
onClick={this.action.bind(this, index)}/>
<div
className={this.state.actionpopup == true && this.state.actionindex == index ? "dropdown-menu show" : "dropdown-menu"}
aria-labelledby="dropdownMenuButton">
<a className="dropdown-item" href="#" onClick={this.edit.bind(this, value.ID, "edit")}>
<img className="dropdown-icon" src={pen} />Edit</a>
<a className="dropdown-item" href="#" onClick={this.deleteopen.bind(this, value.ID, value.Email, value.UserType, value.Scheduled, value.Todo, manageremail)}>
<img className="dropdown-icon" src={emptyTrash} />Delete</a>
</div>
</div></td></tr>
);});}
}

public emptyData = () => {
let array = [];
for (var i = 0; i < this.state.emptyPostsCount; i++) {
array.push([""]);
}
return array.map((value, index) => {
/** The gridrowcolor is used to change the color of each row dynamically*/
let gridrowcolor;
if (this.state.emptyPostsCount % 2 == 0) {
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
<td></td></tr>
);});
}

public newform = () => {
this.props.callback("form", "", "");
}

public render(): React.ReactElement<IRocketAppProps> {
return (
<div className="tab-pane fade show active" id="pills-onboarding" role="tabpanel" aria-labelledby="pills-onboarding-tab">
<div className="col-md-12 mt-4 mb-2 table-mar-top">
{this.state.deletetoast ?
<div
className={"toast delete_message fade show"}
role="alert"
aria-live="assertive"
aria-atomic="true"
data-delay={2000}>
<div className="toast-header">
<span className="form-placeholder-font-size p-1">
<img className="tick_icon pr-2  float-left" src={greentick} alt="toast" />Record deleted successfully</span>
</div>
</div> : null}
<div className="float-left mt-2 headerspacing">
<h6 className="float-left page-heading-rep table-header left-header">User Configuration</h6>
</div>
<div className="float-right headerspacing">
<form className="form-inline float-left right-header">
{this.state.UserConfigGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :
<SearchComponent searchFunc={this.userconfigsearch}></SearchComponent>}
<div className="dropdown pos-inherit">
{this.state.UserConfigGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :
<button
type="button"
className="btn btn-info ml-3"
title="Advanced Filter"
data-toggle="dropdown"
aria-expanded="false"
onClick={this.filteropen.bind(this)}>
<img src={filter} /></button>}
{this.state.filterpopup ?
<div className="dropdown-menu m-0 pb-4 advanced-filter show">
<div className="container-fluid">
<div className="row">
<div className="col-md-12 pb-2 border-bottom mt-2  mb-3">
<span className="filter-title">Advanced Filter</span>
<button
type="button"
className="close"
data-dismiss="modal"
aria-label="Close"
onClick={() => this.setState({ filterpopup: false })}><span aria-hidden="true">×</span></button>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-user-type-user-config">User Type</label>
<Typeahead
className="form-placeholder-font-size w-100 mt-2"
selected={this.state.UserTypeSelected}
options={['HR', 'Manager', 'Admin', 'New Hire']}
minLength='0'
placeholder="Select UserType"
onChange={this.handleUserType.bind(this)}/>
</div>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-manager-user-config">Manager</label>
<Typeahead
className="form-placeholder-font-size w-100 mt-2"
onChange={this.setTypeahead.bind(this)}
options={this.state.UserNameList}
placeholder="Select Manager"
labelKey="UserName"
selected={this.state.ManagerName}
maxResults={3}
minLength='1'
renderMenuItemChildren={this.renderTypeaheadItems}/>
</div>
</div>
<label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Date Range</label>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
className="form-placeholder-font-size w-100 mt-2"
placeholder="From"
value={this.state.StartDateFrom}
onSelectDate={this.handleStartFromDatePicker.bind(this)}/>
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
<div className="col-md-12 mb-4">
<div className="float-right">
<a
href="#"
className="filter-close form-label col-gray px-4"
onClick={this.filterclose.bind(this)}>Clear</a>
<a
href="#"
className="btn btn-primary filter-close ml-2 px-4"
onClick={this.filter.bind(this)}>Apply Filter</a>
</div>
</div>
</div>
</div>
</div> : null}
</div>
{this.state.UserConfigGrid.length == 0 ? null :
<SaveToReport siteUrl={this.state.siteUrl} context={this.props.context} listname={this.state.listName} selectfields={this.state.selectfields} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
</SaveToReport>}
<button type="button" className="btn btn-info ml-3" onClick={this.newform.bind(this)}>
<img src={addIcon} /></button>
<MultipleUserCreation context={this.state.currentContext}></MultipleUserCreation>
</form>
</div>
<div className="col-md-12 col- float-left overlay-resp table-mar-top mt-4">
<table className="table table-border table-border">
<thead className="table-content-header">
<tr>
<th>USER TYPE
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.sort.bind(this, 'asc', 'UserType')}>
<img src={up} /></a></span>
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.sort.bind(this, 'desc', 'UserType')}>
<img src={down} /></a></span></th>
<th>USER NAME
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.sort.bind(this, 'asc', 'UserName')}>
<img src={up} /></a></span>
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.sort.bind(this, 'desc', 'UserName')}>
<img src={down} /></a></span></th>
<th>MANAGER
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.sort.bind(this, 'asc', 'Manager')}>
<img src={up} /></a></span>
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.sort.bind(this, 'desc', 'Manager')}>
<img src={down} /></a></span></th>
<th>START DATE
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} onClick={this.sort.bind(this, 'asc', 'StartDate')}>
<img src={up} /</a></span>
<span className="sorting">
<a href="#" className={this.state.UserConfigGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} onClick={this.sort.bind(this, 'desc', 'StartDate')}>
<img src={down} /></a></span></th>
<th className="text-center">ACTION</th></tr></thead>
<tbody>
{this.bindData()}
{this.state.UserConfigGrid.length > 0 && this.emptyData()}</tbody></table>
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
<h5 className="modal-title" id="exampleModalLongTitle">Delete Record</h5>
<button
type="button"
className="close"
data-dismiss="modal"
aria-label="Close"
onClick={this.deleteclose.bind(this)}>
<span aria-hidden="true">×</span></button>
</div>
<div className="modal-body">
<span className="delete-modal-box">Are you sure you want to delete this record ?</span>
</div>
<div className="modal-footer footer-border-none">
<button
type="button"
className="btn btn-secondary cancel-button-del-modal"
data-dismiss="modal" onClick={this.deleteclose.bind(this)}>Cancel</button>
<button
type="button"
className="btn btn-primary del-button"
data-dismiss="modal" onClick={this.deleterecord.bind(this)}>Delete</button>
</div>
</div>
</div>
</div> : null}
</div>
{this.state.UserConfigGrid.length != 0 && this.state.UserConfigGridCount != 0 ?
<div className="col-md-12  col- float-left mt-2">
<div className="float-left  col-gray">
<span># Records : <span>{this.state.gridLength} </span> out of <span>{this.state.UserConfigGridCount}</span></span>
</div>
<div className="float-right ">
<Pagination
count={this.state.pageCount}
shape="rounded"
page={this.state.currentPage}
onChange={this.handlePage.bind(this)}/>
</div>
</div> : null}
</div>
</div>
);}
