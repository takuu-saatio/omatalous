import React, { Component, PropTypes } from "react";
import s from "./TransactionsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import BaseComponent from "../BaseComponent";
import InsightsView from "./InsightsView";

@withStyles(s)
class TransactionsView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr transactions", props);
    this.state = Object.assign(props.state, {
      transaction: {
        type: "+",
        category: 1
      }
    });
  }

  async fetchData(props = this.props) { 

    const user = this.props.params.user || this.state.auth.user.uuid; 
    console.log("fetching transactions for", user);
    this.props.fetchTransactions(user);

  }
  
  updateState(state) {
    super.updateState(state);
  }

  _handleInputChange(event) {

    let formParams = {};
    formParams[event.target.name] = event.target.value;
    let transaction = Object.assign(this.state.transaction, formParams);
    let state = Object.assign(this.state, { transaction });
    state.messages = { editStatus: "changed" };
    this.setState(state);

  }
  
  _saveTransaction() {
    const user = this.props.params.user || this.state.auth.user.uuid; 
    const transaction = Object.assign({}, this.state.transaction);
    this.props.saveTransaction(user, transaction);
  }
  

  _deleteTransaction(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa tapahtuman?")) {
      this.props.deleteTransaction(uuid);
    }
  }

  render() {
     
    console.log("render transactions", this.props, this.state);
    let { transactions, transaction, messages } = this.state;
    
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
 
    let fullWidth = { width: "100%" };
    
    let transactionElems = transactions.map(transaction => {
      return (
        <div key={transaction.uuid} className={s.transactionsList}>
          <span>{transaction.amount}</span>
          <span>{transaction.description}</span>
        </div>
      );
    });

    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.saveTransaction}>
            <div className={s.amount}>
              <TextField style={fullWidth}
                name="amount" 
                floatingLabelText="Määrä"
                value={transaction.amount}
                onChange={this._handleInputChange.bind(this)} />
            </div>
            <div className={s.category}>
              <DropDownMenu value={this.state.transaction.category} 
                onChange={this._handleInputChange.bind(this)}>
                <MenuItem value={1} primaryText="Sekalaiset"/>
                <MenuItem value={2} primaryText="Ruokakauppa"/>
                <MenuItem value={3} primaryText="Ravintolat"/>
                <MenuItem value={4} primaryText="Viihde"/>
                <MenuItem value={5} primaryText="Matkustus"/>
              </DropDownMenu>
            </div>
            <div className={s.description}>
              <TextField style={fullWidth}
                name="description" 
                floatingLabelText="Selite"
                value={transaction.description}
                onChange={this._handleInputChange.bind(this)} />
            </div>
            <div className={s.submit}>
              <FlatButton onClick={() => this._saveTransaction()} label="TALLENNA" />
            </div>
          </div>
          <div>
            <InsightsView />
          </div>
          <div className={s.transactions}>
            <div className={s.income}>
              <div>TULOT</div>
              <div>+ LISÄÄ</div>
              {transactionElems}
            </div>
            <div className={s.expenses}>
              <div>MENOT</div>
              <div>- LISÄÄ</div>
              {transactionElems}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default TransactionsView;
