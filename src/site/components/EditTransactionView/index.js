"use strict";

import React, { Component, PropTypes } from "react";
import s from "./EditTransactionView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";

class EditTransactionView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    
    super(props);
    console.log("constr edit tx", props);
    let state = this.props.state;
    if (this.props.transaction) {
      state.transaction = this.props.transaction;
    }
     
    this.state = state;
  
  }

  async fetchData(props = this.props) { 
    
    const { transaction } = this.state;
    if (transaction) {
      return;
    }
        
    const user = this.props.params.user || this.state.auth.user.uuid;
    const uuid = this.props.params.uuid; 
    console.log("fetching tx", user, uuid);
    
    this.props.fetchTransaction(user, uuid);

  }
  
  updateState(state) {
    
    console.log("UPDATING TX STATE", state);
        
    if (state.messages) {
      if (state.messages.editStatus === "saved") {
        this.props.close();
        return;
      } else {
         this.state.messages = state.messages;
      
      }
    }

    if (state.transaction) {
      this.state.transaction = state.transaction;
    }
     
    if (state.transaction || state.messages) {
      this.setState(this.state);
    }
    
  }

  _handleInputChange(event) {
    this._handleFormChange(event.target.name, event.target.value); 
  }
  
  _handleCategoryDropdown(event, index, value) {
    this._handleFormChange("category", value);
  }

  _handleFormChange(name, value) {
    let formParams = {};
    formParams[name] = value;
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
  
  _toggleTxSign() {
    let sign = this.state.transaction.sign;
    sign = sign === "-" ? "+" : "-"; 
    this.state.transaction.sign = sign;
    this.setState(this.state);
  }

  renderChildren() {
    return null;
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
    let txSignSymbol = null;
    if (transaction.sign === "-") {
      txBorderCss.borderBottom = "2px solid red";
      txSignSymbol = (<i style={fullWidth} className="material-icons">&#xE15B;</i>);
    } else {
      txBorderCss.borderBottom = "2px solid green";
      txSignSymbol = (<i style={fullWidth} className="material-icons">&#xE145;</i>);
    }
    
    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.saveTransaction}>
            <div className={s.topGroup}>
              <div className={s.sign}>
                <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                  onClick={() => this._toggleTxType()}>
                  {txSignSymbol}
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
                  onChange={this._handleCategoryDropdown.bind(this)}>
                  <MenuItem value="misc" primaryText="Sekalaiset" />
                  <MenuItem value="groceries" primaryText="Ruokakauppa" />
                </DropDownMenu>
              </div>
            </div>
            <div className={s.descGroup}>
              <div className={s.description}>
                <TextField style={fullWidth} 
                  name="description" 
                  floatingLabelText="Selite"
                  value={this.state.transaction.description}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
            </div>
            <div>
              {this.renderChildren()}
            </div>
            <div className={s.status}>
              {editStatus}
            </div>
            <div className={s.buttonsGroup}>
              <div className={s.cancel}>
                <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                  onClick={() => this.props.close()} label="PERUUTA"/>
              </div>
              <div className={s.submit}>
                <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                  onClick={() => this._saveTransaction()} label="TALLENNA"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export const EditTransactionViewClass = EditTransactionView;

@withStyles(s)
export default class StyledEditTransactionView extends EditTransactionView {};
