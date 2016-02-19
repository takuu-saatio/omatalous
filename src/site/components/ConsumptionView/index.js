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
  
  _getMonthSummary(transactions, days) {
  
    const summary = {
      total: 0, 
      singlesTotal: 0, 
      dayAvg: 0
    };
    
    if (!transactions || transactions.length === 0) {
      return summary;
    }

    const txDate = new Date(transactions[0].createdAt);
    console.log("tx summary", transactions);
    const monthLastDay = 
      new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0).getDate();
    transactions.forEach(tx => {
      
      const value = tx.sign === "+" ? tx.amount : -tx.amount;
      
      summary.total += value;
      if (tx.type === "single") {
        summary.singlesTotal += value;
      }
    
    });
    
    days = days ||
      new Date(txDate.getFullYear(), txDate.getMonth() + 1, 0).getDate();
    
    summary.dayAvg = Math.abs(Math.ceil(summary.singlesTotal / days));
    return summary;

  }
  
  _renderMonthStats(monthStats, goal) {
    
    console.log("RENDER MONTH", monthStats); 
    
    if (!monthStats) {
      return null;
    }

    let available = 
      monthStats.fixedIncome - 
      monthStats.fixedExpenses - 
      monthStats.expenses +
      monthStats.income;
    available = Math.floor(available);
    let spendable = available;
    
    let monthContent = "" + available;
    let savingGoal = 0;
    if (goal) {
      savingGoal = Math.floor(goal.currentMonthSavingGoal);
      monthContent += " - " + savingGoal;
      spendable = Math.floor(spendable - savingGoal);
    }

    const now = new Date();
    const lastDay = 
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    if (this.state.spendablePeriod === "week") {
      const remainingWeeks = (lastDay - now.getDate()) / 7;
      spendable = Math.floor((available - savingGoal) / remainingWeeks);
    } else if (this.state.spendablePeriod === "day") {
      const remainingDays = (lastDay - now.getDate()) + 1;
      spendable = Math.floor((available - savingGoal) / remainingDays);
    }
    
    const expandIcon = this.state.futureTransactionsOpen ?
      <span>&#xE5CE;</span> : <span>&#xE5CF;</span>;
    
    return (
      <div className={s.month}>
        <div className={s.monthHeader}>
          <span>Kuluva kuukausi</span>
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
              Säästötavoite
            </div>
            <div className={s.sectionValue}>
              {savingGoal} €
            </div>
          </div>
        </div>
      </div>
    );
  
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
            <div className={s.txAmount}
              style={{ color: transaction.sign === "+" ? "green" : "red" }}>
              {transaction.sign}{transaction.amount}
            </div>
            <div className={s.txCategory}>
              {categories[transaction.category]}
            </div>
            <div className={s.txDescription}>
              {transaction.description}
            </div>
            <div className={s.txDate}>
              {transaction.dateLabel}
            </div>
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

  _renderMonthSummary(transactions, month, days) {

    const summary = this._getMonthSummary(transactions, days);    
     
    const amountColor = (amount) => {
      return { color: amount < 0 ? "red" : "green" };
    };
    
    const summaryLabel = month === this.state.monthStats.label ?
      "Tapahtumat" : "Historia " + month;
  
    const nextMonthButton = month !== this.state.monthStats.label ?
      <FlatButton style={Object.assign({ lineHeight: "28px" })} 
        onTouchTap={() => this._loadMonth(this._nextMonth())}
        labelStyle={{ padding: "0px" }}
        label={"< " + this._nextMonth()} /> : null;
      
    return (
      <div>
        <div className={s.monthSummary}>
          <div className={s.monthNav}>
            <div className={s.nextMonth}>
              {nextMonthButton}
            </div>
            <div className={s.currentMonth}>
              <div className={s.summaryLabel}>{summaryLabel}</div>
            </div>
            <div className={s.prevMonth}>
              <FlatButton style={Object.assign({ lineHeight: "28px" })} 
                onTouchTap={() => this._loadMonth(this._prevMonth())}
                labelStyle={{ padding: "0px" }}
                label={this._prevMonth() + " >"} />
            </div>
          </div>
          <div className={s.summaryData}>
            
            <span>
              <span>Yht. </span>
              <span>
                {Math.abs(Math.ceil(summary.singlesTotal))} €
              </span>
            </span>

            <span>KA/pv: {summary.dayAvg} €</span>
          </div>
        </div>
        <div className={s.topMonthNav}>
        </div>
      </div>
    );

  }
  
  _renderAlerts(alerts) {
    
    if (!alerts || alerts.length === 0) {
      return null;
    }

    const alertElems = alerts.map(alert => {
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
    
    return (
      <div className={s.alerts}>
        {alertElems}
      </div>
    );
    
  }

  _renderQuickTransaction() {
    
    const quickTransaction = this.state.quickTransaction;

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
    let fullWidth = { width: "100%", minWidth: "initial" };
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

    return (
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
    );

  }

  render() {
     
    console.log("render consumption", this.props, this.state);
    let { transactions, goal, monthStats, 
      alerts, messages } = this.state;
    
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
    
    let goalElem = null;
    
    if (goal) {
    
      let totalSaved = goal.totalSaved;
      
      if (monthStats) {
      
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const origAvg = (monthStats.fixedIncome - monthStats.fixedExpenses) / daysInMonth;
        const available = 
          monthStats.fixedIncome - 
          monthStats.fixedExpenses - 
          monthStats.expenses +
          monthStats.income;
       
        const remainingDays = (daysInMonth - now.getDate()) + 1;
        const spendable = available;
        console.log(daysInMonth, remainingDays, spendable, origAvg);
        const monthSaving = spendable < 0 ? spendable :
          ((spendable / remainingDays) - origAvg);
        totalSaved += monthSaving;
 
      }
      
      totalSaved = Math.floor(totalSaved);
      
      if (goal.finite) {
      
        goalElem = (
          <div className={s.goal}>
            <div className={s.goalLabel}>
              Säästetty
            </div>
            <div className={s.goalContent}>
              {totalSaved}/{goal.targetAmount} €
            </div>
          </div>
        );

      } else {

        goalElem = (
          <div className={s.goal}>
            <div className={s.goalLabel}>
              Säästetty
            </div>
            <div className={s.goalContent}>
              {totalSaved} €
            </div>
          </div>
        );

      }

    }

    const currentMonthElem = this._renderMonthStats(monthStats, goal);
 
    let topMonthNav = null;
    if (this.state.month !== monthStats.label) {
      
      topMonthNav = this._renderMonthSummary(transactions, this.state.month);
    
    } else {
      
      const total = Math.floor(monthStats.income - monthStats.expenses);
      
      const summary = this._getMonthSummary(transactions, (new Date()).getDate());
      console.log("got summary", summary);
      topMonthNav = this._renderMonthSummary(transactions,
        this.state.month, (new Date()).getDate());

    }
  
    let alertsElem = this._renderAlerts(alerts);
 
    const futureTransactions = monthStats ? monthStats.futureTransactions : [];
    const futureTransactionElems = this._renderFutureTransactionElems(futureTransactions);
    
    const boxStyles = this.state.futureTransactionsOpen ?
      {
        height: (23 + (futureTransactions.length * 26)) + "px", 
        paddingTop: "24px" 
      } :
      {
        height: "0px",
        paddingTop: "0px"
      };

    const futureTransactionsList = (
      <div style={boxStyles} className={s.futureTransactions}>
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
    
    const quickTransaction = this._renderQuickTransaction();

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div>
            {currentMonthElem}
            {goalElem}
          </div>
          {alertsElem}
          {futureTransactionsList}
          {topMonthNav}
          {quickTransaction}
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

export default ConsumptionView;
