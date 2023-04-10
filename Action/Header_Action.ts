/** [Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Created Date: 5/28/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.
* Ref: HC_PC_13*/
import { Dispatcher } from "simplr-flux";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as Exception from './Exception_Action';

let getRole = async (currentContext, siteUrl) => {
try {
let email = currentContext.pageContext.user.email;
let apiUrl = siteUrl + `/_api/web/lists/GetByTitle('UserDetails')/items?$select=UserType,User/EMail&$expand=User/Id&$filter=(Email eq '${email}')`;
const response = await currentContext.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1);
const responseJSON = await response.json()
Dispatcher.dispatch({ type: "getRole", value: responseJSON.value });
}
catch (e) {
Exception.writeException(siteUrl, currentContext, e, "Header_Action in getRole");
}
}

export { getRole }

