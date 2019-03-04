import React, {Component} from "react";
import {SearchInput, SearchBox} from "./Search.styles";
import {IconButton, UtilsCommon} from "frontend-common";
import {string, object, func} from "prop-types";
import {WAIT_INTERVAL, ENTER_KEY} from "../../constants/search";
export class Search extends Component {
  state = {
    inputValue: "",
  };
  /*
   time-slicing implementation
   todo: redo this when react will support time-slicing out of the box
 */
  timer = null;
  handleInputChange = event => {
    clearTimeout(this.timer);
    this.setState({inputValue: event.target.value});
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  };
  /*
   handle user press enter
   send fetch data request immediately
 */
  handleKeyDown = event => {
    if (event.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.triggerChange();
    }
  };
  triggerChange = () => {
    const {setFilterQuery, disabled} = this.props;
    if (disabled) {
      return false;
    }

    return setFilterQuery(this.state.inputValue);
  };
  render() {
    const {placeholder, theme, disabled} = this.props;
    const {inputValue} = this.state;

    return (
      <div>
        <SearchBox>
          <IconButton
            theme={theme}
            name="search"
            type="transparent_gray"
            iconsize={36}
            onClick={this.triggerChange}
          />
          <SearchInput
            disabled={disabled}
            type="search"
            placeholder={placeholder}
            onChange={this.handleInputChange}
            value={inputValue}
            onKeyDown={this.handleKeyDown}
          />
        </SearchBox>
      </div>
    );
  }
}
Search.propTypes = {
  placeholder: string,
  theme: object,
  setFilterQuery: func,
};
export default UtilsCommon.themed(Search);
