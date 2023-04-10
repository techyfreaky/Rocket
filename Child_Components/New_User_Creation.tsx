/** [Ref] - Denotes Pseudo Code Reference
* This Component is New User Creation Form
* App Name: Rocket
* Author: Manish
* Created Date: 18/02/2020*/
import * as React from 'react';
import { IRocketAppProps } from '../../../components/IRocketAppProps';
import { WebPartContext } from "@microsoft/sp-webpart-base"
require("tslib");
require("@pnp/logging");
require("@pnp/common");
require("@pnp/odata");
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "react-datepicker/dist/react-datepicker.css";
import { Typeahead } from 'react-bootstrap-typeahead';
import * as moment from 'moment';
/**Importing the action and store file and set to an object.*/
import * as UserConfigAction from '../Action/UserConfig_Action';
import * as NewUserAction from '../Action/User_Creation_Action';
import NewUserStore from '../Store/User_Creation_Store';
/**Importing the CSS properties.*/
import '../css/commontheme.css';
import '../css/style.css';

const backArrow: string = require('../images/user-drill-back-image.svg');
const edit: string = require('../images/pen.png');

export interface NewUserProps {
context: WebPartContext;
editviewState: any;
editId: any;
callback: any;
}

export interface NewUserStates {
siteUrl: string;
currentContext: WebPartContext;
UserType: string;
StartDate: Date;
Username: any[];
ErrorUserName: string;
ErrorStartDate: string;
ErrorStartDate1: string;
ErrorUserType: string;
ErrorUserData: string;
Clear: boolean;
UserNameClear: string;
UserView: string;
EditId: string;
TeamNamelist: any[];
TeamName: any[];
RoleNamelist: any[];
RoleName: any[];
ManagerNamelist: any[];
ManagerName: any[];
Email: string;
CStartDate: any;
UserId: any;
UserDataValidation: any;
editviewState: any;
viewdata: any[];
TemplateData: any[];
UserDetailData: any[];
Manageruserdata: any[];
ScheduleData: any[];
ManagerNamevalidation: any[];
viewUsername: string;
}

export default class NewUser extends React.Component<NewUserProps, NewUserStates>{
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
EditId: this.props.editId,
editviewState: this.props.editviewState,
UserType: "",
StartDate: null,
Username: [],
ErrorUserName: "",
ErrorStartDate: "",
ErrorStartDate1: "",
ErrorUserType: "",
Clear: false,
UserNameClear: "",
UserView: "",
TeamNamelist: [],
ManagerNamelist: [],
RoleNamelist: [],
TeamName: [],
ManagerName: [],
RoleName: [],
Email: "",
CStartDate: "",
UserId: "",
UserDataValidation: [],
ErrorUserData: "",
viewdata: [],
TemplateData: [],
UserDetailData: [],
Manageruserdata: [],
ScheduleData: [],
ManagerNamevalidation: [],
viewUsername: "",
};
this.handleChange = this.handleChange.bind(this);
}

componentWillMount() {
if (this.state.EditId != "") {
NewUserAction.ViewUser(this.state.siteUrl, this.state.currentContext, this.state.EditId);
}
NewUserAction.getManagerName(this.state.siteUrl, this.state.currentContext);
NewUserAction.getTeamName(this.state.siteUrl, this.state.currentContext);
NewUserAction.getRoleName(this.state.siteUrl, this.state.currentContext);
NewUserStore.on("ManagerNamelist", this.loadManagerName.bind(this));
NewUserStore.on("TeamNamelist", this.loadTeamName.bind(this));
NewUserStore.on("RoleNamelist", this.loadRoleName.bind(this));
NewUserStore.on("UserDataValidation", this.loadUserDataValidation.bind(this));
NewUserStore.on("userView", this.loadView.bind(this));
NewUserStore.on("createuser", this.loadresponse.bind(this));
NewUserStore.on("updateUser", this.loadupdate.bind(this));
}

loadView() {
if (NewUserStore.userView[0].StartDate != null) {
let normaldate = new Date(NewUserStore.userView[0].StartDate);
this.setState({
viewdata: NewUserStore.userView,
UserType: NewUserStore.userView[0].UserType,
UserView: NewUserStore.userView[0].Email,
StartDate: normaldate,
viewUsername: NewUserStore.userView[0].UserName
})
if (NewUserStore.userView[0].Team != null) {
if (NewUserStore.userView[0].Team.Team != null) {
this.setState({ TeamName: [{ Team: NewUserStore.userView[0].Team.Team, Id: NewUserStore.userView[0].Team.Id }] })
}
}
else {
this.setState({ TeamName: [] });
}
if (NewUserStore.userView[0].Role != null) {
if (NewUserStore.userView[0].Role.Role != null) {
this.setState({ RoleName: [{ Role: NewUserStore.userView[0].Role.Role, Id: NewUserStore.userView[0].Role.Id }] })
}
}
else {
this.setState({ RoleName: [] });
}
let managername;
if (NewUserStore.userView[0].Manager != null) {
if (NewUserStore.userView[0].Manager.FirstName != null) {
managername = NewUserStore.userView[0].Manager.FirstName;
if (NewUserStore.userView[0].Manager.LastName != null) {
managername += " " + NewUserStore.userView[0].Manager.LastName;
}
}
else if (NewUserStore.userView[0].Manager.Title != null) {
managername = NewUserStore.userView[0].Manager.Title;
}
else{
managername = "";
}
this.setState({
ManagerName: [{
UserName: managername,
User: { Id: NewUserStore.userView[0].Manager.Id },
EMail: NewUserStore.userView[0].Manager.EMail
}]});
}
else {
this.setState({ ManagerName: [] });
}}
}

public loadresponse = () => {
this.clearForm();
}

public loadupdate = () => {
this.clearForm();
}

public loadUserDataValidation = () => {
if (NewUserStore.UserDataValidation.length != 0) {
this.setState({ ErrorUserData: "User Already Exists" });
}
else {
if (this.state.ManagerName.length != 0) {
NewUserAction.getManagerTemplate(this.state, this.state.siteUrl, this.state.currentContext);
NewUserStore.on("ManagerTemplateData", this.loadManagerTemplateData.bind(this));
NewUserStore.on("Manageruserdata", this.loadManageruserdata.bind(this));
}
else {
NewUserAction.PostCreateUser(this.state, this.state.siteUrl, this.state.currentContext);
}}
}

/**The managerSchedule()  is called to schedule the manager template with user Startdate to the manager.*/
public managerSchedule = (TempDetails, UserDetails) => {
let schedule = [];
if (UserDetails[0].length == 8) {
UserDetails.map((value, index) => {
let startdate;
let date1 = moment(value[2]).format('YYYY-MM-DD');
let cstartdate1 = moment(date1, 'YYYY-MM-DD');
var currentDate = new Date(),
mnth = ("0" + (currentDate.getMonth() + 1)).slice(-2),
day = ("0" + currentDate.getDate()).slice(-2);
let date2 = [currentDate.getFullYear(), mnth, day].join("-");
let cstartdate2 = moment(date2, 'YYYY-MM-DD');
if (cstartdate1 < cstartdate2) {
startdate = cstartdate2.add(1, 'days');
}
else {
startdate = cstartdate1;
}
TempDetails.map((tempvalue, index) => {
if (tempvalue.TemplateUsage == "Single") {
const date = moment(startdate, 'YYYY-MM-DD');
let ndate, msg = "";
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
if (tempvalue.StartDateType == "Before") {
let ndate1;
ndate1 = moment(date).subtract(tempvalue.NoOfDaysOrWeek, 'days');
if (moment(ndate1) < cstartdate2) {
ndate = moment(cstartdate2).add(1, 'days');
}
else {
ndate = ndate1;
}
}
if (tempvalue.StartDateType == "After") {
ndate = moment(date).add(tempvalue.NoOfDaysOrWeek, 'days');
}
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}
else if (tempvalue.TemplateUsage == "Multiple") {
if (tempvalue.ScheduleType == "Daily") {
for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
const date = moment(startdate, 'YYYY-MM-DD');
let ndate, msg = "";
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
if (tempvalue.StartDateType == "Before") {
let ndate1;
ndate1 = date.subtract(i, 'days');
if (moment(ndate1) < cstartdate2) {
ndate = moment(cstartdate2).add(1, 'days');
}
else {
ndate = ndate1;
}
}
if (tempvalue.StartDateType == "After") {
ndate = moment(date).add(i, 'days');
}
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}
}
else if (tempvalue.ScheduleType == "Weekly") {
for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
const date = moment(startdate, 'YYYY-MM-DD');
let ndate, msg = "";
if (tempvalue.StartDateType == "Before") {
let ndate1;
ndate1 = date.subtract(i, 'days');
if (moment(ndate1) < cstartdate2) {
ndate = moment(cstartdate2).add(1, 'days');
}
else {
ndate = ndate1;
}
}
if (tempvalue.StartDateType == "After") {
ndate = moment(date).add(i, 'days');
}
tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays{
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}});}
}
else if (tempvalue.ScheduleType == "Monthly") {
for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
const date = moment(startdate, 'YYYY-MM-DD');
let ndate, msg = "";
if (tempvalue.StartDateType == "Before") {
let ndate1;
ndate1 = date.subtract(i, 'days');
if (moment(ndate1) < cstartdate2) {
ndate = moment(cstartdate2).add(1, 'days');
}
else {
ndate = ndate1;
}
}
if (tempvalue.StartDateType == "After") {
ndate = moment(date).add(i, 'days');
}
if (tempvalue.MonthlyRepitition == "Days") {
if (parseInt(ndate.format('D')) == tempvalue.NoOfDaysOrWeek) {
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}
}
if (tempvalue.MonthlyRepitition == "Week") {
if (tempvalue.NoOfDaysOrWeek == "1") {
if (parseInt(ndate.format('D')) >= 1 && parseInt(ndate.format('D')) <= 7) {
tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays) {
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}});}
}
if (tempvalue.NoOfDaysOrWeek == "2") {
if (parseInt(ndate.format('D')) > 7 && parseInt(ndate.format('D')) <= 14) {
tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays) {
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}});}
}
if (tempvalue.NoOfDaysOrWeek == "3") {
if (parseInt(ndate.format('D')) > 14 && parseInt(ndate.format('D')) <= 21) {
tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays) {
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}});}
}
if (tempvalue.NoOfDaysOrWeek == "4") {
if (parseInt(ndate.format('D')) > 21 && parseInt(ndate.format('D')) <= 28) {
tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays) {
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}});}}}}
}
else if (tempvalue.ScheduleType == "Yearly") {
let yearlydate = tempvalue.YearlyRepitition, ndate, msg = "";
let date = moment(tempvalue.YearlyRepitition, 'YYYY-MM-DD');
let cdate = date.format('YYYY');
let currentDate = new Date();
let date1 = moment(currentDate, 'YYYY-MM-DD');
let cdate1 = date1.format('YYYY');
if (cdate < cdate1) {
let cdate3 = new Date(yearlydate);
cdate3.setFullYear(parseInt(cdate1));
let cdate4 = moment(cdate3, 'YYYY-MM-DD');
if (cdate4 < date1) {
ndate = cdate4.add(1, 'years');
}
else {
ndate = cdate4;
}
}
else {
if (date < date1) {
ndate = date1.add(1, 'years');
}
else {
ndate = date;
}
}
for (var i = 1; i <= 10; i++) {
ndate.add(1, 'years');
schedule.push([]);
let length = (schedule.length) - 1;
schedule[length].push(value[0]);
schedule[length].push(value[1]);
schedule[length].push(tempvalue.Id);
schedule[length].push("No Response");
schedule[length].push("On Track");
let datetime = moment(ndate, 'YYYY-MM-DD');
schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
msg = tempvalue.MessageContent;
let status = msg.indexOf("@NewHire");
let status1 = msg.indexOf("@Manager");
let status2 = msg.indexOf("@Team");
let status3 = msg.indexOf("@Role");
let status4 = msg.indexOf("@Start Date");
if (status != -1) {
msg = msg.replace("@NewHire", value[3]);
}
else {
msg = msg.replace("@NewHire", "");
}
if (status1 != -1 && value[4] != "") {
msg = msg.replace("@Manager", value[4]);
}
else {
msg = msg.replace("@Manager", "");
}
if (status2 != -1 && value[5] != "") {
msg = msg.replace("@Team", value[5]);
}
else {
msg = msg.replace("@Team", "");
}
if (status3 != -1 && value[6] != "") {
msg = msg.replace("@Role", value[6]);
}
else {
msg = msg.replace("@Role", "");
}
if (status4 != -1) {
msg = msg.replace("@Start Date", cstartdate1.format('LL'));
}
}
schedule[length].push(msg);
schedule[length].push(value[7]);
}}}
});
NewUserAction.ScheduleManagerTemplate(this.state, this.state.siteUrl, this.state.currentContext, schedule);
if (this.state.EditId == "") {
NewUserAction.PostCreateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
else {
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
}});
}
else {
NewUserAction.ScheduleManagerTemplate(this.state, this.state.siteUrl, this.state.currentContext, schedule);
if (this.state.EditId == "") {
NewUserAction.PostCreateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
else {
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
}}
}

/** Listener Function to set the ManagerName details to the state for the filter typeahead*/
public loadManagerName = () => {
this.setState({ ManagerNamelist: NewUserStore.ManagerNamelist });
}

/** Listener Function to set the TeamName details to the state for the filter typeahead */
public loadTeamName = () => {
this.setState({ TeamNamelist: NewUserStore.TeamNamelist });
}

/** Listener Function to set the ManagerTemplateData  to the state and calls the userdetails()method */
public loadManagerTemplateData = () => {
if (NewUserStore.ManagerTemplateData.length != 0) {
this.setState({ TemplateData: NewUserStore.ManagerTemplateData }, () => { this.userdetails(); });
}
else {
if (this.state.EditId == "") {
NewUserAction.PostCreateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
else {
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
this.setState({ editviewState: "view" });
}}
}

/**Listener Function to set the ManagerUserData  to the state*/
public loadManageruserdata = () => {
this.setState({ Manageruserdata: NewUserStore.Manageruserdata });
}

public userdetails = () => {
let array1 = this.state.Manageruserdata;
let array2 = [];
let array3 = this.state.TemplateData;
let team = "", role = "";
if (array1.length > 0) {
array1.map((value, index) => {
if (this.state.TeamName.length != 0) {
team = this.state.TeamName[0].Team;
}
if (this.state.RoleName.length != 0) {
role = this.state.RoleName[0].Role;
}
array2.push([]);
array2[index].push(value.User.Id);
array2[index].push(value.ID);
if (this.state.editviewState == "") {
array2[index].push(this.state.CStartDate);
}
else {
array2[index].push(this.state.StartDate);
}
if (this.state.editviewState == "") {
array2[index].push(this.state.Username);
}
else {
array2[index].push(this.state.viewUsername);
}
array2[index].push(value.UserName);
array2[index].push(team);
array2[index].push(role);
if (this.state.editviewState == "") {
array2[index].push(this.state.Email);
}
else {
array2[index].push(this.state.UserView);
}
});
}
else {
array2.push([]);
}
this.managerSchedule(array3, array2);
}

/** Listener Function to set the RoleName details to the state for the filter typeahead*/
public loadRoleName = () => {
this.setState({ RoleNamelist: NewUserStore.RoleNamelist })
}

/**clearForm() is used to clear the data from the state and return back to userconfig grid*/
clearForm() {
this.setState({
Clear: true, StartDate: null, ManagerName: [], Username: [],
UserType: "", ErrorUserName: "", ErrorStartDate: "", ErrorUserType: "",
UserNameClear: "", TeamName: [], RoleName: [], ErrorUserData: "", ErrorStartDate1: "", Email: "", UserId: ""
});
this.props.callback("grid", "", "");
}

handleChange(event) {
let state = this.state;
state[event.target.name] = event.target.value;
this.setState(state);
}

Validate = (e) => {
e.preventDefault();
let ErrorUserType = "";
let ErrorUserName = "";
let ErrorStartDate = "";
let ErrorStartDate1 = "";
if (this.state.UserType == "" || !this.state.UserType) {
ErrorUserType = "Please  Select User Type";
}
if (this.state.Username.length == 0 || !this.state.Username) {
ErrorUserName = "Please Enter User Name";
}
if (this.state.StartDate == null || !this.state.StartDate) {
ErrorStartDate = "Please Select StartDate";
}
var currentDate = new Date();
if (this.state.StartDate < currentDate && this.state.StartDate != null) {
ErrorStartDate1 = "Please Select A Date Greater Than Present Date";
}
this.setState({ ErrorUserType, ErrorUserName, ErrorStartDate, ErrorStartDate1 });
if (ErrorUserType != "" || ErrorUserName != "" || ErrorStartDate != "" || ErrorStartDate1 != "") {
return false;
}
else {
NewUserAction.UserDataValidation(this.state, this.state.siteUrl, this.state.currentContext);
}
}

EditContent = () => {
if (this.state.viewdata[0].Manager == null || this.state.viewdata[0].Manager.Id == -1) {
if (this.state.ManagerName.length == 0) {
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
}
if (this.state.viewdata[0].Manager == null || this.state.viewdata[0].Manager.Id == -1) {
if (this.state.ManagerName.length != 0) {
NewUserAction.getManagerTemplate(this.state, this.state.siteUrl, this.state.currentContext);
NewUserStore.on("ManagerTemplateData", this.loadManagerTemplateData.bind(this));
NewUserStore.on("Manageruserdata", this.loadManageruserdata.bind(this));
}
}
if (this.state.viewdata[0].Manager.EMail != null && this.state.ManagerName.length != 0) {
this.ManagerUpdate();
}
if (this.state.viewdata[0].Manager.EMail != null && this.state.ManagerName.length == 0) {
NewUserAction.updateSchedule(this.state, this.state.siteUrl, this.state.currentContext);
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
}

ManagerUpdate() {
if (this.state.viewdata[0].Manager.EMail == this.state.ManagerName[0].EMail) {
NewUserAction.updateUser(this.state, this.state.siteUrl, this.state.currentContext);
}
else {
NewUserAction.updateSchedule(this.state, this.state.siteUrl, this.state.currentContext);
NewUserAction.getManagerTemplate(this.state, this.state.siteUrl, this.state.currentContext);
NewUserStore.on("ManagerTemplateData", this.loadManagerTemplateData.bind(this));
NewUserStore.on("Manageruserdata", this.loadManageruserdata.bind(this));
}
}

/**UserName() is used to setstate the data from the peoplepicker to the state*/
UserName(items: any[]) {
if (items.length != 0) {
for (let i in items) {
this.setState({ Username: items[i].text, Email: items[i].secondaryText, UserId: items[i].id });
this.setState({ Clear: false });
}
}
else {
this.setState({ Clear: false, Username: [], Email: "", UserId: "" });
}
}

/** convert() is used to convert the startdate to string format*/
public convert = (type, date) => {
let startdate = new Date(date),
mnth = ("0" + (date.getMonth() + 1)).slice(-2),
day = ("0" + date.getDate()).slice(-2);
let cstartdate = [date.getFullYear(), mnth, day].join("-");
if (type == "SD") {
this.setState({ CStartDate: cstartdate });
}
}

public handleStartFromDatePicker = (dateVal) => {
this.setState({ StartDate: dateVal });
this.convert("SD", dateVal);
}

public render(): React.ReactElement<NewUserProps> {
return (
<div>
<div>
<div className="float-left col-sm-12 resp-user-config-view w-100 mb-3 user-config-heading-resp headerspacing">
<a href="#" onClick={this.clearForm.bind(this)}><img className="mt-1 back-arrow-resp mr-3 float-left" src={backArrow} /></a>
<h6 className="table-header  float-left">New User Creation</h6>
{(this.state.editviewState == "view") ?
<button className="float-right user-config-create-button " onClick={() => this.setState({ editviewState: "edit" })}  ><img className="mr-2" src={edit}/>Edit</button>: null}
</div>
<form>
<div className="col-md-12 float-left w-100">
<div className="col-md-6 col- mt-4 float-left w-100">
<div className="form-group form-padding-prop col-gray">
<label htmlFor="user-name-config">User Type <span className="mandatory-col-red">*</span></label>
<select className="form-control form-placeholder-font-size w-100" style={{ color: 'grey' }} id="user-type-config" name="UserType" disabled={this.state.editviewState == "" ? false : true} value={this.state.UserType} onChange={this.handleChange}>
<option value="">Select User Type</option>
<option value="HR">HR</option>
<option value="Manager">Manager</option>
<option value="Admin">Admin</option>
<option value="New Hire">New Hire</option>
</select>
<span style={{ color: "red" }}> {this.state.ErrorUserType}</span>
</div>
</div>
<div className="col-md-6 col- mt-4 float-left w-100">
<div className="form-group form-padding-prop col-gray">
<label htmlFor="user-name-config">User Name <span className="mandatory-col-red">*</span></label>
<div className="form-placeholder-font-size w-100 mt-2">
{this.state.Clear == false ?
<PeoplePicker
context={this.state.currentContext}
personSelectionLimit={1}
showtooltip={false}
selectedItems={this.UserName.bind(this)}
showHiddenInUI={false}
principalTypes={[PrincipalType.User]}
resolveDelay={1000}
placeholder="Select Username"
peoplePickerCntrlclassName={this.state.editviewState == "" ? "form-control " : "form-control disabledPP"}
ensureUser={true}
disabled={this.state.editviewState == "" ? false : true}
defaultSelectedUsers={[this.state.UserView]}/> : null}
{this.state.Clear == true ?
<PeoplePicker
context={this.state.currentContext}
personSelectionLimit={1}
showtooltip={true}
selectedItems={this.UserName.bind(this)}
showHiddenInUI={false}
principalTypes={[PrincipalType.User]}
resolveDelay={1000}
placeholder="Select Username"
peoplePickerCntrlclassName={this.state.editviewState == "" ? "form-control " : "form-control disabledPP"}
ensureUser={true}
disabled={this.state.editviewState == "" ? false : true}
defaultSelectedUsers={[this.state.UserNameClear]}/> : null}
</div>
<span style={{ color: "red" }}> {this.state.ErrorUserName}</span>
<span style={{ color: "red" }}> {this.state.ErrorUserData}</span>
</div>
</div>
</div>
<div className="col-md-12 float-left w-100">
<div className="col-md-6 col- mt-4  float-left w-100">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="manager-config">Manager</label>
<Typeahead
clearButton
onChange={(value) => this.setState({ ManagerName: value })}
options={this.state.ManagerNamelist}
placeholder="Select Manager"
labelKey="UserName"
selected={this.state.ManagerName.length == 0?"":this.state.ManagerName}
minLength='1'
className="form-placeholder-font-size manager-spacing"
disabled={this.state.editviewState == "view" ? true : false}/>
</div>
</div>
<div className="col-md-6 col-  mt-4 float-left w-100" >
<div className="form-group col-gray form-padding-prop">
<label htmlFor="start-date-config">Start Date <span className="mandatory-col-red">*</span></label>
<DatePicker
className="form-placeholder-font-size w-100 mt-2"
placeholder="Select Date"
value={this.state.StartDate}
onSelectDate={this.handleStartFromDatePicker.bind(this)}
disabled={this.state.editviewState == "" ? false : true} />
<span style={{ color: "red" }}> {this.state.ErrorStartDate}</span>
<span style={{ color: "red", fontSize: "11px" }}> {this.state.ErrorStartDate1}</span>
</div>
</div>
</div>
<div className="col-md-12 float-left w-100">
<div className="col-md-6 col- mt-4 float-left w-100">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="select-team-config">Team</label>
<Typeahead
clearButton
onChange={(value) => this.setState({ TeamName: value })}
options={this.state.TeamNamelist}
placeholder="Select Team"
labelKey="Team"
selected={this.state.TeamName}
minLength='1'
className="form-placeholder-font-size"
disabled={this.state.editviewState == "view" ? true : false}/>
</div>
</div>
<div className="col-md-6 col-  mt-4 float-left w-100">
<div className="form-group col-gray form-padding-prop">
<label htmlFor="select-role-config">Role</label>
<Typeahead
clearButton
onChange={(value) => this.setState({ RoleName: value })}
options={this.state.RoleNamelist}
placeholder="Select Role"
labelKey="Role"
selected={this.state.RoleName}
minLength='1'
className="form-placeholder-font-size"
disabled={this.state.editviewState == "view" ? true : false}/>
</div>
</div>
</div>
<div className="col-md-12 col- mt-4 mb-4 float-left w-100">
{this.state.editviewState == "" ?
<button type="button" className="float-right user-config-create-button " onClick={this.Validate.bind(this)}>Create</button>: null}
{this.state.editviewState == "edit" ?
<button type="button" className="float-right user-config-create-button " onClick={this.EditContent.bind(this)}>Save</button>: null}
<button type="button" className="float-right mr-3 user-config-cancel-button" onClick={this.clearForm.bind(this)}>Cancel</button>
</div></form>
</div>
</div>
);};
}
