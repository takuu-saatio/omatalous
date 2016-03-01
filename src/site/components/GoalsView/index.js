"use strict";

import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import s from "./GoalsView.scss";
import cx from "classnames";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import RaisedButton from "material-ui/lib/raised-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import Checkbox from "material-ui/lib/checkbox";
import BaseComponent from "../BaseComponent";
import { EditRepeatingTransactionContainer } from "../../containers";
import { staticCategories } from "../../constants";
import { mergeCategories } from "../../utils";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
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
        finite: false
      };
      state.startMonth = this._getStartMonth();
    } else {
      state.startMonth = this._getStartMonth(state.goal.start);
    }
    
    if (!state.categories) {    
      state.categories = [];
    }

    state.expenseCategory = { type: "expense" };
    state.incomeCategory = { type: "income" };
    state.amountErrors = {};

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
    
    if (name === "startAmount" || name === "targetAmount") {
 
      let amount = value;
      if (amount) {
        amount = (""+amount).replace(/,/g, ".");
      }

      if (isNaN(amount)) {
        this.state.amountErrors[name] = "Ei ole numero";
      } else if (parseFloat(amount) < 0) {
        this.state.amountErrors[name] = "Väärä arvo: < 0";
      } else {
        delete this.state.amountErrors[name];
      }
      
      if (!amount || amount === "") {
        delete this.state.amountErrors[name];
      }

    }

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
 
  _toggleFiniteGoal() {
    this.state.goal.finite = !this.state.goal.finite;
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
  
  _saveGoal() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    this.props.saveGoal(user, this.state.goal);
  }
  
  _deleteGoal() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    const now = new Date();
    const monthPadding = now.getMonth() < 9 ? "0" : "";
    const monthVal = now.getFullYear() + "-" + monthPadding + (now.getMonth() + 1);
    this.state.goal.start = monthVal;
    this.state.goal.end = null;
    this.state.goal.targetAmount = null;
    this.state.goal.startAmount = 0;
    this.state.goal.finite = false;
    console.log("DELETE GOAL", this.state.goal);
    this.props.saveGoal(user, this.state.goal);
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

  _renderDropdown(startMonth, value, minTotal, handler, disabled) {
     
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
        disabled={disabled}
        onChange={handler.bind(this)}>
        {menuItems}
      </DropDownMenu>
    );

  }

  _renderTransactionElems(transactions) {

    const weekDays = [ "Su", "Ma", "Ti", "Ke", "To", "Pe", "La" ];

    const incomeCategories = mergeCategories(
      staticCategories.income, this.state.categories, "income");
    const expenseCategories = mergeCategories(
      staticCategories.expenses, this.state.categories, "expense");

    return transactions.map(transaction => {

      const categories = transaction.sign === "+" ?
        incomeCategories : expenseCategories;
      
      const highlightCss = {};
      if (transaction.type === "copy") {
        highlightCss.backgroundColor = "#f0f0f0";
        highlightCss.border = "1px solid #e0e0e0";
      }
      
      let repeatLabel = null;
      switch (transaction.repeats) {
        case "M":
          repeatLabel = transaction.repeatValue + ". pv";
          break;
        case "W":
          repeatLabel = "Joka " + weekDays[transaction.repeatValue];
          break;
        case "D":
          repeatLabel = "Joka päivä";
          break;
        default:
          break;
      }

      const transactionElem = (
        <div style={highlightCss} className={s.transaction}>
          <div className={s.txAmount}
            style={{ color: transaction.sign === "+" ? "#3B8021" : "#C53636" }}>
            {transaction.sign}{transaction.amount}
          </div>
          <div className={s.txCategory}>
            {transaction.description || categories[transaction.category]}
          </div>
          <div className={s.txDate}>
            {repeatLabel}
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
          title="Toistuva"
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
          case "save_failed":
            statusColor = { color: "red" };
            break;
          default:
            statusColor = {};
        }

        const statusElem = (
          <span style={statusColor}>{this.getIntlMessage(editStatus)}</span>
        );

        editStatuses[messageKey] = statusElem;

      });

    }
 
    const fullWidth = { width: "100%", minWidth: "initial" };
    const cursorCss = { cursor: "pointer" }; 
    let incomeTransactions = [];
    let expenseTransactions = [];
    let incomeTxElems = null;
    let expenseTxElems = null;
    
    if (transactions) {

      transactions.forEach(transaction => {
        
        if (transaction.sign === "+") {
          incomeTransactions.push(transaction);
        } else {
          expenseTransactions.push(transaction);
        }

      });
    
      incomeTxElems = this._renderTransactionElems(incomeTransactions);
      expenseTxElems = this._renderTransactionElems(expenseTransactions);

    }
    
    let incomeCatElems = [];
    let expenseCatElems = [];
    if (categories) {
      categories.forEach(category => {

        const catElem = (
          <div className={s.category} style={cursorCss} key={category.uuid}>
            <div className={s.catTitle}>
              <span>{category.label}</span>
            </div>
            <div onClick={() => this._deleteCategory(category.uuid)} 
              className={s.catDelete}>
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
        <RaisedButton 
          style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
          onTouchTap={() => this._deleteGoal()} label="NOLLAA"/>
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

    let saveGoalDisabled = true;
    
    if (goal.finite) {
      saveGoalDisabled = !(
        goal.startAmount !== undefined && goal.startAmount !== "" &&
        goal.targetAmount !== undefined && goal.targetAmount !== "" &&
        !this.state.amountErrors["startAmount"] &&
        !this.state.amountErrors["targetAmount"] &&
        goal.start && goal.end);
    } else {
      saveGoalDisabled = !(
        goal.startAmount !== undefined && goal.startAmount !== "" &&
        !this.state.amountErrors["startAmount"] &&
        goal.start); 
    }
    console.log("save goal disabled?", goal);
     
    let incomeSummary = 0;
    let expensesSummary = 0;
    let repeatingSummary = 0;
    if (monthStats) {
      incomeSummary = monthStats.fixedIncome;
      expensesSummary = monthStats.fixedExpenses;
      repeatingSummary = incomeSummary - expensesSummary;
    }

    const catInputCss = {
      width: "100%"
    };
    const catSubmitCss = {
      minWidth: "initial",
      marginLeft: "6px"
    };

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.repeatingTransactions}>
            <div className={s.transactionsHeader}>
              <div className={s.transactionsLabel}>
                <span>Toistuvat tulot</span>
                <span className={s.infoIcon} style={{ right: "-20px" }}> 
                  <span className={cx("material-icons", s.infoSymbol)}>&#xE88F;</span>
                  <div className={cx(s.infoPopup, s.goalsPopup)} style={{ top: "23px" }}>
                    <div className={s.infoText}>
                      <b>Toistuvat tulot</b>
                      <div>
                        Lisää, poista ja muokkaa säännöllisiä tulojasi.
                        Tietoja säännöllisistä tuloistasi käytetään käytettävissä olevan
                        rahamäärän arviointiin ja säästön suunnitteluun.
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <div className={s.transactionsSummary}>
                <span style={{ color: "green" }} className={s.dataValue}>
                  +{incomeSummary}
                </span>
                <span className={s.euroSign}>
                  €/kk
                </span>
              </div>
            </div>
            <div className={s.transactions}>
              <div className={s.newTransaction}>
                <RaisedButton onTouchTap={() => this._editTransaction("+")}
                  secondary={true} label="Lisää uusi tulo"
                  style={{ width: "100%" }} />
              </div>
              <div className={s.transactionsList}>
                {incomeTxElems}
              </div>
            </div>
          </div>  
          <div className={s.repeatingTransactions}>
            <div className={s.transactionsHeader}>
              <div className={s.transactionsLabel}>
                <span>Toistuvat menot</span>
                <span className={s.infoIcon} style={{ right: "-20px" }}> 
                  <span className={cx("material-icons", s.infoSymbol)}>&#xE88F;</span>
                  <div className={cx(s.infoPopup, s.goalsPopup)} style={{ top: "23px" }}>
                    <div className={s.infoText}>
                      <b>Toistuvat menot</b>
                      <div>
                        Lisää, poista ja muokkaa säännöllisiä menojasi.
                        Tietoja säännöllisistä menoistasi käytetään käytettävissä olevan
                        rahamäärän arviointiin ja säästön suunnitteluun.
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <div className={s.transactionsSummary}>
                <span style={{ color: "red" }} className={s.dataValue}>
                  -{expensesSummary}
                </span>
                <span className={s.euroSign}>
                  €/kk
                </span>
              </div>
            </div>
            <div className={s.transactions}>
              <div className={s.newTransaction}>
                <RaisedButton onTouchTap={() => this._editTransaction("-")}
                  secondary={true} label="Lisää uusi meno"
                  style={{ width: "100%" }} />
              </div>
              <div className={s.transactionsList}>
                {expenseTxElems}
              </div>
            </div>
          </div>
          <div className={s.repeatingSummary}>
            Käytettävissä: <b>{repeatingSummary} €</b>
          </div>
          <div>
            <div style={{ backgroundColor: "#f0f0f0" }}>
              <div className={s.categoriesHeader}>
                <div className={s.categoriesLabel}>
                  <span>Omat kategoriat</span>
                  <span className={s.infoIcon} style={{ right: "-20px" }}> 
                    <span className={cx("material-icons", s.infoSymbol)}>&#xE88F;</span>
                    <div className={cx(s.infoPopup, s.goalsPopup)} style={{ top: "23px" }}>
                      <div className={s.infoText}>
                        <b>Omat kategoriat</b>
                        <div>
                          Voit lisätä kategorioita, jotka kuvaavat parhaiten
                          omia kulutuksen kohteitasi tai tulojasi.
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
              <div className={s.categoriesContainer}>
                <div className={s.categories}>
                  <div className={s.categoriesList}>
                    <div className={s.catTypeLabel}>TULOT</div>
                    <div className={s.newCategory}>
                      <div className={s.catInput}>
                        <TextField style={catInputCss}
                          name="label"
                          floatingLabelText="Uusi kategoria"
                          value={this.state.incomeCategory.label}
                          onChange={this._handleIncomeCatChange.bind(this)}
                        />
                      </div>
                      <div className={s.catSubmit}>
                        <RaisedButton secondary={true} style={catSubmitCss} 
                          onTouchTap={() => this._saveCategory(this.state.incomeCategory)}
                          label="Lisää">
                        </RaisedButton>
                      </div>
                    </div>
                    {incomeCatElems}
                  </div>
                </div>
              </div>
              <div className={s.categoriesContainer}>
                <div className={s.categories}>
                  <div className={s.categoriesList}>
                    <div className={s.catTypeLabel}>MENOT</div>
                    <div className={s.newCategory}>
                      <div className={s.catInput}>
                        <TextField style={catInputCss}
                          name="label"
                          floatingLabelText="Uusi kategoria"
                          value={this.state.expenseCategory.label}
                          onChange={this._handleExpenseCatChange.bind(this)}
                        />
                      </div>
                      <div className={s.catSubmit}>
                        <RaisedButton secondary={true} style={catSubmitCss} 
                          onTouchTap={() => this._saveCategory(this.state.expenseCategory)}
                          label="Lisää">
                        </RaisedButton>
                      </div>
                    </div>
                    {expenseCatElems}
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div className={s.goals}>
            <div className={s.categoriesHeader}>
              <div className={s.categoriesLabel}>
                <span>Säästöasetukset</span>
                <span className={s.infoIcon} style={{ right: "-20px" }}> 
                  <span className={cx("material-icons", s.infoSymbol)}>&#xE88F;</span>
                  <div className={cx(s.infoPopup, s.goalsPopup)} style={{ top: "initial", bottom: "24px" }}>
                    <div className={s.infoText}>
                      <b>Säästöasetukset</b>
                      <div style={{ textAlign: "left", paddingTop: "6px" }}>
                        <b>Aloitussumma:</b> Valmiiksi säästössä oleva rahamäärä.<br/>
                        <b>Aloitus-kk:</b> Kuukausi, jolloin säästäminen on aloitettu tai 
                        on tarkoitus aloittaa.<br/>
                        <b>Tavoite:</b> Säästölle voi asettaa tavoitesumma ja aika, 
                        jotta sovellus voi auttaa mitoittamaan rahankäyttöä ja
                        näyttää säästön edistymistä.<br/>
                        <b>Tavoite €:</b> Tavoitteena olevan säästön lopullinen rahamäärä.<br/>
                        <b>Lopetus-kk:</b> Kuukausi, jonka loppuun mennessä tavoitteen 
                        tulee täyttyä
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className={s.goal}>
              <div className={s.goalRow}>
                <div className={s.goalAmount}>
                  <TextField style={fullWidth} 
                    name="startAmount"
                    errorText={this.state.amountErrors["startAmount"]}
                    floatingLabelText="Aloitussumma"
                    value={this.state.goal.startAmount}
                    onChange={this._handleGoalChange.bind(this)} />
                </div>
                <div className={s.goalStart}>
                  <div className={s.dropdownLabel}>Aloitus-kk</div>
                  {this._renderDropdown(firstMonth, this.state.goal.start, 0, 
                                      this._handleStartDropdown)}
                </div>
              </div>
              <div className={s.goalRow}>
                <div className={s.finiteToggle}>
                  <div className={s.dropdownLabel} style={{ marginBottom: "6px" }}>Tavoite</div>
                  <Checkbox
                    style={{ width: "initial", margin: "auto" }}
                    checked={this.state.goal.finite}
                    onCheck={() => this._toggleFiniteGoal()}
                  />  
                </div>
                <div className={s.goalAmount}>
                  <TextField style={fullWidth} disabled={!this.state.goal.finite} 
                    name="targetAmount"
                    errorText={this.state.amountErrors["targetAmount"]}
                    floatingLabelText="Tavoite €"
                    value={this.state.goal.targetAmount}
                    onChange={this._handleGoalChange.bind(this)} />
                </div>
                <div className={s.goalEnd}>
                  <div className={s.dropdownLabel}>Lopetus-kk</div>
                  {this._renderDropdown(endFirstMonth, this.state.goal.end, 12,
                                        this._handleEndDropdown, !this.state.goal.finite)}
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
                <RaisedButton secondary={true} disabled={saveGoalDisabled}
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
