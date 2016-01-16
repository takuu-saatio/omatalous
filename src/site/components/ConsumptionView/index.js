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
    this.state = Object.assign(props.state, {
      quickTransaction: {
        type: "-",
        category: "misc"
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
    if (state.messages && state.messages.editStatus === "saved") {
      this.setState(Object.assign(state, { 
        quickTransaction: { type: "-", category: "misc", amount: "" } 
      }));
    }
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
    const quickTransaction = Object.assign({}, this.state.quickTransaction);
    this.props.quickSaveTransaction(user, quickTransaction);
  } 

  _deleteTransaction(uuid) {
    if (window.confirm("Oletko varma, että haluat poistaa tapahtuman?")) {
      const user = this.props.params.user || this.state.auth.user.uuid; 
      this.props.quickDeleteTransaction(user, uuid);
    }
  }
  
  _toggleTxType() {
    let type = this.state.quickTransaction.type;
    type = type === "-" ? "+" : "-"; 
    this.state.quickTransaction.type = type;
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
    let { transactions, transaction, quickTransaction, messages } = this.state;
    
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
    
    let transactionElems = transactions.map(transaction => {
      return (
        <div key={transaction.uuid} className={s.transaction}>
          <div style={{ color: transaction.type === "+" ? "green" : "red" }}>
            {transaction.type}{transaction.amount}
          </div>
          <div>{transaction.category}</div>
          <div>{transaction.description}</div>
          <div className={s.txControls}>
            <div>
              <i className="material-icons"
                onClick={() => this._deleteTransaction(transaction.uuid)}>
                &#xE14A;
              </i>
            </div>
            <div>
              <i className="material-icons"
                onClick={() => this._editTransaction(transaction.uuid)}>&#xE150;</i>
            </div>
          </div>
        </div>
      );
    });
    
    const txBorderCss = {
      transition: "all 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
    };
    let txTypeSymbol = null;
    if (quickTransaction.type === "-") {
      txBorderCss.borderBottom = "2px solid red";
      txTypeSymbol = (<i style={fullWidth} className="material-icons">&#xE15B;</i>);
    } else {
      txBorderCss.borderBottom = "2px solid green";
      txTypeSymbol = (<i style={fullWidth} className="material-icons">&#xE145;</i>);
    }
    
    return (
      <div>
        {formError}
        <div className={s.root}>
          <div className={s.saveTransaction} style={txBorderCss}>
            <div className={s.type}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onClick={() => this._toggleTxType()}>
                {txTypeSymbol}
              </FlatButton>
            </div> 
            <div className={s.amount}>
              <TextField style={fullWidth} 
                name="amount" 
                floatingLabelText="Määrä"
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
            <div className={s.submit}>
              <FlatButton style={Object.assign({ lineHeight: "28px" }, fullWidth)} 
                onClick={() => this._saveTransaction()}>
                <i style={fullWidth} className="material-icons">&#xE163;</i>
              </FlatButton>
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

export default ConsumptionView;
