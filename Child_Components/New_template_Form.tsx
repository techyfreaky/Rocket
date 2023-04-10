/**[Ref] - Denotes Pseudo Code Reference
* This Component is New Progress Form
* App Name: Rocket
* Author: Giftson
* Created Date: 06/22/2020*/
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Typeahead } from 'react-bootstrap-typeahead';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import Moment from 'react-moment';
import * as NewTemplateAction from '../Action/New_Template_Action';
import NewTemplateStore from '../Store/New_Template_Store';
import * as BlastoffAction from '../Action/Blastoff_Action';
import * as LooinAction from '../Action/Loopin_Action';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../css/commontheme.css';
import '../css/style.css';
import { weekdays } from 'moment';

const upload: string = require('../images/upload.svg');
const drop: string = require('../images/accordion-dropdown.png');
const docdel: string = require('../images/doc-del.svg');
const file: string = require('../images/file.svg');
const info: string = require('../images/i-icon.svg');
const back: string = require('../images/user-drill-back-image.svg');
const pen: string = require('../images/pen.png');

export interface NewTemplateFormProps {
context: WebPartContext;
userType: any;
templateType: any;
formMode: any;
editID: any;
callback: any;
}

export interface NewTemplateFormStates {
currentContext: any;
currentTab: any;
formMode: any;
editID: any;
tempName: any;
tempDesc: string;
siteURL: any;
templateType: any;
userType: any;
roleArray: any[];
tempRole: any;
loopinImage: any;
errorTempName: any;
errorLoopinImage: any;
tempUsage: any;
scheduleType: any;
time: any;
startdateType: any;
noofDaysSingle: any;
noofDaysMonthly: any;
noofWeeksMonthly: any;
messageType: any;
placeholder: any;
weekdays: any;
monthlyRep: any;
breakpointDaily: any;
breakpointWeekly: any;
breakpointMonthly: any;
yearlyDate: any;
convertedDate: any;
errorSecondLevel: any;
tempMsg: string;
documentFiles: any;
errorFile: any;
pollSize: any;
pollVal: any;
errorThirdLevel: any;
documentName: any;
tempRoleId: any;
successTempPost: any;
successTempDelete: any;
successPollPost: any;
successLoopImgPost: any;
successDocPost: any;
docLength: any;
}

export default class NewTemplateForm extends React.Component<NewTemplateFormProps, NewTemplateFormStates>{
constructor(props) {
super(props);
this.state = {
currentContext: this.props.context,
currentTab: 1,
formMode: this.props.formMode,
editID: this.props.editID,
tempName: "",
tempDesc: "",
templateType: this.props.templateType,
userType: this.props.userType,
siteURL: this.props.context.pageContext.web.absoluteUrl,
roleArray: [],
tempRole: [],
loopinImage: null,
errorTempName: "",
errorLoopinImage: "",
tempUsage: "Single",
scheduleType: "Daily",
time: "09",
startdateType: "Before",
noofDaysSingle: 7,
noofDaysMonthly: 1,
noofWeeksMonthly: 1,
breakpointDaily: 1,
breakpointWeekly: 7,
breakpointMonthly: 30,
messageType: "Message",
placeholder: false,
weekdays: [],
monthlyRep: "Day",
yearlyDate: "",
convertedDate: "",
errorSecondLevel: "",
tempMsg: "",
documentFiles: [],
documentName: "",
errorFile: '',
pollSize: [1, 1],
pollVal: ["", "", "", "", "", ""],
errorThirdLevel: "",
tempRoleId: [],
successPollPost: false,
successTempDelete: false,
successTempPost: false,
successDocPost: false,
successLoopImgPost: false,
docLength: '',
}
};

componentWillMount() {
NewTemplateAction.getRole(this.state.siteURL, this.state.currentContext);
if (this.state.formMode != "create") {
NewTemplateAction.gettemplate(this.state.siteURL, this.state.currentContext, this.state.editID);
}
NewTemplateStore.on("tempDetails", this.loadTemp.bind(this));
NewTemplateStore.on("RoleDetails", this.loadRole.bind(this));
NewTemplateStore.on("tempName", this.checktempName.bind(this));
NewTemplateStore.on("pollDetails", this.loadPoll.bind(this));
NewTemplateStore.on("docDetails", this.loadDoc.bind(this));
NewTemplateStore.on("successTempDelete", this.successDelete.bind(this));
NewTemplateStore.on("postTemplate", this.successPost.bind(this));
NewTemplateStore.on("postPollSuccess", this.postPollSuccess.bind(this));
NewTemplateStore.on("postDoc", this.postDoc.bind(this));
NewTemplateStore.on("postLoopinImg", this.postLoopinImg.bind(this));
}

public loadRole = () => {
let role = NewTemplateStore.roleDetail;
let roleArray = [];
const result = role.map((value, index) => {
roleArray[index] = { Role: value.Role, Id: value.Id };
});
this.setState({ roleArray });
}

public loadTemp = () => {
let temp = NewTemplateStore.templateDetails[0];
let tempRole = [];
const result = temp.Role.map((value, index) => {
tempRole[index] = { Role: value.Role, Id: value.Id };
});
let tempdes;
if (temp.TemplateDescription == null)
tempdes = "";
else
tempdes = temp.TemplateDescription;
this.setState({ tempName: temp.TemplateName, tempDesc: tempdes, tempRole: tempRole, tempUsage: temp.TemplateUsage, messageType: temp.MessageType });
if (temp.TemplateUsage == "Single") {
this.setState({ noofDaysSingle: temp.NoOfDaysOrWeek, startdateType: temp.StartDateType, time: temp.Time });
}
else if (temp.TemplateUsage == "Multiple") {
if (temp.ScheduleType == "Daily") {
this.setState({ breakpointDaily: temp.BreakpointDays, scheduleType: temp.ScheduleType, time: temp.Time, startdateType: temp.StartDateType });
}
else if (temp.ScheduleType == "Weekly") {
this.setState({ breakpointWeekly: temp.BreakpointDays, scheduleType: temp.ScheduleType, time: temp.Time, startdateType: temp.StartDateType, weekdays: temp.WeekDaysId });
}
else if (temp.ScheduleType == "Monthly") {
if (temp.MonthlyRepitition == "Day") {
this.setState({ breakpointMonthly: temp.BreakpointDays, scheduleType: temp.ScheduleType, time: temp.Time, startdateType: temp.StartDateType, noofDaysMonthly: temp.NoOfDaysOrWeek, monthlyRep: temp.MonthlyRepitition });
}
else if (temp.MonthlyRepitition == "Week") {
this.setState({ breakpointMonthly: temp.BreakpointDays, scheduleType: temp.ScheduleType, time: temp.Time, startdateType: temp.StartDateType, noofWeeksMonthly: temp.NoOfDaysOrWeek, monthlyRep: temp.MonthlyRepitition, weekdays: temp.WeekDaysId });
}
}
else if (temp.ScheduleType == "Yearly") {
var date = new Date(temp.YearlyRepitition);
this.setState({ scheduleType: temp.ScheduleType, time: temp.Time, yearlyDate: date });
}
}
if (temp.MessageType == "Poll") {
this.setState({ tempMsg: "" });
NewTemplateAction.getPoll(this.state.siteURL, this.state.currentContext, this.state.editID);
}
else if (temp.MessageType == "Document") {
var file = temp.DocumentName;
file = file.split(":");
NewTemplateAction.getDocument(this.state.siteURL, this.state.currentContext, file);
this.setState({ tempMsg: temp.MessageContent, docLength: file.length });
}
else if (temp.MessageType == "Message") {
this.setState({ tempMsg: temp.MessageContent });
}
}

public loadPoll = () => {
let poll = NewTemplateStore.pollDetails;
let pollVal = this.state.pollVal;
let pollSize = [];
const result = poll.map((value, index) => {
pollVal[value.PollOrder] = value.PollValue;
if (value.PollOrder != 0) {
pollSize.push(1);
}
});
this.setState({ pollVal, pollSize });
}

public loadDoc = () => {
let sameName=false;
if (this.state.docLength > this.state.documentFiles.length) {
let documentFiles = this.state.documentFiles;
const samp = documentFiles.map((value, type) => {
if (value.name == NewTemplateStore.docDetails.name) {
sameName = true;
}
});
if(sameName==false){
documentFiles.push(NewTemplateStore.docDetails);
this.setState({ documentFiles });
}}
}

public uploadFile = (event) => {
let documentFiles = this.state.documentFiles;
let errorFile = "";
let uploadFile = event.target.files[0];
let sameName = false;
let uploadFileType = uploadFile.name.split(".");
if (documentFiles.length < 5) {
let fileTypeindex = uploadFileType.length - 1;
if (uploadFileType[fileTypeindex] == "pdf" || uploadFileType[fileTypeindex] == "docx" || uploadFileType[fileTypeindex] == "doc") {
if (event.target.files[0].size < 10000000) {
if (documentFiles.length != 0) {
const samp = documentFiles.map((value, type) => {
if (value.name == uploadFile.name) {
sameName = true;
errorFile = "File with the same name already exists";
}});
}
if (sameName == false) {
documentFiles.push(event.target.files[0]);
if(this.state.errorThirdLevel=="Please Upload A File"){
this.setState({errorThirdLevel:""});
}}
}
else {
errorFile = "File Size Should Be Lesser Than 10MB";
}
}
else {
errorFile = "File Should Be Of Type .pdf or .docx";
}
}
this.setState({ documentFiles, errorFile });
}

public handleChange = (event) => {
let state = this.state;
if (event.target.name == "loopinImage") {
state[event.target.name] = event.target.files[0];
}
else if (event.target.name == "weekdays") {
if (event.target.checked) {
let weekdays = this.state.weekdays;
let weekday = event.target.value;
weekday = parseInt(weekday);
weekdays.push(weekday);
this.setState({ weekdays });
}
else {
let weekdays = this.state.weekdays;
let weekday = event.target.value;
weekday = parseInt(weekday);
var index = state["weekdays"].indexOf(weekday);
if (index != -1)
weekdays.splice(index, 1);
this.setState({ weekdays });
}
}
else if (event.target.name == "messageType") {
this.setState({ errorThirdLevel: "" });
state[event.target.name] = event.target.value;
}
else {
state[event.target.name] = event.target.value;
}
this.setState(state);
}

public valFirstLevel = () => {
let errorTempName = "", errorLoopinImage = "";
var regex = /^[A-Za-z ]+$/;
if (this.state.tempName == "") {
errorTempName = "Please Enter The Template Name";
}
else {
if (!(regex.test(this.state.tempName))) {
errorTempName = "Template Name Accepts Only Alphabets";
}
}
if (this.state.templateType == "LoopIn") {
if (this.state.loopinImage != null) {
var fileType = this.state.loopinImage.type.split("/");
if (fileType[1] != "png" && fileType[1] != "jpeg") {
errorLoopinImage = "File Should Be Of Type .png Or .jpg";
}
else if (this.state.loopinImage.size > 250000) {
errorLoopinImage = "Image Size Should Not Exceed 250kB";
}
}
else {
errorLoopinImage = "Please Upload The Image";
}
}
if (errorLoopinImage == "" && errorTempName == "") {
this.setState({ errorLoopinImage, errorTempName }, () => {
NewTemplateAction.gettempName(this.state.siteURL, this.state.currentContext, this.state.tempName);
});
}
else {
this.setState({ errorLoopinImage, errorTempName });
}
}

public checktempName = () => {
let templateName = NewTemplateStore.templateName;
if (templateName.length != 0) {
this.setState({ errorTempName: "Template Name Already Exists" });
}
else {
this.setState({ currentTab: 2 });
}
}

public handleDateChange = (dateSelected, dateType) => {
let state = this.state;
state[dateType] = dateSelected;
this.setState(state);
this.convertDate(dateSelected);
}

public convertDate = (dateSelected) => {
var date = new Date(dateSelected),
mnth = ("0" + (date.getMonth() + 1)).slice(-2),
day = ("0" + date.getDate()).slice(-2);
let conv = [date.getFullYear(), mnth, day].join("-") + "T08:00:00Z";
conv = "'" + conv + "'";
this.setState({ convertedDate: conv.toString() });
}

public valSecondLevel = () => {
let errorSecondLevel = "";
if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Weekly" && this.state.weekdays.length == 0) {
errorSecondLevel = "Select Any Weekday";
}
else if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Monthly" && this.state.monthlyRep == "Week" && this.state.weekdays.length == 0) {
errorSecondLevel = "Select Any Weekday";
}
else if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Yearly" && this.state.yearlyDate == "") {
errorSecondLevel = "Select A Date";

if (errorSecondLevel == "") {
this.setState({ currentTab: 3, errorSecondLevel });
}
else {
this.setState({ errorSecondLevel });
}
}

public addPoll = () => {
let pollSize = this.state.pollSize;
if (pollSize.length < 5) {
pollSize.push(1);
}
this.setState({ pollSize });
}

public populatePoll = () => {
return this.state.pollSize.map((value, index) => {
return (
<div className={(this.state.formMode == "edit") || (this.state.formMode == "view") ? "form-group mt-4 col-gray form-padding-prop" : "form-group mt-4 col-gray"}>
<label className="form-label" htmlFor="temp-poll-answer1">Enter Choice {index + 1}{index > 1 ? (this.state.pollSize.length - 1) == index ? <img src={docdel} style={{ paddingLeft: 10 }} onClick={this.deletePoll.bind(this)} /> : null : null}</label>
<input disabled={this.state.formMode == "view" ? true : false} type="text" className="form-control form-placeholder-font-size" id="temp-poll-answer1" placeholder={"Enter choice " + (index + 1)} value={this.state.pollVal[index + 1]} onChange={this.addPollval.bind(this, index + 1)} />
</div>
);
});
}

public addPollval = (index, event) => {
let pollVal = this.state.pollVal;
pollVal[index] = event.target.value;
this.setState({ pollVal });
}

public deletePoll = () => {
let pollSize = this.state.pollSize;
pollSize.pop();
this.setState({ pollSize });
}

public deleteFile = (index, event) => {
if (this.state.formMode != "view") {
let documentFiles = this.state.documentFiles;
documentFiles.splice(index, 1);
this.setState({ documentFiles });
}
}

public placeholder = (placeholder, event) => {
let tempMsg = this.state.tempMsg;
tempMsg = tempMsg + placeholder;
if (tempMsg.length <= 255 && this.state.formMode != "view") {
this.setState({ tempMsg });
}
}

public fileGrid = () => {
return this.state.documentFiles.map((value, index) => {
return (
<tr className="table-content text-left">
<td className="pl-3"><img className="mr-2" src={file} />{value.name.length > 25 ? value.name.slice(0, 25) + "..." : value.name}</td>
<td className="pl-3 text-center">{Math.ceil(value.size / 1000)} kB</td>
<td className="text-center"><img src={docdel} onClick={this.deleteFile.bind(this, index)} /></td>
</tr>
);});
}

public cancel = () => {
if (this.props.templateType == "Blastoff") {
BlastoffAction.getNewUserGridData(this.state.siteURL, this.state.currentContext, "");
}
else if (this.props.templateType == "LoopIn") {
LooinAction.getLoopinGridData(this.state.siteURL, this.state.currentContext, "");
}
this.setState({roleArray: [],tempRole: [],loopinImage: null,errorTempName: "",errorLoopinImage: "",tempUsage: "Single",scheduleType: "Daily",time: "09",startdateType: "Before",noofDaysSingle: 7,
noofDaysMonthly: 1,noofWeeksMonthly: 1,breakpointDaily: 1,breakpointWeekly: 7,breakpointMonthly: 30,messageType: "Message",placeholder: false,weekdays: [],monthlyRep: "Day",yearlyDate: "",convertedDate: "",
errorSecondLevel: "",tempMsg: "",documentFiles: [],documentName: "",errorFile: '',pollSize: [1, 1],pollVal: ["", "", "", "", "", ""],errorThirdLevel: "",tempRoleId: [],successPollPost: false,successTempDelete: false,
successTempPost: false,successDocPost: false,successLoopImgPost: false,docLength: '',currentTab: 1,tempName: "",tempDesc: ""});
this.props.callback("grid", "", "", "", "");
}

public valEditForm = () => {
let errorSecondLevel = "";
if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Weekly" && this.state.weekdays.length == 0) {
errorSecondLevel = "Select Any Weekday";
}
else if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Monthly" && this.state.monthlyRep == "Week" && this.state.weekdays.length == 0) {
errorSecondLevel = "Select Any Weekday";
}
else if (this.state.tempUsage == "Multiple" && this.state.scheduleType == "Yearly" && this.state.yearlyDate == "") {
errorSecondLevel = "Select A Date";
}
if (errorSecondLevel == "") {
this.setState({ errorSecondLevel }, () => { this.valThirdLevel() });
}
else {
this.setState({ errorSecondLevel });
}
}

public successPost = () => {
this.setState({ successTempPost: true }, () => { this.cancelBack(); });
}

public postPollSuccess = () => {
this.setState({ successPollPost: true }, () => { this.cancelBack(); });
}

public postDoc = () => {
this.setState({ successDocPost: true }, () => { this.cancelBack(); });
}

public postLoopinImg = () => {
this.setState({ successLoopImgPost: true }, () => { this.cancelBack(); });
}

public successDelete = () => {
this.setState({ successTempDelete: true }, () => { this.cancelBack(); });
}

public cancelBack = () => {
if (this.state.formMode == "create" && this.state.successTempPost) {
if (this.state.templateType != 'LoopIn') {
if (this.state.messageType == "Message")
this.cancel();
else if (this.state.messageType == "Poll" && this.state.successPollPost)
this.cancel();
else if (this.state.messageType == "Document" && this.state.successDocPost)
this.cancel();
}
else {
if (this.state.messageType == "Message" && this.state.successLoopImgPost)
this.cancel();
else if (this.state.messageType == "Poll" && this.state.successPollPost && this.state.successLoopImgPost)
this.cancel();
else if (this.state.messageType == "Document" && this.state.successDocPost && this.state.successLoopImgPost)
this.cancel();
}
}
else {
if (this.state.successTempPost) {
if (this.state.messageType == "Message")
this.cancel();
else if (this.state.messageType == "Poll" && this.state.successPollPost && this.state.successTempDelete)
this.cancel();
else if (this.state.messageType == "Document" && this.state.successDocPost && this.state.successTempDelete)
this.cancel();
}}
}

public valThirdLevel = () => {
let flag = 0;
let errorThirdLevel = "";
if (this.state.messageType == "Message") {
if (this.state.tempMsg == "") {
errorThirdLevel = "Please Enter Message";
}
}
else if (this.state.messageType == "Document") {
if (this.state.tempMsg == "") {
errorThirdLevel = "Please Enter Message";
}
else if (this.state.documentFiles.length == 0) {
errorThirdLevel = "Please Upload A File";
}
}
else if (this.state.messageType == "Poll") {
if (this.state.pollVal[0] == "") {
errorThirdLevel = "Please Enter Question";
}
else {
let length = this.state.pollSize.length;
var result = this.state.pollVal.map((value, index) => {
if ((index > 0) && (length >= index)) {
if (value == "" && flag == 0) {
flag = 1;
errorThirdLevel = "Please Enter The Choice " + index;
}}});}
}
if (errorThirdLevel == "") {
let tempRole = this.state.tempRole;
let tempRoleId = [];
let documentName = "";
if (tempRole.length != 0) {
const result = tempRole.map((value, index) => {
tempRoleId.push(value.Id);
});
}
if (this.state.documentFiles.length != 0) {
const results = this.state.documentFiles.map((value, index) => {
if (index == 0)
documentName = documentName + value.name;
else
documentName = documentName + ":" + value.name;
})
}
this.setState({ tempRoleId, documentName }, () => {
NewTemplateAction.postTemplate(this.state.siteURL, this.state.currentContext, this.state);
if (this.state.formMode == "edit") {
NewTemplateAction.postDeleteTemp(this.state.siteURL, this.state.currentContext, this.state.editID);
}});
}
this.setState({ errorThirdLevel });
}

public render(): React.ReactElement<NewTemplateFormProps> {
if (this.state.formMode == "create") {
return (
<div className="container-fluid pad-0">
<div className="row m-4 wizard-border headerspacing">
<div className="col-12 col-sm-12 col-md-12 mar-0 col-lg-12 text-center p-0 mt-3 mb-2">
<div className="card px-0 pt-4 pb-0 pad-0 mt-3 mb-3">
<form id="msform">
{/* progressbar */}
<ul id="progressbar">
<li className="active" id="account"><span className="wizard-count">1</span><span className="wizard-title">Template</span></li>
<li id="personal" className={this.state.currentTab != 1 ? "active" : null}><span className="wizard-count">2</span><span className="wizard-title">Schedule</span></li>
<li id="final" className={this.state.currentTab == 3 ? "active" : null}><span className="wizard-count">3</span><span className="wizard-title">Message</span></li>
</ul> {/* progressbar */}
<div className="row justify-content-center m-0">
<div className="col-md-7 mt-4">
<fieldset style={{ position: "relative", opacity: this.state.currentTab == 1 ? 1 : 0, display: this.state.currentTab == 1 ? "block" : "none" }}>{/*Fieldset For Template Starts*/}
<div className="row mb-4">
<div className="col-md-12">
<div className="form-group col-gray">
<label className="form-label" htmlFor="exampleFormControlInput1">Template Name </label>
<input type="email" className="form-control form-placeholder-font-size" id="exampleFormControlInput1" name="tempName" value={this.state.tempName} placeholder="Enter Template Name" onChange={this.handleChange.bind(this)} maxLength={64} />
<span className="float-left form-error-msg form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorTempName}</span>
</div>
</div>
</div>
<div className="row mb-4">
<div className="col-md-12">
<div className="form-group col-gray">
<label className="form-label col-gray">Template Description</label>
<textarea className="form-control form-placeholder-font-size  resize-none mb-2" rows={4} placeholder="Enter description of the template" value={this.state.tempDesc} defaultValue={""} maxLength={255} name="tempDesc" onChange={this.handleChange.bind(this)} />
<span className="float-left mb-2 resp-font">You have <span>{255 - this.state.tempDesc.length}</span> out of <span>255</span> characters remaining</span>
</div>
</div>
</div>
<div className="row mb-5">
<div className="col-md-12">
<div className="form-group col-gray">
<label className="form-label" htmlFor="exampleFormControlInput1">Roles </label>
<Typeahead
multiple
onChange={(value) => this.setState({ tempRole: value })}
options={this.state.roleArray}
selected={this.state.tempRole}
labelKey="Role"
placeholder="Select Roles"/>
</div>
</div>
</div>
{this.state.templateType == "LoopIn" ?
<div className="row mb-5">
<div className="col-md-12 w-100">
<label className="form-label col-gray">Upload Image (JPEG, PNG ) </label>
<div className="upload-btn-wrapper float-left mt-2">
<button type="button" className="download-template upload-button-prop ">
<img className="mr-2 ml-2" src={upload} />Upload Image</button>
<input type="file" name="loopinImage" onChange={this.handleChange.bind(this)} accept=".png,.jpeg" onClick={(e)=>{e.currentTarget.value=null;}}/>
<div className="float-right">
<p className="float-right mt-2 form-label col-gray upload-image">{this.state.loopinImage == null ? "" : this.state.loopinImage.name.length > 25 ? this.state.loopinImage.name.slice(0, 25) + "..." : this.state.loopinImage.name}</p>
</div>
</div>
<div>
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorLoopinImage}</span>
</div>
</div>
</div> : null}
<div className="row mt-5 mb-5">
<div className="col-md-12 mt-4">
<div className="float-left page-heading-rep">
<a href="#" className="cancel-bold-text  mt-2" onClick={this.cancel.bind(this)}>CANCEL</a>
</div>
<div className="float-right">
<input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.valFirstLevel.bind(this)} />
</div>
</div>
</div>
</fieldset>{/*Fieldset For Template Ends*/}
<fieldset style={{ position: "relative", opacity: this.state.currentTab == 2 ? 1 : 0, display: this.state.currentTab == 2 ? "block" : "none" }}>
<div className="row mb-4">
<div className="col-md-12">
<div className="form-group  col-gray">
<label className="form-label col-gray ">How often would you like this message to be sent ?</label>
<div className="radio float-left radio-font mt-3">
<label><input type="radio" className="mr-2" name="tempUsage" value="Single" checked={this.state.tempUsage == "Single"} onClick={this.handleChange.bind(this)} /><span className="mr-5 mar-0">One Time</span></label>
<label><input type="radio" className="ml-5 mr-2" name="tempUsage" value="Multiple" checked={this.state.tempUsage == "Multiple"} onClick={this.handleChange.bind(this)} />Multiple Times</label>
</div>
</div>
</div>
</div>
<div className={this.state.tempUsage == "Multiple" ? "row mb-4 block" : "row mb-4 hide"} id="multime-schedule">
<div className="col-md-12">
<div className="form-group col-gray">
<label htmlFor="temp-edit-schedule" className="w-100 form-label col-gray mb-4">Schedule the template to be sent</label>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="scheduleType" value={this.state.scheduleType} onChange={this.handleChange.bind(this)}>
<option value="Daily">Daily</option>
<option value="Weekly">Weekly</option>
<option value="Monthly">Monthly</option>
<option value="Yearly">Yearly</option>
</select>
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 float-left radio-font mr-2">Until</span> : null}
{this.state.scheduleType == "Daily" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" name="breakpointDaily" value={this.state.breakpointDaily} onChange={this.handleChange.bind(this)}>
<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>
<option value={4}>4</option>
<option value={5}>5</option>
<option value={6}>6</option>
</select> : null}
{this.state.scheduleType == "Weekly" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" value={this.state.breakpointWeekly} name="breakpointWeekly" onChange={this.handleChange.bind(this)}>
<option value={7}>7</option>
<option value={14}>14</option>
<option value={21}>21</option>
<option value={28}>28</option>
</select> : null}
{this.state.scheduleType == "Monthly" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" value={this.state.breakpointMonthly} name="breakpointMonthly" onChange={this.handleChange.bind(this)}>
<option value={30}>30</option>
<option value={60}>60</option>
<option value={90}>90</option>
<option value={120}>120</option>
<option value={150}>150</option>
<option value={180}>180</option>
</select> : null}
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 float-left radio-font mr-2">days</span> : null}
{this.state.scheduleType != "Yearly" ?
<select className="mdb-select md-form wizard-form-width radio-font float-left temp-edit-dropdown" name="startdateType" value={this.state.startdateType} onChange={this.handleChange.bind(this)}>
<option value="Before">Before</option>
<option value="After">After</option>
</select> : null}
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 radio-font float-left mr-2">new hire start date at time</span> : null}
{this.state.scheduleType != "Yearly" ?
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select> : null}
{this.state.scheduleType == "Yearly" ?
<div>
<span className="ml-2 float-left radio-font mr-2">On</span>
<div className="date-yearly float-left">
<DatePicker
value={this.state.yearlyDate}
onSelectDate={(value) => this.handleDateChange(value, "yearlyDate")}
className="form-placeholder-font-size"/>
</div>
<span className="ml-2 float-left radio-font mr-2">at time</span>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select>
</div>
: null}
</div>
</div>
</div>
<div className={this.state.scheduleType == "Monthly" && this.state.tempUsage == "Multiple" ? "float-left mt-3 row mb-4 block w-100" : "w-100 float-left mt-3 row mb-4 hide"} id="multime-schedule">
<div className="col-md-12">
<div className="form-group col-gray">
<span className="ml-2 float-left radio-font mr-2">On</span>
{this.state.monthlyRep == "Day" ?
<input type="number" className="ml-2 float-left radio-font mr-2 input-number" value={this.state.noofDaysMonthly} min={1} max={28} name="noofDaysMonthly" onChange={this.handleChange.bind(this)} />:
<input type="number" className="ml-2 float-left radio-font mr-2 input-number" value={this.state.noofWeeksMonthly} min={1} max={4} name="noofWeeksMonthly" onChange={this.handleChange.bind(this)} />}
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="monthlyRep" value={this.state.monthlyRep} onChange={this.handleChange.bind(this)}>
<option value="Day">Day</option>
<option value="Week">Week</option>
</select>
<span className="ml-2 float-left radio-font mr-2">of every month</span>
</div>
</div>
</div>
{/* Multiple Mode - Weekly */}
<div className={(this.state.scheduleType == "Weekly" && this.state.tempUsage == "Multiple") || (this.state.monthlyRep == "Week" && this.state.scheduleType == "Monthly" && this.state.tempUsage == "Multiple") ? "row mb-4 block float-left w-100 mt-3" : "mt-3 w-100 row mb-4 hide float-left"} id="weekly-schedule">
<div className="col-md-12 mt-2">
<div className="form-check col-gray float-left mr-3">
<input className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(1) != -1 ? true : false} value={1} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">
Monday
</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(2) != -1 ? true : false} value={2} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">
Tuesday
</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(3) != -1 ? true : false} value={3} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">
Wednesday
</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(4) != -1 ? true : false} value={4} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Thursday</label>
</div>
<div className="form-check col-gray float-left ">
<input className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(5) != -1 ? true : false} value={5} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Friday</label>
</div>
</div>
</div>
<div className={this.state.tempUsage == "Single" ? "row mb-5 block" : "row mb-5 hide"} id="onetime-schedule">
<div className="col-md-12">
<div className="form-group col-gray">
<label htmlFor="temp-edit-schedule" className="w-100 form-label col-gray mb-4">Schedule the template to be sent</label>
<select className="mdb-select md-form float-left radio-font temp-edit-dropdown" name="noofDaysSingle" value={this.state.noofDaysSingle} onChange={this.handleChange.bind(this)}>
<option value={7}>7</option>
<option value={30}>30</option>
<option value={60}>60</option>
<option value={90}>90</option>
<option value={120}>120</option>
</select>
<span className="ml-2 float-left radio-font mr-2">days</span>
<select className="mdb-select md-form radio-font float-left wizard-form-width temp-edit-dropdown" name="startdateType" value={this.state.startdateType} onChange={this.handleChange.bind(this)}>
<option value="Before">Before</option>
<option value="After">After</option>
</select>
<span className="ml-2 radio-font float-left mr-2">new hire start date at time</span>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select>
</div>
</div>
</div>
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7" style={{ color: "red"}}>{this.state.errorSecondLevel}</span>
<div className="row mt-5 mb-5 w-100">
<div className="col-md-12 col- mb-5 w-100 mt-4">
<div className="float-left">
<a href="#" className="float-left cancel-bold-text mt-2" onClick={this.cancel.bind(this)}>CANCEL</a>
</div>
<div className="float-right">
<input type="button" name="previous" title="Back" className="previous action-button-previous" onClick={() => this.setState({ currentTab: 1 })} />
<input type="button" name="next" className="next action-button" defaultValue="Next" onClick={this.valSecondLevel.bind(this)} />
</div>
</div>
</div>
</fieldset>{/*Fieldset for Schedule Ends*/}
<fieldset style={{ position: "relative", opacity: this.state.currentTab == 3 ? 1 : 0, display: this.state.currentTab == 3 ? "block" : "none" }}>{/*Fieldset For Temp-Message Starts*/}
<div className="row mb-4">
<div className="col-md-12">
<label className="form-label col-gray">Template Type</label>
<div className="radio radio-font col-gray float-left mt-3">
<label><input type="radio" className="mr-2 drilldown-resp-mar-left " name="messageType" value="Message" checked={this.state.messageType == "Message"} onChange={this.handleChange.bind(this)} /><span className="mr-5 mar-0 ">Message</span></label>
<label><input type="radio" className="ml-5 drilldown-resp-mar-left mr-2" name="messageType" value="Poll" checked={this.state.messageType == "Poll"} onChange={this.handleChange.bind(this)} /><span className="mr-5 mar-0">Poll</span></label>
<label><input type="radio" className="ml-5 drilldown-resp-mar-left mr-2" name="messageType" value="Document" checked={this.state.messageType == "Document"} onChange={this.handleChange.bind(this)} />Document</label>
</div>
</div>
</div>
<div className={this.state.messageType == "Message" ? "row mb-4 show" : "row mb-4 hide"} id="temp-message">{/*Template with Message Contents*/}
<div className="col-md-12">
<div className="form-group ">
<label className="float-left form-label col-gray">Message</label>
<span className="float-left w-100">
<label data-toggle="collapse" role="button" className="mt-1 col-gray float-left" aria-expanded="false" aria-controls="collapseExample" onClick={() => this.setState({ placeholder: !this.state.placeholder })}>
<img src={drop} className="mr-2" />Placeholders</label></span>
<div className={this.state.placeholder == true ? "collapse block" : "collapse hide"} id="collapseExample">
<div className="card card-body pb-0 pl-0 pt-0 float-left footer-border-none">
<div className="mb-2">
<label className="placeholder-border" onClick={this.placeholder.bind(this, "@NewHire")}>@New Hire</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Manager")}>@Manager</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@StartDate")}>@Start Date</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Team")}>@Team</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Role")}>@Role</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "[LinkName](linkref)")}>{'{'}Link{'}'}</label>
</div>
</div>
</div>
<textarea className="form-control border-prop-text-area form-placeholder-font-size pt-0 resize-none mt-2 pos-rel" id="messageintemplate" placeholder="Enter the message" rows={4} value={this.state.tempMsg} defaultValue={""} maxLength={255} name="tempMsg" onChange={this.handleChange.bind(this)} />
<span className="float-left col-gray mt-2 resp-font ">You have <span>{255 - this.state.tempMsg.length}</span> out of <span>255</span> words remaining</span>
</div>
</div>
</div>{/*Template with Message Content Ends*/}
<div className={this.state.messageType == "Document" ? "row mb-4 show" : "row mb-4 hide"} id="temp-document">{/*Document with Message*/}
<div className="col-md-12">
<div className="form-group ">
<label className="float-left form-label col-gray">Message</label>
<span className="float-left w-100">
<label data-toggle="collapse" role="button" className="mt-1 col-gray float-left" aria-expanded="false" aria-controls="collapseExample" onClick={() => this.setState({ placeholder: !this.state.placeholder })} >
<img src={drop} className="mr-2" />Placeholders</label></span>
<div className={this.state.placeholder == true ? "collapse block" : "collapse hide"} id="collapseExample">
<div className="card card-body col-sm-12 pb-0 pl-0 pt-0 float-left footer-border-none">
<div className="mb-2">
<label className="placeholder-border" onClick={this.placeholder.bind(this, "@NewHire")}>@New Hire</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Manager")}>@Manager</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@StartDate")}>@Start Date</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Team")}>@Team</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Role")}>@Role</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "[LinkName](linkref)")}>{'{'}Link{'}'}</label>
</div>
</div>
</div>
<textarea className="form-control border-prop-text-area form-placeholder-font-size  resize-none pt-0 mt-2 pos-rel" id="messageintemplate" placeholder="Enter the message" rows={4} value={this.state.tempMsg} defaultValue={""} maxLength={255} name="tempMsg" onChange={this.handleChange.bind(this)} />
<span className="float-left col-gray mt-2 resp-font mb-3">You have <span>{255 - this.state.tempMsg.length}</span> out of <span>255</span> characters remaining</span>
<label className="float-left form-label col-gray mt-4">Upload documents (PDF, word)</label>
<div className="upload-btn-wrapper w-100 mt-2 mb-2 text-left">
<button type="button" className="download-template upload-button-prop">
<img className="mr-2 ml-2" src={upload} />Upload a new file</button>
<input type="file" onChange={this.uploadFile.bind(this)} onClick={(e)=>{e.currentTarget.value=null;}} accept=".pdf,.docx,.doc"/>
</div>
<span className="form-error-msg form-placeholder-font-size w-100 float-left errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFile}</span>
{this.state.documentFiles.length != 0 ?
<table className="table col-gray mt-3 table-border tab-border-doc">
<thead className="text-left">
<tr>
<th className="pl-3">FILE NAME</th>
<th className="text-center">FILE SIZE</th>
<th className="text-center">ACTION</th>
</tr>
</thead>
<tbody>
{this.fileGrid()}
</tbody>
</table>: null}
</div>
</div>
</div>{/*Document with Message*/}
<div className={this.state.messageType == "Poll" ? "row mb-4 show" : "row mb-4 hide"} id="temp-poll">{/*Template Poll Type*/}
<div className="col-md-12">
<div className="form-group col-gray">
<label className="form-label" htmlFor="temp-poll-question">Question</label>
<input type="text" className="form-control form-placeholder-font-size" id="temp-poll-question" placeholder="Enter your question here" value={this.state.pollVal[0]} onChange={this.addPollval.bind(this, 0)} />
</div>
{this.populatePoll()}
{this.state.pollSize.length != 5 ?
<div className="form-group mt-4 col-gray text-left">
<button type="button" className="mb-1 add-border footer-border-none" onClick={this.addPoll.bind(this)} />
</div> : null}
</div>
</div>{/*Template Poll type*/}
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorThirdLevel}</span>
<div className="w-100 row mt-5 mb-5">
<div className=" col-md-12 col- mb-5 mt-4">
<div className="float-left">
<a href="#" className="float-left cancel-bold-text mt-2" onClick={this.cancel.bind(this)}>CANCEL</a>
</div>
<div className="float-right">
<input type="button" name="previous" title="Back" className="previous action-button-previous" onClick={() => this.setState({ currentTab: 2 })} />
<input type="button" name="next" className="action-button finish-btn" defaultValue="Finish" onClick={this.valThirdLevel.bind(this)} />
</div>
</div>
</div>
</fieldset>{/*Fieldset For Temp-Message Ends*/}
</div>
</div>
</form>
</div>
</div>
</div>
</div>
);
}
if (this.state.formMode != "create") {
return (
<div className="col-md-12 col- pad-0 float-left p-5">
<div className="float-left p-0 col-sm-12 resp-user-config-view w-100 pad-0 mb-3 user-config-heading-resp headerspacing">
<a href="#" onClick={this.cancel.bind(this)}><img className="mt-1 back-arrow-resp mr-3 float-left" src={back} /></a>
<h6 className="table-header  float-left">{this.state.tempName}</h6>
</div><form>
<div className="float-left mt-3 w-100 mb-3 pl-3">
<h6 className="table-header form-padding-prop  form-inner-heading ">Templates</h6>
<button type="button" onClick={() => this.setState({ formMode: "edit" })} className={this.state.formMode == "view" ? "float-right user-config-create-button button-mr-prop " : "float-right user-config-create-button button-mr-prop hide"}><img className="mr-2" src={pen} />Edit</button>
</div>
<div className="col-md-6 col- mt-4 float-left">
<div className="form-group form-padding-prop col-gray">
<label htmlFor="temp-edit-temp-name">Template Name </label>
<input type="email" className="form-control form-placeholder-font-size" id="temp-edit-temp-name" disabled={true} name="tempName" value={this.state.tempName} placeholder="Enter Template Name" onChange={this.handleChange.bind(this)} maxLength={64} />
</div>
</div>
<div className="col-md-6 col- mt-4 mb-5 float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="temp-edit-temp-desc">Template Description</label>
<input type="email" className="form-control form-placeholder-font-size" id="temp-edit-temp-desc" disabled={this.state.formMode == "view" ? true : false} placeholder="Enter Template description" value={this.state.tempDesc} defaultValue={""} maxLength={255} name="tempDesc" onChange={this.handleChange.bind(this)} />
</div>
</div>
<div className="col-md-6 col- float-left">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="temp-edit-roles">Roles</label>
<Typeahead
disabled={this.state.formMode == "view" ? true : false}
multiple
onChange={(value) => this.setState({ tempRole: value })}
options={this.state.roleArray}
selected={this.state.tempRole}
labelKey="Role"
placeholder="Select Roles"/>
</div>
</div>
<div className="w-100 col-md-12 float-left">
<div className="float-left mt-5 mb-3">
<h6 className="table-header form-padding-prop form-inner-heading ">Schedule</h6>
</div>
</div>
<div className="col-md-12 col- mt-4  float-left">
<div className="form-group form-padding-prop col-gray">
<label>How often would you like this message to be sent ?</label>
<div className="radio mt-3">
<label><input type="radio" disabled={this.state.formMode == "view" ? true : false} className="mr-2" name="tempUsage" value="Single" checked={this.state.tempUsage == "Single"} onClick={this.handleChange.bind(this)} /><span className="mr-5">One Time</span></label>
<label><input type="radio" disabled={this.state.formMode == "view" ? true : false} className="ml-5 mr-2" name="tempUsage" value="Multiple" checked={this.state.tempUsage == "Multiple"} onClick={this.handleChange.bind(this)} />Multiple Times</label>
</div>
</div>
</div>
<div className={this.state.tempUsage == "Multiple" ? "col-md-12 col- mt-4  float-left" : "hide col-md-6 col- mt-4  float-left"} id="multime-schedule">
<div className="form-group form-padding-prop pl-4 col-gray">
<label htmlFor="temp-edit-schedule" className="w-100  col-gray mb-4">Schedule the template to be sent</label>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" disabled={this.state.formMode == "view" ? true : false} name="scheduleType" value={this.state.scheduleType} onChange={this.handleChange.bind(this)} id="type">
<option value="Daily">Daily</option>
<option value="Weekly">Weekly</option>
<option value="Monthly">Monthly</option>
<option value="Yearly">Yearly</option>
</select>
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 float-left radio-font mr-2">Until</span> : null}
{this.state.scheduleType == "Daily" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" name="breakpointDaily" disabled={this.state.formMode == "view" ? true : false} value={this.state.breakpointDaily} onChange={this.handleChange.bind(this)}>
<option value={1}>1</option>
<option value={2}>2</option>
<option value={3}>3</option>
<option value={4}>4</option>
<option value={5}>5</option>
<option value={6}>6</option>
</select> : null}
{this.state.scheduleType == "Weekly" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" value={this.state.breakpointWeekly} name="breakpointWeekly" disabled={this.state.formMode == "view" ? true : false} onChange={this.handleChange.bind(this)}>
<option value={7}>7</option>
<option value={14}>14</option>
<option value={21}>21</option>
<option value={28}>28</option>
</select> : null}
{this.state.scheduleType == "Monthly" ?
<select className="mdb-select md-form float-left wizard-form-days-width radio-font temp-edit-dropdown" disabled={this.state.formMode == "view" ? true : false} value={this.state.breakpointMonthly} name="breakpointMonthly" onChange={this.handleChange.bind(this)}>
<option value={30}>30</option>
<option value={60}>60</option>
<option value={90}>90</option>
<option value={120}>120</option>
<option value={150}>150</option>
<option value={180}>180</option>
</select> : null}
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 float-left radio-font mr-2">days</span> : null}
{this.state.scheduleType != "Yearly" ?
<select className="mdb-select md-form wizard-form-width radio-font float-left temp-edit-dropdown custom-text-box-width" disabled={this.state.formMode == "view" ? true : false} name="startdateType" value={this.state.startdateType} onChange={this.handleChange.bind(this)}>
<option value="Before">Before</option>
<option value="After">After</option>
</select> : null}
{this.state.scheduleType != "Yearly" ?
<span className="ml-2 radio-font float-left mr-2">new hire start date at time</span> : null}
{this.state.scheduleType != "Yearly" ?
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" disabled={this.state.formMode == "view" ? true : false} name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select> : null}
{this.state.scheduleType == "Yearly" ?
<div>
<span className="ml-2 float-left radio-font mr-2">On</span>
<div className="date-yearly float-left">
<DatePicker
disabled={this.state.formMode == "view" ? true : false}
value={this.state.yearlyDate}
onSelectDate={(value) => this.handleDateChange(value, "yearlyDate")}
className="form-placeholder-font-size"/>
</div>
<span className="ml-2 float-left radio-font mr-2">at time</span>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" disabled={this.state.formMode == "view" ? true : false} name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select>
</div>: null}
</div>
</div>
<div className={this.state.scheduleType == "Monthly" && this.state.tempUsage == "Multiple" ? "col-md-12   float-left block" : "col-md-12  float-left hide "} id="multime-schedule">
<div className="col-md-12">
<div className="form-group col-gray">
<span className="ml-2 float-left radio-font mr-2">On</span>
{this.state.monthlyRep == "Day" ?
<input type="number" disabled={this.state.formMode == "view" ? true : false} className="ml-2 float-left radio-font mr-2 input-number" value={this.state.noofDaysMonthly} min={1} max={28} name="noofDaysMonthly" onChange={this.handleChange.bind(this)} />:
<input type="number" disabled={this.state.formMode == "view" ? true : false} className="ml-2 float-left radio-font mr-2 input-number" value={this.state.noofWeeksMonthly} min={1} max={4} name="noofWeeksMonthly" onChange={this.handleChange.bind(this)} />}
<select disabled={this.state.formMode == "view" ? true : false} className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" name="monthlyRep" value={this.state.monthlyRep} onChange={this.handleChange.bind(this)}>
<option value="Day">Day</option>
<option value="Week">Week</option>
</select>
<span className="ml-2 float-left radio-font mr-2">of every month</span>
</div>
</div>
</div>
<div className={(this.state.scheduleType == "Weekly" && this.state.tempUsage == "Multiple") || (this.state.monthlyRep == "Week" && this.state.scheduleType == "Monthly" && this.state.tempUsage == "Multiple") ? "col-md-12 mt-3 ml-4 float-left" : "col-md-12 mt-2 ml-3 float-left hide"} id="weekly-schedule">
<div className="form-check col-gray float-left mr-3">
<input disabled={this.state.formMode == "view" ? true : false} className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(1) != -1 ? true : false} value={1} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">
Monday</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input disabled={this.state.formMode == "view" ? true : false} className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(2) != -1 ? true : false} value={2} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Tuesday</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input disabled={this.state.formMode == "view" ? true : false} className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(3) != -1 ? true : false} value={3} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Wednesday</label>
</div>
<div className="form-check col-gray float-left mr-3">
<input disabled={this.state.formMode == "view" ? true : false} className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(4) != -1 ? true : false} value={4} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Thursday</label>
</div>
<div className="form-check col-gray float-left ">
<input disabled={this.state.formMode == "view" ? true : false} className="form-check-input" type="checkbox" name="weekdays" checked={this.state.weekdays.indexOf(5) != -1 ? true : false} value={5} onChange={this.handleChange.bind(this)} />
<label className="form-check-label" htmlFor="defaultCheck1">Friday</label>
</div>
</div>
<div className={this.state.tempUsage == "Single" ? "col-md-12 mb-5 float-left mt-4 show" : "col-md-12 mb-5 float-left mt-4 hide"} id="onetime-schedule">
<div className="form-group form-padding-prop pl-4 col-gray">
<label htmlFor="temp-edit-schedule" className="w-100 col-gray mb-4">Schedule the template to be sent</label>
<select disabled={this.state.formMode == "view" ? true : false} className="mdb-select md-form float-left radio-font temp-edit-dropdown" name="noofDaysSingle" value={this.state.noofDaysSingle} onChange={this.handleChange.bind(this)}>
<option value={7}>7</option>
<option value={30}>30</option>
<option value={60}>60</option>
<option value={90}>90</option>
<option value={120}>120</option>
</select>
<span className="ml-2 float-left radio-font mr-2">days</span>
<select disabled={this.state.formMode == "view" ? true : false} className="mdb-select md-form radio-font float-left wizard-form-width temp-edit-dropdown custom-text-box-width" name="startdateType" value={this.state.startdateType} onChange={this.handleChange.bind(this)}>
<option value="Before">Before</option>
<option value="After">After</option>
</select>
<span className="ml-2 radio-font float-left mr-2">new hire start date at time</span>
<select className="mdb-select md-form float-left wizard-form-width radio-font temp-edit-dropdown" id="temp-edit-schedule" disabled={this.state.formMode == "view" ? true : false} name="time" value={this.state.time} onChange={this.handleChange.bind(this)}>
<option value="09">9:00</option>
<option value="12">12:00</option>
<option value="16">16:00</option>
<option value="20">20:00</option>
</select>
</div>
</div>
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7 pl-4 ml-3" style={{ color: "red" }}>{this.state.errorSecondLevel}</span>
<div className="w-100 float-left">
<div className="float-left mt-5 mb-3 pl-3">
<h6 className="table-header form-padding-prop form-inner-heading ">Message</h6>
</div>
</div>
<div className="col-md-12 col- mt-4  float-left">
<div className="form-group form-padding-prop col-gray">
<label>Template Type</label>
<div className="radio mt-3">
<label><input type="radio" disabled={this.state.formMode == "view" ? true : false} className="mr-2" name="messageType" value="Message" checked={this.state.messageType == "Message"} onChange={this.handleChange.bind(this)} /><span className="mr-5 mar-0"  >Message</span></label>
<label><input type="radio" disabled={this.state.formMode == "view" ? true : false} className="ml-5 mr-2" name="messageType" value="Poll" checked={this.state.messageType == "Poll"} onChange={this.handleChange.bind(this)} /><span className="mr-5 mar-0" >Poll</span></label>
<label><input type="radio" disabled={this.state.formMode == "view" ? true : false} className="ml-5 mr-2" name="messageType" value="Document" checked={this.state.messageType == "Document"} onChange={this.handleChange.bind(this)} />Document</label>
</div>
</div>
</div>
<div className={this.state.messageType == "Message" ? "col-md-12 col-  mt-4 float-left block" : "col-md-12 col-  mt-4 float-left hide"} id="temp-message">
<div className="form-group col-gray form-padding-prop">
<label className="w-100">Message</label><span>
<label data-toggle="collapse" role="button" className="mt-3" aria-expanded="false" aria-controls="collapseExample" onClick={() => this.setState({ placeholder: !this.state.placeholder })}>
<img src={drop} className="mr-2" />Placeholders</label></span>
<div className={(this.state.placeholder == true) && (this.state.formMode == "edit") ? "collapse block" : "collapse hide"} id="collapseExample">
<div className="card card-body footer-border-none">
<div className="w-100 float-left">
<label className="placeholder-border" onClick={this.placeholder.bind(this, "@NewHire")}>@New Hire</label>
<label className="placeholder-border ml-3" onClick={this.placeholder.bind(this, "@Manager")}>@Manager</label>
<label className="placeholder-border ml-3" onClick={this.placeholder.bind(this, "@StartDate")}>@Start Date</label>
<label className="placeholder-border ml-3" onClick={this.placeholder.bind(this, "@Team")}>@Team</label>
<label className="placeholder-border ml-3" onClick={this.placeholder.bind(this, "@Role")}>@Role</label>
<label className="placeholder-border ml-3" onClick={this.placeholder.bind(this, "[LinkName](linkref)")}>{'{'}Link{'}'}</label>
</div>
</div>
</div>
<textarea disabled={this.state.formMode == "view" ? true : false} className="form-control border-prop-text-area form-placeholder-font-size ml-3 float-left  resize-none pt-0 mt-2 pos-rel" id="messageintemplate" placeholder="Enter the message" rows={4} value={this.state.tempMsg} defaultValue={""} maxLength={255} name="tempMsg" onChange={this.handleChange.bind(this)} />
<span className="float-left col-gray pl-3 w-100 mt-2 resp-font mb-3 ">You have <span>{255 - this.state.tempMsg.length}</span> out of <span>255</span> words remaining</span>
</div>
</div>
<div className={this.state.messageType == "Poll" ? "col-md-12 col-  mt-4 float-left block" : "col-md-12 col-  mt-4 float-left hide"} id="temp-poll">{/*Template Poll Type*/}
<div className="form-group col-gray  form-padding-prop">
<label className="form-label" htmlFor="temp-poll-question">Question</label>
<input type="text" disabled={this.state.formMode == "view" ? true : false} className="form-control form-placeholder-font-size" id="temp-poll-question" placeholder="Enter your question here" value={this.state.pollVal[0]} onChange={this.addPollval.bind(this, 0)} />
</div>
{this.populatePoll()}
{this.state.pollSize.length != 5 ?
<div className="form-group mt-4 col-gray text-left form-padding-prop">
<button type="button" disabled={this.state.formMode == "view" ? true : false} className="mb-1 add-border footer-border-none" onClick={this.addPoll.bind(this)}/>
</div> : null}
</div>
{/*Template Poll type*/}
<div className={this.state.messageType == "Document" ? "col-md-12 col-  mt-4 float-left block" : "col-md-12 col-  mt-4 float-left hide"} id="temp-document">{/*Document with Message*/}
<div className="form-group form-padding-prop">
<label className="float-left  col-gray">Message</label>
<span className="float-left w-100">
<label data-toggle="collapse" role="button" className="mt-1 col-gray  float-left" aria-expanded="false" aria-controls="collapseExample" onClick={() => this.setState({ placeholder: !this.state.placeholder })}>
<img src={drop} className="mr-2" />Placeholders</label></span>
<div className={this.state.placeholder == true ? "collapse block float-left" : "float-left collapse hide"} id="collapseExample">
<div className="card card-body col-sm-12 pb-0 pl-0 pt-0 float-left footer-border-none">
<div className="float-left mb-2 ">
<label className="placeholder-border" onClick={this.placeholder.bind(this, "@NewHire")}>@New Hire</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Manager")}>@Manager</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@StartDate")}>@Start Date</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Team")}>@Team</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "@Role")}>@Role</label>
<label className="placeholder-border mar-0 ml-3" onClick={this.placeholder.bind(this, "[LinkName](linkref)")}>{'{'}Link{'}'}</label>
</div>
</div>
</div>
<textarea disabled={this.state.formMode == "view" ? true : false} className="form-control border-prop-text-area form-placeholder-font-size ml-3 float-left  resize-none pt-0 mt-2 pos-rel" id="messageintemplate" placeholder="Enter the message" rows={4} value={this.state.tempMsg} defaultValue={""} maxLength={255} name="tempMsg" onChange={this.handleChange.bind(this)} />
<span className="float-left col-gray pl-3 w-100 mt-2 resp-font mb-3">You have <span>{255 - this.state.tempMsg.length}</span> out of <span>255</span> words remaining</span>
<label className="float-left form-label col-gray mt-4">Upload documents (PDF, word)</label>
<div className="upload-btn-wrapper w-100 mt-2 mb-2 text-left">
<button disabled={this.state.formMode == "view" ? true : false} type="button" className="download-template upload-button-prop">
<img className="mr-2 ml-2" src={upload} />Upload a new file</button>
<input disabled={this.state.formMode == "view" ? true : false} id="upload" type="file" ref="upload" onChange={this.uploadFile.bind(this)} accept=".pdf,.docx,.doc" onClick={(e)=>{e.currentTarget.value=null;}} />
</div>
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.errorFile}</span>
{this.state.documentFiles.length != 0 ?
<table className="table col-gray mt-3 table-border tab-border-doc">
<thead className="text-left">
<tr>
<th className="pl-3">FILE NAME</th>
<th className="text-center">FILE SIZE</th>
<th className="text-center">ACTION</th>
</tr>
</thead>
<tbody>
{this.fileGrid()}
</tbody>
</table>: null}
</div>
</div>{/*Document with Message*/}
<span className="float-left form-error-msg form-placeholder-font-size w-100 errorBoxText_c25b5cc7 pl-4 ml-3" style={{ color: "red" }}>{this.state.errorThirdLevel}</span>
<div className="col-md-12 col- mt-5 mb-5 col-gray float-left w-100">
<button type="button" className={this.state.formMode == "edit" ? "float-right user-config-create-button  mar-0 mr-4" : "float-right user-config-create-button  mar-0 mr-4 hide"} onClick={this.valEditForm.bind(this)}>Save Changes</button>
<button type="button" className="float-right mr-3 user-config-cancel-button" onClick={this.cancel.bind(this)}>Cancel</button>
</div></form>
</div>
);}}
}
