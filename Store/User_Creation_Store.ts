/**[Ref] - Denotes Pseudo Code Reference
* Author: Manish
* Import the necessary node-modules. If any of the nodes modules are not avaialble then install the node modules using the npm install command.*/
import { Dispatcher } from 'simplr-flux';
import { EventEmitter } from 'events';
export class NewUserStore extends EventEmitter {
public TeamNamelist: any;
public RoleNamelist: any;
public ManagerNamelist: any;
public UserDataValidation: any;
public userView: any;
public MultipleUserData: any;
public MultipleTeamData: any;
public MultipleRoleData: any;
public userMailID: any;
public ManagerTemplateData: any;
public TemplateDetails: any;
public Manageruserdata: any;
public ManagerNamevalidation: any;
public InvalidData: any;
public MultipleManagerData: any;
public HandleDataStore = (data) => {
switch (data.action.type) {
case "TeamNamelist":
this.TeamNamelist = data.action.value;
this.emit('TeamNamelist');
break;
case "RoleNamelist":
this.RoleNamelist = data.action.value;
this.emit('RoleNamelist');
break;
case "ManagerNamelist":
this.ManagerNamelist = data.action.value;
this.emit('ManagerNamelist');
break;
case "UserDataValidation":
this.UserDataValidation = data.action.value;
this.emit('UserDataValidation');
break;
case "userView":
this.userView = data.action.value;
this.emit('userView');
break;
case "MultipleUserData":
this.MultipleUserData = data.action.value;
this.emit('MultipleUserData');
break;
case "MultipleTeamData":
this.MultipleTeamData = data.action.value;
this.emit('MultipleTeamData');
break;
case "MultipleRoleData":
this.MultipleRoleData = data.action.value;
this.emit('MultipleRoleData');
break;
case "userMailID":
this.userMailID = data.action.value;
this.emit('userMailID');
break;
case "ManagerTemplateData":
this.ManagerTemplateData = data.action.value;
this.emit('ManagerTemplateData');
break;
case "Manageruserdata":
this.Manageruserdata = data.action.value;
this.emit('Manageruserdata');
break;
case "ManagerNamevalidation":
this.ManagerNamevalidation = data.action.value;
this.emit('ManagerNamevalidation');
break;
case "InvalidData":
this.InvalidData = data.action.value;
this.emit('InvalidData');
break;
case "MultipleManagerData":
this.MultipleManagerData = data.action.value;
this.emit('MultipleManagerData');
break;
case "UserCreationTemplateDetails":
this.TemplateDetails = data.action.value;
this.emit('TemplateDetails');
break;
case "createuser":
this.emit(data.action.type);
break;
case "updateUser":
this.emit(data.action.type);
break;
}}
}

const objNewUserStore = new NewUserStore;
Dispatcher.register(objNewUserStore.HandleDataStore.bind(objNewUserStore));
export default objNewUserStore;

