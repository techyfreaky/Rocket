/** [Ref] - Denotes Pseudo Code Reference
* Author: Giftson
* Created Date: 06/01/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.
* Ref: PTC_PC_9*/
import { Dispatcher } from "simplr-flux"
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

const getTemplateStatus = async (siteUrl, currentContext, listName, user, status, tab) => {
try {
if (user == null) {
if (tab == "New Hire") {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=Status,Email/Email,Email/UserType&$expand=Email/EmailId&$filter=(Status eq '${status}')and(Email/UserType eq 'New Hire')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responseJSON = await response.json();
Dispatcher.dispatch({ type: status, value: responseJSON.value.length });
}
if (tab == "Manager") {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=Status,Email/Email,Email/UserType&$expand=Email/EmailId&$filter=(Status eq '${status}')and(Email/UserType eq 'Manager')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responseJSON = await response.json();
Dispatcher.dispatch({ type: status, value: responseJSON.value.length });
}
}
else {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=Status,Email/Email&$expand=Email/Id&$filter=(Status eq '${status}')and(Email/Email eq '${user}')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responseJSON = await response.json();
Dispatcher.dispatch({ type: status, value: responseJSON.value.length });
}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in getTemplateStatus");
}
};

const getProgressTabDetails = async (siteUrl, currentContext, listName, tab, filter, top) => {
try {
if (tab == "New Hire") {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=UserName&$filter=(UserType eq 'New Hire') and (Scheduled eq 1) and (IsActive eq 1)${filter}`;
const response1 = await currentContext.spHttpClient.get(apiURL1, SPHttpClient.configurations.v1);
const responseJSON1 = await response1.json();
Dispatcher.dispatch({ type: "tabDetailsCount", value: responseJSON1.value.length });
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=UserName,Email,ID,User/EMail,Manager/FirstName,Manager/LastName,Manager/EMail,Manager/Title,Team/Team,StartDate,NeedsAttention,OnTrack,Completed&$expand=User/Id,Manager/Id,Team/Id&$top=${top}&$filter=(UserType eq 'New Hire') and (Scheduled eq 1) and (IsActive eq 1)${filter}`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const responseJSON2 = await response2.json();
Dispatcher.dispatch({ type: "tabDetails", value: responseJSON2.value });
}
else if (tab == "Manager") {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=UserName&$filter=(UserType eq 'Manager') and (Scheduled eq 1) and (IsActive eq 1)${filter}`;
const response1 = await currentContext.spHttpClient.get(apiURL1, SPHttpClient.configurations.v1);
const responseJSON1 = await response1.json();
Dispatcher.dispatch({ type: "tabDetailsCount", value: responseJSON1.value.length });
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=UserName,Email,ID,User/EMail,Team/Team,NeedsAttention,OnTrack,Completed,NoOfHires,NoOfTemplates&$expand=User/Id,Team/Id&$top=${top}&$filter=(UserType eq 'Manager') and (Scheduled eq 1) and (IsActive eq 1)${filter}`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const responseJSON2 = await response2.json();
Dispatcher.dispatch({ type: "tabDetails", value: responseJSON2.value });
}
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in getProgressTabDetails");
}
};

const postDelete = async (siteUrl, currentContext, delindex, delEmail) => {
try {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${delindex}')`;
let array = [];
const data1: ISPHttpClientOptions = {
body: `{ Scheduled:${0},NeedsAttention:${0},OnTrack:${0},Completed:${0},LoopInTempId:[],BlastoffTempId:[] }`,
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
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID,Email/Email&$expand=Email/EmailID&$filter=(Email/Email eq '${delEmail}')`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const deleteindexJson = await response.json();
const result = deleteindexJson.value.map((value, index) => {
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${value.ID}')`;
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
});
});
Dispatcher.dispatch({ type: "successDelete" });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in postDelete");
}
};

const getFilterDetails = async (siteUrl, currentContext, listName, tab) => {
try {
if (tab == "New Hire") {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=UserName,User/EMail&$expand=User/Id&$filter=(UserType eq 'Manager')and(IsActive eq 1)`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const ManagerJSON = await response.json();
Dispatcher.dispatch({ type: "FilterManager", value: ManagerJSON.value });
}
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Team')/items?$select=Team`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const TeamJSON = await response.json();
Dispatcher.dispatch({ type: "FilterTeam", value: TeamJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in getFilterDetails");
}
};

const getProgressMsgDetails = async (siteUrl, currentContext, listName, user, filter, top) => {
try {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=Email/Email&$expand=Email/EmailId&$filter=(Email/Email eq '${user}')and(IsActive eq 1)${filter}`;
const response1 = await currentContext.spHttpClient.get(apiURL1, SPHttpClient.configurations.v1);
const responseJSON1 = await response1.json();
Dispatcher.dispatch({ type: "tabMsgCount", value: responseJSON1.value.length });
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('${listName}')/items?$select=ID,TemplateName/ID,TemplateName/TemplateName,TemplateName/MessageType,ScheduledDateAndTime,Status,Response,Email/Email&$expand=TemplateName/Id,Email/Id&$top=${top}&$filter=(Email/Email eq '${user}')and(IsActive eq 1)${filter}`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const responseJSON2 = await response2.json();
Dispatcher.dispatch({ type: "tabMsgDetails", value: responseJSON2.value });
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,Email,Manager/FirstName,Manager/LastName,Manager/EMail,Manager/Title,StartDate,NoOfHires&$expand=Manager/Id&$filter=(Email eq '${user}')`;
const response3 = await currentContext.spHttpClient.get(apiURL3, SPHttpClient.configurations.v1);
const responseJSON3 = await response3.json();
Dispatcher.dispatch({ type: "tabMsgUser", value: responseJSON3.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in getProgressMsgDetails");
}
};

const getPollDetails = async (siteUrl, currentContext, tempId) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Poll')/items?$select=TemplateID/ID,PollValue&$expand=TemplateID/Id&$filter=(PollOrder eq 0) and (TemplateID/ID eq '${tempId}')`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responseJSON = await response.json();
Dispatcher.dispatch({ type: "pollDetail", value: responseJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in getPollDetails");
}
};

const postDeleteMsg = async (siteUrl, currentContext, delIndex, user) => {
try {
let apiURL1 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=Status&$filter=(ID eq ${delIndex})`;
const response1 = await currentContext.spHttpClient.get(apiURL1, SPHttpClient.configurations.v1);
const responseJSON1 = await response1.json();
const status1 = await responseJSON1.value[0].Status;
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,UserType,BlastoffTemp/TemplateName,OnTrack,NeedsAttention,Completed&$expand=BlastoffTemp/BlastoffTempId&$filter=(Email eq '${user}')`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const responseJSON2 = await response2.json();
const status2 = await responseJSON2.value[0];
let ontrack = status2.OnTrack, needsattention = status2.NeedsAttention, completed = status2.Completed;
switch (status1) {
case "On Track":
ontrack -= 1;
break;
case "Needs Attention":
needsattention -= 1;
break;
case "Completed":
completed -= 1;
break;
}
let total = status2.OnTrack + status2.NeedsAttention + status2.Completed;
let scheduled;
if (total = 1) {
if (status2.UserType == "Manager" && status2.BlastoffTemp.length != 0) {
scheduled = 1;
}
else {
scheduled = 0;
}
}
else {
scheduled = 1;
}
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${delIndex}')`;
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
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
})
let apiURL4 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${status2.ID}')`;
const data: ISPHttpClientOptions = {
body: `{Completed:${completed},OnTrack:${ontrack},NeedsAttention:${needsattention},Scheduled:${scheduled} }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL4, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
Dispatcher.dispatch({ type: "successMsgDelete", value: response.status });
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Progress_Action in postDeleteMsg");
}
};

export { getTemplateStatus, getProgressTabDetails, postDelete, getFilterDetails, getProgressMsgDetails, getPollDetails, postDeleteMsg };

