import React, { Component, PropTypes } from "react";
import s from "./PlanningView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditPlannedTransactionContainer } from "../../containers";
import { staticCategories } from "../../constants";
import http from "../../tools/http-client";

@withStyles(s)
class PlanningView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    
    super(props); 
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
  
  _deleteTransaction(uuid) { 
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.deleteTransaction(user, uuid);
  }
  
  _copyTransaction(transaction) { 
    const user = this.props.params.user || this.state.auth.user.uuid;
    const copy = Object.assign({}, transaction);
    delete copy.uuid;
    delete copy.month;
    delete copy.createdAt;
    copy.type = "single";
    console.log("copy tx", copy); 
    this.props.saveTransaction(user, copy);
    this.props.deleteTransaction(user, transaction.uuid);
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
        category: "misc"
      } : null;
      
      return (
        <EditPlannedTransactionContainer signDisabled={true}
          close={() => this._closeEditTx()}
          categories={this.state.categories}
          params={params} transaction={transaction} />
      );
    
    }
     
    let transactionElems = null;
    if (transactions && transactions.length > 0) {
      
      const groupedTxs = [];
      let txGroup = { transactions: [] };
      transactions.forEach(transaction => {
      
        if (transaction.month !== txGroup.month) {
          groupedTxs.push(Object.assign({}, txGroup));
          txGroup = { month: transaction.month, transactions: [] };
        }

        txGroup.transactions.push(transaction);

      });

      groupedTxs.push(txGroup);

      transactionElems = [];
      groupedTxs.forEach((group, i) => {
        
        const groupTransactionElems = group.transactions.map(transaction => {
          
          const categories = transaction.sign === "+" ?
            staticCategories.income : staticCategories.expenses;
            
          return (
            <div key={transaction.uuid} className={s.transaction}>
              <div>
                {transaction.month}
              </div>
              <div style={{ color: transaction.sign === "+" ? "green" : "red" }}>
                {transaction.sign}{transaction.amount}
              </div>
              <div>{categories[transaction.category]}</div>
              <div>{transaction.description}</div>
              <div className={s.txControls}>
                <div className={s.txControlContainer}>
                  <div>
                    <i className="material-icons"
                      onTouchTap={() => this._copyTransaction(transaction)}>
                      &#xE8A1;
                    </i>
                  </div>
                  <div>
                    <i className="material-icons"
                      onTouchTap={() => this._editTransaction(transaction.uuid)}>
                      &#xE150;
                    </i>
                  </div>
                  <div>
                    <i className="material-icons"
                      onTouchTap={() => this._deleteTransaction(transaction.uuid)}>
                      &#xE14A;
                    </i>
                  </div>
                </div>
              </div>
            </div>
          );
        });
      
        transactionElems = transactionElems.concat(groupTransactionElems);
        if (groupedTxs.length > i+1) {

          let nextMonth = groupedTxs[i+1].month;
          const monthHeaderElem = (
            <div className={s.monthHeader} key={nextMonth}>
              <div className={s.monthHeaderLine}></div>
              <div className={s.monthHeaderLabel}>
                {nextMonth}
              </div>
            </div>
          );

          transactionElems.push(monthHeaderElem);
        
        }

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
