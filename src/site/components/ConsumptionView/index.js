import React, { Component, PropTypes } from "react";
import s from "./ConsumptionView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import CircularProgress from "material-ui/lib/circular-progress";
import LinearProgress from "material-ui/lib/linear-progress";
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
    
    this.summaryTypes = [
      "singlesTotal",
      "dayAvg"
    ];

    this.state = Object.assign(props.state, {
      quickTransaction: {
        sign: "-",
        type: "single",
        category: "misc"
      },
      quickTxDisabled: true,
      spendablePeriod: "month",
      summaryType: 0,
      savingView: "total"
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
    
    // Win7/IE10 hacks :(
    if (state.transactions) {
      this.state.transactions = [];
    }
    if (state.monthStats) {
      this.state.monthStats = null;
    }
    if (state.goal) {
      this.state.goal = null;
    }
    
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
  
  _setSavingView(view) {
    this.setState(Object.assign(this.state, {
      savingView: view
    }));
  }
  
  _getHighlightCss(field, value) {
    
    if (field === value) {
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
 
  _renderGoal(goal, monthStats) {
  
    if (!goal) {
      return null;
    }
    
    let totalSaving = goal.totalSaved;
    let totalSavingGoal = goal.targetAmount;
    
    let monthSaving = 0; 
    let monthSavingGoal = goal.currentMonthSavingGoal;

    if (monthStats) {
    
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const origAvg = (monthStats.fixedIncome - monthStats.fixedExpenses) / daysInMonth; 
      const zeroLevel = (origAvg * (now.getDate() + 1));
      monthSaving = Math.floor(zeroLevel - monthStats.expenses + monthStats.income);
      // const remainingDays = (daysInMonth - now.getDate()) + 1;
      // const monthSaving = spendable < 0 ? spendable :
      //   ((spendable / remainingDays) - origAvg);
      
      totalSaving += monthSaving;

    }
     
    let goalElem = null;
 
    if (goal.finite) {
      
      let savingValue = Math.floor(totalSaving);
      let savingMax = Math.ceil(totalSavingGoal);

      if (this.state.savingView === "month") {
        savingValue = Math.floor(monthSaving);
        savingMax = Math.ceil(monthSavingGoal);
      }

      goalElem = (
        <div>
          <div className={s.sectionLabelContainer}>
            <div className={s.sectionLabel}>
              Säästetty
            </div>
            <div className={s.sectionLabelAlt}>
              Säästötavoite
            </div>
          </div>
          <div className={s.sectionValue}>
            <div className={s.goal}>
              <div className={s.sectionValueContainer}>
                <div className={s.goalContent}>
                  {savingValue} <span className={s.euroSign}>€</span>
                </div>
                <div className={s.goalContentAlt}>
                  {savingMax} <span className={s.euroSign}>€</span>
                </div>
              </div>
              <LinearProgress mode="determinate" max={savingMax} value={savingValue} />
            </div>
          </div>
        </div>
      );

    } else {

      goalElem = (
        <div>
          <div className={s.sectionLabel}>
            Säästetty
          </div>
          <div className={s.sectionValue}>
            <div className={s.goal}>
              <div className={s.goalContent}>
                {totalSaving} <span className={s.euroSign}>€</span>
              </div>
            </div>
          </div>
        </div>
      );

    }
    
    
    return goalElem;

  }

  _renderMonthStats(monthStats, goal) {
     
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
    
    const savingElem = this._renderGoal(goal, monthStats);
 
    return (
      <div className={s.month}>
        <div className={s.monthHeader}>
          <span>Kuluva kuukausi</span>
        </div>  
        <div className={s.monthData}>
          <div className={s.section}>
            <div className={s.sectionLabel}>
              Jäljellä
            </div>
            <div className={s.sectionValue}>
              {available} <span className={s.euroSign}>€</span>
            </div>
          </div>
          <div className={s.section}>
            <div className={s.sectionLabel}>
              Käytettävissä
            </div>
            <div className={s.sectionValue}>
              {spendable} <span className={s.euroSign}>€</span>
            </div>
            <div className={s.periodSwitch}>
              <div style={this._getHighlightCss(this.state.spendablePeriod, "month")}
                className={s.periodSwitchCell}
                onTouchTap={() => this._setSpendablePeriod("month")}>
                KK
              </div>
              <div style={this._getHighlightCss(this.state.spendablePeriod, "day")}
                className={s.periodSwitchCell}
                onTouchTap={() => this._setSpendablePeriod("day")}>
                PV
              </div>
            </div>
          </div>
          <div className={s.savingsCell}>
            {savingElem}
            <div className={s.periodSwitch}>
              <div style={this._getHighlightCss(this.state.savingView, "total")}
                className={s.periodSwitchCell}
                onTouchTap={() => this._setSavingView("total")}>
                YHT
              </div>
              <div style={this._getHighlightCss(this.state.savingView, "month")}
                className={s.periodSwitchCell}
                onTouchTap={() => this._setSavingView("month")}>
                KK
              </div>
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
        
        const transactionElem = (
          <div style={highlightCss} className={s.transaction}>
            <div className={s.txAmount}
              style={{ color: transaction.sign === "+" ? "#3B8021" : "#C53636" }}>
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
              style={{ color: transaction.sign === "+" ? "#3B8021" : "#C53636" }}>
              {transaction.sign}{transaction.amount}
            </div>
            <div className={s.futureTxCategory}>{categories[transaction.category]}</div>
            <div className={s.futureTxDescription}>{transaction.description}</div>
          </div>
        );
    });

  }
  
  _nextSummaryType() {
    
    this.state.summaryType += 1;
    if (this.state.summaryType === this.summaryTypes.length) {
      this.state.summaryType = 0;
    }

    this.setState(this.state);

  }

  _prevSummaryType() {
    
    this.state.summaryType -= 1;
    if (this.state.summaryType === -1) {
      this.state.summaryType = this.summaryTypes.length - 1;
    }

    this.setState(this.state);

  }

  _renderMonthSummary(transactions, month, days) {

    const summary = this._getMonthSummary(transactions, days);    
     
    const amountColor = (amount) => {
      return { color: amount < 0 ? "#C53636" : "#3B8021" };
    };
    
    const summaryLabel = month === this.state.monthStats.label ?
      "Tapahtumat" : month;
  
    const nextMonthButton = month !== this.state.monthStats.label ?
      <FlatButton style={Object.assign({ lineHeight: "28px" })} 
        onTouchTap={() => this._loadMonth(this._nextMonth())}
        labelStyle={{ padding: "0px" }}
        label={"< " + this._nextMonth()} /> : null;

    const selectedSummaryType = this.summaryTypes[this.state.summaryType];
    const summaryDataValues = {
      "singlesTotal": Math.abs(Math.ceil(summary.singlesTotal)),
      "dayAvg": summary.dayAvg
    };
    
    const summaryTypeNames = {
      "singlesTotal": "Yhteensä",
      "dayAvg": "Keskikulutus päivässä"
    };

    const summaryTypeLabel = summaryTypeNames[selectedSummaryType];
    const expandIcon = this.state.futureTransactionsOpen ?
      <span>&#xE5C9;</span> : <span>&#xE5C6;</span>;

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
            <div className={s.futureButton}> 
              <i className="material-icons"
                onTouchTap={() => this._toggleFutureTransactions()}>
                {expandIcon}
              </i>
            </div>  
            <div className={s.dataDisplay}>
              <div className={s.typeLabel}>{summaryTypeLabel}</div>
              <span>{summaryDataValues[selectedSummaryType]} €</span>
            </div>
            <div className={s.dataSelector}> 
              <div className={s.typePrev} 
                onTouchTap={() => this._prevSummaryType()}>
                <i className="material-icons">&#xE8D6;</i>
              </div>
            </div>
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
      txSignSymbol = (<i style={Object.assign({ color: "#C53636" }, fullWidth)} 
                      className="material-icons">&#xE15D;</i>);
    } else {
      //txBorderCss.borderBottom = "2px solid green";
      txSignSymbol = (<i style={Object.assign({ color: "#3B8021" }, fullWidth)} 
                      className="material-icons">&#xE148;</i>);
    }
    
    let inputErrorElem = null;
    if (this.state.amountError) {
      const inputErrorCss = {
        color: "#C53636",
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
        <div className={s.quickTxLabel}>
          Lisää tapahtuma
        </div>
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
     
    console.log("render consumption");
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
          statusColor = { color: "#3B8021" };
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
    if (!transactions) {
      transactionElems = <CircularProgress />;
    } else if (transactions.length > 0) {  
      transactionElems = (
        <div className={s.transactionsList}>
          {this._renderTransactionElems(transactions)}
        </div>
      );
    } else {
      transactionElems = (
        <div className={s.noTransactions}>
          Ei tapahtumia
        </div>
      );
    }
    
    const currentMonthElem = this._renderMonthStats(monthStats, goal);
 
    let topMonthNav = null;
    if (this.state.month !== monthStats.label) {
      
      topMonthNav = this._renderMonthSummary(transactions, this.state.month);
    
    } else {
      
      const total = Math.floor(monthStats.income - monthStats.expenses);
      
      const summary = this._getMonthSummary(transactions, (new Date()).getDate());
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
          </div>
          {alertsElem}
          {topMonthNav}
          {futureTransactionsList}
          {quickTransaction}
          <div className={s.transactions}>
            {transactionElems}
          </div>
        </div>
      </div>
    );
  }

}

export default ConsumptionView;
