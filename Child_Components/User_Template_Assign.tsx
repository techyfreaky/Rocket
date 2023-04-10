/** [Ref] - Denotes Pseudo Code Reference
* This component is the User Template Assign component. The component displays the form for assigning Template to the user.
* App Name: Rocket
* Author: Praveen Kumar
* Created Date: 06/05/2020*/
import * as React from 'react';
import { IRocketAppProps } from '../../../components/IRocketAppProps';
import { escape, assign } from '@microsoft/sp-lodash-subset';
import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from 'moment';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const userdrillback: string = require('../images/user-drill-back-image.svg');
const info: string = require('../images/i-icon.svg');
const addicon: string = require('../images/add-icon.svg');
const sche: string = require('../images/sche.svg');
const bookmark: string = require('../images/bookmark.png');
const deleteicon: string = require('../images/todo-delete.svg');
const pen: string = require('../images/pen.png');

import '../css/commontheme.css';
import '../css/style.css';

/** Importing the action and store file and set to an object.*/
import * as TemplateAssignAction from '../Action/User_Template_Assign_Action';
import TemplateAssignStore from '../Store/User_Template_Assign_Store';
import * as TodoAction from '../Action/Todo_Action';
import * as ProgressAction from '../webports/rocketWebport/Action/Progress_Action';

export interface IUserTemplateAssignProps {
context: WebPartContext;
callback: any;
editID: any;
evstate: any;
schedule: any;
callfrom: any;
templates: any;
}

export interface IUserTemplateAssignStates {
siteUrl: string;
currentContext: WebPartContext;
editId: any;
evstate: any;
formState: boolean;
disableusername: boolean;
UserConfigList: any;
userDetails: any[];
UserName: any;
ManagerName: any;
StartDate: any;
Team: any;
Role: any;
UserId: any;
UserMail: any;
UserDetailsId: any;
UserType: any;
UserDetails: any[];
SUserDetails: any;
SUserDetails1: any;
Blastoff: any[];
Loopin: any[];
BlastoffAssigned: any[];
LoopInAssigned: any[];
CBlastoff: any;
CLoopIn: any;
PostUserName: any;
PostBlastoff: any[];
PostLoopIn: any[];
DelBEntries: any[];
DelLEntries: any[];
templateassignvalue: any;
TemplateAssignStatus: boolean;
BlastoffTempDetails: any;
LoopInTempDetails: any;
addlimit: boolean;
temptype: any;
blastoffstatus: any;
loopinstatus: any;
UserNameErrorMsg: any;
EmptyErrorMsg: any;
userdetailspopup: boolean;
Comments: string;
managerAssigned: any;
updateCount: any;
updateStatus: any;
UBlastoffAssigned: any;
ULoopInAssigned: any;
scheduleState: boolean;
schedulebflag: any;
schedulelflag: any;
}
/** Define the class that inherits from base react component class */
export default class UserTemplateAssign extends React.Component<IUserTemplateAssignProps, IUserTemplateAssignStates>{
constructor(props) {
super(props);
/**Set the values of the state variables.*/
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
editId: this.props.editID,
evstate: this.props.evstate,
formState: true,
disableusername: false,
UserConfigList: [],
userDetails: [],
UserId: '',
UserMail: '',
UserDetailsId: '',
UserName: [],
ManagerName: "No Manager Assigned",
StartDate: "StartDate not Defined",
Team: "No Team Assigned",
Role: "No Role Assigned",
UserType: "UserType not Defined",
UserDetails: [],
SUserDetails: [],
SUserDetails1: [],
Blastoff: [],
Loopin: [],
BlastoffAssigned: [[]],
LoopInAssigned: [[]],
CBlastoff: [],
CLoopIn: [],
PostUserName: [],
PostBlastoff: [],
DelBEntries: [],
DelLEntries: [],
PostLoopIn: [],
templateassignvalue: ["temp"],
TemplateAssignStatus: true,
BlastoffTempDetails: [],
LoopInTempDetails: [],
addlimit: true,
temptype: ["Blastoff"],
blastoffstatus: ["Active"],
loopinstatus: [""],
UserNameErrorMsg: "",
EmptyErrorMsg: "",
userdetailspopup: false,
Comments: "",
managerAssigned: [],
updateCount: 0,
updateStatus: '',
UBlastoffAssigned: [],
ULoopInAssigned: [],
scheduleState: true,
schedulebflag: 0,
schedulelflag: 0
};
}
/*** Load event of the list guid.*/
public componentWillMount() {
if (this.state.editId == "") {
TemplateAssignAction.getUserConfigList(this.state.siteUrl, this.state.currentContext);
TemplateAssignStore.on("userconfiglist", this.loadUserConfig.bind(this));
}
else {
if (this.props.callfrom == "todo") {
TemplateAssignAction.getUserTodoAssign(this.state.siteUrl, this.state.currentContext, this.state.editId, "form");
}
else if (this.props.callfrom == "schedule") {
TemplateAssignAction.getUserScheduleAssign(this.state.siteUrl, this.state.currentContext, this.state.editId);
}
TemplateAssignStore.on("userschedule", this.loaduserschedule.bind(this));
TemplateAssignStore.on("usertododetails", this.loadusertododetails.bind(this));
this.setState({ disableusername: true });
}
TemplateAssignStore.on("userdetail", this.loadUserDetails.bind(this));
TemplateAssignStore.on("blastoff", this.loadBlastoff.bind(this));
TemplateAssignStore.on("loopin", this.loadLoopIn.bind(this));
TemplateAssignStore.on("managerAssignedDetails", this.loadmanagerAssigned.bind(this));
TemplateAssignStore.on("BlastoffTempDetails", this.loadBlastoffTempDetails.bind(this));
TemplateAssignStore.on("LoopInTempDetails", this.loadLoopInTempDetails.bind(this));
TemplateAssignStore.on("updateStatus", this.loadupdatestatus.bind(this));
TemplateAssignStore.on("schedulestatus", this.loadschedulestatus.bind(this));
TemplateAssignStore.on("TodoStatus", this.loadtodostatus.bind(this));
TemplateAssignStore.on("updateTodoStatus", this.loadupdateTodoStatus.bind(this));
}

public loadtodostatus = () => {
if (TemplateAssignStore.TodoStatus == "success") {
this.cancel();
}
}

public loadupdateTodoStatus = () => {
if (TemplateAssignStore.updateTodoStatus == "success") {
this.cancel();
}
}

public loadUserConfig = () => {
this.setState({ UserConfigList: TemplateAssignStore.userconfig });
}

public loadBlastoff = () => {
this.setState({ Blastoff: TemplateAssignStore.blastoff }, () => { TemplateAssignAction.getLoopIns(this.state.siteUrl, this.state.currentContext, this.state.Role); });
}

public loadLoopIn = () => {
if (this.state.editId != "") {
this.setState({ Loopin: TemplateAssignStore.loopin }, () => { this.assignBL(); });
}
else {
this.setState({ Loopin: TemplateAssignStore.loopin });
}
}

/*Edit*/
public loaduserschedule = () => {
this.setState({ userDetails: TemplateAssignStore.userschedule }, () => { this.assignData(); })
}

public loadusertododetails = () => {
this.setState({ userDetails: TemplateAssignStore.usertodo }, () => { this.assignData(); });
}

public loadmanagerAssigned = () => {
this.setState({ managerAssigned: TemplateAssignStore.managerAssigned }, () => { this.userdetails(); });
}

public userdetails = () => {
let array1 = this.state.SUserDetails;
let array2 = this.state.managerAssigned;
let array3 = [];
let team = "", role = "";
if (array2.length > 0) {
array2.map((value, index) => {
if (value.Team != null) {
if (value.Team.Team != null) {
team = value.Team.Team;
}
}
if (value.Role != null) {
if (value.Role.Role != null) {
role = value.Role.Role;
}
}
array3.push([]);
array3[index].push(array1.User.ID);
array3[index].push(array1.ID);
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
this.setState({ SUserDetails: array3 }, () => { TemplateAssignAction.getBlastoffTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostBlastoff, "form"); });
}

public loadUserDetails = () => {
this.setState({ UserDetails: TemplateAssignStore.userdetails }, () => { this.assign(); });
}

public loadBlastoffTempDetails = () => {
if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length == 0) {
if (this.props.callfrom == "todo" || (this.props.callfrom == "schedule" && this.state.editId == "")) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
}
else if (this.props.callfrom == "schedule" && this.state.editId != "") {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, this.state.UBlastoffAssigned, this.state.ULoopInAssigned);
}
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.SUserDetails, this.state.UserDetailsId, this.state.editId, "Blastoff"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.LoopInTempDetails.length > 0) {
if (this.props.callfrom == "todo" || (this.props.callfrom == "schedule" && this.state.editId == "")) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
}
else if (this.props.callfrom == "schedule" && this.state.editId != "") {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, this.state.UBlastoffAssigned, this.state.ULoopInAssigned);
}
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.SUserDetails, this.state.UserDetailsId, this.state.editId, "Blastoff"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.LoopInTempDetails.length == 0) {
this.setState({ BlastoffTempDetails: TemplateAssignStore.BlastoffTempDetails });
}
}

public loadLoopInTempDetails = () => {
if (this.state.PostLoopIn.length > 0 && this.state.PostBlastoff.length == 0) {
if (this.props.callfrom == "todo" || (this.props.callfrom == "schedule" && this.state.editId == "")) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
}
else if (this.props.callfrom == "schedule" && this.state.editId != "") {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, this.state.UBlastoffAssigned, this.state.ULoopInAssigned);
}
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.SUserDetails1, this.state.UserDetailsId, this.state.editId, "LoopIn"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.BlastoffTempDetails.length > 0) {
if (this.props.callfrom == "todo" || (this.props.callfrom == "schedule" && this.state.editId == "")) {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, [], []);
}
else if (this.props.callfrom == "schedule" && this.state.editId != "") {
this.props.templates(this.state.PostBlastoff, this.state.PostLoopIn, this.state.UBlastoffAssigned, this.state.ULoopInAssigned);
}
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.SUserDetails1, this.state.UserDetailsId, this.state.editId, "LoopIn"); });
}
else if (this.state.PostBlastoff.length > 0 && this.state.PostLoopIn.length > 0 && this.state.BlastoffTempDetails.length == 0) {
this.setState({ LoopInTempDetails: TemplateAssignStore.LoopInTempDetails });
}
}

public loadschedulestatus = () => {
if (TemplateAssignStore.schedulestatus == "Blastoff" && this.state.schedulebflag == 0 && this.state.schedulelflag == 0) {
if (this.state.PostLoopIn.length > 0) {
debugger;
this.setState({ schedulebflag: 1 }, () => { this.props.schedule(this.state.LoopInTempDetails, this.state.SUserDetails1, this.state.UserDetailsId, this.state.editId, "LoopIn"); });
}
else {
this.cancel();
}
}
if (TemplateAssignStore.schedulestatus == "LoopIn" && this.state.schedulelflag == 0 && this.state.schedulebflag == 0) {
if (this.state.PostBlastoff.length > 0) {
this.setState({ schedulelflag: 1 }, () => { this.props.schedule(this.state.BlastoffTempDetails, this.state.SUserDetails, this.state.UserDetailsId, this.state.editId, "Blastoff"); });
}
else {
this.cancel();
}
}
if (this.state.schedulebflag == 1 || this.state.schedulelflag == 1) {
this.cancel();
}
}

public loadupdatestatus = () => {
if (TemplateAssignStore.updateStatus == 204 && this.state.PostBlastoff.length == 0 && this.state.PostLoopIn.length == 0) {
this.cancel();
}
}

renderTypeaheadItems = (options, props, index) => {
return (
<div>
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + options.User.EMail} ></img>
<span>{options.UserName}</span>
</div>
)
}

public setTypeahead = (uname) => {
if (uname.length > 0) {
this.setState({ UserName: uname });
this.setState({ UserNameErrorMsg: "" });
this.setState({ UserId: uname[0].User.Id });
this.setState({ UserMail: uname[0].User.EMail });
this.getUserDetails(uname[0].User.EMail);
}
else {
this.setState({ userdetailspopup: false, TemplateAssignStatus: true });
this.setState({ UserName: uname });
this.setState({ EmptyErrorMsg: "", templateassignvalue: ["temp"], blastoffstatus: ["Active"], loopinstatus: [""], temptype: ["Blastoff"], Blastoff: [], Loopin: [], BlastoffAssigned: [[]], LoopInAssigned: [[]] });
}
}

public getUserDetails = (UserName) => {
TemplateAssignAction.getUserDetails(this.state.siteUrl, this.state.currentContext, UserName, "form");
this.setState({ TemplateAssignStatus: false });
if (this.state.evstate == "view") {
this.setState({ TemplateAssignStatus: true });
}
}

public assign = () => {
this.state.UserDetails.map((value, index) => {
let sd = "";
let ManagerName;
if (value.Manager != null) {
if (value.Manager.FirstName != null) {
ManagerName = value.Manager.FirstName;
if (value.Manager.LastName != null) {
ManagerName += " " + value.Manager.LastName;
}
this.setState({ ManagerName: ManagerName });
}
else{
if(value.Manager.Title != null){
ManagerName = value.Manager.Title;
this.setState({ ManagerName: ManagerName });
}
else{
ManagerName = "";
this.setState({ ManagerName: ManagerName });
}}
}
if (value.Team != null) {
if (value.Team.Team != null) {
this.setState({ Team: value.Team.Team });
}
}
if (value.Role != null) {
if (value.Role.Role != null) {
this.setState({ Role: value.Role.Role });
}
}
if (value.StartDate != null) {
let date = new Date(value.StartDate);
sd = date.toLocaleDateString();
this.setState({ StartDate: sd });
}
this.setState({ UserType: value.UserType, UserDetailsId: value.ID });
});
this.setState({ userdetailspopup: true }, () => { TemplateAssignAction.getBlastoffs(this.state.siteUrl, this.state.currentContext, this.state.UserType, this.state.Role); });
}

public handleRadio = (value, index, event) => {
let blastoffradio = this.state.blastoffstatus;
let loopinradio = this.state.loopinstatus;
let temptype = this.state.temptype;
let blastoffAssigned = this.state.BlastoffAssigned;
let loopinAssigned = this.state.LoopInAssigned;
let blastoffs = this.state.Blastoff;
let loopins = this.state.Loopin;
if (value == "blastoff") {
blastoffradio.splice(index, 1, "Active");
loopinradio.splice(index, 1, "");
temptype.splice(index, 1, "Blastoff");
if (loopinAssigned[index].length > 0) {
loopins.push(loopinAssigned[index][0]);
loopinAssigned.splice(index, 1, []);
}
this.setState({ LoopInAssigned: loopinAssigned, Loopin: loopins });
this.setState({ blastoffstatus: blastoffradio, loopinstatus: loopinradio, temptype: temptype });
}
else {
blastoffradio.splice(index, 1, "");
loopinradio.splice(index, 1, "InActive");
temptype.splice(index, 1, "LoopIn");
if (blastoffAssigned[index].length > 0) {
blastoffs.push(blastoffAssigned[index][0]);
blastoffAssigned.splice(index, 1, []);
}
this.setState({ BlastoffAssigned: blastoffAssigned, Blastoff: blastoffs });
this.setState({ blastoffstatus: blastoffradio, loopinstatus: loopinradio, temptype: temptype });
}
}

public setTypeahead1 = (index, Blastoff) => {
if (Blastoff.length > 0) {
let blastoffs = this.state.Blastoff;
let blastoffAssigned = this.state.BlastoffAssigned;
blastoffAssigned.splice(index, 1, Blastoff);
blastoffs.map((value, blastoffindex) => {
if (value.TemplateName == Blastoff[0].TemplateName) {
blastoffs.splice(blastoffindex, 1, { ID: Blastoff[0].ID, TemplateName: "" });
}
});
this.setState({ EmptyErrorMsg: "" });
this.setState({ BlastoffAssigned: blastoffAssigned, Blastoff: blastoffs });
}
else {
let blastoffs = this.state.Blastoff;
let blastoffAssigned = this.state.BlastoffAssigned;
blastoffs.splice(index, 1, blastoffAssigned[index][0]);
blastoffAssigned.splice(index, 1, Blastoff);
this.setState({ Blastoff: blastoffs, BlastoffAssigned: blastoffAssigned });
}
}

public setTypeahead2 = (index, LoopIn) => {
if (LoopIn.length > 0) {
let loopins = this.state.Loopin;
let loopinAssigned = this.state.LoopInAssigned;
loopinAssigned.splice(index, 1, LoopIn);
loopins.map((value, loopinindex) => {
if (value.TemplateName == LoopIn[0].TemplateName) {
loopins.splice(loopinindex, 1, { ID: LoopIn[0].ID, TemplateName: "" });
}
});
this.setState({ EmptyErrorMsg: "" });
this.setState({ LoopInAssigned: loopinAssigned, Loopin: loopins });
}
else {
let loopins = this.state.Loopin;
let loopinAssigned = this.state.LoopInAssigned;
loopins.splice(index, 1, loopinAssigned[index][0])
loopinAssigned.splice(index, 1, LoopIn);
this.setState({ Loopin: loopins, LoopInAssigned: loopinAssigned });
}
}

public addTemplates = () => {
let array = this.state.templateassignvalue;
let bradiostatus = this.state.blastoffstatus;
let lradiostatus = this.state.loopinstatus;
let temptype = this.state.temptype;
let blastoffAssigned = this.state.BlastoffAssigned;
let loopinAssigned = this.state.LoopInAssigned;
let addlimit = this.state.templateassignvalue.length;
if (addlimit < 10) {
array.push("temp");
bradiostatus.push("Active");
lradiostatus.push("");
temptype.push("Blastoff");
blastoffAssigned.push([]);
loopinAssigned.push([]);
this.setState({ templateassignvalue: array, blastoffstatus: bradiostatus, loopinstatus: lradiostatus, temptype: temptype, BlastoffAssigned: blastoffAssigned, LoopInAssigned: loopinAssigned });
}
else {
this.setState({ addlimit: false });
}
}

public delete = (index, event) => {
let array = this.state.templateassignvalue;
let bradiostatus = this.state.blastoffstatus;
let lradiostatus = this.state.loopinstatus;
let temptype = this.state.temptype;
let blastoffAssigned = this.state.BlastoffAssigned;
let loopinAssigned = this.state.LoopInAssigned;
let blastoffs = this.state.Blastoff;
let loopins = this.state.Loopin;
array.splice(index, 1);
bradiostatus.splice(index, 1);
lradiostatus.splice(index, 1);
temptype.splice(index, 1);
if (blastoffAssigned[index].length > 0) {
let flag = 0;
blastoffs.map((value1, index1) => {
if (blastoffAssigned[index][0].ID == value1.ID && flag == 0) {
debugger;
flag = 1;
blastoffs.splice(index1, 1, blastoffAssigned[index][0]);
}});
}
if (loopinAssigned[index].length > 0) {
let flag = 0;
loopins.map((value1, index1) => {
if (loopinAssigned[index][0].ID == value1.ID && flag == 0) {
flag = 1;
loopins.splice(index, 1, loopinAssigned[index][0]);
}});
}
blastoffAssigned.splice(index, 1);
loopinAssigned.splice(index, 1);
this.setState({ EmptyErrorMsg: "", templateassignvalue: array, blastoffstatus: bradiostatus, loopinstatus: lradiostatus, temptype: temptype, Blastoff: blastoffs, Loopin: loopins, BlastoffAssigned: blastoffAssigned, LoopInAssigned: loopinAssigned });
}

public bindTemplates = () => {
return this.state.templateassignvalue.map((value, index) => {
let label = "exampleFormControlInput" + index;
let label1 = "selecttemp" + index;
let name = "optradio" + index;
let bradiostatus = this.state.blastoffstatus;
let lradiostatus = this.state.loopinstatus;
let temptype = this.state.temptype;
return (
<div className="w-100 col-md-12 col-sm-12 mt-3 mb-2 float-left">
{(this.state.editId != "" && this.state.UserName != "")|| (this.state.editId =="") ?
<div className="col-md-6 col- mt-4 mb-3 float-left">
<div className="form-group form-padding-prop col-gray radio-pad">
<label htmlFor={label}>Template Type</label>
<div className="radio mt-2">
<label>
<input
type="radio"
className="mr-2"
name={name}
defaultValue="blastoffs"
disabled={this.state.TemplateAssignStatus}
defaultChecked={true}
checked={bradiostatus[index] == "Active" ? true : false}
onClick={this.handleRadio.bind(event, "blastoff", index)}/>
<span className="mr-5">Blastoffs</span></label>
<label>
<input
type="radio"
className="ml-5 mr-2"
name={name}
defaultValue="Loopins"
disabled={this.state.TemplateAssignStatus}
checked={lradiostatus[index] == "InActive" ? true : false}
onClick={this.handleRadio.bind(event, "loopin", index)}/>Loopins</label>
</div>
</div>
</div>: null}
{(this.state.editId != "" && this.state.UserName != "")|| (this.state.editId =="") ?
<div className="col-md-6 col- mt-4  float-left" id="div2">
<div className="form-group col-gray form-padding-prop">
<label htmlFor={label1}>{temptype[index]}</label>{temptype[index] == "Blastoff" ?
<Typeahead
clearButton
className="d-image"
onChange={this.setTypeahead1.bind(this, index)}
options={this.state.Blastoff}
disabled={this.state.TemplateAssignStatus}
placeholder="Select Blastoff"
maxResults={5}
labelKey="TemplateName"
selected={this.state.BlastoffAssigned[index]}
minLength='1'/>:
<Typeahead
clearButton
className="d-image"
onChange={this.setTypeahead2.bind(this, index)}
options={this.state.Loopin}
disabled={this.state.TemplateAssignStatus}
placeholder="Select LoopIn"
maxResults={5}
labelKey="TemplateName"
selected={this.state.LoopInAssigned[index]}
minLength='1'/>}
<a href="#" className={this.state.TemplateAssignStatus == true ||this.state.templateassignvalue.length == 1 ? "delete-icon" : ""} onClick={this.delete.bind(this, index)}>
<img src={deleteicon} /></a>
</div>
</div>: null}
</div>
);});
}

public handleComments = (event) => {
this.setState({ Comments: event.target.value });
}

public editClick = () => {
this.setState({ TemplateAssignStatus: false });
}

public assignData = () => {
this.state.userDetails.map((value, index) => {
if (this.props.callfrom == "todo") {
this.setState({
UserName: [value.Email],
UserMail: value.Email.Email
});
this.getUserDetails(value.Email.Email);
}
else if (this.props.callfrom == "schedule") {
this.setState({
UserName: [value.UserName],
UserMail: value.Email
});
this.getUserDetails(value.Email);
}
if (this.props.callfrom == "todo" && value.Comments != null) {
this.setState({ Comments: value.Comments });
}});
}

public assignBL = () => {
let blastoff = [];
let loopin = [];
let templateassignvalue = [];
let bstatus = [];
let lstatus = [];
let temptype = [];
let blastoffs = this.state.Blastoff;
let loopins = this.state.Loopin;
let BlastoffTemp;
let LoopInTemp;
let usertodoassign = this.state.userDetails;
this.setState({ Blastoff: blastoffs, Loopin: loopins });
usertodoassign.map((value, index) => {
BlastoffTemp = value.BlastoffTemp;
LoopInTemp = value.LoopInTemp;
if (BlastoffTemp.length == 0 && LoopInTemp.length == 0) {
templateassignvalue.push("temp");
bstatus.push("Active");
lstatus.push("");
blastoff.push([]);
loopin.push([]);
temptype.push("Blastoff");
}
BlastoffTemp.map((bvalue, bindex) => {
templateassignvalue.push("temp");
bstatus.push("Active");
lstatus.push("");
blastoffs.map((blastoffvalue, index) => {
if (bvalue.TemplateName == blastoffvalue.TemplateName) {
blastoff.push([blastoffvalue]);
}
});
loopin.push([]);
temptype.push("Blastoff");
});
LoopInTemp.map((lvalue, lindex) => {
templateassignvalue.push("temp");
lstatus.push("InActive");
bstatus.push("");
loopins.map((loopinvalue, index) => {
if (lvalue.TemplateName == loopinvalue.TemplateName) {
loopin.push([loopinvalue]);
}
});
blastoff.push([]);
temptype.push("LoopIn");
});
this.setState({ CBlastoff: BlastoffTemp, CLoopIn: LoopInTemp });
this.setState({ templateassignvalue: templateassignvalue });
this.setState({ loopinstatus: lstatus, blastoffstatus: bstatus });
this.setState({ temptype: temptype });
this.setState({ BlastoffAssigned: blastoff }, () => { this.removeblastoffs(); });
this.setState({ LoopInAssigned: loopin }, () => { this.removeloopins(); });
});
this.setState({ userdetailspopup: true, TemplateAssignStatus: false });
if (this.state.evstate == "view") {
this.setState({ TemplateAssignStatus: true });
}
}

public removeblastoffs = () => {
let blastoff = this.state.BlastoffAssigned;
let blastoffs = this.state.Blastoff;
blastoff.map((bvalue, bindex) => {
blastoffs.map((value, index) => {
if (bvalue.length != 0) {
if (bvalue[0].TemplateName == value.TemplateName) {
blastoffs.splice(index, 1, { ID: value.ID, TemplateName: "" });
}}});});
this.setState({ Blastoff: blastoffs });
}

public removeloopins = () => {
let loopin = this.state.LoopInAssigned;
let loopins = this.state.Loopin;
loopin.map((lvalue, lindex) => {
loopins.map((value, index) => {
if (lvalue.length != 0) {
if (lvalue[0].TemplateName == value.TemplateName) {
loopins.splice(index, 1, { ID: value.ID, TemplateName: "" });
}}});});
this.setState({ Loopin: loopins });
};

public empty = () => {
if (this.state.EmptyErrorMsg.length != 0) {
return (
<span className="form-placeholder-font-size w-100 errormsg1 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.EmptyErrorMsg}</span>
);}
}

public savetodo = (e) => {
e.preventDefault();
let blastoffAssigned = this.state.BlastoffAssigned;
let loopinAssigned = this.state.LoopInAssigned;
let blastoff = this.state.BlastoffAssigned;
let loopin = this.state.LoopInAssigned;
let errormsg = "", flag = 0;
if (this.state.templateassignvalue.length > 1) {
blastoff.map((bvalue, bindex) => {
loopin.map((lvalue, lindex) => {
if (bindex == lindex && (bvalue.length == 0 && lvalue.length == 0)) {
if (flag == 0) {
flag = 1;
errormsg = "Please Type in a value at position " + (lindex + 1);
}}});});
}
else {
errormsg = "";
}
this.setState({ EmptyErrorMsg: errormsg });
let array = [], array1 = this.state.PostBlastoff, array2 = this.state.PostLoopIn;
blastoffAssigned.map((value, index) => {
if (value.length > 0) {
array1.push(value[0].ID);
}
});
loopinAssigned.map((value, index) => {
if (value.length > 0) {
array2.push(value[0].ID);
}
});
if (this.state.editId == "") {
if (this.state.UserName.length > 0 && errormsg == "") {
this.setState({ scheduleState: false, disableusername: true, TemplateAssignStatus: true });
array.push(this.state.UserId);
array.push(array1)
array.push(array2);
array.push(this.state.UserDetailsId);
array.push(this.state.Comments);
TemplateAssignAction.postTodo(this.state.siteUrl, this.state.currentContext, array);
}
else {
this.setState({ UserNameErrorMsg: "Please Enter the UserName" });
}
}
else {
TemplateAssignAction.updateTodo(this.state.siteUrl, this.state.currentContext, this.state);
}
}

public saveschedule = (e) => {
e.preventDefault();
if (this.state.UserName.length > 0) {
let blastoff = this.state.BlastoffAssigned;
let loopin = this.state.LoopInAssigned;
let errormsg = "", flag = 0;
blastoff.map((bvalue, bindex) => {
loopin.map((lvalue, lindex) => {
if (bindex == lindex && (bvalue.length == 0 && lvalue.length == 0)) {
if (flag == 0) {
flag = 1;
errormsg = "Please Type in a value at position " + (lindex + 1);
}}});
});
this.setState({ EmptyErrorMsg: errormsg });
if (errormsg == "" && this.state.UserNameErrorMsg == "") {
this.setState({ scheduleState: false, disableusername: true, TemplateAssignStatus: true });
let blastoffAssigned = this.state.BlastoffAssigned;
let loopinAssigned = this.state.LoopInAssigned;
let array1 = this.state.PostBlastoff;
let array2 = this.state.PostLoopIn;
let array3 = this.state.SUserDetails;
let array4 = this.state.SUserDetails1;
let array15 = [], array16 = [];
if (this.state.editId == "") {
blastoffAssigned.map((value, index) => {
if (value.length > 0) {
array1.push(value[0].ID);
}
});
loopinAssigned.map((value, index) => {
if (value.length > 0) {
array2.push(value[0].ID);
}});
}
else {
let cblastoff = this.state.CBlastoff;
let btemplates = this.state.Blastoff;
let cloopin = this.state.CLoopIn;
let ltemplates = this.state.Loopin;
let updateCount = this.state.updateCount;
let array5 = [], array6 = [], array7 = [], array8 = [], array9 = [], array10 = [], array11 = [], array12 = [], array13 = [], array14 = [];
blastoffAssigned.map((value, index) => {
if (value.length > 0) {
array5.push(value[0].TemplateName);
array15.push(value[0].ID);
}
});
loopinAssigned.map((value, index) => {
if (value.length > 0) {
array6.push(value[0].TemplateName);
array16.push(value[0].ID);
}
});
cblastoff.map((value, index) => {
array7.push(value.TemplateName);
});
cloopin.map((value, index) => {
array8.push(value.TemplateName);
});
array5.map((value, index) => {
let i = array7.indexOf(value);
if (i == -1) {
array9.push(value);
}
else {
array11.push(value);
}
});
array6.map((value, index) => {
let i = array8.indexOf(value);
if (i == -1) {
array10.push(value);
}
else {
array12.push(value);
}
});
blastoffAssigned.map((bvalue, bindex) => {
array9.map((value, index) => {
if (bvalue.length > 0 && bvalue[0].TemplateName == value) {
array1.push(bvalue[0].ID);
}});
});
loopinAssigned.map((lvalue, lindex) => {
array10.map((value, index) => {
if (lvalue.length > 0 && lvalue[0].TemplateName == value) {
array2.push(lvalue[0].ID);
}});
});
array11.map((value, index) => {
cblastoff.map((cvalue, cindex) => {
if (cvalue.TemplateName == value) {
cblastoff.splice(cindex, 1);
}});
});
array12.map((value, index) => {
cloopin.map((cvalue, cindex) => {
if (cvalue.TemplateName == value) {
cloopin.splice(cindex, 1);
}});
});
if (cblastoff.length > 0) {
cblastoff.map((value, index) => {
btemplates.map((bvalue, bindex) => {
if (bvalue.TemplateName == value.TemplateName) {
array13.push(bvalue.ID);
}});});
}
if (cloopin.length > 0) {
cloopin.map((value, index) => {
ltemplates.map((lvalue, lindex) => {
if (lvalue.TemplateName == value.TemplateName) {
array14.push(lvalue.ID);
}});});
}
if (array13.length > 0) {
updateCount += 1;
}
if (array14.length > 0) {
updateCount += 1;
}
if (array13.length > 0) {
this.setState({ UBlastoffAssigned: array15, ULoopInAssigned: array16, DelBEntries: array13, updateCount }, () => { TemplateAssignAction.updateSchedule(this.state.siteUrl, this.state.currentContext, this.state.DelBEntries, this.state); });
}
if (array14.length > 0) {
this.setState({ UBlastoffAssigned: array15, ULoopInAssigned: array16, DelLEntries: array14, updateCount }, () => { TemplateAssignAction.updateSchedule(this.state.siteUrl, this.state.currentContext, this.state.DelLEntries, this.state); });
}
}
if (array1.length > 0) {
if (this.state.UserType == "Manager") {
this.setState({ UBlastoffAssigned: array15, PostBlastoff: array1, SUserDetails: this.state.UserDetails[0] }, () => { TemplateAssignAction.getManagerAssignedDetails(this.state.siteUrl, this.state.currentContext, this.state.UserMail, "form"); });
}
else if (this.state.UserType == "New Hire") {
this.state.UserDetails.map((value, index) => {
let managername = "", team = "", role = "";
if (value.Manager != null ) {
if (value.Manager.FirstName != null) {
managername = value.Manager.FirstName;
if (value.Manager.LastName != null) {
managername += value.Manager.LastName;
}
this.setState({ ManagerName: managername });
}
else{
if(value.Manager.Title != null){
managername = value.Manager.Title;
this.setState({ ManagerName: managername });
}
else{
managername="";
this.setState({ ManagerName: managername });
}}
}
if (value.Team != null) {
if (value.Team.Team != null) {
team = value.Team.Team;
}
}
if (value.Role != null) {
if (value.Role.Role != null) {
role = value.Role.Role;
}
}
array3.push([]);
array3[0].push(value.User.ID);
array3[0].push(value.Id);
array3[0].push(value.StartDate);
array3[0].push(value.UserName);
array3[0].push(managername)
array3[0].push(team);
array3[0].push(role);
});
this.setState({ UserDetails: array3, PostBlastoff: array1 }, () => { TemplateAssignAction.getBlastoffTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostBlastoff, "form"); });
}
}
if (array2.length > 0) {
this.state.UserDetails.map((value, index) => {
let managername = "", team = "", role = "";
if (value.Manager != null ) {
if (value.Manager.FirstName != null) {
managername = value.Manager.FirstName;
if (value.Manager.LastName != null) {
managername += value.Manager.LastName;
}
this.setState({ ManagerName: managername });
}
else{
if(value.Manager.Title != null){
managername = value.Manager.Title;
this.setState({ ManagerName: managername });
}
else{
managername="";
this.setState({ ManagerName: managername });
}}
}
if (value.Team != null) {
if (value.Team.Team != null) {
team = value.Team.Team;
}
}
if (value.Role != null) {
if (value.Role.Role != null) {
role = value.Role.Role;
}
}
array4.push([]);
array4[0].push(value.User.ID);
array4[0].push(value.Id);
array4[0].push(value.StartDate);
array4[0].push(value.UserName);
array4[0].push(managername);
array4[0].push(team);
array4[0].push(role);
});
this.setState({ SUserDetails1: array4, PostLoopIn: array2 }, () => { TemplateAssignAction.getLoopInTempDetails(this.state.siteUrl, this.state.currentContext, this.state.PostLoopIn, "form"); });
}}
}
else {
this.setState({ UserNameErrorMsg: "Please Enter the UserName" });
}
}

public cancel = () => {
this.setState({ Blastoff: [], Loopin: [], scheduleState: true, BlastoffAssigned: [], LoopInAssigned: [], Comments: "", UserName: [] });
if (this.props.callfrom == "todo") {
this.props.callback("grid", "", "");
}
else if (this.props.callfrom == "schedule") {
this.props.callback("grid", '', '');
}
}

/** render method will have the static HTML DOM*/
public render(): React.ReactElement<IRocketAppProps> {
return (
<div className="col-md-12 col- float-left pad-0 p-5">
<div className="float-left w-100 mb-3 user-config-heading-resp headerspacing">
<a href="#" className={!this.state.scheduleState ? "actions-cursor not-active" : "actions-cursor"} onClick={this.cancel.bind(this)}>
<img className="mt-1 back-arrow-resp mr-3 float-left" src={userdrillback} /></a>
{this.props.callfrom == "schedule" ?
<h6 className="table-header">New Onboarding</h6> : <h6 className="table-header">New Onboarding Todo</h6>}
{this.state.evstate == "view" && this.state.TemplateAssignStatus == true ?
<button type="button" className="float-right user-config-create-button button-mr-prop" onClick={this.editClick.bind(this)}>
<img className="mr-2" src={pen} />Edit</button> : null}
</div>
<form>
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group form-padding-prop col-gray">
<label htmlFor="selectusername">User Name </label>
<Typeahead
clearButton
className="w-100 mt-2"
onChange={this.setTypeahead.bind(this)}
options={this.state.UserConfigList}
disabled={this.state.disableusername}
placeholder="Select UserName"
labelKey="UserName"
maxResults={5}
selected={this.state.UserName}
minLength='1'
renderMenuItemChildren={this.renderTypeaheadItems}/>
</div>
</div>
{this.state.UserNameErrorMsg != "" ? <span className="float-left form-placeholder-font-size errormsg1 w-100 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.UserNameErrorMsg}</span> : null}
{this.state.userdetailspopup ?
<div className="col-md-6 col- mt-4 float-left manager-spacing-form">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="selectmanager">Manager</label>
<input
type="text"
value={this.state.ManagerName}
disabled={true}
placeholder="Select Manager"
className="form-control form-placeholder-font-size tag-spacing"/>
</div>
</div> : null}
{this.state.userdetailspopup ?
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="startdate">Start Date</label>
<input
type="text"
value={this.state.StartDate}
disabled={true}
placeholder="Select StartDate"
className="form-control form-placeholder-font-size tag-spacing"/>
</div>
</div> : null}
{this.state.userdetailspopup ?
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="selectteam">Team</label>
<input
type="text"
value={this.state.Team}
disabled={true}
placeholder="Select Team"
className="form-control form-placeholder-font-size team-spacing"/>
</div>
</div> : null}
{this.state.userdetailspopup ?
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="selectrole">Role</label>
<input
type="text"
value={this.state.Role}
disabled={true}
placeholder="Select Role"
className="form-control form-placeholder-font-size tag-spacing"/>
</div>
</div> : null}
{this.state.userdetailspopup ?
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="selectrole">UserType</label>
<input
type="text"
value={this.state.UserType}
disabled={true}
placeholder="Select UserType"
className="form-control form-placeholder-font-size tag-spacing"/>
</div>
</div> : null}
<div className="w-100 col-md-12 col-sm-12 mt-3 mb-2 float-left">
<h6 className="table-header page-heading-rep float-left form-padding-prop">
Templates <img src={info} className="ml-2" /></h6>
{this.state.addlimit ?
<button
type="button"
className="btn btn-info add-btn-mar-prop float-right"
disabled={this.state.TemplateAssignStatus}
onClick={this.addTemplates.bind(this)}>
<img src={addicon} /></button> : null}
</div>
{this.bindTemplates()}
{this.empty()}
<div className="col-md-12 col- mt-5 col-gray float-left">
{this.props.callfrom == "todo" ?
<div className=" col-md-6 form-group form-padding-prop">
<label htmlFor="exampleFormControlTextarea1">Comments</label>
<textarea
value={this.state.Comments}
onChange={this.handleComments.bind(this)}
className="form-control border-prop-text-area form-placeholder-font-size resize-none"
id="exampleFormControlTextarea1"
disabled={this.state.TemplateAssignStatus}
placeholder="Enter Comments"
defaultValue={""}
rows={3}/>
</div> : null}
</div>
<div className="col-md-12 col- mt-5 mb-5 col-gray float-left w-100">
{(this.state.editId == "") || (this.state.editId != "" && this.state.evstate == "view" && !this.state.TemplateAssignStatus)
|| (this.state.editId != "" && this.state.evstate == "edit" && !this.state.TemplateAssignStatus) ?
this.state.scheduleState ?
<button type="button" className="float-right user-config-create-button todo-schedule-button  mar-0" onClick={this.saveschedule.bind(this)}>
<img src={sche} className="mr-2" />Schedule</button> : <div className="float-right loader"></div>: null}
{this.props.callfrom == "todo" && ((this.state.editId == "") || (this.state.editId != "" && this.state.evstate == "view" && !this.state.TemplateAssignStatus)
|| (this.state.editId != "" && this.state.evstate == "edit" && !this.state.TemplateAssignStatus)) ?
this.state.scheduleState ?
<button type="button" className="float-right user-config-create-button mr-3 mar-0" onClick={this.savetodo.bind(this)}>
<img src={bookmark} className="mr-2" />Save for Late</button> : null : null}
{this.state.scheduleState ?
<button type="button" className="float-right mr-3 user-config-cancel-button mar-0" onClick={this.cancel.bind(this)}Cancel</button> : null}
</div>
</form>
</div>
);}
}
