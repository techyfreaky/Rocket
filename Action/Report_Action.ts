/**[Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Created Date: 06/16/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let getReportGridData = (siteUrl, currentContext, filterquery, top) => {
try {
let filter = "";
if (filterquery == "") {
filter = "&$orderby=Created desc";
}
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('ReportList')/items?$select=ID,Created,ReportName,Author/FirstName,Author/LastName,Author/EMail,Author/Title&$expand=Author/AuthorId&$top=${top}&$filter=(IsActive eq 1)` + filterquery + filter;
currentContext.spHttpClient.get(apiURL, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "ReportGrid", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Report_Action in getReportGridData");
}
};

let getReportGridCount = (siteUrl, currentContext,filterquery) => {
try {
let countapiURL = siteUrl + `/_api/web/lists/GetByTitle('ReportList')/items?$filter=(IsActive eq 1)`+filterquery;
currentContext.spHttpClient.get(countapiURL, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "count", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Report_Action in getReportGridCount");
}
};

let getUserName = (siteUrl, currentContext) => {
try {
let api = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserName,Email&$filter=(IsActive eq 1) and ((UserType eq 'HR') or (UserType eq 'Admin'))`;
currentContext.spHttpClient.get(api, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "usernamelist", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Report_Action in getUserName");
}
};

let postDeletereport = (siteUrl, currentContext, state) => {
try {
let apiURL = siteUrl + `/_api/web/lists/GetByTitle('ReportList')/items('${state.delindex}')`;
const data: ISPHttpClientOptions = {
body: `{ IsActive:${0} }`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json',
'odata-version': '',
'IF-MATCH': '*',
'X-HTTP-Method': 'PATCH'
}
};
currentContext.spHttpClient.post(apiURL, SPHttpClient.configurations.v1, data)
.then((response: SPHttpClientResponse) => {
Dispatcher.dispatch({ type: "Reportsuccess", value: response.status });
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Report_Action in postDeletereport");
}
}

export { getReportGridData, getReportGridCount, getUserName, postDeletereport };

