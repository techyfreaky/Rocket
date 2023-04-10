/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Created Date: 05/28/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.
* Ref: UC_PC_36 */
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let getUserGridData = (siteUrl, currentContext, filterquery, top) => {
try {
let filter = "";
if (filterquery == "") {
filter = "&$orderby=Created desc";
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=Scheduled,Todo,UserName,User/FirstName,User/LastName,User/EMail,Manager/FirstName,Manager/LastName,Manager/EMail,Manager/Title,UserType,StartDate,ID,Email&$expand=User/UserId,Manager/ManagerId&$top=${top}&$filter=(IsActive eq 1)` + filterquery + filter;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "userConfigGrid", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserGridData");
}
};

let getUserGridCount = (siteUrl, currentContext,filterquery) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$filter=(IsActive eq 1)`+filterquery;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "countUserConfig", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getUserGridCount");
}
};

let getManagerName = (siteUrl, currentContext) => {
try {
let api = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,User/EMail&$expand=User/UserId&$filter=(UserType eq 'Manager') and (IsActive eq 1)`;
currentContext.spHttpClient.get(api, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "managernamelist", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in getManagerName");
}
};

let postDeleteUser = async (siteUrl, currentContext, state) => {
try {
if (state.manageremail != "") {
let onTrack, Completed, NeedsAttention;
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID,Status&$filter=(NewHireEmail eq '${state.delemail}')and (IsActive eq 1)`;
const response2 = await currentContext.spHttpClient.get(apiUrl2, SPHttpClient.configurations.v1);
const array1 = await response2.json();
if (array1.value.length > 0) {
const a = array1.value.map((value, index) => {
if (value.Status == "On Track") {
onTrack += 1;
}
if (value.Status == "Completed") {
Completed += 1;
}
if (value.Status == "Needs Attention") {
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
});});
}
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID&$filter=(EmailId/Email eq '${state.manageremail}' and IsActive eq ${1})`;
const response3 = await currentContext.spHttpClient.get(apiUrl4, SPHttpClient.configurations.v1);
const array3 = await response3.json();
let val = await array3.value.length, scheduled;
if (val == 0) {
scheduled = 0;
}
else {
scheduled = 1;
}
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,NoOfHires,OnTrack,Completed,NeedsAttention&$filter=(Email eq '${state.manageremail}')`;
const response1 = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const array = await response1.json();
let index = await array.value[0].ID;
let newcount = await array.value[0].NoOfHires - 1;
let newOnTrack = await array.value[0].OnTrack - onTrack;
let newCompleted = await array.value[0].Completed - Completed;
let newNeedsAttention = await array.value[0].NeedsAttention - NeedsAttention;
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${index}')`;
const data: ISPHttpClientOptions = {
body: `{ NoOfHires:${newcount},Scheduled:${scheduled},OnTrack:${newOnTrack},Completed:${newCompleted},NeedsAttention:${newNeedsAttention}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});
}
if (state.delUserType == "Manager") {
let apiUrl4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,Manager/EMail&$expand=Manager/ManagerId&$filter=(ManagerId/EMail eq '${state.delemail}')and (IsActive eq 1)`;
const response3 = await currentContext.spHttpClient.get(apiUrl4, SPHttpClient.configurations.v1);
const array = await response3.json();
if (array.value.length > 0) {
const a = array.value.map((value, index) => {
if (value.Manager.EMail == state.delemail) {
let apiUrl5 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
const data2: ISPHttpClientOptions = {
body: `{ ManagerId:${-1}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl5, SPHttpClient.configurations.v1, data2)
.then((response3: SPHttpClientResponse) => {
});}})}
}
if (state.Scheduled == 1) {
let apiUrl6 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID&$filter=(EmailId/Email eq '${state.delemail}')and (IsActive eq 1)`;
const response4 = await currentContext.spHttpClient.get(apiUrl6, SPHttpClient.configurations.v1);
const array = await response4.json();
if (array.value.length > 0) {
const a = array.value.map((value, index) => {
let apiUrl7 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${value.ID}')`;
const data3: ISPHttpClientOptions = {
body: `{ IsActive:${0}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl7, SPHttpClient.configurations.v1, data3)
.then((response4: SPHttpClientResponse) => {
});});}
}
else if (state.Todo == 1) {
let apiUrl8 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items?$select=ID&$filter=(EmailId/Email eq '${state.delemail}') and (IsActive eq 1)`;
const response4 = await currentContext.spHttpClient.get(apiUrl8, SPHttpClient.configurations.v1);
const array = await response4.json();
if (array.value.length > 0) {
const a = array.value.map((value, index) => {
let apiUrl9 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items('${value.ID}')`;
const data4: ISPHttpClientOptions = {
body: `{ IsActive:${0}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl9, SPHttpClient.configurations.v1, data4)
.then((response5: SPHttpClientResponse) => {
});});}
}
let apiUrl10 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${state.delindex}')`;
const data5: ISPHttpClientOptions = {
body: `{ IsActive:${0},Scheduled:${0},OnTrack:${0},Completed:${0},NeedsAttention:${0}}`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl10, SPHttpClient.configurations.v1, data5)
.then((response6: SPHttpClientResponse) => {
if (response6.status == 204) {
Dispatcher.dispatch({ type: "successDeleteUserConfig", value: response6.status });}});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "User_Template_Creation in postDeleteUser");
}
};

export { getUserGridData, getUserGridCount, getManagerName, postDeleteUser };

