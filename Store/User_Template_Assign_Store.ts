/* [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Crated Date: 06/05/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Declare the store call that extends "EventsEmitter"*/
export class UserTemplateAssignStore extends EventEmitter {
public userconfig: any;
public userdetails: any;
public blastoff: any;
public loopin: any;
public userschedule: any;
public usertodo: any;
public BlastoffTempDetails: any;
public LoopInTempDetails: any;
public TempDetails: any;
public userdetailstatus: any;
public managerAssigned: any;
public updateStatus: any;
public userdetail: any;
public userdetail1: any;
public templateDetails: any;
public TodoStatus: any;
public multipleTodoStatus: any;
public multipleScheduleBStatus: any;
public multipleScheduleLStatus: any;
public schedulestatus: any;
public updateTodoStatus: any;

public handleDataStore = (action) => {
switch (action.action.type) {
case "userconfig":
this.userconfig = action.action.value;
this.emit('userconfiglist');
break;
case "userdetails":
this.userdetails = action.action.value;
this.emit('userdetail');
break;
case "userdetails1":
this.userdetails = action.action.value;
this.emit('userdetail1');
break;
case "blastoff":
this.blastoff = action.action.value;
this.emit('blastoff');
break;
case "loopin":
this.loopin = action.action.value;
this.emit('loopin');
break;
case 'userschedule':
this.userschedule = action.action.value;
this.emit('userschedule');
break;
case "usertodo":
this.usertodo = action.action.value;
this.emit('usertododetails');
break;
case 'usertodo1':
this.usertodo = action.action.value;
this.emit('usertododetails1');
case "TempDetails":
this.TempDetails = action.action.value;
this.emit('TempDetails');
break;
case "TodoBlastoffTempDetails":
this.BlastoffTempDetails = action.action.value;
this.emit('TodoBlastoffTempDetails');
break;
case "BlastoffTempDetails":
this.BlastoffTempDetails = action.action.value;
this.emit('BlastoffTempDetails');
break;
case "TodoLoopInTempDetails":
this.LoopInTempDetails = action.action.value;
this.emit('TodoLoopInTempDetails');
break;
case "LoopInTempDetails":
this.LoopInTempDetails = action.action.value;
this.emit('LoopInTempDetails');
break;
case "managerAssigned":
this.managerAssigned = action.action.value;
this.emit('managerAssigned');
break;
case "managerAssignedDetails":
this.managerAssigned = action.action.value;
this.emit('managerAssignedDetails');
break;
case "updateStatus":
this.updateStatus = action.action.value;
this.emit('updateStatus');
break;
case "userdetail":
this.userdetail = action.action.value;
this.emit('userdetails');
break;
case "userdetail1":
this.userdetail1 = action.action.value;
this.emit('userdetails1');
break;
case "TemplateDetails":
this.templateDetails = action.action.value;
this.emit('TemplateDetails');
break;
case "TodoStatus":
this.TodoStatus = action.action.value;
this.emit('TodoStatus');
break;
case "multipleTodoStatus":
this.multipleTodoStatus = action.action.value;
this.emit('multipleTodoStatus');
break;
case "multipleScheduleBStatus":
this.multipleScheduleBStatus = action.action.value;
this.emit('multipleScheduleBStatus');
break;
case "multipleScheduleLStatus":
this.multipleScheduleLStatus = action.action.value;
this.emit('multipleScheduleLStatus');
break;
case "schedulestatus":
this.schedulestatus = action.action.value;
this.emit('schedulestatus');
break;
case "updateTodoStatus":
this.updateTodoStatus = action.action.value;
this.emit('updateTodoStatus');
break;
}}
}

const objUserTempAssignStore = new UserTemplateAssignStore;
// Dispatcher code
Dispatcher.register(objUserTempAssignStore.handleDataStore.bind(objUserTempAssignStore));
export default objUserTempAssignStore;

