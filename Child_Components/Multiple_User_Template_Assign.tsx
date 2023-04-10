/**
 * [Ref] - Denotes Pseudo Code Reference  
 *  
 * This component is the Multiple Template Assign component. The component allows to import multiple users for multiple template assign. 
 * 
 * App Name: Rocket
 * Author: Praveen Kumar
 * Created Date: 07/20/2020
 */
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import CSVReader from 'react-csv-reader';
import * as moment from 'moment';
import * as TemplateAssignAction from '../Action/User_Template_Assign_Action';
import TemplateAssignStore from '../Store/User_Template_Assign_Store';
import * as TodoAction from '../Action/Todo_Action';
import * as ProgressAction from '../webports/rocketWebport/Action/Progress_Action';
import '../css/commontheme.css';
import '../css/style.css';

const DownloadImage: string = require('../images/down-icon.svg');
const UpoladImage: string = require('../images/upload.svg');
const Close: string = require('../Images/backicon.svg');
const threedots: string = require('../images/threedots.svg');

export interface MultipleUserTemplateAssignProps {
    context: WebPartContext;
    callfrom: any;
    callback: any;
}

export interface MultipleUserTemplateAssignStates {
    siteUrl: any;
    currentContext: WebPartContext;
    MultipleAssignPopup: boolean;
    FileName: any;
    theInputKey:any;
    csvdata: any;
    UserDetails: any;
    UserDetails1: any;
    TemplateDetails: any;
    ErrorMsg: any;
    validArray: any;
    UserId: any;
    invalidIndex: any;
    onboardState: boolean;
    multipleTodoStatus: any;
    multipleScheduleBStatus: any;
    multipleScheduleLStatus: any;
    todoArray: any;
    scheduleBArray: any;
    scheduleLArray: any;
    todoflag: any;
    schedulebflag: any;
    schedulelflag: any;
    scheduleBlastoffArray: any;
    scheduleLoopInArray: any;
    tloopindex: any;
    bloopindex: any;
    lloopindex: any;
}

export default class MultipleUserTemplateAssign extends React.Component<MultipleUserTemplateAssignProps, MultipleUserTemplateAssignStates> {
    constructor(props) {
        super(props);
        this.state = {
            siteUrl: this.props.context.pageContext.web.absoluteUrl,
            currentContext: this.props.context,
            MultipleAssignPopup: false,
            csvdata: [],
            FileName: "",
            UserDetails: [],
            UserDetails1: [],
            TemplateDetails: [],
            ErrorMsg: [],
            validArray: [],
            UserId: "",
            theInputKey:true,
            invalidIndex: [],
            onboardState: true,
            multipleTodoStatus: [],
            multipleScheduleBStatus: [],
            multipleScheduleLStatus: [],
            todoArray: [],
            scheduleBArray: [],
            scheduleLArray: [],
            todoflag: 0,
            schedulebflag: 0,
            schedulelflag: 0,
            scheduleBlastoffArray: [],
            scheduleLoopInArray: [],
            tloopindex: 0,
            bloopindex: 0,
            lloopindex: 0
        }
    }

    public componentWillMount = () => {
        TemplateAssignStore.on("userdetails", this.loadUserDetails.bind(this));
TemplateAssignStore.on("TemplateDetails", this.loadTemplateDetails.bind(this));
        TemplateAssignStore.on("userdetails1", this.loadUserDetails1.bind(this));
        TemplateAssignStore.on("multipleTodoStatus", this.loadstatus.bind(this));
 TemplateAssignStore.on("multipleScheduleBStatus", this.loadstatus.bind(this));
  TemplateAssignStore.on("multipleScheduleLStatus", this.loadstatus.bind(this));
    }

    public loadstatus = () => {
        console.log("this.state.invalidIndex:",this.state.invalidIndex);
        let errormsg = "";
        if (this.state.invalidIndex.length > 0) {
            errormsg += "Error on line #";
            this.state.invalidIndex.map((invalue, inindex) => {
                errormsg += invalue;
                if (inindex != this.state.invalidIndex.length - 1) {
                    errormsg += ', ';
                }});
 errormsg += '. Data is not matching with the uploaded file. Please check and upload again.';
        }
        let tflag = this.state.todoflag;
        let bflag = this.state.schedulebflag;
        let lflag = this.state.schedulelflag;
        if (this.state.todoArray.length == 0 && tflag != 1) {
            tflag = 1;
        }
        if (this.state.scheduleBArray.length == 0 && bflag != 1) {
            bflag = 1;
        }
        if (this.state.scheduleLArray.length == 0 && lflag != 1) {
            lflag = 1;
        }
        if (TemplateAssignStore.multipleTodoStatus != undefined && tflag == 0) {
      this.state.multipleTodoStatus.push(TemplateAssignStore.multipleTodoStatus);
if (this.state.todoArray.length == this.state.multipleTodoStatus.length) {
console.log(this.state.multipleTodoStatus.length);
                tflag = 1;
                if (this.state.scheduleBArray.length > 0) {
                    this.setState({ todoflag: tflag }, () => { this.scheduleb(); });}
                else if (this.state.scheduleBArray.length == 0 && this.state.scheduleLArray.length > 0) {
                    this.setState({ todoflag: tflag }, () => { this.schedulel(); });}
  else if (this.state.scheduleBArray.length == 0 && this.state.scheduleLArray.length == 0) {
  this.setState({ todoflag: tflag, schedulebflag: 1, schedulelflag: 1 }, () => { this.final(errormsg); });
                }
            else {
                this.setState({ todoflag: tflag, tloopindex: TemplateAssignStore.multipleTodoStatus }, () => { this.todo(); });
            }}
        if (TemplateAssignStore.multipleScheduleBStatus != undefined && bflag == 0 && tflag == 1) {   this.state.multipleScheduleBStatus.push(TemplateAssignStore.multipleScheduleBStatus);
if (this.state.scheduleBArray.length == this.state.multipleScheduleBStatus.length) {
                bflag = 1;
                if (this.state.scheduleLArray.length > 0) {
  this.setState({ todoflag: tflag, schedulebflag: bflag }, () => { this.schedulel(); });
                }
                else if (this.state.scheduleLArray.length == 0) {
                    this.setState({ todoflag: tflag, schedulebflag: bflag, schedulelflag: 1 }, () => { this.final(errormsg); });
                }}
            else {
                this.setState({ todoflag: tflag, schedulebflag: bflag, bloopindex: TemplateAssignStore.multipleScheduleBStatus }, () => { this.scheduleb() });
            }}
        if (TemplateAssignStore.multipleScheduleLStatus != undefined && tflag == 1 && bflag == 1 && lflag == 0) {
this.state.multipleScheduleLStatus.push(TemplateAssignStore.multipleScheduleLStatus);
            if (this.state.scheduleLArray.length == this.state.multipleScheduleLStatus.length) {
                this.setState({ todoflag: tflag, schedulebflag: bflag, schedulelflag: lflag }, () => { this.final(errormsg); });
            }
            else {
                this.setState({ todoflag: tflag, schedulebflag: bflag, schedulelflag: lflag, lloopindex: TemplateAssignStore.multipleScheduleLStatus }, () => { this.schedulel() });
            }}
    }

    public final = (errormsg) => {
        if (this.state.todoflag == 1 && this.state.schedulebflag == 1 && this.state.schedulelflag == 1) {
            this.setState({ onboardState: true, ErrorMsg: errormsg });
        }
        if (errormsg == "") {
            this.multipleassignclose();
        }
    }

    public loadUserDetails = () => {
this.setState({ UserDetails: TemplateAssignStore.userdetail }, () => { TemplateAssignAction.getTemplateDetails(this.state.siteUrl, this.state.currentContext); });
    }

    public loadTemplateDetails = () => {
        this.setState({ TemplateDetails: TemplateAssignStore.templateDetails }, () => { TemplateAssignAction.getUserDetail1(this.state.siteUrl, this.state.currentContext); });
    }

    public loadUserDetails1 = () => {
this.setState({ UserDetails1: TemplateAssignStore.userdetail1 }, () => { this.validate(); });
    }

    public validate = () => {
                let todoArray = this.state.todoArray;
        let scheduleBUserDetails = this.state.scheduleBArray;
        let scheduleLUserDetails = this.state.scheduleLArray;
        let scheduleBlastoffArray = this.state.scheduleBlastoffArray;
        let scheduleLoopInArray = this.state.scheduleLoopInArray;
        this.state.validArray.map((value, index) => {
            let flag2 = 0;
            this.state.UserDetails.map((uvalue, uindex) => {
                if (value.UserEmail == uvalue.Email) {
                    flag2 = 1;
                    if (value.ScheduleType == "Todo") {
                        let bflag = 0, lflag = 0, barray = [], larray = [];
                        if (value.Blastoffs != "") {
                            value.Blastoffs.split(';').map((bvalue, bindex) => {
                             this.state.TemplateDetails.map((tvalue, tindex) => {
  if (bvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateType == "Blastoff" && tvalue.TemplateFor == uvalue.UserType) {
          if (uvalue.Role != null && tvalue.Role.length != 0) {
                                            if (uvalue.Role.Role != null) {
                                          tvalue.Role.map((rvalue, rindex) => {
                                if (rvalue.Role == uvalue.Role.Role) {
                                                        barray.push(tvalue);
                                                    }});}
                                        }
                                        else {
                                            debugger;
                                            barray.push(tvalue);
                                        }}});
                            });
  if (barray.length != value.Blastoffs.split(';').length) {
                                bflag = 1;
                            }}
                        if (value.LoopIns != "") {
                            value.LoopIns.split(';').map((lvalue, lindex) => {
                           this.state.TemplateDetails.map((tvalue, tindex) => {
if (lvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateType == "LoopIn") {
              if (uvalue.Role != null && tvalue.Role.length != 0) {
                                            if (uvalue.Role.Role != null) {
                                      tvalue.Role.map((rvalue, rindex) => {
                             if (rvalue.Role == uvalue.Role.Role) {
                                                        larray.push(tvalue);
                                                    }});}
                                        }
                                        else {
                                            larray.push(tvalue);
                                        }}});
});
                     if (larray.length != value.LoopIns.split(';').length) {
                                lflag = 1;
                            }}
                        if (bflag == 0 && lflag == 0) {
                            todoArray.push([]);
                            let length = todoArray.length;
                            todoArray[length - 1].push(uvalue.User.Id);
                            if (value.Blastoffs != "") {
                                todoArray[length - 1].push([]);
                        value.Blastoffs.split(';').map((bvalue, bindex) => {
                 this.state.TemplateDetails.map((tvalue, tindex) => {
                                        if (tvalue.TemplateType == "Blastoff") {
if (bvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateFor == uvalue.UserType) {
                     todoArray[length - 1][1].push(tvalue.ID);
                                            }}});
                            }
                            else {
                                todoArray[length - 1].push([]);
                            }
                            if (value.LoopIns != "") {
                                todoArray[length - 1].push([]);
                            value.LoopIns.split(';').map((lvalue, lindex) => {
this.state.TemplateDetails.map((tvalue, tindex) => {
                                        if (tvalue.TemplateType == "LoopIn") {
  if (lvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase()) {
                         todoArray[length - 1][2].push(tvalue.ID);
                                            }}});});
                            }
                            else {
                                todoArray[length - 1].push([]);
                            }
                            todoArray[length - 1].push(uvalue.ID);
                            todoArray[length - 1].push(value.Comments);
                            console.log("TodoArray:",todoArray);
                        }
                        else {
                            if (this.state.invalidIndex.length > 0) {
                                let flag = 0;
                                this.state.invalidIndex.map((value3, index3) => {
if (value.index != value3 && index3 == this.state.invalidIndex.length - 1 && flag == 0) {
 this.state.invalidIndex.push(value.index);
                                    }
                                    else if (value.index == value3) {
                                        flag = 1;
                                    }});
                            }
                            else {
                                this.state.invalidIndex.push(value.index);
                            }}
                    }
                    else if (value.ScheduleType == "Schedule") {
                        let sflag = 0, barray = [], larray = [];
                        if (value.Blastoffs != "") {
                            value.Blastoffs.split(';').map((bvalue, bindex) => {
                          this.state.TemplateDetails.map((tvalue, tindex) => {
   if (bvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateType == "Blastoff" && tvalue.TemplateFor == uvalue.UserType) {
        if (uvalue.Role != null && tvalue.Role.length != 0) {
                                            if (uvalue.Role.Role != null) {
                                    tvalue.Role.map((rvalue, rindex) => {
                              if (rvalue.Role == uvalue.Role.Role) {
                                                        barray.push(tvalue);
                                                    }});}
                                        }
                                        else {
                                            barray.push(tvalue);
                                        }}});
                            });
 if (barray.length != value.Blastoffs.split(';').length) {
                                sflag = 1;
                            }
                        }
                        if (value.LoopIns != "") {
                            value.LoopIns.split(';').map((lvalue, lindex) => {
                          this.state.TemplateDetails.map((tvalue, tindex) => {
 if (lvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateType == "LoopIn") {
             if (uvalue.Role != null && tvalue.Role.length != 0) {
                                            if (uvalue.Role.Role != null) {
                                        tvalue.Role.map((rvalue, rindex) => {
                        if (rvalue.Role == uvalue.Role.Role) {
                                                        larray.push(tvalue);
                                                    }});}
                                        }
                                        else {
                                            larray.push(tvalue);
                                        }}});
                            });
                        if (larray.length != value.LoopIns.split(';').length) {
                                sflag = 1;
                            }
                        }
                        if (sflag == 0) {
                            if (value.Blastoffs != "") {
                                scheduleBUserDetails.push([]);
                                let length = scheduleBUserDetails.length;
                                scheduleBlastoffArray.push([]);
                                let length1 = scheduleBlastoffArray.length;
                                if (uvalue.UserType == "Manager") {
                                    let flag1 = 0;
                           this.state.UserDetails1.map((value1, index1) => {
                                        if (value1.Manager != null) {
                if (value1.Manager.EMail != null && value.UserEmail != null) {
                          if (value1.Manager.EMail == value.UserEmail) {
                                                    flag1 = 1;
                                                    let team = "", role = "";
                                                    if (value1.Team != null) {
                                             if (value1.Team.Team != null) {
                                       team = value1.Team.Team;
                                                        }
                                                    }
                                                    if (value1.Role != null) {
                                           if (value1.Role.Role != null) {
                                       role = value1.Role.Role;
                                                        }}
                                       scheduleBUserDetails[length - 1].push([]);
          let length1 = scheduleBUserDetails[length - 1].length;
             scheduleBUserDetails[length - 1][length1 - 1].push(uvalue.User.Id);
                   scheduleBUserDetails[length - 1][length1 - 1].push(uvalue.Id);
            scheduleBUserDetails[length - 1][length1 - 1].push(value1.StartDate);
           scheduleBUserDetails[length - 1][length1 - 1].push(value1.UserName);
            scheduleBUserDetails[length - 1][length1 - 1].push(uvalue.UserName);
                    scheduleBUserDetails[length - 1][length1 - 1].push(team);
                       scheduleBUserDetails[length - 1][length1 - 1].push(role);
              scheduleBUserDetails[length - 1][length1 - 1].push(value1.Email);
                                                }}}
                                    });
                                    if (flag1 == 0) {
                 scheduleBUserDetails[length - 1].push(uvalue.User.Id);
                   scheduleBUserDetails[length - 1].push(uvalue.Id);
                                    }
                                }
                                else if (uvalue.UserType == "New Hire") {
                                    let managername = "", team = "", role = "";
                                    if (uvalue.Manager != null) {
                                        if (uvalue.Manager.FirstName != null) {
               managername = uvalue.Manager.FirstName;
                                        if (uvalue.Manager.LastName != null) {
                      managername += " " + uvalue.Manager.LastName;
                                            }}
                                    }
                                    if (uvalue.Team != null) {
                                        if (uvalue.Team.Team != null) {
                                            team = uvalue.Team.Team;
                                        }
                                    }
                                    if (uvalue.Role != null) {
                                        if (uvalue.Role.Role != null) {
                                            role = uvalue.Role.Role;
                                        }
                                    }
           scheduleBUserDetails[length - 1].push(uvalue.User.Id);
                scheduleBUserDetails[length - 1].push(uvalue.Id);
        scheduleBUserDetails[length - 1].push(uvalue.StartDate);
          scheduleBUserDetails[length - 1].push(uvalue.UserName);
       scheduleBUserDetails[length - 1].push(managername);
                                    scheduleBUserDetails[length - 1].push(team);
                                    scheduleBUserDetails[length - 1].push(role);
                                }
                      value.Blastoffs.split(';').map((bvalue, bindex) => {
                   this.state.TemplateDetails.map((tvalue, tindex) => {
                                        if (tvalue.TemplateType == "Blastoff") {
if (bvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase() && tvalue.TemplateFor == uvalue.UserType) {
                              scheduleBlastoffArray[length1 - 1].push(tvalue);
                                            }}});});
                            }
                            if (value.LoopIns != "") {
                                scheduleLUserDetails.push([]);
                                let length = scheduleLUserDetails.length;
                                scheduleLoopInArray.push([]);
                                let length1 = scheduleLoopInArray.length;
                                let managername = "", team = "", role = "";
                                if (uvalue.Manager != null) {
                                    if (uvalue.Manager.FirstName != null) {
                                        managername = uvalue.Manager.FirstName;
                                        if (uvalue.Manager.LastName != null) {
                    managername += " " + uvalue.Manager.LastName;
                                        }}
                                }
                                if (uvalue.Team != null) {
                                    if (uvalue.Team.Team != null) {
                                        team = uvalue.Team.Team;
                                    }
                                }
                                if (uvalue.Role != null) {
                                    if (uvalue.Role.Role != null) {
                                        role = uvalue.Role.Role;
                                    }
                                }
       scheduleLUserDetails[length - 1].push(uvalue.User.Id);
                                scheduleLUserDetails[length - 1].push(uvalue.Id);
      scheduleLUserDetails[length - 1].push(uvalue.StartDate);
      scheduleLUserDetails[length - 1].push(uvalue.UserName);
        scheduleLUserDetails[length - 1].push(managername);
                                scheduleLUserDetails[length - 1].push(team);
                                scheduleLUserDetails[length - 1].push(role);
                          value.LoopIns.split(';').map((lvalue, lindex) => {
                       this.state.TemplateDetails.map((tvalue, tindex) => {
                                        if (tvalue.TemplateType == "LoopIn") {
                                            if (lvalue.replace(/\s/g, "").toLowerCase() == tvalue.TemplateName.replace(/\s/g, "").toLowerCase()) {
                              scheduleLoopInArray[length1 - 1].push(tvalue);
                                            }}});});}
                        }
                        else {
                            if (this.state.invalidIndex.length > 0) {
                                let flag = 0;
                                this.state.invalidIndex.map((value3, index3) => {
                                    if (value.index != value3 && index3 == this.state.invalidIndex.length - 1 && flag == 0) {
this.state.invalidIndex.push(value.index);
                                    }
                                    else if (value.index == value3) {
                                        flag = 1;
                                    }});
                            }
                            else {
                                this.state.invalidIndex.push(value.index);
                            }}}}
            });
            if (flag2 == 0) {
                if (this.state.invalidIndex.length > 0) {
                    let flag = 0;
                    this.state.invalidIndex.map((value3, index3) => {
                        if (value.index != value3 && index3 == this.state.invalidIndex.length - 1 && flag == 0) {
                            this.state.invalidIndex.push(value.index);
                        }
                        else if (value.index == value3) {
                            flag = 1;
                        }});
                }
                else {
                    this.state.invalidIndex.push(value.index);
                }}
        });
        let todoflag = 0, schedulebflag = 0, schedulelflag = 0;
        if (todoArray.length > 0) {
            todoflag = 1;
            this.todo();
        }
        else {
            if (scheduleBUserDetails.length > 0 && todoflag == 0) {
                this.scheduleb();
                schedulebflag = 1;
            }
            else if (scheduleBUserDetails.length == 0 && scheduleLUserDetails.length > 0 && todoflag == 0) {
                this.schedulel();
                schedulelflag = 1;
            }
        }
        if (todoflag == 0 && schedulelflag == 0 && schedulebflag == 0) {
            let errormsg = "";
            if (this.state.invalidIndex.length > 0) {
                errormsg += "Error on line #";
                this.state.invalidIndex.map((invalue, inindex) => {
                    errormsg += invalue;
                    if (inindex != this.state.invalidIndex.length - 1) {
                        errormsg += ', ';
                    }
                });
                errormsg += '. Data is not matching with the uploaded file. Please check and upload again.';
            }
            this.setState({ onboardState: true, ErrorMsg: errormsg });
        }
    }

    public todo = () => {
        this.state.todoArray.map((value, index) => {
            if (index == this.state.tloopindex) {
                TemplateAssignAction.postmultipleTodo(this.state.siteUrl, this.state.currentContext, value, index);
            }});
    }

    public scheduleb = () => {
        if (this.state.scheduleBArray.length > 0) {
            this.state.scheduleBArray.map((svalue, sindex) => {
                let flag = 0;
                this.state.scheduleBlastoffArray.map((sbvalue, sbindex) => {
      if (sindex == sbindex && flag == 0 && this.state.bloopindex == sindex) {
                        let array = [];
                        this.state.TemplateDetails.map((tvalue, tindex) => {
                            sbvalue.map((sbbvalue, sbbindex) => {
                            if (sbbvalue.TemplateName == tvalue.TemplateName) {
                                    array.push(tvalue.ID);
                                }});
});
                  if (svalue.length == 7 && svalue[0].length == undefined) {
                            flag = 1;
this.calschedule(sbvalue, [svalue], svalue[1], array, "Blastoff", sindex);
                        }
                        if (svalue[0].length == 8) {
                            flag = 1;
this.calschedule(sbvalue, svalue, svalue[0][1], array, "Blastoff", sindex);
                        }
                   if (svalue.length == 2 && svalue[0].length == undefined) {
                            flag = 1;
       this.calschedule(sbvalue, [[]], svalue[1], array, "Blastoff", sindex);
                        }}});});}
    }

    public schedulel = () => {
        if (this.state.scheduleLArray.length > 0) {
            this.state.scheduleLArray.map((svalue, sindex) => {
                let flag = 0;
                this.state.scheduleLoopInArray.map((slvalue, slindex) => {
       if (sindex == slindex && flag == 0 && this.state.lloopindex == sindex) {
                        let array1 = [];
                        this.state.TemplateDetails.map((tvalue, tindex) => {
                            slvalue.map((sllvalue, sllindex) => {
                         if (sllvalue.TemplateName == tvalue.TemplateName) {
                                    array1.push(tvalue.ID);
                                }});
                        });
                        if (svalue.length == 7) {
                            flag = 1;
this.calschedule(slvalue, [svalue], svalue[1], array1, "LoopIn", sindex);
                        }}});});}
    }

    public calschedule = async (TempDetails, UserDetails, UserId, array, TempType, index) => {
        let schedule = [];
        if (UserDetails[0].length == 7 || UserDetails[0].length == 8) {
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
                            }
                        }
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
                        if (value.length == 8) {
                            schedule[length].push(value[7]);
                        }
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
                                    }
                                }
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
                                    }
                                }
                                schedule[length].push(msg);
                                if (value.length == 8) {
                                    schedule[length].push(value[7]);
                                }
                        }
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
                                    }
                                }
                                if (tempvalue.StartDateType == "After") {
                                    ndate = moment(date).add(i, 'days');
                                }
                                tempvalue.WeekDays.map((weekvalue, index) => {
if (ndate.format('dddd') == weekvalue.Weekdays){
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
                                        if (value.length == 8) {
                                            schedule[length].push(value[7]);
                                        }}});}
                        }
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
                                    }
                                }
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
                                        if (value.length == 8) {
                                            schedule[length].push(value[7]);
                                        }}
                                }
                                if (tempvalue.MonthlyRepitition == "Week") {
                                    if (tempvalue.NoOfDaysOrWeek == "1") {
    if (parseInt(ndate.format('D')) >= 1 && parseInt(ndate.format('D')) <= 7) {
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
                                                    if (value.length == 8) {
                                                        schedule[length].push(value[7]);
                                                    }}});}
                                    }
                                    if (tempvalue.NoOfDaysOrWeek == "2") {
  if (parseInt(ndate.format('D')) > 7 && parseInt(ndate.format('D')) <= 14) {
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
if (value.length == 8) {
schedule[length].push(value[7]);
}
}
});
}
}

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
debugger;
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
if (value.length == 8) {
schedule[length].push(value[7]);
}
}
});}
}
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
}
}
schedule[length].push(msg);
if (value.length == 8) {
schedule[length].push(value[7]);
}}});}}}}
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
}
}
else {
if (date < date1) {
ndate = date1.add(1, 'years');
}
else {
ndate = date;
}
}
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
}
}
schedule[length].push(msg);
if (value.length == 8) {
schedule[length].push(value[7]);
}}}}});
});
TemplateAssignAction.postMultipleSchedule(this.state.siteUrl, this.state.currentContext, schedule, UserId, array, TempType, index, "");
}
else {
TemplateAssignAction.postMultipleSchedule(this.state.siteUrl, this.state.currentContext, schedule, UserId, array, TempType, index, "noschedule");
}
}

public multipleassignopen = () => {
this.setState({ MultipleAssignPopup: true });
}

public multipleassignclose = () => {
this.setState({ MultipleAssignPopup: false });
this.setState({ FileName: "", csvdata: [], UserDetails: [], UserDetails1: [], TemplateDetails: [], ErrorMsg: "", validArray: [], UserId: "", invalidIndex: [], multipleTodoStatus: [], multipleScheduleBStatus: [], multipleScheduleLStatus: [], todoArray: [], scheduleBArray: [], scheduleLArray: [], todoflag: 0, schedulebflag: 0, schedulelflag: 0, scheduleBlastoffArray: [], scheduleLoopInArray: [], tloopindex: 0, bloopindex: 0, lloopindex: 0 });
if (this.props.callfrom == "Todos") {
TodoAction.getTodoGridData(this.state.siteUrl, this.state.currentContext, "");
}
else if (this.props.callfrom == "ProgressTracker") {
this.props.callback();
}
}

public handleFileUpload = (data, FileInfo) => {
let uploadFileType = FileInfo.name.split(".");
let fileTypeindex = uploadFileType.length - 1;
if (uploadFileType[fileTypeindex] == "csv") {
this.setState({ FileName: "", csvdata: [], UserDetails: [], UserDetails1: [], TemplateDetails: [], ErrorMsg: "", validArray: [], UserId: "", invalidIndex: [], multipleTodoStatus: [], multipleScheduleBStatus: [], multipleScheduleLStatus: [], todoArray: [], scheduleBArray: [], scheduleLArray: [], todoflag: 0, schedulebflag: 0, schedulelflag: 0, scheduleBlastoffArray: [], scheduleLoopInArray: [], tloopindex: 0, bloopindex: 0, lloopindex: 0 });
data.map((value, index) => {
if (value[0] == "" && (value[1] == "" || value[1] == null) && (value[2] == "" || value[2] == null) && (value[3] == "" || value[3] == null) || (value[4] == "" || value[4] == null) && index == data.length - 1) {
data.splice(index, 1);
}});
this.setState({ csvdata: data, FileName: FileInfo.name, ErrorMsg: "" });
FileInfo=null;
data=null;
}
else {
this.setState({ ErrorMsg: "Please Upload .csv File" });
FileInfo=null;
data=null;
}
}

public create = () => {
this.state.csvdata.map((value, index) => {
if (value.UserEmail == "" && value.Blastoffs == "" && value.LoopIns == "" && value.ScheduleType == "" && value.Comments == "") {
if (index == this.state.csvdata.length - 1) {
this.state.csvdata.splice(index, 1);
}}});
let validArray = [];
if (this.state.csvdata.length > 0) {
this.setState({ onboardState: false });
let array = [];
this.state.csvdata.map((value, index) => {
let bflag = 0, lflag = 0;
if (value.Blastoffs != "") {
value.Blastoffs.split(';').map((bvalue, bindex) => {
value.Blastoffs.split(';').map((bbvalue, bbindex) => {
if (bbindex >= bindex + 1) {
if (bvalue == bbvalue && bbindex == value.Blastoffs.split(';').length - 1) {
bflag = 1;
}}});});
}
if (value.LoopIns != "") {
value.LoopIns.split(';').map((lvalue, lindex) => {
value.LoopIns.split(';').map((llvalue, llindex) => {
if (llindex >= lindex + 1) {
if (lvalue == llvalue && llindex == value.LoopIns.split(';').length - 1) {
lflag = 1;
}}});});
}
if (value.ScheduleType == "Schedule" && value.UserEmail != "" && (value.Blastoffs != "" || value.LoopIns != "") && (bflag == 0 && lflag == 0)) {
let flag = true;
let length1 = value.Blastoffs.split(';').length;
let length2 = value.LoopIns.split(';').length;
if (length1 + length2 > 10) {
flag = false;
}
if (flag == true) {
array.push({ UserEmail: value.UserEmail, Blastoffs: value.Blastoffs, LoopIns: value.LoopIns, ScheduleType: value.ScheduleType, Comments: value.Comments, index: index + 1 });
}
else {
this.state.invalidIndex.push(index + 1);
}
}
else if (value.ScheduleType == "Todo" && value.UserEmail != "" && (bflag == 0 && lflag == 0)) {
let flag = true, length1, length2;
if (value.Blastoffs != "") {
length1 = value.Blastoffs.split(';').length;
}
if (value.LoopIns != "") {
length2 = value.LoopIns.split(';').length;
}
if (length1 + length2 > 10) {
flag = false;
}
if (flag == true) {
array.push({ UserEmail: value.UserEmail, Blastoffs: value.Blastoffs, LoopIns: value.LoopIns, ScheduleType: value.ScheduleType, Comments: value.Comments, index: index + 1 });
}
else {
this.state.invalidIndex.push(index + 1);
}
}
else {
if (this.state.invalidIndex.length > 0) {
let flag = 0;
this.state.invalidIndex.map((value3, index3) => {
if (index != value3 - 1 && index3 == this.state.invalidIndex.length - 1 && flag == 0) {
this.state.invalidIndex.push(index + 1);
}
else if (index == value3) {
flag = 1;
}});
}
else {
this.state.invalidIndex.push(index + 1);
}}
});
array.map((value, index) => {
array.map((value1, index1) => {
if (index1 >= index + 1) {
if (value.UserEmail == value1.UserEmail && index1 == array.length - 1) {
if (this.state.invalidIndex.length > 0) {
let flag = 0;
this.state.invalidIndex.map((value3, index3) => {
if (value1.index != value3 && index3 == this.state.invalidIndex.length - 1 && flag == 0) {
this.state.invalidIndex.push(value1.index);
}
else if (value1.index == value3) {
flag = 1;
}});
}
else {
this.state.invalidIndex.push(value1.index);
}
}
else if (value.UserEmail != value1.UserEmail && index1 == array.length - 1) {
validArray.push(value);
}
}
else if (index == index1 && index == array.length - 1) {
validArray.push(array[index]);
}});
});
this.setState({ validArray }, () => { TemplateAssignAction.getUserDetail(this.state.siteUrl, this.state.currentContext); });
}
else if (this.state.csvdata.length == 0 && this.state.FileName != "") {
this.setState({ ErrorMsg: "Please Upload the File with valid data" });
}
else if (this.state.csvdata.length == 0 && this.state.FileName == ""&& this.state.ErrorMsg=="") {
this.setState({ ErrorMsg: "Please Upload a file for Onboarding" });
}
}

public reloadCSV  = ()=>{
this.setState({theInputKey: false});
this.setState({theInputKey: true});
}

public render(): React.ReactElement<MultipleUserTemplateAssignProps> {
const papaparseOptions = {
header: true,
dynamicTyping: false,
skipEmptyLines: false
};
return (
<div>
<button
type="button"
className="btn btn-info ml-3"
data-toggle="modal"
data-target="#mul-add-new-hire"
data-placement="bottom"
onClick={this.multipleassignopen.bind(this)}>
<img src={threedots} />
</button>
{this.state.MultipleAssignPopup ?
<div className="modal fade show" id="mul-add-new-hire" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" style={{ display: 'block', paddingRight: '17px' }} aria-modal="true">
<div className="modal-dialog modal-dialog-centered popupbox" role="document">
<div className="modal-content  px-2 pt-0 pb-2">
<div className="modal-header title">
<h5 className="modal-title" id="exampleModalLongTitle">Onboard Multiple Template</h5>
<button type="button" className="close" data-dismiss="modal" disabled={!this.state.onboardState} aria-label="Close" onClick={this.multipleassignclose.bind(this)}><span aria-hidden="true">×</span> </button>
</div>
<div className="modal-body pt-1">
<div className="form-group">
<label className="labeltext col-gray" htmlFor="mul-add-new-hire">Please download the template given below and fill the details upload back to onboard multiple new hires</label>
<a href={this.state.siteUrl + "/_layouts/15/Download.aspx?SourceUrl=" + this.state.siteUrl + 'DownloadCSV/Multiple_Template_Assign.csv'} className={this.state.onboardState ? "download-template w-100 float-left" : "download-template w-100 float-left not-active"} download><img src={DownloadImage} className="mr-2" />Download Template</a>
<div className="upload-btn-wrapper mt-4">
<button type="button" className="download-template upload-button-prop fileName-bottom-spacing fileName-right-spacing" onClick={this.reloadCSV.bind(this)}>
<img className="mr-2 ml-2" src={UpoladImage} />
Upload a new file
</button>
{this.state.theInputKey?
<CSVReader disabled={!this.state.onboardState} parserOptions={papaparseOptions} onFileLoaded={this.handleFileUpload.bind(this)}></CSVReader>
:null}
{this.state.FileName != "" ? <span className="form-placeholder-font-size float-left fileName-bottom-spacing w-100">{this.state.FileName}</span> : null}
{this.state.ErrorMsg != "" ? <span className="form-placeholder-font-size float-left mt-1 w-100 errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.ErrorMsg}</span> : null}
</div>
</div>
</div>
<div className="modal-footer mt-3 popupfooter">
<a href="#" className={this.state.onboardState ? "back_icon" : "back_icon not-active"} onClick={this.multipleassignclose.bind(this)}><img className="back" src={Close} data-dismiss="modal" /></a>
{this.state.onboardState ? <button type="button" className="btn float-right" data-dismiss="modal" onClick={this.create.bind(this)}>Assign</button> : null}
{!this.state.onboardState ? <div className="loader"></div> : null}
</div>
</div>
</div>
</div> : null}
</div>
);
}
}
