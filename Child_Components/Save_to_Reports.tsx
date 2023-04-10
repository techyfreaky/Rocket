/** [Ref] - Denotes Pseudo Code Reference
* This component is the save to report component. The component is used to save the grid in a csv file.
* App Name: Rocket
* Author: Praveen Kumar
* Created Date: 06/19/2020 */
import * as React from 'react';
import { IRocketAppProps } from '../../../components/IRocketAppProps';
import { escape, assign } from '@microsoft/sp-lodash-subset';
import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import '../css/commontheme.css';
import '../css/style.css';
import * as SaveReportAction from '../Action/Save_To_Report_Action';
import SaveReportStore from '../Store/Save_To_Report_Store';

const backicon: string = require('../images/backicon.svg');
const save: string = require('../images/save.svg');

export interface IReportGridProps {
siteUrl: any;
context: WebPartContext;
listname: string;
selectfields: any;
gridfields: any;
displayfields: any;
filterquery: any;
}

export interface IReportGridStates {
siteUrl: string;
currentContext: WebPartContext;
libraryName: string;
listName: string;
selectfields: any;
gridfields: any;
displayfields: any;
filterquery: any;
savepopup: boolean;
ReportNames: any;
ReportName: string;
RName: string;
GridData: any[];
csvdata: any;
ErrorMsg: any;
}

export default class ReportGrid extends React.Component<IReportGridProps, IReportGridStates>{
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
libraryName: "Report",
listName: this.props.listname,
selectfields: this.props.selectfields,
gridfields: this.props.gridfields,
displayfields: this.props.displayfields,
filterquery: this.props.filterquery,
savepopup: false,
ReportNames: [],
ReportName: "",
RName: "",
GridData: [],
csvdata: [],
ErrorMsg: ""
}
}

public componentWillMount() {
SaveReportStore.on("reportname", this.loadReportNames.bind(this));
SaveReportStore.on("gridData", this.loadGridData.bind(this));
}

public loadReportNames = () => {
this.setState({ ReportNames: SaveReportStore.ReportName }, () => { this.save() });
}

public loadGridData = () => {
let array = [];
let gridfields = this.state.gridfields;
let gridData = SaveReportStore.GridData;
gridData.map((gdvalue, gdindex) => {
array.push([]);
let joinvalue = "";
gridfields.map((value, index) => {
if (value[0] != '/') {
if (value == "StartDate" || value == "Created" || value == "ScheduledDateAndTime") {
let pvalue;
pvalue = moment(gdvalue[value]).format('LL');
array[gdindex].push(pvalue);
}
else {
if (gdvalue[value] != null) {
array[gdindex].push(gdvalue[value]);
}
else {
array[gdindex].push('-');
}}
}
else {
let values = value.split('/');
let pvalue;
if (gdvalue[values[1]] != null) {
if (gdvalue[values[1]][values[2]] != null) {
if (values[2] == "StartDate" || value == "Created" || value == "ScheduledDateAndTime") {
pvalue = moment(gdvalue[values[1]][values[2]]).format('LL');
}
else {
if (values[2] == "FirstName" || values[2] == "LastName") {
joinvalue += gdvalue[values[1]][values[2]] + " ";
}
else {
pvalue = gdvalue[values[1]][values[2]];
}}
}
else {
pvalue = '-';
}
}
else {
pvalue = '-';
}
if (values[2] == "FirstName" || values[2] == "LastName") {
if (values[2] == "LastName") {
if (joinvalue == "") {
array[gdindex].push('-');
}
else {
array[gdindex].push(joinvalue);
}}
}
else {
array[gdindex].push(pvalue);
}}});
});
this.setState({ GridData: array }, () => { this.createcsv(); });
}

public createcsv = () => {
const newcsv = {
fieldSeparator: ',',
quoteStrings: '"',
decimalSeparator: '.',
useTextFile: false,
useBom: true,
showLabels: true,
headers: this.state.displayfields
}
const csvExporter = new ExportToCsv(newcsv);
const csv = csvExporter.generateCsv(this.state.GridData, true);
this.setState({ csvdata: csv }, () => { this.post(); });
}

public post = () => {
if (this.state.csvdata.length != 0) {
SaveReportAction.postCsv(this.state.siteUrl, this.state.currentContext, this.state);
}
this.saveclose();
}

public handleReportName = (event) => {
this.setState({ RName: event.target.value });
this.setState({ ErrorMsg: "" });
var str = event.target.value;
/*filename validation*/
for (var i = 0, x = str.length; i < x; i++) {
if (str[i] == '"' || str[i] == '*' || str[i] == ':' || str[i] == '<' || str[i] == '>' || str[i] == '?' || str[i] == '/' || str[i] == "\\" || str[i] == '|' || str[i] == '.') {
this.setState({ ErrorMsg: "Please enter a name that doesn't include any of these characters: * : < > ? / \\ |." + '"' });
}

/*capitalizing the first letter of each word*/
str = str.split(" ");
for (var j = 0, y = str.length; j < y; j++) {
str[j] = str[j][0].toUpperCase() + str[j].substring(1);
}
str = str.join(" ");
this.setState({ ReportName: str });
}

/** SR_PC_15 Sets the savepopup value to true*/
public saveopen = () => {
this.setState({ savepopup: true });
}

/** SR_PC_11 Invoke the SaveReport action to get all the ReportNames Data.*/
public savevalidation = () => {
if (this.state.ErrorMsg == "") {
SaveReportAction.getReportName(this.state.siteUrl, this.state.currentContext);
}
}

public save = () => {
if (this.state.ReportName != "") {
let status = false;
this.state.ReportNames.map((value, index) => {
let rname = value.ReportName.replace(/\s/g, "");
let reportname = this.state.ReportName.replace(/\s/g, "");
if (rname.toLowerCase() == reportname.toLowerCase()) {
status = true;
}
});
if (status == false) {
SaveReportAction.getGridData(this.state.siteUrl, this.state.currentContext, this.state.listName, this.state.selectfields, this.state.filterquery);
}
else {
this.setState({ ErrorMsg: "Report Name Already Exists" });
}
}
else {
this.setState({ ErrorMsg: "Save the report with a report name" });
}
}

/*** SR_PC_16 Clears the state variables and sets the savepopup value to false*/
public saveclose = () => {
this.setState({ savepopup: false, RName: "", ReportName: "", selectfields: "", gridfields: [], displayfields: [], ErrorMsg: "", csvdata: [], GridData: [] });
}

public render(): React.ReactElement<IRocketAppProps> {
return (
<div>
<button
type="button"
className="btn btn-info ml-3"
data-toggle="modal"
data-target="#exampleModalCenter"
onClick={this.saveopen.bind(this)}>
<img src={save} /></button>
{this.state.savepopup ?
<div
className="modal fade show"
id="exampleModalCenter"
tabIndex={-1}
style={{ display: "block", paddingRight: 17 }}
role="dialog"
aria-labelledby="exampleModalCenterTitle"
aria-hidden="true">
<div
className="modal-dialog modal-dialog-centered popupbox"
role="document">
<div className="modal-content  px-2 pt-0 pb-2">
<div className="modal-header title">
<h5 className="modal-title" id="exampleModalLongTitle">Save to Reports</h5>
<button
type="button"
className="close"
data-dismiss="modal"
aria-label="Close"
onClick={() => { this.setState({ savepopup: false }); }}>
<span aria-hidden="true">×</span></button>
</div>
<div className="modal-body">
<div className="form-group">
<label className="labeltext" htmlFor="exampleFormControlSelect1">Report Name</label>
<input maxLength={64} className="form-control py-0 textbox save-to-name" type="text" value={this.state.RName} onChange={this.handleReportName.bind(this)}/>
</div>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.ErrorMsg}</span>
<div className="modal-footer mt-3 popupfooter">
<label className="back_icon ">
<img
className="back"
src={backicon}
data-dismiss="modal"
onClick={this.saveclose.bind(this)}/></label>
<button
type="button"
className="btn float-right"
data-dismiss="modal"
onClick={this.savevalidation.bind(this)}>Save</button>
</div>
</div>
</div>
</div> : null}
</div>
);}
}
