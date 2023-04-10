/**[Ref] - Denotes Pseudo Code Reference
* Author: Giftson
* Crated Date: 06/01/2020
* Ref: EC_PC_13 & EC_PC_14 Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Ref: EC_PC_15 Declare the store call that extends "EventsEmitter" */
export class ManageProgressStore extends EventEmitter{
public completedCount=null;
public ontrackCount=null;
public needattentionCount=null;
public filterManager=[];
public filterTeam=[];
public tabDetails=[];
public tabCount=null;
public tabMsgCount=null;
public tabMsgDetails=[];
public tabUserDetail=[];
public pollDetail=[];

handleStore = (action) =>{
switch(action.action.type){
case "Completed":
this.completedCount=action.action.value
this.emit(action.action.type);
break;
case "On Track":
this.ontrackCount=action.action.value
this.emit(action.action.type);
break;
case "Needs Attention":
this.needattentionCount=action.action.value
this.emit(action.action.type);
break;
case "tabDetails":
this.tabDetails=action.action.value
this.emit(action.action.type);
break;
case "successDelete":
this.emit(action.action.type);
break;
case "FilterManager":
this.filterManager=action.action.value
this.emit(action.action.type);
break;
case "FilterTeam":
this.filterTeam=action.action.value
this.emit(action.action.type);
break;
case "tabDetailsCount":
this.tabCount=action.action.value
this.emit(action.action.type)
break;
case "tabMsgCount":
this.tabMsgCount=action.action.value
this.emit(action.action.type)
break;
case "tabMsgDetails":
this.tabMsgDetails=action.action.value
this.emit(action.action.type)
break;
case "tabMsgUser":
this.tabUserDetail=action.action.value
this.emit(action.action.type)
break;
case "pollDetail":
this.pollDetail=action.action.value
this.emit(action.action.type)
break;
case "successMsgDelete":
this.emit(action.action.type)
break;
}}
}

/** Ref: TG_PC_16*/
const objProgressStore = new ManageProgressStore;
// Dispatcher code
Dispatcher.register(objProgressStore.handleStore.bind(objProgressStore));

export default objProgressStore;

