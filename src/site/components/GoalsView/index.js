"use strict";

import React, { Component, PropTypes } from "react";
import s from "./GoalsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditRepeatingTransactionContainer } from "../../containers";

@withStyles(s)
class GoalsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    
    super(props);
    console.log("constr goals", props);
    let state = this.props.state;
    if (!state.goal) {
      state.goal = {
      };
    }
    
    this.state = state;
    
  }

  async fetchData(props = this.props) { 
    
    if (this.state.edit) {
      return;
    }
     
    const user = this.props.params.user || this.state.auth.user.uuid;
    const uuid = this.props.params.uuid; 
    console.log("fetching goals", user, uuid);
    this.props.fetchTransactions(user);

  }
  
  updateState(state) {
    super.updateState(state);
  }

  _handleInputChange(event) {
    
    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let goal = Object.assign(this.state.goal, formParams);
    let state = Object.assign(this.state, { goal });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _handleDropdownChange(name, value) {
    
    console.log("dropdown change", name, value); 
    let formParams = {};
    formParams[name] = value;
    let goal = Object.assign(this.state.goal, formParams);
    let state = Object.assign(this.state, { goal });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }

  _handleStartDropdown(event, index, value) {
    this._handleDropdownChange("start", value);
  }
  
  _handleEndDropdown(event, index, value) {
    this._handleDropdownChange("end", value);
  }
  
  _handleEndDropdown(event, index, value) {
  }  
 
  _deleteTransaction(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa tapahtuman?")) {
      const user = this.props.params.user || this.state.auth.user.uuid; 
      this.props.deleteTransaction(user, uuid);
    }
  }
  
  _editTransaction(uuid) {
    this.state.edit = uuid;
    this.setState(this.state);
  }

  _closeEditTx() {
    this.state.edit = false;
    this.fetchData();
  }

  render() {
     
    console.log("render goals", this.props, this.state);
    let { transactions, goal, messages, edit } = this.state;
    
    if (edit) {
       
      let params = Object.assign(this.props.params, {
        uuid: edit 
      });
      
      let transaction = (edit === "+" || edit === "-") ? {
        type: edit,
        category: "misc",
        repeats: "M1"
      } : null;
      
      return (
        <EditRepeatingTransactionContainer close={() => this._closeEditTx()}
          params={params} transaction={transaction} />
      );
    
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

    let incomeTxElems = [];
    let expenseTxElems = [];
    
    if (transactions) {

      transactions.forEach(transaction => {
        
        const txElem = (
          <div className={s.transaction} key={transaction.uuid}>
            <div onClick={() => this._editTransaction(transaction.uuid)} 
              className={s.txTitle}>
              {transaction.description}
              {transaction.amount} €
            </div>
            <div onClick={() => this._deleteTransaction(transaction.uuid)} 
              className={s.txDelete}>X</div>
          </div>
        );
        
        if (transaction.type === "+") {
          incomeTxElems.push(txElem);
        } else {
          expenseTxElems.push(txElem);
        }

      });

    }

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div>
            <div>
              <div className={s.transactionsLabel}>Toistuvat tulot</div>
              <div className={s.transactions}>
                {incomeTxElems}
                <div onClick={() => this._editTransaction("+")} className={s.newTransaction}>
                  + UUSI
                </div>
              </div>
              <div></div>
            </div>
            <div>
              <div className={s.transactionsLabel}>Toistuvat menot</div>
              <div className={s.transactions}>
                {expenseTxElems}
                <div onClick={() => this._editTransaction("-")} className={s.newTransaction}>
                  + UUSI
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div className={s.goals}>
            <div className={s.goalLabel}>Säästötavoite</div>
            <div className={s.goal}>
              <div className={s.goalAmount}>
                <TextField style={fullWidth} 
                  name="description"
                  floatingLabelText="Selite"
                  value={this.state.description}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
              <div className={s.goalStart}>
                <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
                  id="start" 
                  value={this.state.goal.start} 
                  onChange={this._handleStartDropdown.bind(this)}>
                  <MenuItem value="1" primaryText="Tammi 2016" />
                  <MenuItem value="2" primaryText="Helmi 2016" />
                </DropDownMenu>
              </div>
              <div className={s.goalEnd}>
                <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
                  id="end" 
                  value={this.state.goal.end} 
                  onChange={this._handleEndDropdown.bind(this)}>
                  <MenuItem value="1" primaryText="Tammi 2016" />
                  <MenuItem value="2" primaryText="Helmi 2016" />
                </DropDownMenu>
              </div>
            </div>
            <div className={s.goalsSubmit}>
              <div className={s.editStatus}>
                {editStatus}
              </div>
              <div className={s.saveButton}> 
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

export default GoalsView;
