/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Created Date: 06/19/20
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import * as Exception from './Exception_Action';

let getReportName = (siteUrl, currentContext) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('ReportList')/items?$select=ReportName&$filter=(IsActive eq 1)`;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "ReportName", value: responseJSON.value });
});});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Save_To_Report_Action in getReportName");
}
};

let getGridData = (siteUrl, currentContext, listname, fields, filterquery) => {
try {
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('${listname}')/items?$select=${fields}` + filterquery;
currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
.then((response: SPHttpClientResponse) => {
response.json().then((responseJSON: any) => {
Dispatcher.dispatch({ type: "Grid", value: responseJSON.value });
});
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Save_To_Report_Action in getGridData");
}
};

let postCsv = async (siteUrl, currentContext, state) => {
try {
/*csv file post*/
let index = siteUrl.indexOf('.com');
let relativeUrl = siteUrl.slice(index + 4, siteUrl.length);
let web = Web(siteUrl);
let fileName = state.ReportName + ".csv";
const response = await web.getFolderByServerRelativeUrl(relativeUrl + '/Report/').files.add(fileName, state.csvdata, true);
/*posting the ReportName into the ReportList*/
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('ReportList')/items`;
const data: ISPHttpClientOptions = {
body: `{ ReportName:'${state.ReportName}' }`,
headers: {
'accept': 'application/json;odata=nometadata',
'content-type': 'application/json'
}
};
currentContext.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, data)
.then((response1: SPHttpClientResponse) => {
});
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Save_To_Report_Action in postCsv");
}
};

export { getReportName, getGridData, postCsv };

