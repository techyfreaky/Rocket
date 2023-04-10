/**[Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Crated Date: 05/28/2020
* Ref: UC_PC_42 Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/*** Ref: UC_PC_43 Declare the store call that extends "EventsEmitter*/
export class UserGridStore extends EventEmitter {
public UserGridData = [];
public UserGridCount = [];
public delete: any;
public managernamelist: any;

public handleDataStore = (action) => {
switch (action.action.type) {
case "userConfigGrid":
this.UserGridData = action.action.value;
this.emit('userconfig');
break;
case "countUserConfig":
this.UserGridCount = action.action.value;
this.emit('gridcount');
break;
case "successDeleteUserConfig":
this.delete = action.action.value;
this.emit('success');
break;
case "managernamelist":
this.managernamelist = action.action.value;
this.emit('managername');
break;
case "successPostUserMultiple":
this.emit('successPostUserMultiple');
break;
}}
}

/** Ref: UC_PC_44*/
const objUserGridStore = new UserGridStore;
// Dispatcher code
Dispatcher.register(objUserGridStore.handleDataStore.bind(objUserGridStore));
export default objUserGridStore;


