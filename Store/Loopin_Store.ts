/** [Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

export class LoopinGridStore extends EventEmitter {
public LoopinGridData = [];
public delete: any;
public archive: any;
public unarchive: any;
public createdByNameListLoopin: any;

public handleDataStore = (action) => {
switch (action.action.type) {
case "LoopinGrid":
this.LoopinGridData = action.action.value;
this.emit('LoopinGrid');
break;
case "successDeleteLoopin":
this.delete = action.action.value;
this.emit('success');
break;
case "loopinArchive":
this.archive = action.action.value;
this.emit('Archive');
break;
case "LoopinunArchive":
this.unarchive = action.action.value;
this.emit('unArchive');
break;
case "CreatedBylistLoopin":
this.createdByNameListLoopin = action.action.value;
this.emit('createdByNameListLoopin');
break;
}}
}

const objLoopinGridStore = new LoopinGridStore;
Dispatcher.register(objLoopinGridStore.handleDataStore.bind(objLoopinGridStore));

export default objLoopinGridStore;

