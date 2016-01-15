"use strict";

import React, { Component, PropTypes } from "react";
import s from "../EditTransactionView/EditTransactionView.scss";
import withStyles from "../../decorators/withStyles";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import { EditTransactionViewClass } from "../EditTransactionView";

@withStyles(s)
class EditRepeatingTransactionView extends EditTransactionViewClass {
  
  constructor(props) {
    super(props);
    console.log("contstr rep", props, this.state);
  }

  _handleRepeatDropdown(event, index, value) {
    this._handleFormChange("repeats", value);
  }

  renderChildren() {
    let fullWidth = { width: "100%", minWidth: "initial" };
    return (
      <div> 
        <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
          name="repeat" 
          value={this.state.transaction.repeats} 
          onChange={this._handleRepeatDropdown.bind(this)}>
          <MenuItem value="D" primaryText="Päivittäin" />
          <MenuItem value="W1" primaryText="Viikottain" />
          <MenuItem value="M1" primaryText="Kuukausittain" />
        </DropDownMenu>
      </div>
    );

  }

}

export default EditRepeatingTransactionView;
