/** [Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Created Date: 06/22/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let getNewUserGridData = async (siteUrl, currentContext, filterquery) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$Select=ID,TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq 1)and(TemplateFor eq 'New Hire')${filterquery}`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responsejson = await response.json()
Dispatcher.dispatch({ type: "BlastoffGrid", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in getNewUserGridData");
}
};

let getManagerGridData = async (siteUrl, currentContext, filterquery) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$Select=ID,TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq 1)and(TemplateFor eq 'Manager')${filterquery}`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responsejson = await response.json()
Dispatcher.dispatch({ type: "BlastoffGrid", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in getManagerGridData");
}
};

let getArchiveGridData = async (siteUrl, currentContext, filterquery) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$Select=ID,TemplateName,Created,TemplateUsageCount,TemplateDescription,MessageType,Author/EMail&$expand=Author/AuthorId&$filter=(TemplateType eq 'Blastoff')and(IsActive eq -1)${filterquery}`;
const response = await currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
const responsejson = await response.json()
Dispatcher.dispatch({ type: "BlastoffGrid", value: responsejson.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in getArchiveGridData");
}
};

let postDeleteUser = async (siteUrl, currentContext, delindex, DeleteTempalte) => {
try {
let apiURL1 = siteUrl +`/_api/web/lists/GetByTitle('Template')/items('${delindex}')`;
const data: ISPHttpClientOptions = {
body: `{ IsActive:0 }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
const response1 = await currentContext.spHttpClient.post(apiURL1, SPHttpClient.configurations.v1, data);
let apiURL2 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items?$select=ID,TemplateName/TemplateName&$expand=TemplateName/TemplateNameID&$filter=(TemplateName/TemplateName eq '${DeleteTempalte}')`;
const response2 = await currentContext.spHttpClient.get(apiURL2, SPHttpClient.configurations.v1);
const deleteindexJson = await response2.json();
const result = deleteindexJson.value.map((value, index) => {
let apiURL3 = siteUrl + `/_api/web/lists/GetByTitle('ScheduledTemplate')/items('${value.ID}')`;
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
currentContext.spHttpClient.post(apiURL3, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
});
});
let apiURL4 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items?$select=ID,BlastoffTemp/Id&$expand=BlastoffTemp/BlastoffTempID&$filter=(BlastoffTemp/TemplateName eq '${DeleteTempalte}')`;
const response3 = await currentContext.spHttpClient.get(apiURL4, SPHttpClient.configurations.v1);
const deleteindexJson1 = await response3.json();
const result1 = deleteindexJson1.value.map((value, index) => {
var arrindex;
var res = value.BlastoffTemp.map((value1, index) => {
if (value1.Id == delindex) {
arrindex = index;
}
});
value.BlastoffTemp.splice(arrindex, 1);
var blastoffArray = [];
var res = value.BlastoffTemp.map((value2, index) => {
blastoffArray.push(value2.Id);
});
let apiURL5 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items('${value.ID}')`;
const data2: ISPHttpClientOptions = {
body: `{ BlastoffTempId:[${blastoffArray}] }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL5, SPHttpClient.configurations.v1, data2)
.then((response: SPHttpClientResponse) => {
});
});
let apiURL6 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,BlastoffTemp/Id&$expand=BlastoffTemp/BlastoffTempID&$filter=(BlastoffTemp/TemplateName eq '${DeleteTempalte}')`;
const response4 = await currentContext.spHttpClient.get(apiURL6, SPHttpClient.configurations.v1);
const deleteindexJson2 = await response4.json();
const result3 = deleteindexJson2.value.map((value, index) => {
var arrindex;
var res = value.BlastoffTemp.map((value1, index) => {
if (value1.Id == delindex) {
arrindex = index;
}
});
value.BlastoffTemp.splice(arrindex, 1);
var blastoffArray = [];
var res = value.BlastoffTemp.map((value2, index) => {
blastoffArray.push(value2.Id);
});
let apiURL7 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
const data3: ISPHttpClientOptions = {
body: `{ BlastoffTempId:[${blastoffArray}] }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL7, SPHttpClient.configurations.v1, data3)
.then((response: SPHttpClientResponse) => {
});
});
Dispatcher.dispatch({ type: "successBlastsoffDelete", value: response1.status });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in postDeleteUser");
}
};

let postArchiveUser = async (siteUrl, currentContext, Archiveindex) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items('${Archiveindex}')`;
const data: ISPHttpClientOptions = {
body: `{ IsActive:-1 }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
const response = await currentContext.spHttpClient.post(apiURL, SPHttpClient.configurations.v1, data);
Dispatcher.dispatch({ type: "BlastoffArchive", value: response.status });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in postArchiveUser");
}
};

let postunArchiveUser = async (siteUrl, currentContext, unArchiveindex) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('Template')/items('${unArchiveindex}')`;
const data: ISPHttpClientOptions = {
body: `{ IsActive:1 }`,
headers: {
'accept': 'application/json;odata=nometadata',
"content-type": "application/json",
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
const response = await currentContext.spHttpClient.post(apiURL, SPHttpClient.configurations.v1, data);
Dispatcher.dispatch({ type: "BlastoffunArchive", value: response.status });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in postunArchiveUser");
}
};
let getCreatedBy = (siteUrl, currentContext) => {
try {
let api = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=Email,UserName&$filter=(UserType eq 'Admin')or(UserType eq 'HR')and(IsActive eq 1)`;
currentContext.spHttpClient.get(api, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "CreatedBylist", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Blastoff_Action in getCreatedBy");
}
};

export { getNewUserGridData, getManagerGridData, getArchiveGridData, postDeleteUser, postArchiveUser, postunArchiveUser, getCreatedBy }

