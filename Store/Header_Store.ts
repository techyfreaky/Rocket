/** [Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Crated Date:5/28/2020
* Ref: HC_PC_15 Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import {Dispatcher}  from 'simplr-flux';
import {EventEmitter} from 'events';
export class HeaderStore extends EventEmitter{
public role :string;

public HandleDataStore = (data) =>{
switch(data.action.type){
case"getRole":{
this.role = data.action.value[0].UserType;
this.emit('getRole');
}}}
}

/** Ref: HC_PC_17*/
const objHeaderStore = new HeaderStore;
// Dispatcher code
Dispatcher.register(objHeaderStore.HandleDataStore.bind(objHeaderStore));

export default objHeaderStore;

