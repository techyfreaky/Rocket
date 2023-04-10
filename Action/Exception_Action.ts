/**  [Ref] - Denotes Pseudo Code Reference
* Author: Giftson
* Created Date: 05/28/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then  install the node modules using the npm install command.
* Ref: EC_PC_10 & EC_PC_11 */
import { Dispatcher } from "simplr-flux"
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse,ISPHttpClientOptions } from "@microsoft/sp-http";

const writeException = async(siteUrl, currentContext,error,errorinfo) => {
let siteurl=siteUrl+"/_api/lists/GetByTitle('Exception')/items";
const data: ISPHttpClientOptions = {
body: `{ ErrorDescription: "${error}" , ErrorLocation: "${errorinfo}" }`,
headers:{"content-type":"application/json"}
};
let response = await currentContext.spHttpClient.post(siteurl,SPHttpClient.configurations.v1,data);
let responseJSON=await response.json();
Dispatcher.dispatch({type:"successException",value:response.status});
};

export { writeException };

