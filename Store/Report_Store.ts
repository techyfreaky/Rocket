/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Crated Date: 06/16/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Declare the store call that extends "EventsEmitter"*/
export class ReportGridStore extends EventEmitter {
public ReportGridData = [];
public ReportGridCount = [];
public delete: any;
public usernamelist: any;

public handleDataStore = (action) => {
switch (action.action.type) {
case "ReportGrid":
this.ReportGridData = action.action.value;
this.emit('report');
break;
case "count":
this.ReportGridCount = action.action.value;
this.emit('gridcount');
break;
case "Reportsuccess":
this.delete = action.action.value;
this.emit('Reportsuccess');
break;
case "usernamelist":
this.usernamelist = action.action.value;
this.emit('username');
break;
}}
}

const objReportGridStore = new ReportGridStore;
// Dispatcher code
Dispatcher.register(objReportGridStore.handleDataStore.bind(objReportGridStore));

export default objReportGridStore;

