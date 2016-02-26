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
class EditRepeatingTransactionView extends EditTransactionViewClass {
  
  constructor(props) {
    super(props);
    console.log("contstr rep", props, this.state);
  }

  _handleRepeatDropdown(event, index, value) {
    this.state.transaction.repeatValue = 1;
    this._handleFormChange("repeats", value);
  }
  
  _handleRepeatValDropdown(event, index, value) {
    this._handleFormChange("repeatValue", value);
  }

  renderChildren() {
    
    let fullWidth = { width: "100%", minWidth: "initial" };

    const { transaction } = this.state;

    let valueElem = null;
    if (transaction.repeats === "M") {
      
      const menuItems = [];
      for (let i = 1; i <= 31; i++) {
        menuItems.push(
          <MenuItem key={`day-${i}`} value={i} primaryText={`${i}. päivä`} />
        );
      }

      valueElem = (
        <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
          name="repeatValue" 
          value={this.state.transaction.repeatValue} 
          onChange={this._handleRepeatValDropdown.bind(this)}>
          {menuItems}
        </DropDownMenu>
      );

    } else if (transaction.repeats === "W") {
      valueElem = (
        <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
          name="repeatValue" 
          value={this.state.transaction.repeatValue} 
          onChange={this._handleRepeatValDropdown.bind(this)}>
          <MenuItem value={1} primaryText="Maanantai" />
          <MenuItem value={2} primaryText="Tiistai" />
          <MenuItem value={3} primaryText="Keskiviikko" />
          <MenuItem value={4} primaryText="Torstai" />
          <MenuItem value={5} primaryText="Perjantai" />
          <MenuItem value={6} primaryText="Lauantai" />
          <MenuItem value={0} primaryText="Sunnuntai" />
        </DropDownMenu>
      );
    }

    return (
      <div className={s.extraGroup}>
        <div className={s.repetitionSettings}> 
          <div className={s.repetitionType}>
            <div className={s.groupLabel}>
              Toistuvuus
            </div> 
            <DropDownMenu style={Object.assign({ height: "43px" }, fullWidth)}
              name="repeats" 
              value={this.state.transaction.repeats} 
              onChange={this._handleRepeatDropdown.bind(this)}>
              <MenuItem value="D" primaryText="Päivittäin" />
              <MenuItem value="W" primaryText="Viikottain" />
              <MenuItem value="M" primaryText="Kuukausittain" />
            </DropDownMenu>
          </div>
          <div className={s.repetitionValue}>
            <div className={s.groupLabel}>
              Ajankohta
            </div> 
            {valueElem}
          </div>
        </div>
      </div>
    );

  }

}

export default EditRepeatingTransactionView;
