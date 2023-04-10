/**[Ref] - Denotes Pseudo Code Reference
* This component is the OnboardingTodo grid component. The component displays the data in the Grid format.
* App Name: Rocket
* Author: Praveen Kumar
* Created Date: 06/04/2020 */
import * as React from 'react';
import { IRocketAppProps } from '../components/IRocketAppProps';
import { escape, assign } from '@microsoft/sp-lodash-subset';
import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import Moment from 'react-moment';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, Suggestions, optionProperties, values, Overlay } from 'office-ui-fabric-react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OutsideHandler from 'react-outside-click-handler';
import Modal from 'react-modal';
import SearchComponent from '../Child_Components/Search_Component';
import SaveToReport from '../Child_Components/Save_To_Report';
import MultipleTemplateAssign from '../Child_Components/Multiple_User_Template_Assign';
import '../css/commontheme.css';
import '../css/style.css';
import * as TodoAction from '../Action/Todo_Action';
import TodoStore from '../Store/Todo_Store';
import * as TemplateAssignAction from '../Action/User_Template_Assign_Action';
import TemplateAssignStore from '../Store/User_Template_Assign_Store';

const filter: string = require('../images/filter.svg');
const addIcon: string = require('../images/add-icon.svg');
const pen: string = require('../images/pen.svg');
const emptyTrash: string = require('../images/empty-trash.svg');
const tableActions: string = require('../images/actions-black.svg');
const schedule: string = require('../images/schedule.svg');
const pinbgimg: string = require('../images/pinbgimg.png');
const searchResults: string = require('../images/search-results.svg');
const greentick: string = require('../images/greentick.svg');

export interface IOnboardingTodoProps {
context: WebPartContext;
callback: any;
schedule: any;
templates: any;
}

export interface IOnboardingTodoStates {
siteUrl: string;
currentContext: WebPartContext;
listName: string;
selectfields: any;
gridfields: any;
displayfields: any;
blastoffname: any;
loopinname: any;
blastoffs: any;
loopins: any;
BMaxLimitMsg: any;
LMaxLimitMsg: any;
OnboardingTodoGrid: any[];
OnboardingTodoGridCount: any[];
StartDateFrom: any;
CStartDateFrom: any;
StartDateTo: any;
CStartDateTo: any;
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
ErrorMsg: string;
DateRangeErrorMsg: string;
EditID: any;
EVState: any;
PostBlastoff: any;
PostLoopIn: any;
BlastoffTempDetails: any;
LoopInTempDetails: any;
UserDetails: any;
UserDetails1: any;
Id: any;
UserTodoDetails: any;
UserDetail: any;
managerAssigned: any;
schedulebflag: any;
schedulelflag: any;
}

export default class OnboardingTodoGrid extends React.Component<IOnboardingTodoProps, IOnboardingTodoStates>{
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
listName: "TodoTemplate",
selectfields: `Email/Email,Email/UserName,Email/UserType,Email/StartDate,LoopInTemp/TemplateName,BlastoffTemp/TemplateName&$expand=Email/EmailId&$expand=LoopInTemp/LoopInTempId,BlastoffTemp/BlastoffTempId&$filter=(IsActive eq 1)`,
gridfields: ['/Email/UserName/', '/Email/UserType/', '/Email/StartDate/', '/BlastoffTemp/length/', '/LoopInTemp/length/'],
displayfields: ['UserName', 'UserType', 'StartDate', 'BlastoffTempCount', 'LoopInTempCount'],
blastoffname: [],
loopinname: [],
blastoffs: [],
loopins: [],
BMaxLimitMsg: "",
LMaxLimitMsg: "",
OnboardingTodoGrid: [],
OnboardingTodoGridCount: [],
StartDateFrom: null,
CStartDateFrom: null,
StartDateTo: null,
CStartDateTo: null,
searchquery: "",
searchtext: "",
filterquery: "",
filterpopup: false,
actionpopup: false,
actionindex: "",
deletepopup: false,
deletetoast: false,
delindex: "",
delemail: "",
ErrorMsg: "",
DateRangeErrorMsg: "",
EditID: "",
EVState: "",
PostBlastoff: [],
PostLoopIn: [],
BlastoffTempDetails: [],
LoopInTempDetails: [],
UserDetails: [],
UserDetails1: [],
Id: '',
UserTodoDetails: [],
UserDetail: [],
managerAssigned: [],
schedulebflag: 0,
schedulelflag: 0
};
}

public componentWillMount() {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
TodoAction.getBlastoff(this.state.siteUrl, this.state.currentContext);
TodoAction.getLoopin(this.state.siteUrl, this.state.currentContext);
TodoStore.on("Todogrid", this.loadTodoGridData.bind(this));
TodoStore.on("blastoff", this.loadBlastoff.bind(this));
TodoStore.on("loopin", this.loadLoopin.bind(this));
TodoStore.on("success", this.ondeleteload.bind(this));
TemplateAssignStore.on("usertododetails1", this.loadusertododetails.bind(this));
TemplateAssignStore.on("userdetail1", this.loadUserDetails.bind(this));
TemplateAssignStore.on("managerAssigned", this.loadmanagerAssigned.bind(this));
TemplateAssignStore.on("TodoBlastoffTempDetails", this.loadBlastoffTempDetails.bind(this));
TemplateAssignStore.on("TodoLoopInTempDetails", this.loadLoopInTempDetails.bind(this));
TemplateAssignStore.on("schedulestatus", this.loadschedulestatus.bind(this));
}

public loadTodoGridData = () => {
this.setState({ OnboardingTodoGrid: TodoStore.TodoGridData });
}

public loadBlastoff = () => {
this.setState({ blastoffname: TodoStore.blastoff });
}

public loadLoopin = () => {
this.setState({ loopinname: TodoStore.loopin });
}

public loadusertododetails = () => {
this.setState({ UserTodoDetails: TemplateAssignStore.usertodo }, () => { TemplateAssignAction.getUserDetails(this.state.siteUrl, this.state.currentContext, this.state.UserTodoDetails[0].Email.Email, "grid"); });
}

public loadUserDetails = () => {
this.setState({ UserDetail: TemplateAssignStore.userdetails }, () => { this.userschedule(); });
}

public loadmanagerAssigned = () => {
this.setState({ managerAssigned: TemplateAssignStore.managerAssigned }, () => { this.userdetails(); });
}

public userdetails = () => {
let array1 = this.state.UserDetails;
let array2 = this.state.managerAssigned;
let array3 = [];
let team = "", role = "";
if (array2.length > 0) {
array2.map((value, index) => {
if (value.Team != null) {
if(value.Team.Team!=null)
team = value.Team.Team;
}
if (value.Role != null) {
if(value.Role.Role!=null)
role = value.Role.Role;
}
array3.push([]);
array3[index].push(array1.User.ID);
array3[index].push(array1.Id);
array3[index].push(value.StartDate);
array3[index].push(value.UserName);
array3[index].push(array1.UserName);
array3[index].push(team);
array3[index].push(role);
array3[index].push(value.Email);
});
}
else {
array3.push([]);
}
this.setState({ UserDetails: array3 }, () => { TemplateAssignAction.getBlastoffTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostBlastoff, "grid"); });
}

public loadBlastoffTempDetails = () => {
if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length == 0) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.UserDetails, this.state.Id, this.state.EditID, "Blastoff"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.LoopInTempDetails.length > 0) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.UserDetails, this.state.Id, this.state.EditID, "Blastoff"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.LoopInTempDetails.length == 0) {
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails });
}
}

public loadLoopInTempDetails = () => {
if (this.state.PostLoopIn.length > 0 && this.state.PostBlastoff.length == 0) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.UserDetails1, this.state.Id, this.state.EditID, "LoopIn"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.BlastoffTempDetails.length > 0) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.UserDetails1, this.state.Id, this.state.EditID, "LoopIn"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.BlastoffTempDetails.length == 0) {
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails });
}
}

public loadschedulestatus = () => {
if (TemplateAssignStore.schedulestatus == "Blastoff" && this.state.schedulebflag == 0 && this.state.schedulelflag == 0) {
if (this.state.PostLoopIn.length > 0) {
debugger;
this.setState({ schedulebflag: 1 }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.UserDetails1, this.state.Id, this.state.EditID, "LoopIn"); });
}
else {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
}
}
if (TemplateAssignStore.schedulestatus == "LoopIn" && this.state.schedulelflag == 0 && this.state.schedulebflag == 0) {
if (this.state.PostBlastoff.length > 0) {
this.setState({ schedulelflag: 1 }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.UserDetails, this.state.Id, this.state.EditID, "Blastoff"); });
}
else {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
}
}
if (this.state.schedulebflag == 1 || this.state.schedulelflag == 1) {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
}
}

public todosearch = (searchtext) => {
let searchquery = "";
if (searchtext != "") {
searchquery = ` and (substringof('${searchtext}',EmailId/UserName))`;
}
this.setState({ searchtext });
this.setState({ searchquery: searchquery }, () => { this.formquery(); });
}

public setTypeahead1 = (blastoff) => {
if (blastoff.length <= 5) {
this.setState({ blastoffs: blastoff });
}
}

public bmaxlimit = (text) => {
if (this.state.blastoffs.length == 5) {
if (text != "") {
this.setState({ BMaxLimitMsg: "Max Limit Reached" });
}
}
else if (this.state.blastoffs.length < 5) {
this.setState({ BMaxLimitMsg: "" });
}
}

public setTypeahead2 = (loopin) => {
if (loopin.length <= 5) {
this.setState({ loopins: loopin });
}
}

public lmaxlimit = (text) => {
if (this.state.loopins.length == 5) {
if (text != "") {
this.setState({ LMaxLimitMsg: "Max Limit Reached" });
}
}
else if (this.state.loopins.length < 5) {
this.setState({ LMaxLimitMsg: "" });
}
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
this.setState({ DateRangeErrorMsg: "From Date should be lesser than the To date" });
}
else {
this.setState({ DateRangeErrorMsg: "" });
}
}
if (type == "to" && fromval != null) {
if (value < fromval) {
this.setState({ DateRangeErrorMsg: "To Date should be greater than the from date" });
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
let errormsg = "";
if (this.state.blastoffs.length == 0 && this.state.loopins.length == 0 && this.state.StartDateFrom == null && this.state.StartDateTo == null) {
this.setState({ ErrorMsg: "Please select atleast one filter" });
errormsg = "validation failed";
}
if (this.state.filterquery != "" && this.state.blastoffs.length == 0 && this.state.loopins.length == 0 && this.state.StartDateFrom == null && this.state.StartDateTo == null) {
this.setState({ filterpopup: false });
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, "");
}
if (errormsg == ""&&this.state.DateRangeErrorMsg=="") {
this.formquery();
this.setState({ filterpopup: false, BMaxLimitMsg: "", LMaxLimitMsg: "", ErrorMsg: "", DateRangeErrorMsg: "" });
}
}

public formquery = () => {
let filter = "";
if (this.state.searchquery != "") {
filter += this.state.searchquery;
}
if (this.state.blastoffs.length > 0) {
this.state.blastoffs.map((value, index) => {
if (index == 0) {
filter += ` and (BlastoffTempId/TemplateName eq '${value.TemplateName}')`;
}
else {
filter += ` and (BlastoffTempId/TemplateName eq '${value.TemplateName}')`;
}});
}
if (this.state.loopins.length > 0) {
this.state.loopins.map((value, index) => {
if (index == 0) {
filter += ` and (LoopInTempId/TemplateName eq '${value.TemplateName}')`;
}
else {
filter += ` and (LoopInTempId/TemplateName eq '${value.TemplateName}')`;
}});
}
if (this.state.CStartDateFrom != null) {
filter += ` and (EmailId/StartDate ge '${this.state.CStartDateFrom}')`;
}
if (this.state.CStartDateTo != null) {
filter += ` and (EmailId/StartDate le '${this.state.CStartDateTo}')`;
}
this.setState({ filterquery: filter });
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, filter);
}

filterclose = () => {
this.setState({ filterpopup: false, BMaxLimitMsg: "", LMaxLimitMsg: "", ErrorMsg: "", DateRangeErrorMsg: "", blastoffs: [], loopins: [], StartDateFrom: null, CStartDateFrom: null, StartDateTo: null, CStartDateTo: null }, () => { this.formquery(); });
}

public action = (index) => {
this.setState({ actionpopup: !this.state.actionpopup });
this.setState({ actionindex: index });
}

public edit = (editindex, evstate) => {
this.setState({ EVState: evstate, EditID: editindex });
this.props.callback("form", evstate, editindex);
}

public deleteopen = (dindex, delemail) => {
this.setState({ delindex: dindex, delemail });
this.setState({ deletepopup: true });
}

public deleterecord = () => {
TodoAction.postDeleteTodo(this.state.siteUrl, this.state.currentContext, this.state.delindex, this.state.delemail);
this.setState({ deletetoast: true });
this.deleteclose();
}

public ondeleteload = () => {
if (TodoStore.delete == 204) {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery);
}
}

public deleteclose = () => {
this.setState({ deletepopup: false });
setTimeout(function () { this.setState({ deletetoast: false }); }.bind(this), 2000);
}

public schedule = (ID, e) => {
e.preventDefault();
this.setState({ EditID: ID });
TemplateAssignAction.getUserTodoAssign(this.state.siteUrl, this.state.currentContext, ID, "grid");
}

public userschedule = () => {
let todovalue = this.state.UserTodoDetails[0];
let uservalue = this.state.UserDetail[0];
let blastoffAssigned = todovalue.BlastoffTemp;
let loopinAssigned = todovalue.LoopInTemp;
let array1 = this.state.UserDetails;
let array2 = this.state.UserDetails1;
let array3 = this.state.PostBlastoff;
let array4 = this.state.PostLoopIn;
blastoffAssigned.map((bvalue, index) => {
this.state.blastoffname.map((value, index) => {
if (bvalue.TemplateName == value.TemplateName) {
array3.push(value.ID);
}});
});
loopinAssigned.map((lvalue, index) => {
this.state.loopinname.map((value, index) => {
if (lvalue.TemplateName == value.TemplateName) {
array4.push(value.ID);
}});
});
if (todovalue.BlastoffTemp.length > 0) {
if (todovalue.Email.UserType == "Manager") {
this.setState({ UserDetails: uservalue, Id: uservalue.Id, PostBlastoff: array3 });
TemplateAssignAction.getManagerAssignedDetails(this.state.siteUrl, this.state.currentContext, todovalue.Email.Email, "grid");
}
else if (todovalue.Email.UserType == "New Hire") {
let managername = "", team = "", role = "";
if (uservalue.Manager != null) {
if (uservalue.Manager.FirstName != null) {
managername = uservalue.Manager.FirstName;
if (uservalue.Manager.LastName != null) {
managername += " " + uservalue.Manager.LastName;
}
}
else if(uservalue.Manager.Title != null){
managername = uservalue.Manager.Title;
}
else{
managername = "";
}
}
if (uservalue.Team.Team != null) {
team = uservalue.Team.Team;
}
if (uservalue.Role.Role != null) {
role = uservalue.Role.Role;
}
array1.push([]);
array1[0].push(uservalue.User.ID);
array1[0].push(uservalue.Id);
array1[0].push(todovalue.Email.StartDate);
array1[0].push(todovalue.Email.UserName);
array1[0].push(managername);
array1[0].push(team);
array1[0].push(role);
this.setState({ UserDetails: array1, Id: uservalue.Id, PostBlastoff: array3 }, () => { TemplateAssignAction.getBlastoffTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostBlastoff, "grid"); });
}
}
if (todovalue.LoopInTemp.length > 0) {
let managername = "", team = "", role = "";
if (uservalue.Manager != null) {
if (uservalue.Manager.FirstName != null) {
managername = uservalue.Manager.FirstName;
if (uservalue.Manager.LastName != null) {
managername += " " + uservalue.Manager.LastName;
}}
}
if (uservalue.Team.Team != null) {
team = uservalue.Team.Team;
}
if (uservalue.Role.Role != null) {
role = uservalue.Role.Role;
}
array2.push([]);
array2[0].push(uservalue.User.ID);
array2[0].push(uservalue.Id);
array2[0].push(todovalue.Email.StartDate);
array2[0].push(todovalue.Email.UserName);
array2[0].push(managername);
array2[0].push(team);
array2[0].push(role);
this.setState({ UserDetails1: array2, Id: uservalue.Id, PostLoopIn: array4 }, () => { TemplateAssignAction.getLoopInTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostLoopIn, "grid"); });
}
}

public bindData = () => {
let loadcall = this.state.OnboardingTodoGrid.length == 0 ? (this.state.filterquery == "" && this.state.searchquery == "") ? "noData" : "filterNoData" : "gridData";
if (loadcall == "noData") {
return (
<div className="center mt-5">
<h4 className="display-message">
Sorry! You don't have any Onboarding Todo's</h4>
<img className=" my-5 center" src={pinbgimg} alt="background" />
<h4 className="display-message mar-0 ml-5">
Click on the '+' icon to add a new Onboarding Todo</h4>
<h4 className="display-message mar-0 ml-5">Click on the '...' icon to add multiple Onboarding Todo's</h4>
</div>
);
}
else if (loadcall == "filterNoData") {
return (
<div className="center mt-5">
<img className="my-5 center" src={searchResults} alt="background" />
{this.state.searchquery == "" && this.state.filterquery != "" ?
<h4 className="display-message">No Results found</h4> : null}
{this.state.searchquery != "" ?
<div>
<h4 className="display-message">Sorry, we couldn't fetch any results</h4>
<h4 className="display-message">matching '{this.state.searchtext}'</h4>
</div> : null}
{this.state.searchquery == "" && this.state.filterquery != "" ?
<button type="button" className="user-config-create-button mt-4 center results-screen-back" onClick={this.filterclose.bind(this)}>
Back to OnboardingTodo's
</button> : null}
</div>
);
}
else if (loadcall == "gridData") {
return this.state.OnboardingTodoGrid.map((value, index) => {
/**The userprofilepic is used to form the User's profilepic url and display it in the grid*/
var userprofilepic = this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Email.Email;
return (
<div className="col- col-md-3 mt-3">
<div className="card card-padding todo-card-prop card-margin">
<div className="card-body float-left p-0 m-0">
<div className="float-right">
<div className="dropdown">
<img className="table-actions black-actions dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"
aria-haspopup="true"
aria-expanded="false"
src={tableActions}
onClick={this.action.bind(this, index)}/>
<div className={(this.state.actionindex == index && this.state.actionpopup) ? "dropdown-menu show" : "dropdown-menu"}
aria-labelledby="dropdownMenuButton">
<a className="dropdown-item" href="#" onClick={this.edit.bind(this, value.ID, "edit")}>
<img className="dropdown-icon" src={pen} />Edit</a>
<a className="dropdown-item" href="#" onClick={this.deleteopen.bind(this, value.ID, value.Email.Email)}><img className="dropdown-icon" src={emptyTrash} /> Delete</a>
</div>
</div>
</div>
<div className="float-left w-100">
<img className="profile mt-0 float-left mr-3" src={userprofilepic} />
<ul className="mt-1">
<li className="todo-person-info"><a href="#" className="user-drilldown black" onClick={this.edit.bind(this, value.ID, "view")}>{value.Email.UserName}</a></li>
<li className="date_info">
<span className="todo-role">{value.Email.UserType}, </span>
<span className="todo-startdate">
<Moment format="LL">
{value.Email.StartDate}
</Moment></span></li></ul>
<a href="#" className="float-left mt-1 not-active">
<label className="todo-keyword-loopins mr-2">Loopins ({value.LoopInTemp.length})</label></a>
<a href="#" className="float-left mt-1 not-active">
<label className="todo-keyword-loopins todo-keyword-blastoffs ">Blastoffs ({value.BlastoffTemp.length})</label></a>
{value.BlastoffTemp.length == 0 && value.LoopInTemp.length == 0 ? null :
<span className="float-right mt-1 ">
<button type="button" className="todo-schedule-icon" onClick={this.schedule.bind(this, value.ID)}>
<img src={schedule} /></button></span>}
</div>
</div>
</div>
</div>
);});}
}

public todoform = () => {
this.props.callback("form", "", "");
}

public render(): React.ReactElement<IRocketAppProps> {
return (
<div>
<div className="row m-0">
<div className="col-md-12 mt-3 mb-2 pt-2 ">
<div className="float-left headerspacing">
<h6 className="float-left table-header">Onboarding Todo's</h6>
</div>
{this.state.deletetoast ?
<div
className="toast delete_message fade show"
role="alert"
aria-live="assertive"
aria-atomic="true"
data-delay={2000}>
<div className="toast-header">
<span className="form-placeholder-font-size p-1">
<img
className="tick_icon pr-2  float-left"
src={greentick}
alt="toast"/>Record deleted successfully</span>
</div>
</div> : null}
<div className="float-right headerspacing">
<form className="form-inline mr-2 mar-0">
{this.state.OnboardingTodoGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :
<SearchComponent searchFunc={this.todosearch}>
</SearchComponent>
}
<div className="dropdown pos-inherit">
{this.state.OnboardingTodoGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :
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
onClick={() => this.setState({ filterpopup: false })}>
<span aria-hidden="true">×</span></button>
</div>
<label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Templates</label>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<Typeahead
multiple
className="form-placeholder-font-size w-100 mt-2"
onChange={this.setTypeahead1.bind(this)}
options={this.state.blastoffs.length < 5 ? this.state.blastoffname : []}
onInputChange={this.bmaxlimit.bind(this)}
maxResults={3}
placeholder="Select Blastoff"
labelKey="TemplateName"
selected={this.state.blastoffs}
minLength='1'/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.BMaxLimitMsg}</span>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<Typeahead
multiple
className="form-placeholder-font-size w-100 mt-2"
onChange={this.setTypeahead2.bind(this)}
options={this.state.loopins.length < 5 ? this.state.loopinname : []}
onInputChange={this.lmaxlimit.bind(this)}
maxResults={3}
placeholder="Select LoopIn"
labelKey="TemplateName"
selected={this.state.loopins}
minLength='1'/>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.LMaxLimitMsg}</span>
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
onSelectDate={this.handleStartToDatePicker.bind(this)}/>
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
{this.state.OnboardingTodoGrid.length == 0 ? null :
<SaveToReport siteUrl={this.state.siteUrl} context={this.state.currentContext} listname={this.state.listName} selectfields={this.state.selectfields} gridfields={this.state.gridfields} displayfields={this.state.displayfields} filterquery={this.state.filterquery}>
</SaveToReport>}
<button type="button" className="btn btn-info ml-3" onClick={this.todoform.bind(this)}>
<img src={addIcon} /></button>
<MultipleTemplateAssign callback={() => { }} callfrom={"Todos"} context={this.state.currentContext}></MultipleTemplateAssign>
</form>
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
<span className="delete-modal-box">Are you sure you want to delete this record ?
</span>
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
<div className="col-md-12 col- p-0">
<div className="row m-0">
{this.bindData()}
</div>
</div>
</div>
);}
}
