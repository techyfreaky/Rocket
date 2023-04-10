/** [Ref] - Denotes Pseudo Code Reference
* This component is the report grid component. The component displays the data in the Grid format.
* App Name: Rocket
* Author: Praveen Kumar
* Created Date: 06/16/2020 */
import * as React from 'react';
import { IRocketAppProps } from '../../../components/IRocketAppProps';
import { escape, assign } from '@microsoft/sp-lodash-subset';
import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import Moment from 'react-moment';
import SearchComponent from './Search_Component';
import Pagination from '@material-ui/lab/Pagination';
import { DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets } from 'office-ui-fabric-react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import OutsideHandler from 'react-outside-click-handler';
import '../css/commontheme.css';
import '../css/style.css';
import * as ReportGridAction from '../Action/Report_Action';
import ReportGridStore from '../Store/Report_Store';

const filter: string = require('../images/filter.svg');
const up: string = require('../images/up.svg');
const down: string = require('../images/down.svg');
const searchResults: string = require('../images/search-results.svg');
const greentick: string = require('../images/greentick.svg');

export interface IReportGridProps {
context: WebPartContext;
}

export interface IReportGridStates {
siteUrl: string;
currentContext: WebPartContext;
listName: string;
ReportGrid: any[];
ReportGridCount: any;
CreatedByList: any;
CreatedBy: any;
CreatedByName: string;
StartDateFrom: any;
CStartDateFrom: any;
StartDateTo: any;
CStartDateTo: any;
sortquery: any;
searchquery: any;
searchtext: any;
filterquery: any;
filterpopup: boolean;
deletepopup: boolean;
deletetoast: boolean;
delindex: any;
ErrorMsg: string;
DateRangeErrorMsg: string;
top: any;
currentPage: any;
postperPage: any;
indexofFirstPage: any;
indexofLastPage: any;
emptyPostsCount: any;
pageCount: any;
gridLength: any;
}

export default class ReportGrid extends React.Component<IReportGridProps, IReportGridStates>{
constructor(props) {
super(props);
this.state = {
siteUrl: this.props.context.pageContext.web.absoluteUrl,
currentContext: this.props.context,
listName: "Report",
ReportGrid: [],
ReportGridCount: "",
CreatedByList: [],
CreatedBy: [],
CreatedByName: "",
StartDateFrom: null,
CStartDateFrom: null,
StartDateTo: null,
CStartDateTo: null,
sortquery: "",
searchquery: "",
searchtext: "",
filterquery: "",
filterpopup: false,
deletepopup: false,
deletetoast: false,
delindex: "",
ErrorMsg: "",
DateRangeErrorMsg: "",
top: 10,
currentPage: 1,
postperPage: 10,
indexofFirstPage: 0,
indexofLastPage: 10,
emptyPostsCount: 0,
pageCount: '',
gridLength: ''
}
}

public componentWillMount() {
ReportGridAction.getReportGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top);
ReportGridStore.on("report", this.loadReportGrid.bind(this));
ReportGridStore.on("gridcount", this.loadReportGridCount.bind(this));
ReportGridAction.getUserName(this.state.siteUrl, this.state.currentContext);
ReportGridStore.on("username", this.loadUserName.bind(this));
ReportGridStore.on("Reportsuccess", this.ondeleteload.bind(this));
}

public loadReportGrid = () => {
let currentPosts = ReportGridStore.ReportGridData.slice(this.state.indexofFirstPage, this.state.indexofLastPage);
let gridLength = ReportGridStore.ReportGridData.length;
this.setState({ ReportGrid: currentPosts, gridLength, emptyPostsCount: 10 - currentPosts.length }, () => { ReportGridAction.getReportGridCount(this.state.siteUrl, this.state.currentContext, this.state.filterquery) });
}

public loadReportGridCount = () => {
let pageCount = Math.ceil(ReportGridStore.ReportGridCount.length / this.state.postperPage);
this.setState({ ReportGridCount: ReportGridStore.ReportGridCount.length, pageCount });
}

public loadUserName = () => {
this.setState({ CreatedByList: ReportGridStore.usernamelist });
}

public sort = (order, columnName) => {
let sort = "&$orderby=" + columnName + " " + order;
this.setState({ sortquery: sort }, () => { this.formquery(); });
}

public reportsearch = (searchtext) => {
let searchquery = "";
if (searchtext != "") {
searchquery = ` and (substringof('${searchtext}',ReportName))`;
}
this.setState({ searchtext });
this.setState({ searchquery: searchquery }, () => { this.formquery(); });
}

renderTypeaheadItems = (options, props, index) => {
return (
<div>
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + options.Email} ></img>
<span>{options.UserName}</span>
</div>
)
}

public setTypeahead = (uname) => {
this.setState({ CreatedBy: uname });
if (uname.length > 0) {
this.setState({ CreatedByName: uname[0].Email });
}
}

public handleStartFromDatePicker = (dateVal) => {
this.setState({ StartDateFrom: dateVal, ErrorMsg: "" });
this.handleValidate("from", dateVal);
this.convert("from", dateVal);
}

public handleStartToDatePicker = (dateVal) => {
this.setState({ StartDateTo: dateVal, ErrorMsg: "" });
this.handleValidate("to", dateVal);
this.convert("to", dateVal);
}

public handleValidate = (type, value) => {
let fromval = this.state.StartDateFrom, toval = this.state.StartDateTo;
if (type == "from" && toval != null) {
if (value > toval) {
this.setState({ DateRangeErrorMsg: "From Date should be lesser than the to Date" });}
else {
this.setState({ DateRangeErrorMsg: "" });
}}
if (type == "to" && fromval != null) {
if (value < fromval) {
this.setState({ DateRangeErrorMsg: "To Date should be greater than the from Date" });}
else {
this.setState({ DateRangeErrorMsg: "" });
}}
}

public convert = (type, date) => {
let startdate = new Date(date),
mnth = ("0" + (date.getMonth() + 1)).slice(-2),
day = ("0" + date.getDate()).slice(-2);
if (type == "from") {
let cstartdate = [date.getFullYear(), mnth, day].join("-") + "T00:00:00.000Z";
this.setState({ CStartDateFrom: cstartdate });
}
else if (type == "to") {
let cstartdate = [date.getFullYear(), mnth, day].join("-") + "T23:59:59.000Z";
this.setState({ CStartDateTo: cstartdate });
}
}

public filteropen = () => {
this.setState({ filterpopup: !this.state.filterpopup });
}

public filter = () => {
let errormsg = ""
if (this.state.filterquery == "" && this.state.CreatedBy.length == 0 && this.state.CStartDateFrom == null && this.state.CStartDateTo == null) {
this.setState({ ErrorMsg: "Please select atleast one filter" });
errormsg = "validation failed";
}
if (errormsg == "" && this.state.DateRangeErrorMsg == "") {
this.formquery();
this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "" });
}
}

public formquery = () => {
let filter = "";
if (this.state.CreatedBy.length != 0) {
filter += ` and (AuthorId/EMail eq '${this.state.CreatedByName}')`;
}
if (this.state.CStartDateFrom != null) {
filter += ` and (Created ge '${this.state.CStartDateFrom}')`;
}
if (this.state.CStartDateTo != null) {
filter += ` and (Created le '${this.state.CStartDateTo}')`;
}
if (this.state.searchquery != "") {
filter += this.state.searchquery;
}
if (this.state.sortquery != "") {
filter += this.state.sortquery;
}
this.setState({ filterquery: filter, currentPage: 1, top: 10, indexofFirstPage: 0, indexofLastPage: 10 }, () => { ReportGridAction.getReportGridData(this.state.siteUrl, this.state.currentContext, filter, this.state.top) });
}

public filterclose = () => {
this.setState({ filterpopup: false, ErrorMsg: "", DateRangeErrorMsg: "", CreatedByName: "", CreatedBy: [], StartDateFrom: null, CStartDateFrom: null, StartDateTo: null, CStartDateTo: null }, () => { this.formquery(); });
}

public deleteopen = (dindex) => {
this.setState({ delindex: dindex });
this.setState({ deletepopup: true });
}

public deleterecord = () => {
ReportGridAction.postDeletereport(this.state.siteUrl, this.state.currentContext, this.state);
this.setState({ deletetoast: true });
}

public ondeleteload = () => {
this.deleteclose();
ReportGridAction.getReportGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top);
ReportGridAction.getReportGridCount(this.state.siteUrl, this.state.currentContext, this.state.filterquery);

}

public deleteclose = () => {
this.setState({ deletepopup: false });
setTimeout(function () { this.setState({ deletetoast: false }); }.bind(this), 2000);
}

public handlePage = (event, pageNumber) => {
let postperPage = this.state.postperPage;
let indexofLastPage = pageNumber * postperPage;
let indexofFirstPage = indexofLastPage - postperPage;
let top = pageNumber * postperPage;
this.setState({ indexofLastPage, indexofFirstPage, top, currentPage: pageNumber }, () => {
ReportGridAction.getReportGridData(this.state.siteUrl, this.state.currentContext, this.state.filterquery, this.state.top)
});
}

public bindData = () => {
let loadcall = this.state.ReportGrid.length == 0 ? (this.state.filterquery == "" && this.state.searchquery == "") ? "noData" : "filterNoData" : "gridData";
if (loadcall == "noData") {
return (
<tr>
<td colSpan={4}>
<div className="center mt-5">
<img className=" my-5 center" src={searchResults} alt="background" />
<h4 className="display-message">Sorry, you don't have any Saved Reports</h4>
</div></td></tr>
);
}
else if (loadcall == "filterNoData") {
return (
<tr>
<td colSpan={4}>
<div className="center mt-5">
<img
className=" my-5 center"
src={searchResults}
alt="background"/>
{this.state.searchquery == "" && this.state.filterquery != "" ?
<h4 className="display-message">No Results found</h4> : null}
{this.state.searchquery != "" ?
<div>
<h4 className="display-message">Sorry, we couldn't fetch any results</h4>
<h4 className="display-message">matching '{this.state.searchtext}'</h4>
</div> : null}
{this.state.searchquery == "" && this.state.filterquery != "" ?
<button type="button" className="user-config-create-button mt-4 center results-screen-back " onClick={this.filterclose.bind(this)}>Back to Reports</button> :null}
</div></td></tr>
);
}
else if (loadcall == "gridData") {
let colorindex = 0;
let reportheadercolor = ["bg-red", "bg-green", "bg-orange", "bg-pink", "bg-dark-violet", "bg-baby-blue"];
let reportheaderclass;
return this.state.ReportGrid.map((value, index) => {
let reportname = value.ReportName;
let reportheader = reportname[0];
let UserName = "";
/*to loop through the standard colors*/
if (colorindex != 7) {
reportheaderclass = "report-alphabet reports-grid-mar-right mr-3 " + reportheadercolor[colorindex];
colorindex += 1;
}
if (colorindex == 6) {
colorindex = 0;
}
if((value.Author.FirstName != "" && value.Author.FirstName != null && value.Author.LastName != "" && value.Author.LastName != null )){
UserName = value.Author.FirstName + " " + value.Author.LastName;
}
else if((value.Author.Title != "" && value.Author.Title != undefined && value.Author.Title != null)){
UserName = value.Author.Title;
}
else{
UserName = "";
}
/*forming the file download url*/
let fileurl = this.state.siteUrl + "/_layouts/15/Download.aspx?SourceUrl=" + this.state.siteUrl + '/Report/' + value.ReportName + '.csv';
return (
<tr className="table-content ">
<td>
<span className={reportheaderclass}>
{reportheader}</span>
{value.ReportName}</td>
<td>
{(UserName!="")?
<img className="table-person-image" src={this.state.siteUrl + "/_layouts/15/userphoto.aspx?size=S&username=" + value.Author.EMail} />:"-"}
{UserName}</td>
<td>
<Moment format="LL">{value.Created}</Moment></td>
<td className="text-center">
<a href={fileurl} className="download-action-icon" download />
<a
href="#"
data-toggle="modal"
data-target="#deleteModalCenterReports"
className="delete-action-icon ml-2"
onClick={this.deleteopen.bind(this, value.ID)}/></td></tr>
);});}
}

public emptyData = () => {
let array = [];
for (var i = 0; i < this.state.emptyPostsCount; i++) {
array.push([""]);
}
return array.map((value, index) => {
return (
<tr>
<td></td>
<td></td>
<td></td>
<td></td></tr>
);});
}

public render(): React.ReactElement<IRocketAppProps> {
return (
<div
className="tab-pane fade active show"
id="pills-reports"
role="tabpanel"
aria-labelledby="pills-reports-tab">
{this.state.deletetoast ?
<div
className={"toast delete_message fade show"}
role="alert"
aria-live="assertive"
aria-atomic="true"
data-delay={2000}>
<div className="toast-header">
<span className="form-placeholder-font-size p-1">
<img
className="tick_icon pr-2  float-left"
src={greentick}
alt="toast"/>Record deleted successfully</span>
</div>
</div> : null}
<div className="col-md-12 mt-4 float-left">
<div className="float-left mt-2 headerspacing">
<h6 className="float-left table-header">Reports</h6>
</div>
<div className="float-right headerspacing">
<form className="form-inline float-left">
{this.state.ReportGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :
<SearchComponent searchFunc={this.reportsearch}>
</SearchComponent>}
<div className="dropdown pos-inherit">
{this.state.ReportGrid.length == 0 && this.state.filterquery == "" && this.state.searchquery == "" ? null :<button
type="button"
className="btn btn-info ml-3"
title="Advanced Filter"
data-toggle="dropdown"
aria-expanded="false"
onClick={this.filteropen.bind(this)}>
<img src={filter} /></button>}
{this.state.filterpopup ?
<div className="dropdown-menu m-0 pb-4 advanced-filter show">
<div className="container-fluid">
<div className="row mar-0 pad-0 card-resp-font">
<div className="col-md-12 pb-2 border-bottom mt-2  mb-3">
<span className="filter-title">Advanced Filter</span>
<button
type="button"
className="close"
data-dismiss="modal"
aria-label="Close"
onClick={() => { this.setState({ filterpopup: false }); }}>
<span aria-hidden="true">×</span></button>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<label htmlFor="select-createdby-rep">Created by</label>
<Typeahead
className="form-placeholder-font-size w-100 mt-2"
onChange={this.setTypeahead.bind(this)}
options={this.state.CreatedByList}
placeholder="Select Person"
labelKey="UserName"
maxResults={3}
selected={this.state.CreatedBy}
minLength='1'
renderMenuItemChildren={this.renderTypeaheadItems}/>
</div>
</div>
<label className="w-100 filter-inner-heading filter-font col-gray mb-3 ml-3 float-left">Select Date Range</label>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
className="form-placeholder-font-size w-100 mt-2"
placeholder="From"
value={this.state.StartDateFrom}
onSelectDate={this.handleStartFromDatePicker.bind(this)}/>
</div>
</div>
<div className="col-md-6 mb-4">
<div className="form-group filter-font col-gray">
<DatePicker
className="form-placeholder-font-size w-100 mt-2"
placeholder="To"
value={this.state.StartDateTo}
onSelectDate={this.handleStartToDatePicker.bind(this)} />
</div>
</div>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.ErrorMsg}</span>
<span className="form-placeholder-font-size w-100 errormsg errorBoxText_c25b5cc7" style={{ color: "red" }}>{this.state.DateRangeErrorMsg}</span>
<div className="col-md-12 mt-2 mb-2">
<div className="float-right">
<a
href="#"
className="filter-close form-label col-gray px-4"
onClick={this.filterclose.bind(this)}>Clear</a>
<a
href="#"
className="btn btn-primary filter-close ml-2 px-4"
onClick={this.filter.bind(this)}>Apply Filter</a>
</div>
</div>
</div>
</div>
</div> : null}
</div>
</form>
</div>
</div>
<div className="col-md-12 mt-4 float-left overlay-resp">
<table className="table table-border table-border">
<thead className="table-content-header">
<tr>
<th>REPORT NAME
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} href="#" onClick={this.sort.bind(this, 'asc', 'ReportName')}>
<img src={up} /></a></span>
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} href="#" onClick={this.sort.bind(this, 'desc', 'ReportName')}>
<img src={down} /></a></span></th>
<th>CREATED BY
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} href="#" onClick={this.sort.bind(this, 'asc', 'Author')}>
<img src={up} /></a></span>
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} href="#" onClick={this.sort.bind(this, 'desc', 'Author')}>
<img src={down} /></a></span></th>
<th>CREATED ON
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-up not-active" : "sorting-up"} href="#" onClick={this.sort.bind(this, 'asc', 'Created')}>
<img src={up} /></a></span>
<span className="sorting">
<a className={this.state.ReportGrid.length == 0 ? "sorting-down not-active" : "sorting-down"} href="#" onClick={this.sort.bind(this, 'desc', 'Created')}>
<img src={down} /></a></span></th>
<th className="text-center">ACTION </th></tr></thead>
<tbody>
{this.bindData()}
{this.state.ReportGrid.length > 0 && this.emptyData()}
</tbody>
</table>
{this.state.deletepopup ?
<div
className="modal fade show"
id="deleteModalCenterBlastoff"
tabIndex={-1}
style={{ display: "block", paddingRight: 17 }}
role="dialog"
aria-labelledby="exampleModalCenterTitle"
aria-modal="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title" id="exampleModalLongTitle">Delete Record</h5>
<button
type="button"
className="close"
data-dismiss="modal"
aria-label="Close"
onClick={this.deleteclose.bind(this)}>
<span aria-hidden="true">×</span></button>
</div>
<div className="modal-body">
<span className="delete-modal-box">Are you sure you want to delete this record ?
</span>
</div>
<div className="modal-footer footer-border-none">
<button
type="button"
className="btn btn-secondary cancel-button-del-modal"
data-dismiss="modal" onClick={this.deleteclose.bind(this)}>Cancel</button>
<button
type="button"
className="btn btn-primary del-button"
data-dismiss="modal" onClick={this.deleterecord.bind(this)}>Delete</button>
</div>
</div>
</div>
</div> : null}
</div>
{this.state.ReportGrid.length != 0 && this.state.ReportGridCount != 0 ?
<div className="col-md-12  col- float-left mt-2">
<div className="float-left  col-gray">
<span># Records : <span>{this.state.gridLength}</span> out of <span> {this.state.ReportGridCount}</span></span>
</div>
<div className="float-right ">
<Pagination
count={this.state.pageCount}
shape="rounded"
page={this.state.currentPage}
onChange={this.handlePage.bind(this)}/>
</div>
</div> : null}
</div>
);}
}
