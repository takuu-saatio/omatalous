import React, { Component, PropTypes } from "react";
import s from "./TransactionsView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import BaseComponent from "../BaseComponent";

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
        amount: 0,
        description: "testing"
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
            <TextField style={fullWidth}
              name="amount" 
              floatingLabelText="Määrä"
              value={transaction.amount}
              onChange={this._handleInputChange.bind(this)} />
            <TextField style={fullWidth}
              name="description" 
              floatingLabelText="Selite"
              value={transaction.description}
              onChange={this._handleInputChange.bind(this)} />
            <FlatButton onClick={() => this._saveTransaction()} label="TALLENNA" />
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
