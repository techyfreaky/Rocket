/** [Ref] - Denotes Pseudo Code Reference
* Author: Giftson
* Crated Date: 05/29/2020
* Ref: EC_PC_13 & EC_PC_14 Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from "simplr-flux";
import { EventEmitter } from "events";

/** Ref: EC_PC_15 Declare the store call that extends "EventsEmitter"*/
export class ManageExceptionStore extends EventEmitter{
public successCode;

handleStore = (action) =>{
switch(action.action.type){
case "successException":
this.successCode=action.action.value;
this.emit('Success_Error');
break;
}}
}

/** Ref: TG_PC_16 */
const ExceptionStore = new ManageExceptionStore;
// Dispatcher code
Dispatcher.register(ExceptionStore.handleStore.bind(ExceptionStore));

export default ExceptionStore;

