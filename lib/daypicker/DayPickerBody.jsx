'use strict';

import React from 'react';
import moment from 'moment';
import InvalidDate from '../InvalidDate.jsx';
import Picker from '../Picker.jsx';
import Row from '../Row.jsx';
import DateUtils from '../utils/DateUtils';

const DayPickerBody = React.createClass({

    propTypes: {
      visibleDate:  React.PropTypes.any.isRequired,
      date:         DateUtils.evaluateDateProp,
      minDate:      DateUtils.evaluateDateProp,
      maxDate:      DateUtils.evaluateDateProp,
      onSelectDate: React.PropTypes.func.isRequired,
      locale:       React.PropTypes.string.isRequired,
      mode:         React.PropTypes.string.isRequired,
      className:    React.PropTypes.string.isRequired
    },

    render(){
      if (!this.props.visibleDate.isValid()) {
        return <InvalidDate invalidDate={this.props.visibleDate.format()} />;
      }
      const year = this.props.visibleDate.year();
      const month = this.props.visibleDate.month();
      const selectedDate = this.props.date ? this.props.date.format('DD/MM/YYYY') : undefined;

      const visibleDays = DateUtils.getVisibleDays(month, year, this.props.locale);
      const days = visibleDays.days.map((dayOfMonth, index) => {
        const date = this.props.visibleDate.clone();
        const isCurrent = index >= visibleDays.startCurrent && index <= visibleDays.endCurrent;
        if (!isCurrent) {
          date.add(index < visibleDays.startCurrent ? -1 : 1, 'M');
        }
        date.date(dayOfMonth);
        return <Picker
          date={date}
          isSelected={date.format('DD/MM/YYYY') === selectedDate}
          isCurrent={isCurrent}
          isEnabled={DateUtils.isInsideTheEnabledArea(date, this.props.mode, this.props.minDate, this.props.maxDate)}
          onSelectDate={this.props.onSelectDate}
          mode={this.props.mode}
          key={index}
        />;
      });
      const nColumns = 7;
      const nRows = 6;
      const rows = Array.apply(null, Array(nRows)).map((n, index) =>
        <Row pickers={days.slice(nColumns * index, nColumns * (index + 1))} mode={this.props.mode} key={index} />);

      return (
        <div className='body'>
          {rows}
        </div>
      );
    }
});

export default DayPickerBody;
