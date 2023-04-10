/** [Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

export class BlastoffGridStore extends EventEmitter {
public BlastoffGridData = [];
public delete: any;
public archive: any;
public unarchive: any;
public CreatedBylist: any;
public handleDataStore = (action) => {
switch (action.action.type) {
case "BlastoffGrid":
this.BlastoffGridData = action.action.value;
this.emit('BlastoffGrid');
break;
case "successBlastsoffDelete":
this.delete = action.action.value;
this.emit('success');
break;
case "BlastoffArchive":
this.archive = action.action.value;
this.emit('Archive');
break;
case "BlastoffunArchive":
this.unarchive = action.action.value;
this.emit('unArchive');
break;
case "CreatedBylist":
this.CreatedBylist = action.action.value;
this.emit('CreatedBy');
break;
}}
}

const objBlastoffGridStore = new BlastoffGridStore;
Dispatcher.register(objBlastoffGridStore.handleDataStore.bind(objBlastoffGridStore));

export default objBlastoffGridStore;

