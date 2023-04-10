/**[Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Created Date: 06/22/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let UserDataValidation = async (state, siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=Email&$filter=(Email eq '${state.Email}')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "UserDataValidation", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in UserDataValidation");
}
};
let getManagerName = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,User/Id,User/EMail,User/Title&$expand=User/UserId&$filter=(UserType eq 'Manager')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "ManagerNamelist", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in getManagerName");
}
};
let getTeamName = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Team')/items?$select=Team,Id`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json()
Dispatcher.dispatch({ type: "TeamNamelist", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in getTeamName");
}
};

let getRoleName = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Role')/items?$select=Role,Id`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "RoleNamelist", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in getRoleName");
}
};

let PostCreateUser = async (state, siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/lists/GetByTitle('UserDetails')/items`;
let teamName = -1, roleName = -1, managerName = -1;
if (state.TeamName.length != 0) {
teamName = state.TeamName[0].Id;
}
if (state.RoleName.length != 0) {
roleName = state.RoleName[0].Id;
}
if (state.ManagerName.length != 0) {
managerName = state.ManagerName[0].User.Id;
}
const JSONobj: ISPHttpClientOptions = {
body: `{UserName:'${state.Username}',UserType:'${state.UserType}',Email:'${state.Email}',StartDate:'${state.CStartDate}',
TeamId:${teamName},RoleId:${roleName},ManagerId:${managerName},UserId:${state.UserId}}`,
headers: { "accept": "application/json", "content-type": "application/json" }}
const response = await currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, JSONobj);
Dispatcher.dispatch({ type: "createuser", value: "success" });
if (state.ManagerName.length != 0) {
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const UpdateindexJson = await response2.json();
const result = UpdateindexJson.value.map((value, index) => {
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count = value.NoOfHires
let count1 = count + 1
const data1: ISPHttpClientOptions = {
body: `{ NoOfHires:${count1} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => 
});});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in PostCreateUser");
}
}

let getManagerTemplate = async (state, siteUrl, currentContext) => {
try {
let apiURL4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=BlastoffTemp/TemplateName&$expand=BlastoffTemp/Id&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response1 = await currentContext.spHttpClient.get(apiURL4, SPHttpClient.configurations.v1);
const blastoffID = await response1.json();
let blastoffvalue = blastoffID.value;
if (blastoffvalue[0].BlastoffTemp.length == 0 && state.EditId == "") {
PostCreateUser(state, siteUrl, currentContext);
} else if (blastoffvalue[0].BlastoffTemp.length == 0 && state.EditId != "") {
updateUser(state, siteUrl, currentContext);
}
else {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,User/Id,UserName,UserType,Manager/FirstName,Manager/LastName,Email,Team/Team,Role/Role,Team/Id,Role/Id&$expand=User/UserId,Team/Id,Role/Id,Manager/ManagerId&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "Manageruserdata", value: responsejson.value });
let Blastofftemp = [];
const result1 = blastoffID.value[0].BlastoffTemp.map(async (value, index) => {
let apiURL5 = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,TemplateUsage,TemplateUsageCount,ScheduleType,NoOfDaysOrWeek,StartDateType,Time,BreakpointDays,MonthlyRepitition,YearlyRepitition,MessageType,MessageContent,WeekDays/Weekdays&$expand=WeekDays/WeekDaysId&$filter=(IsActive eq 1)and(TemplateName eq'${value.TemplateName}')`;
const response2 = await currentContext.spHttpClient.get(apiURL5, SPHttpClient.configurations.v1);
const responsejson = await response2.json();
await Blastofftemp.push(await responsejson.value[0]);
if (blastoffID.value[0].BlastoffTemp.length == index + 1) {
Dispatcher.dispatch({ type: "ManagerTemplateData", value: await Blastofftemp });
}});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in getManagerTemplate");
}
}

let ScheduleManagerTemplate = async (state, siteUrl, currentContext, schedule) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,OnTrack&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response2 = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const postjson1 = await response2.json();
const result = postjson1.value.map((value, index) => {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count = value.OnTrack;
let count1 = count + schedule.length;
const data1: ISPHttpClientOptions = {
body: `{ OnTrack:${count1},Scheduled:${1}}`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL1, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});
});
if (schedule.length > 0) {
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items`;
schedule.map((value, index) => {
const data2: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}',NewHireEmail:'${value[7]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl2, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in ScheduleManagerTemplate");
}
}

let ViewUser = async (siteUrl, currentContext, EditId) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=Manager/EMail,UserName,UserType,StartDate,Email,Team/Team,Team/Id,Role/Role,Role/Id,Manager/FirstName,Manager/LastName,Manager/Id,Manager/Title&$expand=Manager/ManagerId,Team/Id,Role/Id&$filter=(ID eq '${EditId}')`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "userView", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in ViewUser");
}
};

let updateSchedule = async (state, siteUrl, currentContext) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID,Status,IsActive&$filter=(EmailId/Email eq '${state.viewdata[0].Manager.EMail}')and(NewHireEmail eq '${state.viewdata[0].Email}')and(IsActive eq 1)`;
const response2 = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const postjson1 = await response2.json();
const result = postjson1.value.map(async (value, index) => {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${value.ID}')`;
const data1: ISPHttpClientOptions = {
body: `{ IsActive:${0} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL1, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,OnTrack,NeedsAttention,Completed&$filter=(Email eq '${state.viewdata[0].Manager.EMail}')`;
const response3 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const postjson2 = await response3.json();
const result1 = postjson2.value.map((value1, index) => {
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value1.ID}')`;
if (value.Status == "On Track") {
let count = value1.OnTrack
let count1 = count - 1
const data2: ISPHttpClientOptions = {
body: `{ OnTrack:${count1} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});
}
if (value.Status == "Needs Attention") {
let count2 = value1.OnTrack
let count3 = count2 - 1
const data2: ISPHttpClientOptions = {
body: `{ NeedsAttention:${count3} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});
}
if (value.Status == "Completed") {
let count4 = value1.OnTrack
let count5 = count4 - 1
const data2: ISPHttpClientOptions = {
body: `{ Completed:${count5} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {});
}});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in updateSchedule");
}
}

let updateUser = async (state, siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.EditId}')`;
let teamName = -1, roleName = -1, managerName = -1;
if (state.TeamName.length != 0) {
teamName = state.TeamName[0].Id;
}
if (state.RoleName.length != 0) {
roleName = state.RoleName[0].Id;
}
if (state.ManagerName.length != 0) {
managerName = state.ManagerName[0].User.Id;
}
const data: ISPHttpClientOptions = {
body: `{TeamId:${teamName},RoleId:${roleName},ManagerId:${managerName}}`,
headers: {
"accept": "application/json",
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
Dispatcher.dispatch({ type: "updateUser", value: "success" });
});
if (state.viewdata[0].Manager == null || state.viewdata[0].Manager.Id == -1) {
if (state.ManagerName.length != 0) {
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response3 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const UpdateindexJson = await response3.json();
const result = UpdateindexJson.value.map((value, index) => {
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count4 = value.NoOfHires
let count5 = count4 + 1
const data3: ISPHttpClientOptions = {
body: `{ NoOfHires:${count5} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data3)
.then((response: SPHttpClientResponse) => {
});});}
}
if (state.viewdata[0].Manager.EMail != null) {
if (state.ManagerName.length == 0) {
let apiURL8 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(Email eq '${state.viewdata[0].Manager.EMail}')`;
const response6 = await currentContext.spHttpClient.get(apiURL8, SPHttpClient.configurations.v1);
const UpdateindexJson3 = await response6.json();
const result = UpdateindexJson3.value.map((value, index) => {
let apiURL9 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count6 = value.NoOfHires
let count7 = count6 - 1
const data4: ISPHttpClientOptions = {
body: `{ NoOfHires:${count7} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL9, SPHttpClient.configurations.v1, data4)
.then((response: SPHttpClientResponse) => {
});});}
}
if (state.viewdata[0].Manager.EMail != null) {
if (state.ManagerName.length != 0) {
if (state.viewdata[0].Manager.EMail != state.ManagerName[0].EMail) {
let apiURL6 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(Email eq '${state.viewdata[0].Manager.EMail}')`;
const response5 = await currentContext.spHttpClient.get(apiURL6, SPHttpClient.configurations.v1);
const UpdateindexJson1 = await response5.json();
const result1 = UpdateindexJson1.value.map((value, index) => {
let apiURL7 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count = value.NoOfHires
let count1 = count - 1
const data2: ISPHttpClientOptions = {
body: `{ NoOfHires:${count1} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL7, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});
});
if (state.ManagerName[0].User.Id != 0) {
let apiURL4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(UserId eq '${state.ManagerName[0].User.Id}')`;
const response4 = await currentContext.spHttpClient.get(apiURL4, SPHttpClient.configurations.v1);
const UpdateindexJson2 = await response4.json();
const result = UpdateindexJson2.value.map((value, index) => {
let apiURL5 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count2 = value.NoOfHires
let count3 = count2 + 1
const data1: ISPHttpClientOptions = {
body: `{ NoOfHires:${count3} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL5, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});});}}}}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in updateUser");
}
};

//multiple user creation
let MultipleUserData = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/Web/SiteUsers/?$select=Email,Id`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "MultipleUserData", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in MultipleUserData");
}
};

let MultipleTeamData = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Team')/items?$select=ID,Team`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "MultipleTeamData", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in MultipleTeamData");
}
};

let MultipleRoleData = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Role')/items?$select=ID,Role`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "MultipleRoleData", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in MultipleRoleData");
}
};

let userMailID = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=Email&$filter=(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "userMailID", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in userMailID");
}
};

let MultipleManagerData = async (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,User/Id,UserName,UserType,Manager/FirstName,Manager/LastName,Email,Team/Team,Role/Role,Team/Id,Role/Id,BlastoffTemp/TemplateName&$expand=User/UserId,Team/Id,Role/Id,Manager/ManagerId,BlastoffTemp/Id&$filter=(UserType eq 'Manager' )`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responsejson = await response.json();
Dispatcher.dispatch({ type: "MultipleManagerData", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in MultipleManagerData");
}
};

let PostMultipleCreateUser = async (siteUrl, currentContext, ValidData) => {
try {
let apiUrl = siteUrl + `/_api/lists/GetByTitle('UserDetails')/items`;
const JSONobj: ISPHttpClientOptions = {
body: `{UserName:'${ValidData.UserName}',UserType:'${ValidData.UserType}',Email:'${ValidData.Email}',StartDate:'${ValidData.StartDate}',
TeamId:${ValidData.TeamID},RoleId:${ValidData.RoleID},ManagerId:${ValidData.ManagerID},UserId:${ValidData.UserId}}`,
headers: { "accept": "application/json", "content-type": "application/json" }
}
const response = await currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, JSONobj);
Dispatcher.dispatch({type:"successPostUserMultiple", value: response.status });
if (ValidData.ManagerID != -1) {
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires&$filter=(UserId eq '${ValidData.ManagerID}')`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const UpdateindexJson = await response2.json();
const result = UpdateindexJson.value.map((value, index) => {
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
let count = value.NoOfHires
let count1 = count + 1
const data1: ISPHttpClientOptions = {
body: `{ NoOfHires:${count1} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in PostMultipleCreateUser");
}
}

let getTemplateDetails = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=ID,Role/Role,TemplateName,TemplateFor,TemplateType,TemplateUsage,TemplateUsageCount,ScheduleType,NoOfDaysOrWeek,StartDateType,Time,BreakpointDays,MonthlyRepitition,YearlyRepitition,MessageType,MessageContent,WeekDays/Weekdays&$expand=WeekDays/WeekDaysId,Role/RoleId&$filter=(IsActive eq 1)and(TemplateType eq 'Blastoff')and(TemplateFor eq 'Manager')`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "UserCreationTemplateDetails", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in getTemplateDetails");
}
};

let MultipleTemplateSchedule = async (siteUrl, currentContext, UserDetails, schedule) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,OnTrack&$filter=(UserId eq '${UserDetails[0]}')`;
const response2 = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const postjson1 = await response2.json();
let ontrack = postjson1.value[0].OnTrack;
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${UserDetails[1]}')`;
let count = ontrack + schedule.length;
const data1: ISPHttpClientOptions = {
body: `{ OnTrack:${count},Scheduled:${1} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL1, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});
if (schedule.length > 0) {
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items`;
schedule.map((value, index) => {
const data2: ISPHttpClientOptions = {
body: `{UserId:${value[0]},EmailId:${value[1]},TemplateNameId:${value[2]},Response:'${value[3]}',Status:'${value[4]}',ScheduledDateAndTime:'${value[5]}',Message:'${value[6]}',NewHireEmail:'${value[7]}'}`,
headers: {
'accept': 'application/json',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl2, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});});}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Creation in MultipleTemplateSchedule");
}
}

export {
getTeamName, getRoleName, getManagerName, PostCreateUser, UserDataValidation,
getManagerTemplate, updateUser, ViewUser, MultipleUserData,
MultipleTeamData, MultipleRoleData, ScheduleManagerTemplate, MultipleTemplateSchedule,
updateSchedule, userMailID, PostMultipleCreateUser, MultipleManagerData, getTemplateDetails
}

