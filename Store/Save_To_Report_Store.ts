/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Crated Date: 06/19/20
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/**SR_PC_28 Declare the store call that extends "EventsEmitter"*/
export class SaveReportStore extends EventEmitter {
public ReportName = [];
public GridData = [];

public handleDataStore = (action) => {
switch (action.action.type) {
case "ReportName":
this.ReportName = action.action.value;
this.emit('reportname');
break;
case "Grid":
this.GridData = action.action.value;
this.emit('gridData');
break;
}}
}

/** SR_PC_29 */
const objSaveReportStore = new SaveReportStore;
// Dispatcher code
Dispatcher.register(objSaveReportStore.handleDataStore.bind(objSaveReportStore));

export default objSaveReportStore;

