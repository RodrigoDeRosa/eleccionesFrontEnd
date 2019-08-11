import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import 'react-dates/lib/css/_datepicker.css';
import './Dates.scss';

import { withStyles, withStylesPropTypes, css } from 'react-with-styles';

import DateRangePicker from "react-dates/esm/components/DateRangePicker";

import {DateRangePickerPhrases} from "react-dates/src/defaultPhrases";
import DateRangePickerShape from "react-dates/src/shapes/DateRangePickerShape";
import { START_DATE, END_DATE, VERTICAL_ORIENTATION, ANCHOR_LEFT } from "react-dates/src/constants";
import isSameDay from 'react-dates/src/utils/isSameDay';
import 'react-dates/initialize';


const propTypes = {
    ...withStylesPropTypes,

    // example props for the demo
    autoFocus: PropTypes.bool,
    autoFocusEndDate: PropTypes.bool,
    initialStartDate: momentPropTypes.momentObj,
    initialEndDate: momentPropTypes.momentObj,
    presets: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        start: momentPropTypes.momentObj,
        end: momentPropTypes.momentObj,
    })),

    ...omit(DateRangePickerShape, [
        'startDate',
        'endDate',
        'onDatesChange',
        'focusedInput',
        'onFocusChange',
    ]),
};

const defaultProps = {
    // example props for the demo
    autoFocus: false,
    autoFocusEndDate: false,
    initialStartDate: null,
    initialEndDate: null,
    presets: [],

    // input related props
    startDateId: START_DATE,
    startDatePlaceholderText: 'Fecha Inicial',
    endDateId: END_DATE,
    endDatePlaceholderText: 'Fecha Final',
    disabled: false,
    required: false,
    screenReaderInputMessage: '',
    showClearDates: false,
    showDefaultInputIcon: false,
    customInputIcon: null,
    customArrowIcon: null,
    customCloseIcon: null,

    // calendar presentation and interaction related props
    renderMonthText: null,
    orientation: VERTICAL_ORIENTATION,
    anchorDirection: ANCHOR_LEFT,
    horizontalMargin: 0,
    withPortal: false,
    withFullScreenPortal: false,
    initialVisibleMonth: null,
    numberOfMonths: 2,
    keepOpenOnDateSelect: false,
    reopenPickerOnClearDates: false,
    isRTL: false,

    // navigation related props
    navPrev: null,
    navNext: null,
    onPrevMonthClick() {},
    onNextMonthClick() {},
    onClose() {},

    // day presentation and interaction related props
    renderDayContents: null,
    minimumNights: 0,
    enableOutsideDays: false,
    isDayBlocked: () => false,
    isOutsideRange: day => false,
    isDayHighlighted: () => false,

    // internationalization
    displayFormat: () => moment.localeData('es').longDateFormat('L'),
    monthFormat: 'MMMM YYYY',
    phrases: DateRangePickerPhrases,
};

class DateRangePickerWrapper extends React.Component {
    constructor(props) {
        super(props);
        moment.locale('es');

        let focusedInput = null;
        if (props.autoFocus) {
            focusedInput = START_DATE;
        } else if (props.autoFocusEndDate) {
            focusedInput = END_DATE;
        }

        this.state = {
            focusedInput,
            startDate: props.initialStartDate,
            endDate: props.initialEndDate,
        };

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.renderDatePresets = this.renderDatePresets.bind(this);
    }

    onDatesChange({ startDate, endDate }) {
        this.props.updateDate(startDate, endDate);
        this.setState({ startDate, endDate });
    }

    onFocusChange(focusedInput) {
        this.setState({ focusedInput });
    }

    renderDatePresets() {
        const { presets, styles } = this.props;
        const { startDate, endDate } = this.state;

        return (
            <div {...css(styles.PresetDateRangePicker_panel)}>
                {presets.map(({ text, start, end }) => {
                    const isSelected = isSameDay(start, startDate) && isSameDay(end, endDate);
                    return (
                        <button
                            key={text}
                            {...css(
                                styles.PresetDateRangePicker_button,
                                isSelected && styles.PresetDateRangePicker_button__selected,
                            )}
                            type="button"
                            onClick={() => this.onDatesChange({ startDate: start, endDate: end })}
                        >
                            {text}
                        </button>
                    );
                })}
            </div>
        );
    }

    render() {
        const { focusedInput, startDate, endDate } = this.state;

        // autoFocus, autoFocusEndDate, initialStartDate and initialEndDate are helper props for the
        // example wrapper but are not props on the SingleDatePicker itself and
        // thus, have to be omitted.
        const props = omit(this.props, [
            'autoFocus',
            'autoFocusEndDate',
            'initialStartDate',
            'initialEndDate',
            'presets',
            'updateDate',
        ]);

        return (
            <div className="date-style">
                <DateRangePicker
                    {...props}
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChange}
                    focusedInput={focusedInput}
                    startDate={startDate}
                    endDate={endDate}
                    hideKeyboardShortcutsPanel={true}
                    enableOutsideDays={true}
                    isOutsideRange={date => date.isBefore(moment("07/01/2019"), 'day') || date.isAfter(moment(), 'day')}
                />
            </div>
        );
    }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

export default withStyles(({ reactDates: { color } }) => ({
    PresetDateRangePicker_panel: {
        padding: '0 22px 11px 22px',
    },

    PresetDateRangePicker_button: {
        position: 'relative',
        height: '100%',
        textAlign: 'center',
        background: 'none',
        border: `2px solid transparent`,
        color: color.core.primary,
        padding: '4px 12px',
        marginRight: 8,
        font: 'inherit',
        fontWeight: 700,
        lineHeight: 'normal',
        overflow: 'visible',
        boxSizing: 'border-box',
        cursor: 'pointer',

        ':active': {
            outline: 0,
        },
    },

    PresetDateRangePicker_button__selected: {
        color: color.core.white,
        background: color.core.primary,
    },
}))(DateRangePickerWrapper);
