/**[Ref] - Denotes Pseudo Code Reference   
 * This Component is ErrorBoundary which is used for the exception sequence
 * App Name: Rocket
 * Author: Giftson 
 * Created Date: 05/28/2020 */
 import * as React from 'react';
 import { IWebPartContext } from "@microsoft/sp-webpart-base";
 /** Ref: EC_PC_01 Importing the action and store file and set to an object.*/
 import * as ErrorBoundaryAction from '../Action/Exception_Action';
 import ErrorBoundaryStore from '../Store/Exception_Store';
 
 /** Ref: EC_PC_02 Define the interface for the state variables and declare the variables with the specific data types*/
 export interface ExceptionStates {
   siteUrl: string;
   currentcontext: any;
   hasError: Boolean;
 }
 
 export interface ExceptionProps {
   context: IWebPartContext;
 }
 
 /**Ref: EC_PC_03 Define the class that inherits from base react component class*/
 class Error_Boundary extends React.Component<ExceptionProps, ExceptionStates> {
   constructor(props) {
     super(props);
     this.state = {
       siteUrl: this.props.context.pageContext.web.absoluteUrl,
       currentcontext: this.props.context,
       hasError: false,
     }
   }
 
   /** * Ref: EC_PC_05 * Defining componentwillmount */
   componentWillMount() {
     ErrorBoundaryStore.on("Success_Error", this.assignError.bind(this));
   }
 
   componentDidCatch(error, errorinfo) {
 ErrorBoundaryAction.writeException(this.state.siteUrl, this.state.currentcontext, error, errorinfo.componentStack);
   }
 
   /**Ref: EC_PC_08 Define the listener methods that should be called when response is received from store */
   assignError = () => {
     this.setState({ hasError: true });
   }
 
   render() {
     if (this.state.hasError) {
       return <h1>Something's Wrong</h1>;
     }
     return this.props.children;
  }
 }
 export default Error_Boundary;
 