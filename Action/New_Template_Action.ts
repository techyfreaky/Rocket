/** [Ref] - Denotes Pseudo Code Reference
 * Author: Giftson
 * Created Date: 06/22/2020
 * Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.
 * Ref: NT_PC_36 */
import { Dispatcher } from "simplr-flux"
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { IFile } from "@pnp/sp/files";
import * as Exception from './Exception_Action';

const getRole = async (siteUrl, currentContext) => {
    try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Role')/items?$select=Role,ID`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const TeamJSON = await response.json();
Dispatcher.dispatch({ type: "RoleDetails", value: TeamJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in getRole");
}
};

const gettempName = async (siteUrl, currentContext, tempName) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=TemplateName&$filter=(TemplateName eq '${tempName}')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const TempJSON = await response.json();
Dispatcher.dispatch({ type: "tempName", value: TempJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in gettempName");
}
};

const postTemplate = async (siteUrl, currentContext, state) => {
try {
let noOfDays = null, ScheduleType = "", startdateType, time = state.time, breakpoint = null, weekdays = [], yearlyDate = null, monthlyRep = "", tempMsg = state.tempMsg;
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items`;
if (state.tempUsage == "Single") {
noOfDays = parseInt(state.noofDaysSingle);
startdateType = state.startdateType;
}
else if (state.tempUsage == "Multiple" && state.scheduleType == "Daily") {
ScheduleType = state.scheduleType;
startdateType = state.startdateType;
breakpoint = parseInt(state.breakpointDaily);
}
else if (state.tempUsage == "Multiple" && state.scheduleType == "Weekly") {
ScheduleType = state.scheduleType;
startdateType = state.startdateType;
breakpoint = parseInt(state.breakpointWeekly);
weekdays = state.weekdays;
}
else if (state.tempUsage == "Multiple" && state.scheduleType == "Monthly") {
noOfDays = parseInt(state.monthlyRep == "Day" ? state.noofDaysMonthly : state.noofWeeksMonthly);
ScheduleType = state.scheduleType;
startdateType = state.startdateType;
breakpoint = parseInt(state.breakpointMonthly);
weekdays = state.monthlyRep == "Day" ? [] : state.weekdays;
monthlyRep = state.monthlyRep;
}
else if (state.tempUsage == "Multiple" && state.scheduleType == "Yearly") {
ScheduleType = state.scheduleType;
startdateType = "";
yearlyDate = state.convertedDate;
}
if (state.messageType == "Poll") {
tempMsg = "";
}
const data1: ISPHttpClientOptions = {
body: `{TemplateType:'${state.templateType}',TemplateFor:'${state.userType}',RoleId:[${state.tempRoleId}],TemplateName:'${state.tempName}',TemplateDescription:"${state.tempDesc}",TemplateUsage:'${state.tempUsage}',ScheduleType:'${ScheduleType}',NoOfDaysOrWeek:${noOfDays},WeekDaysId:[${weekdays}],StartDateType:'${startdateType}',Time:'${time}',BreakpointDays:${breakpoint},MonthlyRepitition:'${monthlyRep}',YearlyRepitition:${yearlyDate},MessageType:'${state.messageType}',MessageContent:"${state.tempMsg}",DocumentName:'${state.documentName}'}`,
headers: {
"accept": "application/json",
"content-type": "application/json",
}
};
const response = await currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data1)
const respJSON = await response.json();
const tempid = await respJSON.ID;
Dispatcher.dispatch({ type: "postTemplate", value: "Success" });
if (state.templateType == "LoopIn" && state.formMode == "create") {
let web = Web(siteUrl);
let index = siteUrl.indexOf('.com');
let relativeUrl = siteUrl.slice(index + 4, siteUrl.length);
let fileName = state.tempName + ".png";
const response = await web.getFolderByServerRelativeUrl(relativeUrl + "/LoopInsLibrary/").files.add(fileName, state.loopinImage, true);
Dispatcher.dispatch({ type: "postLoopinImg", value: "Success" });
}

if (state.messageType == "Poll") {
postPoll(siteUrl, currentContext, state, tempid)
}
if (state.messageType == "Document") {
const samp = state.documentFiles.map(async (value, index) => {
let web = Web(siteUrl);
let rindex = siteUrl.indexOf('.com');
let relativeUrl = siteUrl.slice(rindex + 4, siteUrl.length);
const response = await web.getFolderByServerRelativeUrl(relativeUrl + "/DocumentLibrary/").files.add(value.name, value, true);
Dispatcher.dispatch({ type: "postDoc", value: "Success" });
});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in postTemplate");
}
};
/** Ref: NT_PC_45 postPoll function is used to insert the poll details*/
const postPoll = async (siteUrl, currentContext, state, tempid) => {
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('Poll')/items`;
const samp = await state.pollVal.map((value, index) => {
if (state.pollSize.length + 1 > index) {
const data2: ISPHttpClientOptions = {
body: `{TemplateIDId:${tempid},PollOrder:${index},PollValue:'${value}'}`,
headers: {
"accept": "application/json",
"content-type": "application/json",
}
};
currentContext.spHttpClient.post(apiUrl2, SPHttpClient.configurations.v1, data2)
.then((response2: SPHttpClientResponse) => {
if (state.pollSize.length == index && response2.status == 201) {
Dispatcher.dispatch({ type: "postPollSuccess", value: "Success" });
}});}});
}

const gettemplate = async (siteUrl, currentContext, tempID) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=*,Role/Role,Role/Id,Role/ID,WeekDays/Id&$expand=Role/Id,WeekDays/Id&$filter=(ID eq ${tempID})and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const TempJSON = await response.json();
Dispatcher.dispatch({ type: "tempDetails", value: TempJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in gettemplate");
}
};

const getPoll = async (siteUrl, currentContext, tempID) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Poll')/items?$select=*&$filter=(TemplateID eq ${tempID})`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const PollJSON = await response.json();
Dispatcher.dispatch({ type: "pollDetails", value: PollJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in getPoll");
}
};

const getDocument = async (siteUrl, currentContext, fileArr) => {
try {
var docFiles = [];
let index = siteUrl.indexOf('.com');
let web = Web(siteUrl);
let relativeUrl = siteUrl.slice(index + 4, siteUrl.length);
const result = await fileArr.map(async (value, index) => {
var blob = await web.getFileByServerRelativeUrl(relativeUrl + "/DocumentLibrary/" + value).getBlob();
var file = await new File([blob], value, { lastModified: Date.now() });
Dispatcher.dispatch({ type: "docDetails", value: file });
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in getDocument");
}
};

const postDeleteTemp = async (siteUrl, currentContext, delIndex) => {
try {
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items('${delIndex}')`;
const data2: ISPHttpClientOptions = {
body: `{ IsActive:${0} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL2, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
Dispatcher.dispatch({ type: "successTempDelete", value: "Success" });
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "New_Template_Action in postDeleteTemp");
}
};

export { getRole, postTemplate, gettempName, gettemplate, getPoll, getDocument, postDeleteTemp, postPoll };

