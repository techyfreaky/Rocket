/** [Ref] - Denotes Pseudo Code Reference
* Author: Praveen Kumar
* Crated Date: 06/04/2020
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Declare the store call that extends "EventsEmitter"*/
export class TodoGridStore extends EventEmitter {
public TodoGridData = [];
public delete: any;
public blastoff: any;
public loopin: any;

public handleDataStore = (action) => {
switch (action.action.type) {
case "TodoGrid":
this.TodoGridData = action.action.value;
this.emit('Todogrid');
break;
case "success":
this.delete = action.action.value;
this.emit('success');
break;
case "blastoffs":
this.blastoff = action.action.value;
this.emit('blastoff');
break;
case "loopins":
this.loopin = action.action.value;
this.emit('loopin');
break;
}}
}

const objTodoGridStore = new TodoGridStore;
// Dispatcher code
Dispatcher.register(objTodoGridStore.handleDataStore.bind(objTodoGridStore));

export default objTodoGridStore;

