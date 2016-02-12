import React, { Component, PropTypes } from "react";
import s from "./ConsumptionView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import { EditTransactionContainer } from "../../containers";
import { staticCategories } from "../../constants";

@withStyles(s)
class ConsumptionView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    
    super(props);
    console.log("constr consumption", props);

    this.state = Object.assign(props.state, {
      quickTransaction: {
        sign: "-",
        type: "single",
        category: "misc"
      },
      quickTxDisabled: true,
      spendablePeriod: "month"
    });

    if (!this.state.month) {
      const now = new Date();
      const padding = now.getMonth() < 9 ? "0" : "";
      this.state.month = now.getFullYear() + "-" + padding + (now.getMonth() + 1);
    }

  }

  async fetchData(props = this.props) { 

    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching transactions for", user);
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

  _nextMonth() {
    
    let monthElems = this.state.month.split("-");
    let [ nextYear, nextMonth ] = monthElems;
    if (nextMonth === "12") {
      nextYear = parseInt(nextYear) + 1;
      nextMonth = "01";
    } else {
      let monthPadding = parseInt(nextMonth) < 9 ? "0" : "";
      nextMonth = monthPadding + (parseInt(nextMonth) + 1);
    }

    return nextYear + "-" + nextMonth;

  }
  
  _prevMonth() {
    
    let monthElems = this.state.month.split("-");
    let [ prevYear, prevMonth ] = monthElems;
    if (prevMonth === "01") {
      prevYear = parseInt(prevYear) - 1;
      prevMonth = "12";
    } else {
      let monthPadding = parseInt(prevMonth) < 11 ? "0" : "";
      prevMonth = monthPadding + (parseInt(prevMonth) - 1);
    }
    
    return prevYear + "-" + prevMonth;
  
  }

  _loadMonth(month) {
    this.state.month = month;
    this.fetchData();
  }

  _handleInputChange(event) {

    if (event.target.name === "amount") {
      
      let amount = event.target.value;
      if (amount) {
        amount = amount.replace(/,/g, ".");
      }

      if (isNaN(amount)) {
        this.state.amountError = "Ei ole numero";
        this.state.quickTxDisabled = true;
      } else if (parseFloat(amount) <= 0) {
        this.state.amountError = "Väärä arvo: 0";
        this.state.quickTxDisabled = true;
      } else {
        delete this.state.amountError;
        this.state.quickTxDisabled = false;
      }
      
      if (!amount || amount === "") {
        this.state.quickTxDisabled = true;
      }

    }

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
    if (transaction.amount) {
      transaction.amount = transaction.amount.replace(/,/g, ".");
    }

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
  
  _toggleFutureTransactions() {
    this.state.futureTransactionsOpen = !this.state.futureTransactionsOpen;
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
  
  _dismissAlert(uuid) {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.deleteAlert(user, uuid);
  }

  _setSpendablePeriod(period) {
    this.setState(Object.assign(this.state, {
      spendablePeriod: period
    }));
  }
  
  _getPeriodCss(period) {
    
    if (this.state.spendablePeriod === period) {
      return { backgroundColor: "#f0f0f0" };
    }
    
    return {};

  }

  _renderTransactionElems(transactions) {
      
      return transactions.map(transaction => {

        const categories = transaction.sign === "+" ?
          staticCategories.income : staticCategories.expenses;
        
        const highlightCss = {};
        if (transaction.type === "copy") {
          highlightCss.backgroundColor = "#f0f0f0";
        }

        return (
          <div key={transaction.uuid} style={highlightCss} className={s.transaction}>
            <div>
              {transaction.createdAt}
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

  }
  
  _renderFutureTransactionElems(transactions) {
      
      return transactions.map((transaction, index) => {

        const categories = transaction.sign === "+" ?
          staticCategories.income : staticCategories.expenses;
        
        return (
          <div key={transaction.uuid + "-" + index} className={s.futureTransaction}>
            <div className={s.futureTxDate}>
              {transaction.dateLabel}
            </div>
            <div className={s.futureTxAmount}
              style={{ color: transaction.sign === "+" ? "green" : "red" }}>
              {transaction.sign}{transaction.amount}
            </div>
            <div className={s.futureTxCategory}>{categories[transaction.category]}</div>
            <div className={s.futureTxDescription}>{transaction.description}</div>
          </div>
        );
    });

  }

  render() {
     
    console.log("render consumption", this.props, this.state);
    let { transactions, goal, monthStats, 
      alerts, quickTransaction, messages } = this.state;
    
    if (this.state.edit) {
      
      let params = Object.assign(this.props.params, {
        uuid: this.state.edit 
      });

      return (
        <EditTransactionContainer close={() => this._closeEditTx()} 
          categories={this.state.categories} params={params} />
      );

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
      
      transactionElems = this._renderTransactionElems(transactions);
    
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
      
      const totalSaved = Math.floor(goal.totalSaved);
      goalElem = (
        <div className={s.goal}>
          <div className={s.goalLabel}>
            Säästetty
          </div>
          <div className={s.goalContent}>
            {totalSaved}/{goal.amount} €
          </div>
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

      const now = new Date();
      const lastDay = 
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      
      if (this.state.spendablePeriod === "week") {
        //let remainingDays = now.getDay() > 0 ? 8 - now.getDay() : 1;
        //const overflow = (now.getDate() + remainingDays) - lastDay;
        //remainingDays = remainingDays - overflow + 1;
        const remainingWeeks = (lastDay - now.getDate()) / 7;
        spendable = Math.floor((available - savingGoal) / remainingWeeks);
      } else if (this.state.spendablePeriod === "day") {
        const remainingDays = (lastDay - now.getDate()) + 1;
        spendable = Math.floor((available - savingGoal) / remainingDays);
      }
      
      const expandIcon = this.state.futureTransactionsOpen ?
        <span>&#xE5CE;</span> : <span>&#xE5CF;</span>;
      
      currentMonthElem = (
        <div className={s.month}>
          <div className={s.monthLine}></div>
          <div className={s.monthHeader}>
            <span>KULUVA KUUKAUSI</span>
            <i className="material-icons"
              onTouchTap={() => this._toggleFutureTransactions()}>
              {expandIcon}
            </i>
          </div>  
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
              <div className={s.periodSwitch}>
                <div style={this._getPeriodCss("month")}
                  className={s.periodSwitchCell}
                  onTouchTap={() => this._setSpendablePeriod("month")}>
                  KK
                </div>
                <div style={this._getPeriodCss("week")}
                  className={s.periodSwitchCell}
                  onTouchTap={() => this._setSpendablePeriod("week")}>
                  VK
                </div>
                <div style={this._getPeriodCss("day")}
                  className={s.periodSwitchCell}
                  onTouchTap={() => this._setSpendablePeriod("day")}>
                  PV
                </div>
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
        <div>
          <div className={s.monthSummary}>
            <div className={s.summaryLabel}>HISTORIA</div>
            <div className={s.summaryData}>
              <span>{this.state.month}</span>
            </div>
          </div>
          <div className={s.topMonthNav}>
            <div>
              <FlatButton style={Object.assign({ lineHeight: "28px" })} 
                onTouchTap={() => this._loadMonth(this._nextMonth())}
                labelStyle={{ padding: "0px" }}
                label={"< " + this._nextMonth()} />
            </div>
            <div></div>
            <div>
              <FlatButton style={Object.assign({ lineHeight: "28px" })} 
                onTouchTap={() => this._loadMonth(this._prevMonth())}
                labelStyle={{ padding: "0px" }}
                label={this._prevMonth() + " >"} />
            </div>
          </div>
        </div>
      );
    } else {
      
      const total = Math.floor(monthStats.income - monthStats.expenses);
      const totalCss = total < 0 ?
        { color: "red" } : { color: "green" };

      topMonthNav = (
        <div className={s.monthSummary}>
          <div className={s.summaryLabel}>TAPAHTUMAT</div>
          <div className={s.summaryData}>
            <span>Yht. </span>
            <span style={totalCss}>{total} €</span>
          </div>
        </div>
      );

      bottomMonthNav = (
        <div className={s.bottomMonthNav}>
          <FlatButton style={Object.assign({ lineHeight: "28px" })} 
            onTouchTap={() => this._loadMonth(this._prevMonth())}
            label="Selaa historiaa" />
        </div>
      );

    }
  
    let alertElems = null;
    if (alerts) {

      alertElems = alerts.map(alert => {
        return (
          <div className={s.alert}>
            <div className={s.message}>
              {alert.message}
            </div>
            <div onTouchTap={() => this._dismissAlert(alert.uuid)} 
              className={s.dismiss}>
              <i className="material-icons">&#xE14C;</i>
            </div>
          </div>
        );
      });
    
    }

    let inputErrorElem = null;
    if (this.state.amountError) {
      const inputErrorCss = {
        color: "red",
        fontSize: "12px",
        position: "absolute",
        top: "16px",
        whiteSpace: "nowrap",
        backgroundColor: "white",
        zIndex: "2",
        lineHeight: "24px"
      };
      inputErrorElem = (
        <div style={inputErrorCss}>{this.state.amountError}</div>
      );
    }

    const ownCategories = this.state.categories;
    let categories = null;
    let categoryType = null;
    if(quickTransaction.sign === "+") {
      categories = staticCategories.income;
      categoryType = "income";
    } else {
      categories = staticCategories.expenses;
      categoryType = "expense";
    }

    if (ownCategories) {
      ownCategories.forEach(category => {
        if (category.type === categoryType) {
          categories[category.name] = category.label;
        }
      });
    }

    const catKeys = Object.keys(categories);
    let categoryElems = catKeys.map(catKey => {
      return (
        <MenuItem key={catKey} value={catKey} 
          primaryText={categories[catKey]} />
      );
    });
    
    const futureTransactions = monthStats ? monthStats.futureTransactions : [];
    const futureTransactionElems = this._renderFutureTransactionElems(futureTransactions);
    
    const listHeight = this.state.futureTransactionsOpen ?
      23 + (futureTransactions.length * 26) : 0;

    const futureTransactionsList = (
      <div style={{ height: listHeight+"px" }} className={s.futureTransactions}>
        <div>
          <div style={{ textAlign: "center" }}>TULEVAT TAPAHTUMAT</div>
          <div>
          </div>
        </div> 
        <div className={s.futureTransactionsList}>
          {futureTransactionElems}
        </div>
      </div>
    );

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
              {inputErrorElem}
              <TextField style={fullWidth} 
                name="amount" 
                errorStyle={{ display: "none" }}
                errorText={this.state.amountError}
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
                {categoryElems}
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
              <FlatButton disabled={this.state.quickTxDisabled}
                style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onTouchTap={() => this._saveTransaction()}>
                <i style={{ width: "100%", verticalAlign: "top" }} 
                  className="material-icons">&#xE163;</i>
              </FlatButton>
            </div>
          </div>
          <div>
            {goalElem}
            {currentMonthElem}
          </div>
          <div className={s.alerts}>
            {alertElems}
          </div>
          {futureTransactionsList}
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
