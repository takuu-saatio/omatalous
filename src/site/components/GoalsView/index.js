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
      state.goal = {};
      state.startMonth = this._getStartMonth();
    } else {
      state.startMonth = this._getStartMonth(state.goal.start);
    }
    
    if (!state.categories) {    
      state.categories = [];
    }

    state.expenseCategory = { type: "expense" };
    state.incomeCategory = { type: "income" };

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
    this.props.fetchGoal(user);

  }
  
  updateState(state) {

    if (state.categoryCreated === true) {
      this.state.categories.push(state.category);
      if (state.category.type === "expense") {
        state.expenseCategory = { type: "expense" };
      } else {
        state.incomeCategory = { type: "income" };
      }
    }

    super.updateState(state);

  }

  _handleExpenseCatChange(event) {
    this._handleFormChange("expenseCategory", event.target.name, event.target.value);
  }

  _handleIncomeCatChange(event) {
    this._handleFormChange("incomeCategory", event.target.name, event.target.value);
  }

  _handleGoalChange(event) {
    this._handleFormChange("goal", event.target.name, event.target.value);
  }

  _handleFormChange(target, name, value) {
    
    let formParams = {};
    formParams[name] = value;
    let object = Object.assign(this.state[target], formParams);
    this.state[target] = object;
    if (!this.state.messages) {
      this.state.messages = {};
    }
    this.state.messages[target] = { editStatus: "changed" };
    this.setState(this.state);

  }
  
  _handleDropdownChange(name, value) {
    
    console.log("dropdown change", name, value); 
    let formParams = {};
    formParams[name] = value;
    let goal = Object.assign(this.state.goal, formParams);
    this.state["goal"] = goal;
    if (!this.state.messages) {
      this.state.messages = {};
    }
    this.state.messages["goal"] = { editStatus: "changed" };
    
    if (name === "start") {
      this.state.startMonth = this._getStartMonth(value);
      if (this.state.goal.start > this.state.goal.end) {
        delete this.state.goal.end;
      }
    }

    this.setState(this.state);

  }
  
  _getStartMonth(monthVal) {

    let year, month;
    
    if (monthVal) {
      [ year, month ] = monthVal.split("-");
      year = parseInt(year);
      month = parseInt(month);
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = (now.getMonth() + 1);
    }

    return { year, month };
  
  }

  _handleStartDropdown(event, index, value) {
    this._handleDropdownChange("start", value);
  }
  
  _handleEndDropdown(event, index, value) {
    this._handleDropdownChange("end", value);
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
  
  _saveGoal() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.saveGoal(user, this.state.goal);
  }
  
  _deleteGoal() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.deleteGoal(user, this.state.goal.uuid);
  }
  
  _saveCategory(category) {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.saveCategory(user, category);
  }
  
  _deleteCategory(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa kategorian? Jos poistat kategorian, kaikki sillä merkityt tapahtumasi siirtyvät kategoriaan \"Muut\".")) {
      const user = this.props.params.user || this.state.auth.user.uuid; 
      this.props.deleteCategory(user, uuid);
    }
  }

  _renderDropdown(startMonth, value, minTotal, handler) {
     
    const dropdownLabelCss = {
      paddingLeft: "initial",
      paddingRight: "initial"
    };
    
    const dropdownUnderlineCss = {
      width: "100%",
      margin: "initial",
      marginBottom: "-1px"
    };
    
    const iconStyleCss = {
      right: "0px"
    };

    const monthLabels = [
      "Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä",
      "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"
    ];

    const now = new Date(); 
    
    let currentYear = startMonth.year;
    let currentMonth = startMonth.month;
    let totalMonths = ((now.getMonth() + 1) - startMonth.month) + 6;
    totalMonths += (now.getFullYear() - startMonth.year) * 12;
    if (totalMonths < minTotal) {
      totalMonths = minTotal;
    }

    const menuItems = [];
     
    for (let i = 0; i < totalMonths; i++) {
      
      if (currentMonth > 12) {
        currentYear += 1;
        currentMonth = 1;
      }
      
      const monthPadding = currentMonth < 10 ? "0" : "";
      const monthVal = currentYear + "-" + monthPadding + currentMonth;
      menuItems.push( 
        <MenuItem key={monthVal} value={monthVal}
          primaryText={monthLabels[currentMonth - 1] + " " + currentYear} />
      );
      
      currentMonth += 1;

    }
    
    return (
      <DropDownMenu style={Object.assign({ height: "43px" }, { width: "100%" })}
        labelStyle={dropdownLabelCss} 
        underlineStyle={dropdownUnderlineCss} 
        iconStyle={iconStyleCss}
        value={value}
        onChange={handler.bind(this)}>
        {menuItems}
      </DropDownMenu>
    );

  }

  render() {
     
    console.log("render goals", this.props, this.state);
    let { 
      transactions, categories, goal, 
      monthStats, messages, edit 
    } = this.state;
    
    if (edit) {
       
      let params = Object.assign(this.props.params, {
        uuid: edit 
      });
      
      let transaction = (edit === "+" || edit === "-") ? {
        sign: edit,
        type: "repeating",
        category: "misc",
        repeats: "M",
        repeatValue: 1
      } : null;

      return (
        <EditRepeatingTransactionContainer close={() => this._closeEditTx()}
          signDisabled={true}
          categories={this.state.categories}
          params={params} transaction={transaction} />
      );
    
    }
    
    let formError = null;
    if (this.state.error) {
      formError = (
        <span>Error: {this.state.error.id}</span>
      );
    }
    
    let editStatuses = null;
    if (messages) {
      
      editStatuses = {};  
    
      const messageKeys = Object.keys(messages);
      messageKeys.forEach(messageKey => {
        
        const editStatus = messages[messageKey].editStatus;
        let statusColor = {};
        switch (editStatus) {
          case "changed":
            statusColor = { color: "blue" };
            break;
          case "saved":
            statusColor = { color: "green" };
            break;
          default:
            statusColor = {};
        }

        const statusElem = (
          <span style={statusColor}>{editStatus}</span>
        );

        editStatuses[messageKey] = statusElem;

      });

    }
 
    const fullWidth = { width: "100%", minWidth: "initial" };
    const cursorCss = { cursor: "pointer" }; 
    let incomeTxElems = [];
    let expenseTxElems = [];
    
    if (transactions) {

      transactions.forEach(transaction => {
        
        const txElem = (
          <div className={s.transaction} style={cursorCss} key={transaction.uuid}>
            <div onClick={() => this._editTransaction(transaction.uuid)} 
              className={s.txTitle}>
              {transaction.description}&nbsp;
              {transaction.amount} €
            </div>
            <div onClick={() => this._deleteTransaction(transaction.uuid)} 
              className={s.txDelete}>
              <i className="material-icons">&#xE14C;</i> 
            </div>
          </div>
        );
        
        if (transaction.sign === "+") {
          incomeTxElems.push(txElem);
        } else {
          expenseTxElems.push(txElem);
        }

      });

    }
    
    let incomeCatElems = [];
    let expenseCatElems = [];
    if (categories) {
      categories.forEach(category => {

        const catElem = (
          <div className={s.transaction} style={cursorCss} key={category.uuid}>
            <div className={s.txTitle}>
              {category.label}&nbsp;
            </div>
            <div onClick={() => this._deleteCategory(category.uuid)} 
              className={s.txDelete}>
              <i className="material-icons">&#xE14C;</i>
            </div>
          </div>
        );

        if (category.type === "income") {
          incomeCatElems.push(catElem);
        } else {
          expenseCatElems.push(catElem);
        }

      });
    }
  
    let goalDeleteButton = null;
    if (this.state.goal.uuid) {
      goalDeleteButton = (
        <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
          onTouchTap={() => this._deleteGoal()} label="POISTA"/>
      );
    }

    const goalStartMonth = goal ? goal.start : null;
    const nowMonth = this._getStartMonth(null); 
    const firstMonth = {
      year: 2016,
      month: 1
    };

    let endFirstMonth = this.state.startMonth;
    if (endFirstMonth.year <= nowMonth.year && endFirstMonth.month < nowMonth.month) {
      endFirstMonth = nowMonth;
    }

    const saveGoalDisabled = !(goal.amount && goal.start && goal.end);
     
    let incomeSummary = null;
    let expensesSummary = null;
    if (monthStats) {
      
      incomeSummary = (
        <div className={s.fixedSummary}>
          Tässä kuussa yht. {monthStats.fixedIncome} €
        </div>
      );

      expensesSummary = (
        <div className={s.fixedSummary}>
          Tässä kuussa yht. {monthStats.fixedExpenses} €
        </div>
      );

    }

    const catInputCss = {
      width: "140px"
    };
    const catSubmitCss = {
      minWidth: "initial",
      marginLeft: "6px"
    };

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
              <div>{incomeSummary}</div>
            </div>
            <div>
              <div className={s.transactionsLabel}>Toistuvat menot</div>
              <div className={s.transactions}>
                {expenseTxElems}
                <div onClick={() => this._editTransaction("-")} className={s.newTransaction}>
                  + UUSI
                </div>
              </div>
              <div>{expensesSummary}</div>
            </div>
            <div>
              <div className={s.transactionsLabel}>Omat kategoriat</div>
              <div className={s.transactions}>
                <div className={s.catTypeLabel}>Tulot</div>
                {incomeCatElems}
                <div className={s.newCategory}>
                  <TextField style={catInputCss}
                    name="label"
                    floatingLabelText="Uusi kategoria"
                    value={this.state.incomeCategory.label}
                    onChange={this._handleIncomeCatChange.bind(this)} />
                  <FlatButton style={catSubmitCss} 
                    onTouchTap={() => this._saveCategory(this.state.incomeCategory)}>
                    <i className="material-icons">&#xE148;</i>
                  </FlatButton>
                </div>
              </div>
              <div className={s.transactions}>
                <div className={s.catTypeLabel}>Menot</div>
                {expenseCatElems}
                <div className={s.newCategory}>
                  <TextField style={catInputCss}
                    name="label"
                    floatingLabelText="Uusi kategoria"
                    value={this.state.expenseCategory.label}
                    onChange={this._handleExpenseCatChange.bind(this)} />
                  <FlatButton style={catSubmitCss} 
                    onTouchTap={() => this._saveCategory(this.state.expenseCategory)}>
                    <i className="material-icons">&#xE148;</i>
                  </FlatButton>
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
                  name="amount"
                  floatingLabelText="Summa"
                  value={this.state.goal.amount}
                  onChange={this._handleGoalChange.bind(this)} />
              </div>
              <div className={s.goalStart}>
                <div className={s.dropdownLabel}>Aloitus-kk</div>
                {this._renderDropdown(firstMonth, this.state.goal.start, 0, 
                                      this._handleStartDropdown)}
              </div>
              <div className={s.goalEnd}>
                <div className={s.dropdownLabel}>Lopetus-kk</div>
                <div>
                  {this._renderDropdown(endFirstMonth, this.state.goal.end, 12,
                                        this._handleEndDropdown)}
                </div>                      
              </div>
            </div>
            <div className={s.goalsSubmit}>
              <div className={s.editStatus}>
                {editStatuses ? editStatuses["goal"] : null}
              </div>
              <div className={s.deleteButton}> 
                {goalDeleteButton}
              </div>
              <div className={s.saveButton}> 
                <FlatButton disabled={saveGoalDisabled}
                  style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                  onTouchTap={() => this._saveGoal()} label="TALLENNA"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default GoalsView;
