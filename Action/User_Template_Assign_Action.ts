/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Created Date: 06/05/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, SPHttpClientConfiguration } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';
import { containsInvalidFileFolderChars } from "@pnp/sp";

let getUserConfigList = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,User/EMail,User/Id&$expand=User/UserId&$filter=(IsActive eq 1) and (Scheduled eq 0) and (Todo eq 0) and ((UserType eq 'New Hire') or (UserType eq 'Manager'))`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "userconfig", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserConfigList");
}
};

let getUserDetails = (siteUrl, currentContext, Email, gfstate) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,UserName,StartDate,UserType,Email,Team/Team,Role/Role,Manager/FirstName,Manager/LastName,Manager/Title,User/ID&$expand=Team/TeamId,Role/RoleId,Manager/ManagerId,User/UserId&$filter=(Email eq '${Email}')and(IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
if (gfstate == "form") {
Dispatcher.dispatch({ type: "userdetails", value: responseJSON.value });
}
else if (gfstate == "grid") {
Dispatcher.dispatch({ type: "userdetails1", value: responseJSON.value });
}});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserDetails");
}
};

let getBlastoffs = (siteUrl, currentContext, UserType, Role) => {
try {
let apiUrl = "";
if (Role != "No Role Assigned") {
apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateName&$filter=((TemplateType eq 'Blastoff') and (IsActive eq 1) and (TemplateFor eq '${UserType}')) or ((TemplateType eq 'Blastoff') and (IsActive eq 1) and (TemplateFor eq '${UserType}') and (RoleId/Role eq '${Role}'))`;
}
else {
apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateName&$filter=(TemplateType eq 'Blastoff') and (IsActive eq 1) and (TemplateFor eq '${UserType}')`;
}
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "blastoff", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getBlastoffs");
}
};

let getLoopIns = (siteUrl, currentContext, Role) => {
try {
let apiUrl = "";
if (Role != "No Role Assigned") {
apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateName&$filter=((TemplateType eq 'LoopIn') and (IsActive eq 1)) or ((TemplateType eq 'LoopIn') and (IsActive eq 1) and (RoleId/Role eq '${Role}'))`;
}
else {
apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateName&$filter=(TemplateType eq 'LoopIn') and (IsActive eq 1)`;
}
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "loopin", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getLoopIns");
}
};

let getUserScheduleAssign = (siteUrl, currentContext, Id) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=BlastoffTemp/TemplateName,LoopInTemp/TemplateName,UserName,UserType,StartDate,Email&$expand=BlastoffTemp/BlastoffTempId,LoopInTemp/LoopInTempId&$filter=(ID eq ${Id})`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "userschedule", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserScheduleAssign");
}
}

let getUserTodoAssign = (siteUrl, currentContext, Id, gfstate) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items?$select=Comments,BlastoffTemp/TemplateName,LoopInTemp/TemplateName,Email/UserName,Email/UserType,Email/StartDate,Email/Email&$expand=BlastoffTemp/BlastoffTempId,LoopInTemp/LoopInTempId&$expand=Email/EmailId&$filter=(ID eq ${Id})`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
if (gfstate == "form") {
Dispatcher.dispatch({ type: "usertodo", value: responseJSON.value });
}
else if (gfstate == "grid") {
Dispatcher.dispatch({ type: "usertodo1", value: responseJSON.value });
}});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserTodoAssign");
}
};

let postTodo = (siteUrl, currentContext, array) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items`;
if (array[2].length > 0 && array[1].length > 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},BlastoffTempId:[${array[1]}],LoopInTempId:[${array[2]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[1].length > 0 && array[2].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},BlastoffTempId:[${array[1]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[2].length > 0 && array[1].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},LoopInTempId:[${array[2]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[1].length == 0 && array[2].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${array[3]}')`;
const data1: ISPHttpClientOptions = {
body: `{Todo:${1}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
if (response.status == 204) {
Dispatcher.dispatch({ type: "TodoStatus", value: "success" });
}});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in postTodo");
}
};

let updateTodo = (siteUrl, currentContext, state) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items('${state.editId}')`;
const data: ISPHttpClientOptions = {
body: `{BlastoffTempId:[${state.PostBlastoff}],LoopInTempId:[${state.PostLoopIn}],Comments:'${state.Comments}'}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
if (response.status == 204) {
Dispatcher.dispatch({ type: "updateTodoStatus", value: "success" });
}});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in updateTodo");
}
};

let getManagerAssignedDetails = (siteUrl, currentContext, Email, gfstate) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,StartDate,Email,Team/Team,Role/Role&$expand=Team/TeamId&$expand=Role/RoleId&$filter=(ManagerId/EMail eq '${Email}')`;
currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
if (gfstate == "grid") {
Dispatcher.dispatch({ type: "managerAssigned", value: responseJSON.value });
}
else if (gfstate == "form") {
Dispatcher.dispatch({ type: "managerAssignedDetails", value: responseJSON.value });}});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getManagerAssignedDetails");
}
};

let getBlastoffTempDetails = (siteUrl, currentContext, Template, gfstate) => {
try {
let filterquery = "";
if (Template.length > 0) {
Template.map((value, index) => {
if (index == 0) {
filterquery += `(ID eq ${value})`;
}
else {
filterquery += `or(ID eq ${value})`;
}});
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateUsage,TemplateUsageCount,ScheduleType,NoOfDaysOrWeek,StartDateType,Time,BreakpointDays,MonthlyRepitition,YearlyRepitition,MessageType,MessageContent,WeekDays/Weekdays&$expand=WeekDays/WeekDaysId&$filter=${filterquery}`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
if (gfstate == "grid") {
Dispatcher.dispatch({ type: "TodoBlastoffTempDetails", value: responseJSON.value });
}
else if (gfstate == "form") {
Dispatcher.dispatch({ type: "BlastoffTempDetails", value: responseJSON.value });
}
});
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getBlastoffTempDetails");
}
};
let getLoopInTempDetails = (siteUrl, currentContext, Template, gfstate) => {
try {
let filterquery = "";
if (Template.length > 0) {
Template.map((value, index) => {
if (index == 0 && filterquery == "") {
filterquery += `(ID eq ${value})`;
}
else {
filterquery += `or(ID eq ${value})`;
}});
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateUsage,ScheduleType,NoOfDaysOrWeek,StartDateType,Time,BreakpointDays,MonthlyRepitition,YearlyRepitition,MessageType,MessageContent,WeekDays/Weekdays&$expand=WeekDays/WeekDaysId&$filter=${filterquery}`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
if (gfstate == "grid") {
Dispatcher.dispatch({ type: "TodoLoopInTempDetails", value: responseJSON.value });
}
else if (gfstate == "form") {
Dispatcher.dispatch({ type: "LoopInTempDetails", value: responseJSON.value });
}});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getLoopInTempDetails");
}
};

let postSchedule = async (siteUrl, currentContext, schedule, state, TempType, schedulestatus) => {
try {
let Template, newontrack, tempcount, schedulecount;
if (schedulestatus == "noschedule") {
schedulecount = 0
}
else if (schedulestatus == "") {
schedulecount = 1;
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=OnTrack,NoOfTemplates&$filter=(ID eq '${state.UserId}')`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const array = await response.json();
newontrack = array.value[0].OnTrack + schedule.length;
if (TempType == "Blastoff") {
Template = state.ABlastoff;
tempcount = array.value[0].NoOfTemplates + Template.length;
}
else if (TempType == "LoopIn") {
Template = state.ALoopIn;
tempcount = array.value[0].NoOfTemplates + Template.length;
}
if (schedule.length > 0) {
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items`;
schedule.map((value, index) => {
if (value.length == 7) {
const data: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});
}
else if (value.length == 8) {
const data: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}',NewHireEmail:'${value[7]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});}});
}
Template.map((value, index) => {
let NewTempCount;
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=TemplateUsageCount&$filter=(ID eq '${value}')`;
currentContext.spHttpClient.get(apiUrl2, SPHttpClient.configurations.v1)
.then((response2: SPHttpClientResponse) => {
response2.json().then((responseJSON: any) => {
NewTempCount = responseJSON.value[0].TemplateUsageCount + 1;
let apiUrl3 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items('${value}')`;
const data1: ISPHttpClientOptions = {
body: `{TemplateUsageCount:${NewTempCount}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl3, SPHttpClient.configurations.v1, data1)
.then((response3: SPHttpClientResponse) => {
});});});
});
if (TempType == "Blastoff") {
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.UserId}')`;
const data2: ISPHttpClientOptions = {
body: `{Scheduled:${schedulecount},Todo:${0},BlastoffTempId:[${Template}],NoOfTemplates:${tempcount},OnTrack:${newontrack}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl4, SPHttpClient.configurations.v1, data2)
.then((response4: SPHttpClientResponse) => {
if (response4.status == 204) {
Dispatcher.dispatch({ type: "schedulestatus", value: "Blastoff" });
}});
}
else if (TempType == "LoopIn") {
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.UserId}')`;
const data2: ISPHttpClientOptions = {
body: `{Scheduled:${1},Todo:${0},LoopInTempId:[${Template}],NoOfTemplates:${tempcount},OnTrack:${newontrack}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl4, SPHttpClient.configurations.v1, data2)
.then((response5: SPHttpClientResponse) => {
if (response5.status == 204) {
Dispatcher.dispatch({ type: "schedulestatus", value: "LoopIn" });
}});
}
if (state.gridState == true) {
let apiUrl5 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items('${state.todoGridId}')`;
const data3: ISPHttpClientOptions = {
body: `{IsActive:${0}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl5, SPHttpClient.configurations.v1, data3)
.then((response6: SPHttpClientResponse) => {
});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in postSchedule");
}
};

let updateSchedule = async (siteUrl, currentContext, delarray, state) => {
try {
let filterquery = "", OnTrack = 0, Completed = 0, NeedsAttention = 0, updateArray = [];
delarray.map((value, index) => {
if (index == 0) {
filterquery += `(TemplateNameId/ID eq ${value})`;
}
else {
filterquery += `or(TemplateNameId/ID eq ${value})`
}
});
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID,Status&$filter=(EmailId/Email eq '${state.UserMail}') and (${filterquery})`;
console.log("apiURL:",apiUrl2);
const response1 = await currentContext.spHttpClient.get(apiUrl2, SPHttpClient.configurations.v1);
const array = await response1.json();
const a = array.value.map((value, index) => {
if (value.Status == "Completed") {
Completed += 1;
}
else if (value.Status == "On Track") {
OnTrack += 1;
}
else if (value.Status == "Needs Attention") {
NeedsAttention += 1;
}
let apiUrl3 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${value.ID}')`;
const data1: ISPHttpClientOptions = {
body: `{ IsActive:${0}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl3, SPHttpClient.configurations.v1, data1)
.then((response2: SPHttpClientResponse) => {
});
});
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=NoOfTemplates,OnTrack,NeedsAttention,Completed&$filter=(ID eq '${state.editId}')`;
console.log("apiUrl:",apiUrl4);
const response3 = await currentContext.spHttpClient.get(apiUrl4, SPHttpClient.configurations.v1);
const array1 = await response3.json();
let POnTrack = array1.value[0].OnTrack;
let newOnTrack = POnTrack - OnTrack;
let PNeedsAttention = array1.value[0].NeedsAttention;
let newNeedsAttention = PNeedsAttention - NeedsAttention;
let PCompleted = array1.value[0].Completed;
let newCompleted = PCompleted - Completed;
let count = state.UBlastoffAssigned.length + state.ULoopInAssigned.length;
let apiUrl5 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.editId}')`;
const data2: ISPHttpClientOptions = {
body: `{NoOfTemplates:${count},BlastoffTempId:[${state.UBlastoffAssigned}],LoopInTempId:[${state.ULoopInAssigned}],OnTrack:${newOnTrack},NeedsAttention:${newNeedsAttention},Completed:${newCompleted}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl5, SPHttpClient.configurations.v1, data2)
.then((response4: SPHttpClientResponse) => {
});
let apiUrl6 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserType,BlastoffTemp/TemplateName,NoOfTemplates,OnTrack,NeedsAttention,Completed&$expand=BlastoffTemp/BlastoffTempId&$filter=(ID eq '${state.editId}')`;
console.log("apiUrL:",apiUrl6);
const response5 = await currentContext.spHttpClient.get(apiUrl6, SPHttpClient.configurations.v1);
const array2 = await response5.json();
let apiUrl7 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID&$filter=(EmailId/Email eq '${state.UserMail}' and IsActive eq ${1})`;
console.log("apiUrl:",apiUrl7);
const response6 = await currentContext.spHttpClient.get(apiUrl7, SPHttpClient.configurations.v1);
const array3 = await response6.json();
let val = await array3.value.length, scheduled;
if (val == 0) {
if (array2.value[0].UserType == "Manager" && array2.value[0].BlastoffTemp.length != 0) {
scheduled = 1;
}
else {
scheduled = 0;
}
}
else {
scheduled = 1;
}
let apiUrl8 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.editId}')`;
console.log("apiUrl:",apiUrl8);
const data3: ISPHttpClientOptions = {
body: `{ Scheduled:${scheduled}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl8, SPHttpClient.configurations.v1, data3)
.then((response7: SPHttpClientResponse) => {
updateArray.push(response7.status);
if (state.updateCount == 2 && updateArray.length == 2) {
if (updateArray[0] == 204 && updateArray[1] == 204) {
Dispatcher.dispatch({ type: "updateStatus", value: response7.status });
}
}
else if (state.updateCount == 1 && updateArray.length == 1) {
if (updateArray[0] == 204) {
Dispatcher.dispatch({ type: "updateStatus", value: response7.status });
}}});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in updateSchedule");
}
};

/*Multiple Template Assign*/
let getUserDetail = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,UserName,Scheduled,Todo,User/Id,StartDate,UserType,Email,Team/Team,Role/Role,Manager/FirstName,Manager/LastName,Manager/Title,Manager/EMail,User/ID&$expand=User/UserId,Team/TeamId,Role/RoleId,Manager/ManagerId,User/UserId&$filter=(IsActive eq 1) and (Scheduled eq 0) and (Todo eq 0)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
console.log("user details resp:",responseJSON);
Dispatcher.dispatch({ type: "userdetail", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserDetail");
}
};

let getUserDetail1 = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,UserName,Scheduled,Todo,User/Id,StartDate,UserType,Email,Team/Team,Role/Role,Manager/FirstName,Manager/LastName,Manager/Title,Manager/EMail,User/ID&$expand=User/UserId,Team/TeamId,Role/RoleId,Manager/ManagerId,User/UserId&$filter=(IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "userdetail1", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserDetail1");
}
};

let getTemplateDetails = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,Role/Role,TemplateName,TemplateFor,TemplateType,TemplateUsage,TemplateUsageCount,ScheduleType,NoOfDaysOrWeek,StartDateType,Time,BreakpointDays,MonthlyRepitition,YearlyRepitition,MessageType,MessageContent,WeekDays/Weekdays&$expand=WeekDays/WeekDaysId,Role/RoleId&$filter=(IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "TemplateDetails", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getTemplateDetails");
}
};

let postmultipleTodo = (siteUrl, currentContext, array, index) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items`;
if (array[2].length > 0 && array[1].length > 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},BlastoffTempId:[${array[1]}],LoopInTempId:[${array[2]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[1].length > 0 && array[2].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},BlastoffTempId:[${array[1]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[2].length > 0 && array[1].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},LoopInTempId:[${array[2]}],EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
else if (array[1].length == 0 && array[2].length == 0) {
const data: ISPHttpClientOptions = {
body: `{UserId:${array[0]},EmailId:${array[3]},Comments:'${array[4]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});
}
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${array[3]}')`;
const data1: ISPHttpClientOptions = {
body: `{Todo:${1}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data1)
.then((response1: SPHttpClientResponse) => {
if (response1.status == 204) {
Dispatcher.dispatch({ type: "multipleTodoStatus", value: index + 1 });
}});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in postmultipleTodo");
}
}

let postMultipleSchedule = async (siteUrl, currentContext, schedule, UserId, blarray, TempType, index, schedulestatus) => {
try {
let Template, newontrack, tempcount, schedulecount;
if (schedulestatus == "noschedule") {
schedulecount = 0
}
else if (schedulestatus == "") {
schedulecount = 1;
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=OnTrack,NoOfTemplates&$filter=(ID eq '${UserId}')`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const array = await response.json();
newontrack = array.value[0].OnTrack + schedule.length;
if (TempType == "Blastoff") {
Template = blarray;
tempcount = array.value[0].NoOfTemplates + Template.length;
}
else if (TempType == "LoopIn") {
Template = blarray;
tempcount = array.value[0].NoOfTemplates + Template.length;
}
if (schedule.length > 0) {
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items`;
schedule.map((value, index) => {
if (value.length == 7) {
const data: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});
}
else if (value.length == 8) {
const data: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}',NewHireEmail:'${value[7]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});}});
}
Template.map((value, index) => {
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=TemplateUsageCount&$filter=(ID eq '${value}')`;
currentContext.spHttpClient.get(apiUrl2, SPHttpClient.configurations.v1)
.then((response2: SPHttpClientResponse) => {
response2.json().then((responseJSON1: any) => {
let NewTempCount = responseJSON1.value[0].TemplateUsageCount + 1;
let apiUrl3 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items('${value}')`;
const data1: ISPHttpClientOptions = {
body: `{TemplateUsageCount:${NewTempCount}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl3, SPHttpClient.configurations.v1, data1)
.then((response3: SPHttpClientResponse) => {
});});});
});
if (TempType == "Blastoff") {
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${UserId}')`;
const data2: ISPHttpClientOptions = {
body: `{Scheduled:${schedulecount},Todo:${0},BlastoffTempId:[${Template}],NoOfTemplates:${tempcount},OnTrack:${newontrack}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl4, SPHttpClient.configurations.v1, data2)
.then((response4: SPHttpClientResponse) => {
if (response4.status == 204) {
Dispatcher.dispatch({ type: "multipleScheduleBStatus", value: index + 1 });
}
});
}
else if (TempType == "LoopIn") {
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${UserId}')`;
const data2: ISPHttpClientOptions = {
body: `{Scheduled:${1},Todo:${0},LoopInTempId:[${Template}],NoOfTemplates:${tempcount},OnTrack:${newontrack}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl4, SPHttpClient.configurations.v1, data2)
.then((response4: SPHttpClientResponse) => {
if (response4.status == 204) {
Dispatcher.dispatch({ type: "multipleScheduleLStatus", value: index + 1 });
}});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in postMultipleSchedule");
}
}

export { getUserConfigList, getUserDetails, getBlastoffs, getLoopIns, getUserScheduleAssign, getUserTodoAssign, postTodo, updateTodo, getManagerAssignedDetails, getBlastoffTempDetails, getLoopInTempDetails, postSchedule, updateSchedule, getUserDetail, getUserDetail1, getTemplateDetails, postMultipleSchedule, postmultipleTodo };

