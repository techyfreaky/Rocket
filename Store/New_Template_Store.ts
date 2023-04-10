/** [Ref] - Denotes Pseudo Code Reference
* Author: Giftson
* Crated Date: 06/22/2020
* Ref: NT_PC_47 Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Ref: NT_PC_48Declare the store call that extends "EventsEmitter"*/
export class NewTemplateStore extends EventEmitter {
public roleDetail = [];
public templateName = [];
public templateDetails = [];
public pollDetails = [];
public docDetails = null;
public pollid = null;

handleStore = (action) => {
switch (action.action.type) {
case "RoleDetails":
this.roleDetail = action.action.value
this.emit(action.action.type);
break;
case "tempName":
this.templateName = action.action.value
this.emit(action.action.type);
break;
case "tempDetails":
this.templateDetails = action.action.value
this.emit(action.action.type);
break;
case "pollDetails":
this.pollDetails = action.action.value
this.emit(action.action.type);
break;
case "docDetails":
debugger;
this.docDetails = action.action.value
this.emit(action.action.type);
break;
case "successTempDelete":
debugger;
this.emit(action.action.type);
break;
case "postTemplate":
debugger;
this.emit(action.action.type);
break;
case "postLoopinImg":
debugger;
this.emit(action.action.type);
break;
case "postDoc":
debugger;
this.emit(action.action.type);
break;
case "postPollSuccess":
debugger;
this.emit(action.action.type);
break;
}}
}

/** Ref: NT_PC_49*/
const objNewTemplate = new NewTemplateStore;
// Dispatcher code
Dispatcher.register(objNewTemplate.handleStore.bind(objNewTemplate));

export default objNewTemplate;

