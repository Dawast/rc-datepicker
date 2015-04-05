'use strict';

const React = require('react'),
  MonthPickerTop = require('./MonthPickerTop.jsx'),
  MonthPickerBody = require('./MonthPickerBody.jsx');

const MonthPicker = React.createClass({

  propTypes: {
    visibleDate: React.PropTypes.any.isRequired,
    selectedDate: React.PropTypes.any,
    onChangeDate: React.PropTypes.func.isRequired,
    onSelectDate: React.PropTypes.func.isRequired,
    onChangeMode: React.PropTypes.func.isRequired,
    location: React.PropTypes.string.isRequired,
    mode: React.PropTypes.string.isRequired,
    fixed: React.PropTypes.bool,
    classNamePrefix: React.PropTypes.string.isRequired
  },

  _onSelectDate: function(date) {
    if (this.props.fixed) {
      this.props.onSelectDate(date);
    } else {
      this.props.onChangeDate(date);
      this.props.onChangeMode('day');
    }
  },

  render: function () {
    return (
      <div className={this.props.classNamePrefix + ' container month'}>
        <MonthPickerTop
          visibleDate={this.props.visibleDate}
          onChangeDate={this.props.onChangeDate}
          onChangeMode={this.props.onChangeMode}
          fixed={this.props.fixed}
          classNamePrefix={this.props.classNamePrefix} />
        <MonthPickerBody
          visibleDate={this.props.visibleDate}
          selectedDate={this.props.selectedDate}
          onSelectDate={this._onSelectDate}
          mode={this.props.mode}
          location={this.props.location}
          classNamePrefix={this.props.classNamePrefix} />
      </div>
    );
  }
});

module.exports = MonthPicker;
