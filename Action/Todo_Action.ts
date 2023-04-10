/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Created Date: 06/04/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let getTodoGridData = async (siteUrl, currentContext, filterquery) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items?$select=ID,User/ID,Email/Id,Email/Email,Email/UserName,Email/UserType,Email/StartDate,LoopInTemp/TemplateName,BlastoffTemp/TemplateName&$expand=User/UserId,Email/EmailId,LoopInTemp/LoopInTempId,BlastoffTemp/BlastoffTempId&$filter=(IsActive eq 1)` + filterquery;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "TodoGrid", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Todo_Action in getTodoGridData");
}
};

let getBlastoff = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=Id,TemplateName&$filter=(TemplateType eq 'Blastoff') and (IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "blastoffs", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Todo_Action in getBlastoff");
}
};

let getLoopin = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('Template')/items?$select=Id,TemplateName&$filter=(TemplateType eq 'LoopIn') and (IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "loopins", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Todo_Action in getLoopin");
}
};

let postDeleteTodo = async (siteUrl, currentContext, delindex, delemail) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=ID,Email&$filter=(Email eq '${delemail}')`;
const response1 = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const array = await response1.json();
const a = array.value.map((value, index) => {
if (value.Email == delemail) {
let apiUrl1 = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items('${value.ID}')`;
const data: ISPHttpClientOptions = {
body: `{ Todo:${0} }`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl1, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
});}
});
let apiUrl2 = siteUrl + `/_api/web/lists/GetByTitle('TodoTemplate')/items('${delindex}')`;
const data1: ISPHttpClientOptions = {
body: `{ IsActive:${0} }`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiUrl2, SPHttpClient.configurations.v1, data1)
.then((response: SPHttpClientResponse) => {
Dispatcher.dispatch({ type: "success", value: response.status });
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Todo_Action in postDeleteTodo");
}
};

export { getTodoGridData, getBlastoff, getLoopin, postDeleteTodo };

