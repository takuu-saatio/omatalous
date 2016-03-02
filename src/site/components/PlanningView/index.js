import React, { Component, PropTypes } from "react";
import s from "./PlanningView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import RaisedButton from "material-ui/lib/raised-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditPlannedTransactionContainer } from "../../containers";
import { staticCategories } from "../../constants";
import { mergeCategories } from "../../utils";
import http from "../../tools/http-client";

const monthNames = {
  "01": "Tammikuu",
  "02": "Helmikuu",
  "03": "Maaliskuu",
  "04": "Huhtikuu",
  "05": "Toukokuu",
  "06": "Kesäkuu",
  "07": "Heinäkuu",
  "08": "Elokuu",
  "09": "Syyskuu",
  "10": "Lokakuu",
  "11": "Marraskuu",
  "12": "Joulukuu"
};

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
    this.props.saveTransaction(user, copy);
    this.props.deleteTransaction(user, transaction.uuid);
  }

  _closeEditTx() {
    this.state.edit = false;
    this.fetchData();
  }

  render() {
    
    this._setTitle("Muistikirja");
    
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
          title="Suunniteltu"
          close={() => this._closeEditTx()}
          categories={this.state.categories}
          params={params} transaction={transaction} />
      );
    
    }
     
    const incomeCategories = mergeCategories(
      staticCategories.income, this.state.categories, "income");
    const expenseCategories = mergeCategories(
      staticCategories.expenses, this.state.categories, "expense");
      
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
            incomeCategories : expenseCategories;
             
          const highlightCss = {};
          if (transaction.type === "copy") {
            highlightCss.backgroundColor = "#f0f0f0";
            highlightCss.border = "1px solid #e0e0e0";
          }
          
          const transactionElem = (
            <div style={highlightCss} className={s.transaction}>
              <div className={s.txAmount}
                style={{ color: transaction.sign === "+" ? "#3B8021" : "#C53636" }}>
                {transaction.sign}{transaction.amount} €
              </div>
              <div className={s.txCategory}>
                {categories[transaction.category]}
              </div>
              <div className={s.txDescription}>
                {transaction.description}
              </div>
              <div className={s.txDate}>
                <i className="material-icons">
                  &#xE315;
                </i>
              </div>
            </div>
          );

          return (
            <div key={transaction.uuid} className={s.transactionBox}>
              {transactionElem}
              <div className={s.txControls}>
                <div className={s.txControlContainer}>
                  <div>
                    <i className="material-icons"
                      onClick={() => this._copyTransaction(transaction)}>
                      &#xE8A1;
                    </i>
                  </div>
                  <div>
                    <i className="material-icons"
                      onClick={() => this._editTransaction(transaction.uuid)}>
                      &#xE8B8;
                    </i>
                  </div>
                  <div>
                    <i className="material-icons"
                      onClick={() => this._deleteTransaction(transaction.uuid)}>
                      &#xE872;
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
          const [ year, month ] = nextMonth.split("-");
          const monthHeaderElem = (
            <div className={s.monthHeader} key={nextMonth}>
              <div className={s.monthHeaderLine}></div>
              <div className={s.monthHeaderLabel}>
                {monthNames[month] + " " + year}
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
          <div className={s.planningTitle}>
            Muistikirja
          </div>
          <div className={s.planningDescription}>
            Tähän voit listata etukäteen yksittäisiä menoja ja tuloja,
            jotka ovat vielä epävarmoja.
            <br/>
            Kun ne toteutuvat, voit lisätä ne Tapahtumiin.
          </div>
          <div className={s.buttons}>
            <div className={s.buttonLeft}>
              <RaisedButton secondary={true} style={{ width: "100%", lineHeight: "28px" }} 
                onTouchTap={() => this._editTransaction("-")} label="- LISÄÄ MENO"/>
            </div>
            <div className={s.buttonRight}>
              <RaisedButton secondary={true} style={{ width: "100%", lineHeight: "28px" }} 
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
