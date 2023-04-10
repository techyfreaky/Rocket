/** [Ref] - Denotes Pseudo Code Reference
 * Author: Manish
 * This component is the Multiple User Creation component. The component allows to import multiple users for Multiple User Creation.*/
import * as React from 'react';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import CsvParse from '@vtex/react-csv-parse';
import * as moment from 'moment';
import * as NewUserAction from '../Action/User_Creation_Action';
import NewUserStore from '../Store/User_Creation_Store';
import * as UserConfigAction from '../Action/UserConfig_Action';
import '../css/commontheme.css';
import '../css/style.css';
import { values } from 'office-ui-fabric-react';

const DownloadImage: string = require('../images/down-icon.svg');
const UpoladImage: string = require('../images/upload.svg');
const Close: string = require('../Images/backicon.svg');
const threedots: string = require('../images/threedots.svg');

export interface MultipleUserCreationProps {
    context: WebPartContext;
}

export interface MultipleUserCreationStates {
    siteUrl: any;
    currentContext: WebPartContext;
    importUserData: any[];
    MultipleUserData: any[];
    MultipleTeamData: any[];
    MultipleRoleData: any[];
    UserValidData: any[];
    UserInvalidData: any[];
    multipleTeamName: any[];
    multipleRoleName: any[];
    multipleUserEmail: any[];
    UserEmail: any[];
    fileInput: any;
    FileName: string;
    MultipleManagerData: any[];
    ManagerEmail: any[];
    ManagerTemplateData: any[];
    ErrorMessage: string;
    multiplepopup: boolean;
    successUserData: boolean;
    successTeamData: boolean;
    successRoleData: boolean;
    successUserMailID: boolean;
    successMultipleManagerData: boolean;
    successTemplateDetails: boolean;
}

export default class MultipleUserCreation extends React.Component<MultipleUserCreationProps, MultipleUserCreationStates> {
    constructor(props) {
        super(props);
        this.state = {
            siteUrl: this.props.context.pageContext.web.absoluteUrl,
            currentContext: this.props.context,
            importUserData: [],
            MultipleUserData: [],
            MultipleTeamData: [],
            MultipleRoleData: [],
            UserValidData: [],
            UserInvalidData: [],
            multipleTeamName: [],
            multipleRoleName: [],
            multipleUserEmail: [],
            fileInput: React.createRef(),
            FileName: "",
            UserEmail: [],
            MultipleManagerData: [],
            ManagerEmail: [],
            ManagerTemplateData: [],
            ErrorMessage: "",
            multiplepopup: false,
            successUserData: false,
            successTeamData: false,
            successRoleData: false,
            successUserMailID: false,
            successMultipleManagerData: false,
            successTemplateDetails: false,
        }
    }

    componentWillMount() {
NewUserStore.on("MultipleUserData", this.loadMultipleUserData.bind(this));
NewUserStore.on("MultipleTeamData", this.loadMultipleTeamData.bind(this));
NewUserStore.on("MultipleRoleData", this.loadMultipleRoleData.bind(this));
 NewUserStore.on("userMailID", this.loaduserMailID.bind(this));
NewUserStore.on("MultipleManagerData", this.loadMultipleManagerData.bind(this));
NewUserStore.on("TemplateDetails", this.loadTemplateDetails.bind(this));
    }
    loadMultipleManagerData() {
  let email = [];
        let multiple = NewUserStore.MultipleManagerData
multiple.map((value, index) => {
            if (value.Email != "") {
  email.push(value.Email.toLowerCase());
            }})
        this.setState({ MultipleManagerData: multiple, successMultipleManagerData: true });
        this.setState({ ManagerEmail: email });
    }

    loadTemplateDetails() {
        let TemplateName = [];
        this.setState({ ManagerTemplateData: NewUserStore.TemplateDetails, successTemplateDetails: true });
    }

    loaduserMailID() {
        let email = []
        let multiple = NewUserStore.userMailID
        multiple.map((value, index) => {
            email.push(value.Email);
        })
        this.setState({ UserEmail: email, successUserMailID: true });
    }

    public loadMultipleUserData = () => {
        let email = []
        let multiple = NewUserStore.MultipleUserData
        multiple.map((value, index) => {
            email.push(value.Email.toLowerCase()) 
        })
        this.setState({ multipleUserEmail: email, successUserData: true });
        this.setState({ MultipleUserData: NewUserStore.MultipleUserData });
    }

    public loadMultipleTeamData = () => {
        let team = []
        let multiple = NewUserStore.MultipleTeamData
        multiple.map((value, index) => {
            team.push(value.Team)
        })
        this.setState({ multipleTeamName: team, successTeamData: true });
        this.setState({ MultipleTeamData: NewUserStore.MultipleTeamData })
    }

    public loadMultipleRoleData = () => {
        let role = []
        let multiple = NewUserStore.MultipleRoleData
        multiple.map((value, index) => {
            role.push(value.Role)
        })
        this.setState({ multipleRoleName: role, successRoleData: true })
        this.setState({ MultipleRoleData: NewUserStore.MultipleRoleData })
    }

    validateMultipleUser() {
        this.state.importUserData.map((importUservalue, importindex) => {
            let ValidData = [];
            ValidData.push({ ManagerBlastoff: null, Index: null, ManagerName: null, ManagerEmail: null, ManagerRowID: null, TeamName: null, RoleName: null, Email: null, UserType: null, TeamID: -1, RoleID: -1, ManagerID: -1, UserId: null, StartDate: null, UserName: null });
            let Flag = 0;
            if (importUservalue.Email == "" || importUservalue.UserName == "" || importUservalue.StartDate == null || importUservalue.UserType == "") {
            }
            else {
                if (importUservalue.UserType == "HR" || importUservalue.UserType == "Manager" || importUservalue.UserType == "New Hire" || importUservalue.UserType == "Admin") {
                    ValidData[0].UserType = importUservalue.UserType;
                }
                else {
                    this.state.UserInvalidData.push(importindex + 2);
                    Flag = 1;
                }
                if (importUservalue.Team != "" && Flag == 0) {
                    let TeamIndex = this.state.multipleTeamName.indexOf(importUservalue.Team);
                    if (TeamIndex == -1) {
                        this.state.UserInvalidData.push(importindex + 2);
                        Flag = 1;
                    }
                    else {
ValidData[0].TeamID = this.state.MultipleTeamData[TeamIndex].Id;
ValidData[0].TeamName = this.state.MultipleTeamData[TeamIndex].Team;
                    }}
                if (importUservalue.Role != "" && Flag == 0) {
let RoleIndex = this.state.multipleRoleName.indexOf(importUservalue.Role);
                    if (RoleIndex == -1) {
                        this.state.UserInvalidData.push(importindex + 2);
                        Flag = 1;
                    }
                    else {
  ValidData[0].RoleID = this.state.MultipleRoleData[RoleIndex].Id;
    ValidData[0].RoleName = this.state.MultipleRoleData[RoleIndex].Role;
                    }}
                if (importUservalue.StartDate != null && Flag == 0) {
                    let date; 
                    let startdate = new Date(importUservalue.StartDate),
                        mnth = ("0" + (startdate.getMonth() + 1)).slice(-2),
                        day = ("0" + startdate.getDate()).slice(-2);
             let cstartdate = [startdate.getFullYear(), mnth, day].join("-");
                    let currentDate = new Date();
                    mnth = ("0" + (currentDate.getMonth() + 1)).slice(-2),
                        day = ("0" + currentDate.getDate()).slice(-2);
                    let date2 = [currentDate.getFullYear(), mnth, day].join("-");
                    if (cstartdate < date2) {
                        this.state.UserInvalidData.push(importindex + 2);
                        Flag = 1;
                    }
                    else {
                        ValidData[0].StartDate = importUservalue.StartDate;
                    }}
                if (importUservalue.Email != "" && Flag == 0) {
let UserIndex = this.state.UserEmail.indexOf(importUservalue.Email);
                    if (UserIndex != -1) {
                        this.state.UserInvalidData.push(importindex + 2);
                        Flag = 1;
                    }
                    else {
                        let EmailIndex = this.state.multipleUserEmail.indexOf(importUservalue.Email.toLowerCase()); //
                        if (EmailIndex == -1) {
                            this.state.UserInvalidData.push(importindex + 2);
                            Flag = 1;
                        }
                        else {
  ValidData[0].UserId = this.state.MultipleUserData[EmailIndex].Id;
   ValidData[0].Email = this.state.MultipleUserData[EmailIndex].Email;
                            ValidData[0].UserName = importUservalue.UserName;
                        }}}
                if (importUservalue.ManagerEmail == "" && Flag == 0) {
                    ValidData[0].Index = importindex;
                    let UserValidData = this.state.UserValidData;
                    UserValidData.push(ValidData[0]);
                    this.setState({ UserValidData });
                }
                if (importUservalue.ManagerEmail != "" && Flag == 0) {
                    let ManagerIndex = this.state.ManagerEmail.indexOf(importUservalue.ManagerEmail.toLowerCase());
                    if (ManagerIndex == -1) {
                        this.state.UserInvalidData.push(importindex + 2);
                        Flag = 1;
                    }
                    else {
  ValidData[0].ManagerID = this.state.MultipleManagerData[ManagerIndex].User.Id;
  ValidData[0].ManagerEmail = this.state.MultipleManagerData[ManagerIndex].Email;
    ValidData[0].ManagerRowID = this.state.MultipleManagerData[ManagerIndex].ID;
ValidData[0].ManagerBlastoff = this.state.MultipleManagerData[ManagerIndex].BlastoffTemp;
  ValidData[0].ManagerName = this.state.MultipleManagerData[ManagerIndex].UserName;
                        ValidData[0].Index = importindex;
                        let UserValidData = this.state.UserValidData;
                        UserValidData.push(ValidData[0]);
                        this.setState({ UserValidData });
                    }}}})
        let duplicateindex = [];
        this.state.UserValidData.map((value1, Index1) => {
            this.state.UserValidData.map((value2, Index2) => {
                if (Index2 > Index1) {
                    if (value1.Email == value2.Email) {
                        this.state.UserInvalidData.push(value2.Index + 2);
                        duplicateindex.push(Index2);
                    }}});});
        if (duplicateindex.length != 0) {
            duplicateindex.map((dvalue, dindex) => {
                this.state.UserValidData.splice(dvalue, 1);
            });}
        this.state.UserValidData.map((value, Index) => {
NewUserAction.PostMultipleCreateUser(this.state.siteUrl, this.state.currentContext, value);
        });
                let errormsg = "";
        if (this.state.UserInvalidData.length > 0) {
            errormsg += "Error on line #";
            this.state.UserInvalidData.map((invalue, inindex) => {
                errormsg += invalue;
                if (inindex != this.state.UserInvalidData.length - 1) {
                    errormsg += ', ';
                }});
errormsg += '. Data is not matching with the uploaded file. Please check and upload again.';
            this.setState({ ErrorMessage: errormsg });
        }
        this.userdetails();
    }

    public userdetails = () => {
        let User = this.state.UserValidData;
        let Temp = this.state.ManagerTemplateData;
        if (User.length > 0) {
            User.map((value, index) => {
                if (value.ManagerBlastoff.length != 0) {
                    let CurrentUser = [];
                    let currentTemplate = [];
                    CurrentUser.push([]);
                    CurrentUser[index].push(value.ManagerID);
                    CurrentUser[index].push(value.ManagerRowID);
                    CurrentUser[index].push(value.StartDate);
                    CurrentUser[index].push(value.UserName);
                    CurrentUser[index].push(value.ManagerName);
                    CurrentUser[index].push(value.TeamName);
                    CurrentUser[index].push(value.RoleName);
                    CurrentUser[index].push(value.Email);
                    value.ManagerBlastoff.map((tvalue, tindex) => {
                        Temp.map((tempvalue, tempindex) => {
                            if (tvalue.TemplateName == tempvalue.TemplateName) {
                                currentTemplate.push(tempvalue);
                            }})});
                    this.managerSchedule(currentTemplate, CurrentUser);
                }});
            this.close();
        }
    }

    public managerSchedule = (TempDetails, UserDetails) => {
        let schedule = [];
        if (UserDetails[0].length == 8) {
            UserDetails.map((value, index) => {
                let startdate;
                let date1 = moment(value[2]).format('YYYY-MM-DD');
                let cstartdate1 = moment(date1, 'YYYY-MM-DD');
                var currentDate = new Date(),
                    mnth = ("0" + (currentDate.getMonth() + 1)).slice(-2),
                    day = ("0" + currentDate.getDate()).slice(-2);
                let date2 = [currentDate.getFullYear(), mnth, day].join("-");
                let cstartdate2 = moment(date2, 'YYYY-MM-DD');
                if (cstartdate1 < cstartdate2) {
                    startdate = cstartdate2.add(1, 'days');
                }
                else {
                    startdate = cstartdate1;
                }
                TempDetails.map((tempvalue, index) => {
                    if (tempvalue.TemplateUsage == "Single") {
                        const date = moment(startdate, 'YYYY-MM-DD');
                        let ndate, msg = "";
                        schedule.push([]);
                        let length = (schedule.length) - 1;
                        schedule[length].push(value[0]);
                        schedule[length].push(value[1]);
                        schedule[length].push(tempvalue.Id);
                        schedule[length].push("No Response");
                        schedule[length].push("On Track");
                        if (tempvalue.StartDateType == "Before") {
                            let ndate1;
  ndate1 = moment(date).subtract(tempvalue.NoOfDaysOrWeek, 'days');
                            if (moment(ndate1) < cstartdate2) {
                                ndate = moment(cstartdate2).add(1, 'days');
                            }
                            else {
                                ndate = ndate1;
                            }}
                        if (tempvalue.StartDateType == "After") {
                    ndate = moment(date).add(tempvalue.NoOfDaysOrWeek, 'days');
                        }
                        let datetime = moment(ndate, 'YYYY-MM-DD');
                        schedule[length].push(datetime.format('YYYY-MM-DD'));
                        if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                            msg = tempvalue.MessageContent;
                            let status = msg.indexOf("@NewHire");
                            let status1 = msg.indexOf("@Manager");
                            let status2 = msg.indexOf("@Team");
                            let status3 = msg.indexOf("@Role");
                            let status4 = msg.indexOf("@Start Date");
                            if (status != -1) {
                                msg = msg.replace("@NewHire", value[3]);
                            }
                            else {
                                msg = msg.replace("@NewHire", "");
                            }
                            if (status1 != -1 && value[4] != "") {
                                msg = msg.replace("@Manager", value[4]);
                            }
                            else {
                                msg = msg.replace("@Manager", "");
                            }
                            if (status2 != -1 && value[5] != "") {
                                msg = msg.replace("@Team", value[5]);
                            }
                            else {
                                msg = msg.replace("@Team", "");
                            }
                            if (status3 != -1 && value[6] != "") {
                                msg = msg.replace("@Role", value[6]);
                            }
                            else {
                                msg = msg.replace("@Role", "");
                            }
                            if (status4 != -1) {
    msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                            }
                        }
                        schedule[length].push(msg);
                        schedule[length].push(value[7]);
                    }
                    else if (tempvalue.TemplateUsage == "Multiple") {
                        if (tempvalue.ScheduleType == "Daily") {
       for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
                                const date = moment(startdate, 'YYYY-MM-DD');
                                let ndate, msg = "";
                                schedule.push([]);
                                let length = (schedule.length) - 1;
                                schedule[length].push(value[0]);
                                schedule[length].push(value[1]);
                                schedule[length].push(tempvalue.Id);
                                schedule[length].push("No Response");
                                schedule[length].push("On Track");
                                if (tempvalue.StartDateType == "Before") {
                                    let ndate1;
                                    ndate1 = date.subtract(i, 'days');
                                    if (moment(ndate1) < cstartdate2) {
                               ndate = moment(cstartdate2).add(1, 'days');
                                    }
                                    else {
                                        ndate = ndate1;
                                    }}
                                if (tempvalue.StartDateType == "After") {
                                    ndate = moment(date).add(i, 'days');
                                }
                                let datetime = moment(ndate, 'YYYY-MM-DD');
                           schedule[length].push(datetime.format('YYYY-MM-DD'));
                                if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                                    msg = tempvalue.MessageContent;
                                    let status = msg.indexOf("@NewHire");
                                    let status1 = msg.indexOf("@Manager");
                                    let status2 = msg.indexOf("@Team");
                                    let status3 = msg.indexOf("@Role");
                                    let status4 = msg.indexOf("@Start Date");
                                    if (status != -1) {
                                        msg = msg.replace("@NewHire", value[3]);
                                    }
                                    else {
                                        msg = msg.replace("@NewHire", "");
                                    }
                                    if (status1 != -1 && value[4] != "") {
                                        msg = msg.replace("@Manager", value[4]);
                                    }
                                    else {
                                        msg = msg.replace("@Manager", "");
                                    }
                                    if (status2 != -1 && value[5] != "") {
                                        msg = msg.replace("@Team", value[5]);
                                    }
                                    else {
                                        msg = msg.replace("@Team", "");
                                    }
                                    if (status3 != -1 && value[6] != "") {
                                        msg = msg.replace("@Role", value[6]);
                                    }
                                    else {
                                        msg = msg.replace("@Role", "");
                                    }
                                    if (status4 != -1) {
            msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                    }}
                                schedule[length].push(msg);
                                schedule[length].push(value[7]);
                            }}
                        else if (tempvalue.ScheduleType == "Weekly") {
                 for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
                                const date = moment(startdate, 'YYYY-MM-DD');
                                let ndate, msg = "";
                                if (tempvalue.StartDateType == "Before") {
                                    let ndate1;
                                    ndate1 = date.subtract(i, 'days');
                                    if (moment(ndate1) < cstartdate2) {
                              ndate = moment(cstartdate2).add(1, 'days');
                                    }
                                    else {
                                        ndate = ndate1;
                                    }}
                                if (tempvalue.StartDateType == "After") {
                                    debugger;
                                    ndate = moment(date).add(i, 'days');
                                }
                                tempvalue.WeekDays.map((weekvalue, index) => {
  if (ndate.format('dddd') == weekvalue.Weekdays) {
                                        schedule.push([]);
                                        let length = (schedule.length) - 1;
                                        schedule[length].push(value[0]);
                                        schedule[length].push(value[1]);
                                        schedule[length].push(tempvalue.Id);
                                        schedule[length].push("No Response");
                                        schedule[length].push("On Track");
                                  let datetime = moment(ndate, 'YYYY-MM-DD');                                      schedule[length].push(datetime.format('YYYY-MM-DD'));
  if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                                            msg = tempvalue.MessageContent;
                                            let status = msg.indexOf("@NewHire");
                 let status1 = msg.indexOf("@Manager");
                                            let status2 = msg.indexOf("@Team");
                                            let status3 = msg.indexOf("@Role");
                                   let status4 = msg.indexOf("@Start Date");
                                            if (status != -1) {
                                   msg = msg.replace("@NewHire", value[3]);
                                            }
                                            else {
                                         msg = msg.replace("@NewHire", "");
                                            }
                                     if (status1 != -1 && value[4] != "") {
                                msg = msg.replace("@Manager", value[4]);
                                            }
                                            else {
                                        msg = msg.replace("@Manager", "");
                                            }
                                    if (status2 != -1 && value[5] != "") {
                                  msg = msg.replace("@Team", value[5]);
                                            }
                                            else {
                                                msg = msg.replace("@Team", "");
                                            }
                                        if (status3 != -1 && value[6] != "") {
                                   msg = msg.replace("@Role", value[6]);
                                            }
                                            else {
                                                msg = msg.replace("@Role", "");
                                            }
                                            if (status4 != -1) {
                      msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                            }}
                                        schedule[length].push(msg);
                                        schedule[length].push(value[7]);
                                    }});}}
                        else if (tempvalue.ScheduleType == "Monthly") {
                  for (var i = 1; i <= tempvalue.BreakpointDays; i = i + 1) {
                                const date = moment(startdate, 'YYYY-MM-DD');
                                let ndate, msg = "";
                                if (tempvalue.StartDateType == "Before") {
                                    let ndate1;
                                    ndate1 = date.subtract(i, 'days');
                                    if (moment(ndate1) < cstartdate2) {
                            ndate = moment(cstartdate2).add(1, 'days');
                                    }
                                    else {
                                        ndate = ndate1;
                                    }}
                                if (tempvalue.StartDateType == "After") {
                                    ndate = moment(date).add(i, 'days');
                                }
                                if (tempvalue.MonthlyRepitition == "Days") {
       if (parseInt(ndate.format('D')) == tempvalue.NoOfDaysOrWeek) {
                                        schedule.push([]);
                                        let length = (schedule.length) - 1;
                                        schedule[length].push(value[0]);
                                        schedule[length].push(value[1]);
                                        schedule[length].push(tempvalue.Id);
                                        schedule[length].push("No Response");
                                        schedule[length].push("On Track");
                                let datetime = moment(ndate, 'YYYY-MM-DD');                                      schedule[length].push(datetime.format('YYYY-MM-DD'));
                                        if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                                            msg = tempvalue.MessageContent;
                                            let status = msg.indexOf("@NewHire");
                     let status1 = msg.indexOf("@Manager");
                                            let status2 = msg.indexOf("@Team");
                                            let status3 = msg.indexOf("@Role");
                                    let status4 = msg.indexOf("@Start Date");
                                            if (status != -1) {
                                 msg = msg.replace("@NewHire", value[3]);
                                            }
                                            else {
                                        msg = msg.replace("@NewHire", "");
                                            }
                                      if (status1 != -1 && value[4] != "") {
                                     msg = msg.replace("@Manager", value[4]);
                                            }
                                            else {
                                          msg = msg.replace("@Manager", "");
                                            }
                                    if (status2 != -1 && value[5] != "") {
                                    msg = msg.replace("@Team", value[5]);
                                            }
                                            else {
                                                msg = msg.replace("@Team", "");
                                            }
                                       if (status3 != -1 && value[6] != "") {
                                   msg = msg.replace("@Role", value[6]);
                                            }
                                            else {
                                                msg = msg.replace("@Role", "");
                                            }
                                            if (status4 != -1) {
                  msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                            }}
                                        schedule[length].push(msg);
                                        schedule[length].push(value[7]);
                                    } }
                                if (tempvalue.MonthlyRepitition == "Week") {
                                    if (tempvalue.NoOfDaysOrWeek == "1") {
     if (parseInt(ndate.format('D')) >= 1 && parseInt(ndate.format('D')) <= 7) {
                             tempvalue.WeekDays.map((weekvalue, index) => {
                        if (ndate.format('dddd') == weekvalue.Weekdays) {
                                                    schedule.push([]);
                          let length = (schedule.length) - 1;
                   schedule[length].push(value[0]);                                                   schedule[length].push(value[1]);                                                    schedule[length].push(tempvalue.Id);
                                       schedule[length].push("No Response");
                                            schedule[length].push("On Track");
                              let datetime = moment(ndate, 'YYYY-MM-DD');                                                   schedule[length].push(datetime.format('YYYY-MM-DD'));
  if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                            msg = tempvalue.MessageContent;
                                 let status = msg.indexOf("@NewHire");
                               let status1 = msg.indexOf("@Manager");
                                 let status2 = msg.indexOf("@Team");
                                 let status3 = msg.indexOf("@Role");
                           let status4 = msg.indexOf("@Start Date");
                                                        if (status != -1) {
                           msg = msg.replace("@NewHire", value[3]);
                                                        }
                                                        else {
                              msg = msg.replace("@NewHire", "");
                                                        }
                                    if (status1 != -1 && value[4] != "") {
                           msg = msg.replace("@Manager", value[4]);
                                                        }
                                                        else {
                               msg = msg.replace("@Manager", "");
                                                        }
                                 if (status2 != -1 && value[5] != "") {
                              msg = msg.replace("@Team", value[5]);
                                                        }
                                                        else {
                                 msg = msg.replace("@Team", "");
                                                        }
                                  if (status3 != -1 && value[6] != "") {
                        msg = msg.replace("@Role", value[6]);
                                                        }
                                                        else {
                                 msg = msg.replace("@Role", "");
                                                        }
                                                        if (status4 != -1) {
     msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                                        }}
                                                    schedule[length].push(msg);
                   schedule[length].push(value[7]);
                                                }});} }
                                    if (tempvalue.NoOfDaysOrWeek == "2") {
  if (parseInt(ndate.format('D')) > 7 && parseInt(ndate.format('D')) <= 14) {
                                tempvalue.WeekDays.map((weekvalue, index) => {
                           if (ndate.format('dddd') == weekvalue.Weekdays) {
                                                    schedule.push([]);
                          let length = (schedule.length) - 1;                                                   schedule[length].push(value[0]);                                                    schedule[length].push(value[1]);                                                    schedule[length].push(tempvalue.Id);
                                      schedule[length].push("No Response");
                                           schedule[length].push("On Track");
                                     let datetime = moment(ndate, 'YYYY-MM-DD');                                                    schedule[length].push(datetime.format('YYYY-MM-DD'));
    if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                           msg = tempvalue.MessageContent;
                           let status = msg.indexOf("@NewHire");
                               let status1 = msg.indexOf("@Manager");
                                  let status2 = msg.indexOf("@Team");
                               let status3 = msg.indexOf("@Role");
                            let status4 = msg.indexOf("@Start Date");
                                                        if (status != -1) {
                         msg = msg.replace("@NewHire", value[3]);
                                                        }
                                                        else {
                             msg = msg.replace("@NewHire", "");
                                                        }
                                if (status1 != -1 && value[4] != "") {
                          msg = msg.replace("@Manager", value[4]);
                                                        }
                                                        else {
                           msg = msg.replace("@Manager", "");
                                                        }
                                    if (status2 != -1 && value[5] != "") {
                             msg = msg.replace("@Team", value[5]);
                                                        }
                                                        else {
                             msg = msg.replace("@Team", "");
                                                        }
                                 if (status3 != -1 && value[6] != "") {
                               msg = msg.replace("@Role", value[6]);
                                                        }
                                                        else {
                                   msg = msg.replace("@Role", "");
                                                        }
                                                        if (status4 != -1) {
       msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                                        }}
                                                    schedule[length].push(msg);
                    schedule[length].push(value[7]);
                                                } });}}
                                    if (tempvalue.NoOfDaysOrWeek == "3") {
   if (parseInt(ndate.format('D')) > 14 && parseInt(ndate.format('D')) <= 21) {
                             tempvalue.WeekDays.map((weekvalue, index) => {
                          if (ndate.format('dddd') == weekvalue.Weekdays) {
                                                    schedule.push([]);
                           let length = (schedule.length) - 1;
                    schedule[length].push(value[0]);
               schedule[length].push(value[1]);
               schedule[length].push(tempvalue.Id);
                                        schedule[length].push("No Response");
                                          schedule[length].push("On Track");
                                     let datetime = moment(ndate, 'YYYY-MM-DD');
  schedule[length].push(datetime.format('YYYY-MM-DD'));
if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                          msg = tempvalue.MessageContent;
                                let status = msg.indexOf("@NewHire");
                           let status1 = msg.indexOf("@Manager");
                                 let status2 = msg.indexOf("@Team");
                                 let status3 = msg.indexOf("@Role");
                              let status4 = msg.indexOf("@Start Date");
                                                        if (status != -1) {
                            msg = msg.replace("@NewHire", value[3]);
                                                        }
                                                        else {
                             msg = msg.replace("@NewHire", "");
                                                        }
                                       if (status1 != -1 && value[4] != "") {
                         msg = msg.replace("@Manager", value[4]);
                                                        }
                                                        else {
                            msg = msg.replace("@Manager", "");
                                                        }
                                     if (status2 != -1 && value[5] != "") {
                             msg = msg.replace("@Team", value[5]);
                                                        }
                                                        else {
                                   msg = msg.replace("@Team", "");
                                                        }
                                     if (status3 != -1 && value[6] != "") {
                        msg = msg.replace("@Role", value[6]);
                                                        }
                                                        else {
                               msg = msg.replace("@Role", "");
                                                        }
                                                        if (status4 != -1) {
       msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                                        }
                                                    }
                                                    schedule[length].push(msg);
               schedule[length].push(value[7]);
                                                }});}}
                                    if (tempvalue.NoOfDaysOrWeek == "4") {
   if (parseInt(ndate.format('D')) > 21 && parseInt(ndate.format('D')) <= 28) {
                                 tempvalue.WeekDays.map((weekvalue, index) => {
                       if (ndate.format('dddd') == weekvalue.Weekdays) {
                                                    schedule.push([]);
                              let length = (schedule.length) - 1;
                  schedule[length].push(value[0]);
                 schedule[length].push(value[1]);
                 schedule[length].push(tempvalue.Id);
                                    schedule[length].push("No Response");
                                           schedule[length].push("On Track");
                                     let datetime = moment(ndate, 'YYYY-MM-DD');
 schedule[length].push(datetime.format('YYYY-MM-DD'));
                                       if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                           msg = tempvalue.MessageContent;

                    let status = msg.indexOf("@NewHire");
                               let status1 = msg.indexOf("@Manager");
                                   let status2 = msg.indexOf("@Team");
                                 let status3 = msg.indexOf("@Role");
                           let status4 = msg.indexOf("@Start Date");
                                                        if (status != -1) {
                         msg = msg.replace("@NewHire", value[3]);
                                                        }
                                                        else {
                             msg = msg.replace("@NewHire", "");
                                                        }
                                   if (status1 != -1 && value[4] != "") {
                         msg = msg.replace("@Manager", value[4]);
                                                        }
                                                        else {
                              msg = msg.replace("@Manager", "");
                                                        }
                                 if (status2 != -1 && value[5] != "") {
                               msg = msg.replace("@Team", value[5]);
                                                        }
                                                        else {
                                 msg = msg.replace("@Team", "");
                                                        }
                                   if (status3 != -1 && value[6] != "") {
                           msg = msg.replace("@Role", value[6]);
                                                        }
                                                        else {
                              msg = msg.replace("@Role", "");
                                                        }
                                                        if (status4 != -1) {
      msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                                        }}
                                                    schedule[length].push(msg);
                  schedule[length].push(value[7]);
                                                }});}}} }
                        }
                        else if (tempvalue.ScheduleType == "Yearly") {
                   let yearlydate = tempvalue.YearlyRepitition, ndate, msg = "";
               let date = moment(tempvalue.YearlyRepitition, 'YYYY-MM-DD');
                            let cdate = date.format('YYYY');
                            let currentDate = new Date();
                            let date1 = moment(currentDate, 'YYYY-MM-DD');
                            let cdate1 = date1.format('YYYY');
                            if (cdate < cdate1) {
                                let cdate3 = new Date(yearlydate);
                                cdate3.setFullYear(parseInt(cdate1));
                                let cdate4 = moment(cdate3, 'YYYY-MM-DD');
                                if (cdate4 < date1) {
                                    ndate = cdate4.add(1, 'years');
                                }
                                else {
                                    ndate = cdate4;
                                }}
                            else {
                                if (date < date1) {
                                    ndate = date1.add(1, 'years');
                                }
                                else {
                                    ndate = date;
                                }}
                            for (var i = 1; i <= 10; i++) {
                                ndate.add(1, 'years');
                                schedule.push([]);
                                let length = (schedule.length) - 1;
                                schedule[length].push(value[0]);
                                schedule[length].push(value[1]);
                                schedule[length].push(tempvalue.Id);
                                schedule[length].push("No Response");
                                schedule[length].push("On Track");
                                let datetime = moment(ndate, 'YYYY-MM-DD');
                       schedule[length].push(datetime.format('YYYY-MM-DD'));
                                if ((tempvalue.MessageType == "Message" || tempvalue.MessageType == "Document") && tempvalue.MessageContent != null) {
                                    msg = tempvalue.MessageContent;
                                    let status = msg.indexOf("@NewHire");
                                    let status1 = msg.indexOf("@Manager");
                                    let status2 = msg.indexOf("@Team");
                                    let status3 = msg.indexOf("@Role");
                                    let status4 = msg.indexOf("@Start Date");
                                    if (status != -1) {
                                        msg = msg.replace("@NewHire", value[3]);
                                    }
                                    else {
                                        msg = msg.replace("@NewHire", "");
                                    }
                                    if (status1 != -1 && value[4] != "") {
                                        msg = msg.replace("@Manager", value[4]);
                                    }
                                    else {
                                        msg = msg.replace("@Manager", "");
                                    }
                                    if (status2 != -1 && value[5] != "") {
                                        msg = msg.replace("@Team", value[5]);
                                    }
                                    else {
                                        msg = msg.replace("@Team", "");
                                    }
                                    if (status3 != -1 && value[6] != "") {
                                        msg = msg.replace("@Role", value[6]);
                                    }
                                    else {
                                        msg = msg.replace("@Role", "");
                                    }
                                    if (status4 != -1) {
          msg = msg.replace("@Start Date", cstartdate1.format('LL'));
                                    }}
                                schedule[length].push(msg);
                                schedule[length].push(value[7]);
                            }}}});
                NewUserAction.MultipleTemplateSchedule(this.state.siteUrl, this.state.currentContext, UserDetails[0], schedule);
            });}
    }

    public openModal = () => {
 NewUserAction.MultipleUserData(this.state.siteUrl, this.state.currentContext);
  NewUserAction.MultipleTeamData(this.state.siteUrl, this.state.currentContext);
 NewUserAction.MultipleRoleData(this.state.siteUrl, this.state.currentContext);
        NewUserAction.userMailID(this.state.siteUrl, this.state.currentContext);
NewUserAction.MultipleManagerData(this.state.siteUrl, this.state.currentContext);
 NewUserAction.getTemplateDetails(this.state.siteUrl, this.state.currentContext);
        this.setState({ multiplepopup: true });
    }

    handledata = (data) => {
        let file = `${this.state.fileInput.current.files[0].name}`;
        let uploadFileType = file.split(".");
        let fileTypeindex = uploadFileType.length - 1;
        this.setState({ FileName: file });
        if (uploadFileType[fileTypeindex] == "csv") {
            this.setState({ importUserData: data,ErrorMessage:"" }, () => {
                this.state.importUserData.map((value, index) => {
                    if (value.StartDate != "") {
                        let startdate1 = new Date(value.StartDate);
                     const mnth = ("0" + (startdate1.getMonth() + 1)).slice(-2),
                            day = ("0" + startdate1.getDate()).slice(-2);
let startDate = [startdate1.getFullYear(), mnth, day].join("-") + "T00:00:00.000Z";
                        value.StartDate = startDate;
                    }});});
        }
        else {
            this.setState({ ErrorMessage: "Please Upload .csv File" });
        }}

    CreateContent = (e) => {
        if (this.state.importUserData.length > 0) {
            this.state.UserInvalidData.length = 0;
            this.setState({ ErrorMessage: "" });
            this.validateMultipleUser();
        }
        if(this.state.FileName==""){
  this.setState({ErrorMessage:"Please Upload A File For User Creation"})
        }
else if(this.state.importUserData.length == 0&&this.state.ErrorMessage==""){
            this.setState({ErrorMessage:"Please Upload A File With Data"})
        }
}

    public close = () => {
        this.setState({
multiplepopup: false, importUserData: [], MultipleUserData: [], MultipleTeamData: [],
MultipleRoleData: [], UserValidData: [], UserInvalidData: [], multipleTeamName: [], multipleRoleName: [],
multipleUserEmail: [], FileName: "", UserEmail: [], MultipleManagerData: [], ManagerEmail: [],
            ManagerTemplateData: [], ErrorMessage: "",
            successUserData: false,
            successTeamData: false,
            successRoleData: false,
            successUserMailID: false,
            successMultipleManagerData: false,
            successTemplateDetails: false,
        });
        UserConfigAction.getUserGridData(this.state.siteUrl, this.state.currentContext, "", 10);
    }

    public render(): React.ReactElement<MultipleUserCreationProps> {
let csvDownload = this.state.siteUrl + "/_layouts/15/Download.aspx?SourceUrl=" + this.state.siteUrl + "DownloadCSV/Multiple_User_Creation.csv";
        let keys = [
            "Email",
            "UserName",
            "UserType",
            "ManagerEmail",
            "Team",
            "Role",
            "StartDate",
        ]
        return (
            <div>
                <button
                    type="button"
                    className="btn btn-info ml-3"
                    data-toggle="modal"
                    data-target="#exampleModalCenter2"
                    onClick={this.openModal.bind(this)} >
                    <img src={threedots} />
                </button>
                {this.state.multiplepopup && this.state.successMultipleManagerData && this.state.successRoleData && this.state.successTeamData && this.state.successTemplateDetails && this.state.successUserData && this.state.successUserMailID ?
                    <div className="modal fade show" id="mul-add-new-hire" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" style={{ display: 'block', paddingRight: '17px' }} aria-modal="true">
<div className="modal-dialog modal-dialog-centered popupbox" role="document">
                            <div className="modal-content  px-2 pt-0 pb-2">
                                <div className="modal-header title">
                                    <h5 className="modal-title" id="exampleModalLongTitle">Onboard Multiple New Hires</h5>
  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.close.bind(this)}> <span aria-hidden="true">×</span> </button>
                                </div>
                                <div className="modal-body pt-1">
                                    <div className="form-group">
                                        <label className="labeltext col-gray" htmlFor="mul-add-new-hire">Please download the template given below and fill the details upload back to onboard multiple new hires</label>
<a href={csvDownload} className="download-template w-100 float-left" download><img src={DownloadImage} className="mr-2" />Download Template</a>
                                        <div className="upload-btn-wrapper mt-4">
<button type="button" className="download-template upload-button-prop "> <img className="mr-2 ml-2" src={UpoladImage} />Upload a new file</button>
                                            {this.state.FileName != "" ?
<label className="file-color ml-1 col-gray">{this.state.FileName}</label> : null}
                                            <CsvParse
                                                keys={keys}
                                                onDataUploaded={this.handledata}
render={onChange => <input type="file" ref={this.state.fileInput} accept=".csv" onChange={onChange} onClick={(e)=>{e.currentTarget.value=null;}}/>} />                                           
                                        </div>
                                        {this.state.ErrorMessage != "" ?
 <span className="mandatory-col-red mt-1">{this.state.ErrorMessage}</span>: null}
                                    </div>
                                </div>
                                <div className="modal-footer mt-3 popupfooter">
<label className="back_icon "><img className="back" src={Close} data-dismiss="modal" onClick={this.close.bind(this)} /></label>
        <button type="button" className="btn float-right" data-dismiss="modal" onClick={this.CreateContent.bind(this)}>Onboard</button>
                                </div>
                            </div>
                        </div>
                    </div> : null}
            </div>
        ); }
}

