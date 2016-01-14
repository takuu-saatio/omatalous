"use strict";

import React, { Component, PropTypes } from "react";
import s from "./EditTransactionView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";

@withStyles(s)
class EditTransactionView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr edit tx", props);
    let state = this.props.state;
    this.state = props.state;
  }

  async fetchData(props = this.props) { 
    
    const { transaction } = this.state;
    if (transaction && transaction.uuid) {
      return;
    }
        
    const user = this.props.params.user || this.state.auth.user.uuid;
    const uuid = this.props.params.uuid; 
    console.log("fetching tx", user, uuid);
    this.props.fetchTransaction(user, uuid);

  }
  
  updateState(state) {
    console.log("UPDATING TX STATE", state);
    if (state.transaction) {
      this.setState(Object.assign(this.state, { transaction: state.transaction }));
    }
  }

  _handleInputChange(event) {
    
    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let transaction = Object.assign(this.state.transaction, formParams);
    let state = Object.assign(this.state, { transaction });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _handleDropdownChange(event, index, value) {
    
    let formParams = {};
    formParams["category"] = value;
    let transaction = Object.assign(this.state.transaction, formParams);
    let state = Object.assign(this.state, { transaction });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _saveTransaction() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    const transaction = Object.assign({}, this.state.transaction);
    console.log("saving tx for user", user);
    this.props.saveTransaction(user, transaction);
  } 

  _deleteTransaction(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa tapahtuman?")) {
      const user = this.props.params.user || this.state.auth.user.uuid; 
      this.props.deleteTransaction(user, uuid);
    }
  }
  
  _toggleTxType() {
    let type = this.state.transaction.type;
    type = type === "-" ? "+" : "-"; 
    this.state.transaction.type = type;
    this.setState(this.state);
  }

  render() {
     
    console.log("render tx", this.props, this.state);
    let { transaction, messages } = this.state;
    
    if (!transaction) {
      return null;
    }
   
    let formError = null;
    if (this.state.error) {
      formError = (
        <span>Error: {this.state.error.id}</span>
      );
    }
    
    let editStatus = null;
    if (messages && messages.editStatus) {
      
      let statusColor = {};
      switch (messages.editStatus) {
        case "changed":
          statusColor = { color: "blue" };
          break;
        case "saved":
          statusColor = { color: "green" };
          break;
        default:
          statusColor = {};
      }

      editStatus = (
        <span style={statusColor}>{messages.editStatus}</span>
      );

    }
 
    let fullWidth = { width: "100%", minWidth: "initial" };
     
    const txBorderCss = {
      transition: "all 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
    };
    let txTypeSymbol = null;
    if (transaction.type === "-") {
      txBorderCss.borderBottom = "2px solid red";
      txTypeSymbol = (<i style={fullWidth} className="material-icons">&#xE15B;</i>);
    } else {
      txBorderCss.borderBottom = "2px solid green";
      txTypeSymbol = (<i style={fullWidth} className="material-icons">&#xE145;</i>);
    }
    
    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.saveTransaction} style={txBorderCss}>
            <div className={s.type}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onClick={() => this._toggleTxType()}>
                {txTypeSymbol}
              </FlatButton>
            </div> 
            <div className={s.amount}>
              <TextField style={fullWidth} 
                name="amount" 
                floatingLabelText="Määrä"
                value={this.state.transaction.amount}
                onChange={this._handleInputChange.bind(this)} />
            </div>
            <div className={s.category}>
              <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
                name="category" 
                value={this.state.transaction.category} 
                onChange={this._handleDropdownChange.bind(this)}>
                <MenuItem value="misc" primaryText="Sekalaiset" />
                <MenuItem value="groceries" primaryText="Ruokakauppa" />
              </DropDownMenu>
            </div>
            <div className={s.submit}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onClick={() => this._saveTransaction()}>
                <i style={fullWidth} className="material-icons">&#xE163;</i>
              </FlatButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default EditTransactionView;
