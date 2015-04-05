'use strict';

import React, {PropTypes} from 'react/addons';
import moment from 'moment';
import DatePicker from './DatePicker.jsx';
import DateUtils from './utils/DateUtils.js';
import Locales from './utils/Locales.js';

export const DatePickerInput = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    date:           PropTypes.any,
    onChangeDate:   PropTypes.func.isRequired,
    placeholder:    PropTypes.string,
    format:         PropTypes.string,
    location:       PropTypes.string,
    startMode:      PropTypes.string,
    fixed:          PropTypes.bool,
    autoClose:      PropTypes.bool
  },

  getDefaultProps() {
    return {
      location: 'en',
      autoClose: true,
      readOnly: false,
      startMode: 'day',
      fixed: false
    };
  },

  getInitialState() {
    this.temporaryHardcodedLocale();
    const parsedDate = moment(this.props.date, this.getFormat(this.props.date));
    return {
      date: this.props.date,
      datePickerDate: parsedDate.isValid() ? parsedDate : moment(),
      show: false
    };
  },

  showDatePicker() {
    this.setState({show: true});
  },

  hideDatePicker() {
    this.setState({show: false});
  },

  toggleDatePicker() {
    this.setState({show: !this.state.show});
  },

  _onChangeDate(date) {
    this.setState({
      date: date.format(this.getFormat()),
      datePickerDate: date,
      show: !this.props.autoClose
    });
  },

  getFormat(dateString) {
    if (this.props.format) {
      return this.props.format;
    }
    if (this.props.fixed) {
      switch (this.props.startMode) {
        case 'month':
          return 'MMMM';
        case 'year':
          return 'YYYY';
      }
    }
    if (dateString) {
      const array = dateString.match(/\d+/g);
      if (Array.isArray(array) && array.length === 3 && array.filter((x) => x.length > 2).length === 0) {
        return this.props.location === 'it' ? 'DD MM YY' : 'MM DD YY';
      }
    }
    return 'L';
  },

  resetDate() {
    this.replaceState({
      date: '',
      datePickerDate: moment(),
      show: false
    });
    this.refs.datePicker.onChangeVisibleDate(this.state.datePickerDate);
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.date !== this.state.date) {
      const parsedDate = moment(nextState.date, this.getFormat(nextState.date));
      if (parsedDate.isValid()) {
        this.refs.datePicker.onChangeVisibleDate(parsedDate);
      }
      const jsDate = parsedDate.isValid() ? parsedDate.toDate() : false;
      this.props.onChangeDate(nextState.date, jsDate);
    }
  },

  render() {
    return (
      <div>
        <div className='ui action input datepicker-input'>
          <input type="text" placeholder={this.props.placeholder} valueLink={this.linkState('date')} readOnly={this.props.readOnly}/>
          <div className={'ui icon button' + (this.state.show ? ' active' : '')} onClick={this.toggleDatePicker}>
            <i className='calendar icon'></i>
          </div>
        </div>
        <DatePicker
          startDate={this.state.datePickerDate}
          show={this.state.show}
          location={this.props.location}
          startMode={this.props.startMode}
          fixed={this.props.fixed}
          onChange={this._onChangeDate}
          ref='datePicker'/>
      </div>
    );
  },

  temporaryHardcodedLocale() {
    moment.defineLocale('it', {
        months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
        monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
        weekdays : 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
        weekdaysShort : 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
        weekdaysMin : 'D_L_Ma_Me_G_V_S'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'LT:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY LT',
            LLLL : 'dddd, D MMMM YYYY LT'
        },
        calendar : {
            sameDay: '[Oggi alle] LT',
            nextDay: '[Domani alle] LT',
            nextWeek: 'dddd [alle] LT',
            lastDay: '[Ieri alle] LT',
            lastWeek: function () {
                switch (this.day()) {
                    case 0:
                        return '[la scorsa] dddd [alle] LT';
                    default:
                        return '[lo scorso] dddd [alle] LT';
                }
            },
            sameElse: 'L'
        },
        relativeTime : {
            future : function (s) {
                return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
            },
            past : '%s fa',
            s : 'alcuni secondi',
            m : 'un minuto',
            mm : '%d minuti',
            h : 'un\'ora',
            hh : '%d ore',
            d : 'un giorno',
            dd : '%d giorni',
            M : 'un mese',
            MM : '%d mesi',
            y : 'un anno',
            yy : '%d anni'
        },
        ordinalParse : /\d{1,2}º/,
        ordinal: '%dº',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });
  }
});

