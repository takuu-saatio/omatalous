"use strict";

import React, { Component, PropTypes } from "react";
import reactMixin from "react-mixin";
import ReactIntl from "react-intl";
import s from "../EditTransactionView/EditTransactionView.scss";
import withStyles from "../../decorators/withStyles";
import DropDownMenu from "material-ui/lib/DropDownMenu";
import MenuItem from "material-ui/lib/menus/menu-item";
import { EditTransactionViewClass } from "../EditTransactionView";

@withStyles(s)
@reactMixin.decorate(ReactIntl.IntlMixin)
class EditPlannedTransactionView extends EditTransactionViewClass {
  
  constructor(props) {
    super(props);
    console.log("contstr planned tx", props, this.state);
  }

  _handleMonthDropdown(event, index, value) {
    this._handleFormChange("month", value);
  }

  renderChildren() {
    let fullWidth = { width: "100%", minWidth: "initial" };
    return (
      <div> 
        <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
          name="month" 
          value={this.state.transaction.month} 
          onChange={this._handleMonthDropdown.bind(this)}>
          <MenuItem value="2016-01" primaryText="Tammi 2016" />
          <MenuItem value="2016-02" primaryText="Helmi 2016" />
          <MenuItem value="2016-03" primaryText="Maalis 2016" />
          <MenuItem value="2016-04" primaryText="Huhti 2016" />
          <MenuItem value="2016-05" primaryText="Touko 2016" />
          <MenuItem value="2016-06" primaryText="Kesä 2016" />
          <MenuItem value="2016-07" primaryText="Heinä 2016" />
          <MenuItem value="2016-08" primaryText="Elo 2016" />
          <MenuItem value="2016-09" primaryText="Syys 2016" />
          <MenuItem value="2016-10" primaryText="Loka 2016" />
          <MenuItem value="2016-11" primaryText="Marras 2016" />
          <MenuItem value="2016-12" primaryText="Joulu 2016" />
        </DropDownMenu>
      </div>
    );

  }

}

export default EditPlannedTransactionView;
