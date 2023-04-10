/** [Ref] - Denotes Pseudo Code Reference  
 * This Component is Progress Card which is used for showing the count of status
 * App Name: Rocket
 * Author: Giftson 
 * Created Date: 06/01/2020 */
 import * as React from 'react';
 import { IWebPartContext } from "@microsoft/sp-webpart-base";
 
 const needAttention: string = require('../images/needsattention.svg');
 const Completed: string = require('../images/completed.svg');
 const onTrack: string = require('../images/scheduled.svg');
 
 import '../css/commontheme.css';
 import '../css/style.css';
 import * as ProgressAction from '../webports/rocketWebport/Action/Progress_Action';
 import ProgressStore from '../Store/Progress_Store';
 
 export interface ProgressCardState{
     siteUrl: string;
     currentcontext:any;
     listName:string;
     onTrack:any;
     needsAttention:any;
     completed:any;
     user:any;
     tab:any;
   }
 
 export interface ProgressCardProps{
       context:IWebPartContext;
       user:any;
       callbackType:any;
       tab:any;
   }
 
 export default class ProgressCard extends React.Component<ProgressCardProps,ProgressCardState> {
   constructor(props) {
     super(props);
     this.state = {
       siteUrl:this.props.context.pageContext.web.absoluteUrl,
       currentcontext:this.props.context,
       listName:"ScheduledTemplate",
       onTrack:null,
       needsAttention:null,  
       completed:null,
       user:this.props.user,
       tab:this.props.tab,
     }
 }
 
   componentWillMount() {
       ProgressAction.getTemplateStatus(this.state.siteUrl,this.state.currentcontext,this.state.listName,this.state.user,"Completed",this.state.tab);
       ProgressAction.getTemplateStatus(this.state.siteUrl,this.state.currentcontext,this.state.listName,this.state.user,"Needs Attention",this.state.tab);
       ProgressAction.getTemplateStatus(this.state.siteUrl,this.state.currentcontext,this.state.listName,this.state.user,"On Track",this.state.tab);
       
     ProgressStore.on("Completed",this.loadStatusCount.bind(this,"Completed"));
     ProgressStore.on("Needs Attention",this.loadStatusCount.bind(this,"Needs Attention"));
     ProgressStore.on("On Track",this.loadStatusCount.bind(this,"On Track"));
   }
 
     loadStatusCount = (type,e) =>{
         switch(type){
             case "Completed":
                 this.setState({completed:ProgressStore.completedCount});
                 break;
             case "Needs Attention":
                 this.setState({needsAttention:ProgressStore.needattentionCount});
                 break;
             case "On Track":
                 this.setState({onTrack:ProgressStore.ontrackCount});
                 break;        
         }
     }
 
     filterCard = (type,e) =>{
       this.props.callbackType(type);
     }
 
   public render():React.ReactElement<ProgressCardProps>{
     return (
         <div className="container-fluid float-left p-0 col-md-12 col-sm-12">
         <div className="card-deck mt-2">
           <div className="card card-prop red-card text-white">
             <div className={this.state.user==null?"card-img-overlay table-actions cursor-default":"card-img-overlay table-actions"} onClick={this.filterCard.bind(this,"Needs Attention")}> <img src={needAttention} className="card-icon float-left need-attention-resp" />
               <ul className="float-left card-text-padding-prop">
                 <li className="cards-text text-white">NEEDS ATTENTION</li>
                     <li className="cards-count text-white">{this.state.needsAttention}</li>
               </ul>
             </div>
           </div>
           <div className="card card-prop yellow-card text-white">
             <div className={this.state.user==null?"card-img-overlay table-actions cursor-default":"card-img-overlay table-actions"} onClick={this.filterCard.bind(this,"On Track")}> <img src={onTrack} className="card-icon float-left need-attention-resp" />
               <ul className="float-left card-text-padding-prop">
                 <li className="cards-text text-white">ON TRACK</li>
                 <li className="cards-count text-white">{this.state.onTrack}</li>
               </ul>
             </div>
           </div>
           <div className="card card-prop green-card text-white">
             <div className={this.state.user==null?"card-img-overlay table-actions cursor-default":"card-img-overlay table-actions"} onClick={this.filterCard.bind(this,"Completed")}> <img src={Completed} className="card-icon float-left need-attention-resp" />
               <ul className="float-left card-text-padding-prop">
                 <li className="cards-text text-white">COMPLETED</li>
                 <li className="cards-count text-white">{this.state.completed}</li>
               </ul>
             </div>
           </div>
         </div>
       </div>
   );}
 }
 
 Search_Component.tsx
 /**[Ref] - Denotes Pseudo Code Reference   
  * This Component is Search which is used in all the grids for search box
  * App Name: Rocket
  * Author: Giftson 
  * Created Date: 06/01/2020 */
 import * as React from 'react';
 import '../css/commontheme.css';
 import '../css/style.css';
 
 const search: string = require('../images/search.svg');
 
 export interface SearchStates {
   searchText: string;
 }
 
 export interface SearchProps {
   searchFunc: any;
 }
 
 class Search extends React.Component<SearchProps, SearchStates> {
   constructor(props) {
     super(props);
     /** Initialize the state variables*/
     this.state = {
       searchText: "",
     }
   }
 
   searchData = (type, e) => {
     e.preventDefault();
     switch (type) {
       case "change":
         this.setState({ searchText: e.target.value });
         break;
       case "click":
         this.props.searchFunc(this.state.searchText);
         break;
     }
   }
 
   public render(): React.ReactElement<SearchProps> {
     return (
       <div className="md-form mt-0 pos-rel form-control-3menu-resp">
         <input className="form-control resp-font" type="text" placeholder="Search" value={this.state.searchText} name="searchText" onChange={this.searchData.bind(this, "change")} aria-label="Search" />
         <button className="float-left search-button-prop" onClick={this.searchData.bind(this, "click")}><img className="search_icon" src={search} /></button>
       </div>
     ); }
 }
 export default Search;
 