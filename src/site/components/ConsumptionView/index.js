import React, { Component, PropTypes } from "react";
import s from "./ConsumptionView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditTransactionContainer } from "../../containers";

@withStyles(s)
class ConsumptionView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    
    super(props);
    console.log("constr consumption", props);

    this.categoryLabels = {
      "misc": "Sekalaiset",
      "groceries": "Ruokakauppa"
    };

    this.state = Object.assign(props.state, {
      quickTransaction: {
        sign: "-",
        type: "single",
        category: "misc"
      }
    });

  }

  async fetchData(props = this.props) { 

    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching transactions for", user);
    let { month, monthStats } = this.state;
    month = month || (monthStats ? monthStats.label : null);
    this.props.fetchTransactions(user, this.state.month);

  }
 
  updateState(state) {
    super.updateState(state);
    if (state.messages && state.messages.editStatus === "saved") {
      this.setState(Object.assign(state, { 
        quickTransaction: { sign: "-", type: "single", category: "misc", amount: "" } 
      }));
    }
  }

  _loadNextMonth() {
    
    let monthElems = this.state.month.split("-");
    let [ nextYear, nextMonth ] = monthElems;
    if (nextMonth === "12") {
      nextYear = parseInt(nextYear) + 1;
      nextMonth = "01";
    } else {
      let monthPadding = parseInt(nextMonth) < 9 ? "0" : "";
      nextMonth = monthPadding + (parseInt(nextMonth) + 1);
    }

    this.state.month = nextYear + "-" + nextMonth;
    this.fetchData();

  }
  
  _loadPrevMonth() {
    
    let monthElems = this.state.month.split("-");
    let [ prevYear, prevMonth ] = monthElems;
    if (prevMonth === "01") {
      prevYear = parseInt(prevYear) - 1;
      prevMonth = "12";
    } else {
      let monthPadding = parseInt(prevMonth) < 11 ? "0" : "";
      prevMonth = monthPadding + (parseInt(prevMonth) - 1);
    }
    
    this.state.month = prevYear + "-" + prevMonth;
    this.fetchData();

  }

  _handleInputChange(event) {
    
    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let quickTransaction = Object.assign(this.state.quickTransaction, formParams);
    let state = Object.assign(this.state, { quickTransaction });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _handleDropdownChange(event, index, value) {
    
    let formParams = {};
    formParams["category"] = value;
    let quickTransaction = Object.assign(this.state.quickTransaction, formParams);
    let state = Object.assign(this.state, { quickTransaction });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _saveTransaction() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    const transaction = Object.assign({}, this.state.quickTransaction);
    this.props.quickSaveTransaction(user, transaction);
  } 

  _deleteTransaction(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa tapahtuman?")) {
      const user = this.props.params.user || this.state.auth.user.uuid; 
      this.props.quickDeleteTransaction(user, uuid);
    }
  }
  
  _toggleTxSign() {
    let sign = this.state.quickTransaction.sign;
    sign = sign === "-" ? "+" : "-"; 
    this.state.quickTransaction.sign = sign;
    this.setState(this.state);
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
     
    console.log("render consumption", this.props, this.state);
    let { transactions, goal, monthStats, quickTransaction, messages } = this.state;
    
    if (this.state.edit) {
      let params = Object.assign(this.props.params, {
        uuid: this.state.edit 
      });
      return <EditTransactionContainer close={() => this._closeEditTx()} params={params} />;
    }
 
    if (!transactions) {
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

    let dayNames = [
      "Ma", "Ti", "Ke", "To", "Pe", "La", "Su"
    ];

    let transactionElems = null; 
    if (transactions && transactions.length > 0) {

      transactionElems = transactions.map(transaction => {
        return (
          <div key={transaction.uuid} className={s.transaction}>
            <div>
              {transaction.createdAt}
            </div>
            <div style={{ color: transaction.sign === "+" ? "green" : "red" }}>
              {transaction.sign}{transaction.amount}
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
    
    const txBorderCss = {
      transition: "all 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
    };
    let txSignSymbol = null;
    if (quickTransaction.sign === "-") {
      //txBorderCss.borderBottom = "2px solid red";
      txSignSymbol = (<i style={fullWidth} className="material-icons">&#xE15B;</i>);
    } else {
      //txBorderCss.borderBottom = "2px solid green";
      txSignSymbol = (<i style={fullWidth} className="material-icons">&#xE145;</i>);
    }

    let goalElem = null;
    if (goal) {
      
      goalElem = (
        <div className={s.goal}>
          {goal.totalSaved}/{goal.amount} €
        </div>
      );

    } else {

      goalElem = (
        <div className={s.noGoal}>
          Ei tavoitetta
        </div>
      );

    }

    console.log("RENDER MONTH", monthStats); 
    let currentMonthElem = null; 
    if (monthStats) {

      let available = 
        monthStats.fixedIncome - 
        monthStats.fixedExpenses - 
        monthStats.expenses +
        monthStats.income;
      //available = Math.round(available * 100) / 100;
      available = Math.floor(available);
      let spendable = available;
      
      let monthContent = "" + available;
      let savingGoal = 0;
      if (goal) {
        //savingGoal = Math.round(goal.currentMonthSavingGoal * 100) / 100;
        savingGoal = Math.floor(goal.currentMonthSavingGoal);
        monthContent += " - " + savingGoal;
        //spendable = Math.round((spendable - savingGoal) * 100) / 100;
        spendable = Math.floor(spendable - savingGoal);
      }
      
      currentMonthElem = (
        <div className={s.month}>
          <div className={s.monthLine}></div>
          <div className={s.monthData}>
            <div className={s.section}>
              <div className={s.sectionLabel}>
                Jäljellä
              </div>
              <div className={s.sectionValue}>
                {available} €
              </div>
            </div>
            <div className={s.section}>
              <div className={s.sectionLabel}>
                Käytettävissä
              </div>
              <div className={s.sectionValue}>
                {spendable} €
              </div>
            </div>
            <div className={s.section}>
              <div className={s.sectionLabel}>
                Kk-säästö
              </div>
              <div className={s.sectionValue}>
                {savingGoal} €
              </div>
            </div>
          </div>
        </div>
      );
      
    }
    
    let floatLabelCss = {
      //transform: "perspective(1px) scale(0.75) translate3d(2px, -20px, 0px)"
    };
    
    let bottomMonthNav = null;
    let topMonthNav = null;
    if (this.state.month !== monthStats.label) {
      topMonthNav = (
        <div className={s.topMonthNav}>
          <div>
            <FlatButton style={Object.assign({ lineHeight: "28px" })} 
              onTouchTap={() => this._loadNextMonth()}
              label="&lt; MYÖHEMPI" />
          </div>
          <div>{this.state.month}</div>
          <div>
            <FlatButton style={Object.assign({ lineHeight: "28px" })} 
              onTouchTap={() => this._loadPrevMonth()}
              label="AIKAISEMPI &gt;" />
          </div>
        </div>
      );
    } else if (transactions && transactions.length > 0) {
      bottomMonthNav = (
        <div className={s.bottomMonthNav}>
          <FlatButton style={Object.assign({ lineHeight: "28px" })} 
            onTouchTap={() => this._loadPrevMonth()}
            label="Selaa historiaa" />
        </div>
      ); 
    }

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.saveTransaction} style={txBorderCss}>
            <div className={s.sign}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onTouchTap={() => this._toggleTxSign()}>
                {txSignSymbol}
              </FlatButton>
            </div> 
            <div className={s.amount}>
              <TextField style={fullWidth} 
                name="amount" 
                floatingLabelText="Määrä"
                floatingLabelStyle={floatLabelCss}
                value={quickTransaction.amount}
                onChange={this._handleInputChange.bind(this)} />
            </div>
            <div className={s.category}>
              <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
                name="category" 
                value={quickTransaction.category} 
                onChange={this._handleDropdownChange.bind(this)}>
                <MenuItem value="misc" primaryText="Sekalaiset" />
                <MenuItem value="groceries" primaryText="Ruokakauppa" />
              </DropDownMenu>
            </div>
            <div className={s.description}>
              <TextField style={fullWidth} 
                name="description"
                floatingLabelText="Selite"
                value={quickTransaction.description}
                onChange={this._handleInputChange.bind(this)} />
            </div>
            <div className={s.submit}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onTouchTap={() => this._saveTransaction()}>
                <i style={fullWidth} className="material-icons">&#xE163;</i>
              </FlatButton>
            </div>
          </div>
          <div>
            {goalElem}
            {currentMonthElem}
          </div>
          {topMonthNav}
          <div className={s.transactions}>
            <div className={s.transactionsList}>
              {transactionElems}
            </div>
          </div>
          {bottomMonthNav}
        </div>
      </div>
    );
  }

}

export default ConsumptionView;
