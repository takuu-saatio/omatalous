import React, { Component, PropTypes } from "react";
import s from "./PlanningView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditPlannedTransactionContainer } from "../../containers";

import http from "../../tools/http-client";

@withStyles(s)
class PlanningView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.categoryLabels = {
      "misc": "Sekalaiset",
      "groceries": "Ruokakauppa"
    };
    this.state = props.state;
  }

  async fetchData(props = this.props) { 
    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching planning", user);
    this.props.fetchPlannedTransactions(user);
  }

  _setTitle(title) {
    this.context.onSetTitle(title);
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
    
    this._setTitle("Suunnittelu");
    
    const { transactions, edit } = this.state;
    
    console.log("rendering planning", this.state);
     
    if (edit) {
       
      let params = Object.assign(this.props.params, {
        uuid: edit 
      });
      
      let transaction = (edit === "+" || edit === "-") ? {
        sign: edit,
        type: "planned",
        category: "misc",
        repeats: "M1"
      } : null;
      
      return (
        <EditPlannedTransactionContainer close={() => this._closeEditTx()}
          params={params} transaction={transaction} />
      );
    
    }
    
    let transactionElems = null;
    if (transactions && transactions.length > 0) {
      transactionElems = transactions.map(transaction => {
        return (
          <div key={transaction.uuid} className={s.transaction}>
            <div>
              {transaction.month}
            </div>
            <div style={{ color: transaction.sign === "+" ? "green" : "red" }}>
              {transaction.amount}
            </div>
            <div>{this.categoryLabels[transaction.category]}</div>
            <div>{transaction.description}</div>
            <div className={s.txControls}>
              <div className={s.txControlContainer}>
                <div>
                  <i className="material-icons"
                    onClick={() => this._editTransaction(transaction.uuid)}>
                    &#xE150;
                  </i>
                </div>
                <div>
                  <i className="material-icons"
                    onClick={() => this._deleteTransaction(transaction.uuid)}>
                    &#xE14A;
                  </i>
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      transactionElems = (
        <div className={s.noTransactions}>
          Ei tapahtumia
        </div>
      );
    }

    return (
      <div>
        <div className={s.root}>
          <div className={s.buttons}>
            <div className={s.buttonLeft}>
              <FlatButton style={{ width: "100%", lineHeight: "28px" }} 
                onTouchTap={() => this._editTransaction("-")} label="- LISÄÄ MENO"/>
            </div>
            <div className={s.buttonRight}>
              <FlatButton style={{ width: "100%", lineHeight: "28px" }} 
                onTouchTap={() => this._editTransaction("+")} label="+ LISÄÄ TULO"/>
            </div>
          </div>
          <div className={s.transactions}>
            <div className={s.transactionsList}>
              {transactionElems}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default PlanningView;
