import React from "react";
import PropTypes from "prop-types";
import Calendar from "./calendar";
import CalendarIcon from "./calendar_icon";
import Portal from "./portal";
import PopperComponent from "./popper_component";
import { popperPlacementPositions } from "./with_floating";
import classnames from "classnames";
import set from "date-fns/set";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import isValid from "date-fns/isValid";
import {
  newDate,
  isDate,
  isBefore,
  isAfter,
  isEqual,
  setTime,
  getSeconds,
  getMinutes,
  getHours,
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  isDayDisabled,
  isDayInRange,
  getEffectiveMinDate,
  getEffectiveMaxDate,
  parseDate,
  safeDateFormat,
  safeDateRangeFormat,
  getHightLightDaysMap,
  getYear,
  getMonth,
  getStartOfWeek,
  getEndOfWeek,
  registerLocale,
  setDefaultLocale,
  getDefaultLocale,
  DEFAULT_YEAR_ITEM_NUMBER,
  isSameDay,
  isMonthDisabled,
  isYearDisabled,
  getHolidaysMap,
  isDateBefore,
} from "./date_utils";
import TabLoop from "./tab_loop";
import onClickOutside from "react-onclickoutside";

export { default as CalendarContainer } from "./calendar_container";

export { registerLocale, setDefaultLocale, getDefaultLocale };

const outsideClickIgnoreClass = "react-datepicker-ignore-onclickoutside";
const WrappedCalendar = onClickOutside(Calendar);

// Compares dates year+month combinations
function hasPreSelectionChanged(date1, date2) {
  if (date1 && date2) {
    return (
      getMonth(date1) !== getMonth(date2) || getYear(date1) !== getYear(date2)
    );
  }

  return date1 !== date2;
}

/**
 * General datepicker component.
 */
const INPUT_ERR_1 = "Date input not valid.";

export default class DatePicker extends React.Component {
  static get defaultProps() {
    return {
      allowSameDay: false,
      dateFormat: "MM/dd/yyyy",
      dateFormatCalendar: "LLLL yyyy",
      onChange() {},
      disabled: false,
      disabledKeyboardNavigation: false,
      dropdownMode: "scroll",
      onFocus() {},
      onBlur() {},
      onKeyDown() {},
      onInputClick() {},
      onSelect() {},
      onClickOutside() {},
      onMonthChange() {},
      onCalendarOpen() {},
      onCalendarClose() {},
      preventOpenOnFocus: false,
      onYearChange() {},
      onInputError() {},
      monthsShown: 1,
      readOnly: false,
      withPortal: false,
      selectsDisabledDaysInRange: false,
      shouldCloseOnSelect: true,
      showTimeSelect: false,
      showTimeInput: false,
      showPreviousMonths: false,
      showMonthYearPicker: false,
      showFullMonthYearPicker: false,
      showTwoColumnMonthYearPicker: false,
      showFourColumnMonthYearPicker: false,
      showYearPicker: false,
      showQuarterYearPicker: false,
      showWeekPicker: false,
      strictParsing: false,
      timeIntervals: 30,
      timeCaption: "Time",
      previousMonthAriaLabel: "Previous Month",
      previousMonthButtonLabel: "Previous Month",
      nextMonthAriaLabel: "Next Month",
      nextMonthButtonLabel: "Next Month",
      previousYearAriaLabel: "Previous Year",
      previousYearButtonLabel: "Previous Year",
      nextYearAriaLabel: "Next Year",
      nextYearButtonLabel: "Next Year",
      timeInputLabel: "Time",
      enableTabLoop: true,
      yearItemNumber: DEFAULT_YEAR_ITEM_NUMBER,
      focusSelectedMonth: false,
      showPopperArrow: true,
      excludeScrollbar: true,
      customTimeInput: null,
      calendarStartDay: undefined,
      toggleCalendarOnIconClick: false,
    };
  }

  static propTypes = {
    adjustDateOnChange: PropTypes.bool,
    allowSameDay: PropTypes.bool,
    ariaDescribedBy: PropTypes.string,
    ariaInvalid: PropTypes.string,
    ariaLabelClose: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    ariaRequired: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    calendarClassName: PropTypes.string,
    calendarContainer: PropTypes.func,
    children: PropTypes.node,
    chooseDayAriaLabelPrefix: PropTypes.string,
    closeOnScroll: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    className: PropTypes.string,
    customInput: PropTypes.element,
    customInputRef: PropTypes.string,
    calendarStartDay: PropTypes.number,
    // eslint-disable-next-line react/no-unused-prop-types
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    dateFormatCalendar: PropTypes.string,
    dayClassName: PropTypes.func,
    weekDayClassName: PropTypes.func,
    disabledDayAriaLabelPrefix: PropTypes.string,
    monthClassName: PropTypes.func,
    timeClassName: PropTypes.func,
    disabled: PropTypes.bool,
    disabledKeyboardNavigation: PropTypes.bool,
    dropdownMode: PropTypes.oneOf(["scroll", "select"]).isRequired,
    endDate: PropTypes.instanceOf(Date),
    excludeDates: PropTypes.array,
    excludeDateIntervals: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.instanceOf(Date),
        end: PropTypes.instanceOf(Date),
      }),
    ),
    filterDate: PropTypes.func,
    fixedHeight: PropTypes.bool,
    form: PropTypes.string,
    formatWeekNumber: PropTypes.func,
    highlightDates: PropTypes.array,
    holidays: PropTypes.array,
    id: PropTypes.string,
    includeDates: PropTypes.array,
    includeDateIntervals: PropTypes.array,
    includeTimes: PropTypes.array,
    injectTimes: PropTypes.array,
    inline: PropTypes.bool,
    isClearable: PropTypes.bool,
    toggleCalendarOnIconClick: PropTypes.func,
    showIcon: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    calendarIconClassname: PropTypes.string,
    locale: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ locale: PropTypes.object }),
    ]),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    monthsShown: PropTypes.number,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onWeekSelect: PropTypes.func,
    onClickOutside: PropTypes.func,
    onChangeRaw: PropTypes.func,
    onFocus: PropTypes.func,
    onInputClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onMonthChange: PropTypes.func,
    onYearChange: PropTypes.func,
    onInputError: PropTypes.func,
    open: PropTypes.bool,
    onCalendarOpen: PropTypes.func,
    onCalendarClose: PropTypes.func,
    openToDate: PropTypes.instanceOf(Date),
    peekNextMonth: PropTypes.bool,
    placeholderText: PropTypes.string,
    popperContainer: PropTypes.func,
    popperClassName: PropTypes.string, // <PopperComponent/> props
    popperModifiers: PropTypes.arrayOf(PropTypes.object), // <PopperComponent/> props
    popperPlacement: PropTypes.oneOf(popperPlacementPositions), // <PopperComponent/> props
    popperProps: PropTypes.object,
    preventOpenOnFocus: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    scrollableYearDropdown: PropTypes.bool,
    scrollableMonthYearDropdown: PropTypes.bool,
    selected: PropTypes.instanceOf(Date),
    selectsEnd: PropTypes.bool,
    selectsStart: PropTypes.bool,
    selectsRange: PropTypes.bool,
    selectsDisabledDaysInRange: PropTypes.bool,
    showMonthDropdown: PropTypes.bool,
    showPreviousMonths: PropTypes.bool,
    showMonthYearDropdown: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    showYearDropdown: PropTypes.bool,
    strictParsing: PropTypes.bool,
    forceShowMonthNavigation: PropTypes.bool,
    showDisabledMonthNavigation: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date),
    startOpen: PropTypes.bool,
    tabIndex: PropTypes.number,
    timeCaption: PropTypes.string,
    title: PropTypes.string,
    todayButton: PropTypes.node,
    useWeekdaysShort: PropTypes.bool,
    formatWeekDay: PropTypes.func,
    value: PropTypes.string,
    weekLabel: PropTypes.string,
    withPortal: PropTypes.bool,
    portalId: PropTypes.string,
    portalHost: PropTypes.instanceOf(ShadowRoot),
    yearItemNumber: PropTypes.number,
    yearDropdownItemNumber: PropTypes.number,
    shouldCloseOnSelect: PropTypes.bool,
    showTimeInput: PropTypes.bool,
    showMonthYearPicker: PropTypes.bool,
    showFullMonthYearPicker: PropTypes.bool,
    showTwoColumnMonthYearPicker: PropTypes.bool,
    showFourColumnMonthYearPicker: PropTypes.bool,
    showYearPicker: PropTypes.bool,
    showQuarterYearPicker: PropTypes.bool,
    showWeekPicker: PropTypes.bool,
    showDateSelect: PropTypes.bool,
    showTimeSelect: PropTypes.bool,
    showTimeSelectOnly: PropTypes.bool,
    timeFormat: PropTypes.string,
    timeIntervals: PropTypes.number,
    minTime: PropTypes.instanceOf(Date),
    maxTime: PropTypes.instanceOf(Date),
    excludeTimes: PropTypes.array,
    filterTime: PropTypes.func,
    useShortMonthInDropdown: PropTypes.bool,
    clearButtonTitle: PropTypes.string,
    clearButtonClassName: PropTypes.string,
    previousMonthAriaLabel: PropTypes.string,
    previousMonthButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    nextMonthAriaLabel: PropTypes.string,
    nextMonthButtonLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    previousYearAriaLabel: PropTypes.string,
    previousYearButtonLabel: PropTypes.string,
    nextYearAriaLabel: PropTypes.string,
    nextYearButtonLabel: PropTypes.string,
    timeInputLabel: PropTypes.string,
    renderCustomHeader: PropTypes.func,
    renderDayContents: PropTypes.func,
    renderMonthContent: PropTypes.func,
    renderQuarterContent: PropTypes.func,
    renderYearContent: PropTypes.func,
    wrapperClassName: PropTypes.string,
    focusSelectedMonth: PropTypes.bool,
    onDayMouseEnter: PropTypes.func,
    onMonthMouseLeave: PropTypes.func,
    onYearMouseEnter: PropTypes.func,
    onYearMouseLeave: PropTypes.func,
    showPopperArrow: PropTypes.bool,
    excludeScrollbar: PropTypes.bool,
    enableTabLoop: PropTypes.bool,
    customTimeInput: PropTypes.element,
    weekAriaLabelPrefix: PropTypes.string,
    monthAriaLabelPrefix: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = this.calcInitialState();
    this.preventFocusTimeout = null;
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.inline &&
      hasPreSelectionChanged(prevProps.selected, this.props.selected)
    ) {
      this.setPreSelection(this.props.selected);
    }
    if (
      this.state.monthSelectedIn !== undefined &&
      prevProps.monthsShown !== this.props.monthsShown
    ) {
      this.setState({ monthSelectedIn: 0 });
    }
    if (prevProps.highlightDates !== this.props.highlightDates) {
      this.setState({
        highlightDates: getHightLightDaysMap(this.props.highlightDates),
      });
    }
    if (
      !prevState.focused &&
      !isEqual(prevProps.selected, this.props.selected)
    ) {
      this.setState({ inputValue: null });
    }

    if (prevState.open !== this.state.open) {
      if (prevState.open === false && this.state.open === true) {
        this.props.onCalendarOpen();
      }

      if (prevState.open === true && this.state.open === false) {
        this.props.onCalendarClose();
      }
    }
  }

  componentWillUnmount() {
    this.clearPreventFocusTimeout();
    window.removeEventListener("scroll", this.onScroll, true);
  }

  getPreSelection = () =>
    this.props.openToDate
      ? this.props.openToDate
      : this.props.selectsEnd && this.props.startDate
      ? this.props.startDate
      : this.props.selectsStart && this.props.endDate
      ? this.props.endDate
      : newDate();

  // Convert the date from string format to standard Date format
  modifyHolidays = () =>
    this.props.holidays?.reduce((accumulator, holiday) => {
      const date = new Date(holiday.date);
      if (!isValid(date)) {
        return accumulator;
      }

      return [...accumulator, { ...holiday, date }];
    }, []);

  calcInitialState = () => {
    const defaultPreSelection = this.getPreSelection();
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const boundedPreSelection =
      minDate && isBefore(defaultPreSelection, startOfDay(minDate))
        ? minDate
        : maxDate && isAfter(defaultPreSelection, endOfDay(maxDate))
        ? maxDate
        : defaultPreSelection;
    return {
      open: this.props.startOpen || false,
      preventFocus: false,
      preSelection:
        (this.props.selectsRange
          ? this.props.startDate
          : this.props.selected) ?? boundedPreSelection,
      // transforming highlighted days (perhaps nested array)
      // to flat Map for faster access in day.jsx
      highlightDates: getHightLightDaysMap(this.props.highlightDates),
      focused: false,
      // used to focus day in inline version after month has changed, but not on
      // initial render
      shouldFocusDayInline: false,
      isRenderAriaLiveMessage: false,
    };
  };

  clearPreventFocusTimeout = () => {
    if (this.preventFocusTimeout) {
      clearTimeout(this.preventFocusTimeout);
    }
  };

  setFocus = () => {
    if (this.input && this.input.focus) {
      this.input.focus({ preventScroll: true });
    }
  };

  setBlur = () => {
    if (this.input && this.input.blur) {
      this.input.blur();
    }

    this.cancelFocusInput();
  };

  setOpen = (open, skipSetBlur = false) => {
    this.setState(
      {
        open: open,
        preSelection:
          open && this.state.open
            ? this.state.preSelection
            : this.calcInitialState().preSelection,
        lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE,
      },
      () => {
        if (!open) {
          this.setState(
            (prev) => ({
              focused: skipSetBlur ? prev.focused : false,
            }),
            () => {
              !skipSetBlur && this.setBlur();

              this.setState({ inputValue: null });
            },
          );
        }
      },
    );
  };
  inputOk = () => isDate(this.state.preSelection);

  isCalendarOpen = () =>
    this.props.open === undefined
      ? this.state.open && !this.props.disabled && !this.props.readOnly
      : this.props.open;

  handleFocus = (event) => {
    if (!this.state.preventFocus) {
      this.props.onFocus(event);
      if (!this.props.preventOpenOnFocus && !this.props.readOnly) {
        this.setOpen(true);
      }
    }
    this.setState({ focused: true });
  };

  sendFocusBackToInput = () => {
    // Clear previous timeout if it exists
    if (this.preventFocusTimeout) {
      this.clearPreventFocusTimeout();
    }

    // close the popper and refocus the input
    // stop the input from auto opening onFocus
    // setFocus to the input
    this.setState({ preventFocus: true }, () => {
      this.preventFocusTimeout = setTimeout(() => {
        this.setFocus();
        this.setState({ preventFocus: false });
      });
    });
  };

  cancelFocusInput = () => {
    clearTimeout(this.inputFocusTimeout);
    this.inputFocusTimeout = null;
  };

  deferFocusInput = () => {
    this.cancelFocusInput();
    this.inputFocusTimeout = setTimeout(() => this.setFocus(), 1);
  };

  handleDropdownFocus = () => {
    this.cancelFocusInput();
  };

  handleBlur = (event) => {
    if (!this.state.open || this.props.withPortal || this.props.showTimeInput) {
      this.props.onBlur(event);
    }

    this.setState({ focused: false });
  };

  handleCalendarClickOutside = (event) => {
    if (!this.props.inline) {
      this.setOpen(false);
    }
    this.props.onClickOutside(event);
    if (this.props.withPortal) {
      event.preventDefault();
    }
  };

  handleChange = (...allArgs) => {
    let event = allArgs[0];
    if (this.props.onChangeRaw) {
      this.props.onChangeRaw.apply(this, allArgs);
      if (
        typeof event.isDefaultPrevented !== "function" ||
        event.isDefaultPrevented()
      ) {
        return;
      }
    }
    this.setState({
      inputValue: event.target.value,
      lastPreSelectChange: PRESELECT_CHANGE_VIA_INPUT,
    });
    let date = parseDate(
      event.target.value,
      this.props.dateFormat,
      this.props.locale,
      this.props.strictParsing,
      this.props.minDate,
    );
    // Use date from `selected` prop when manipulating only time for input value
    if (
      this.props.showTimeSelectOnly &&
      this.props.selected &&
      date &&
      !isSameDay(date, this.props.selected)
    ) {
      date = set(this.props.selected, {
        hours: getHours(date),
        minutes: getMinutes(date),
        seconds: getSeconds(date),
      });
    }
    if (date || !event.target.value) {
      if (this.props.showWeekPicker) {
        date = getStartOfWeek(
          date,
          this.props.locale,
          this.props.calendarStartDay,
        );
      }
      this.setSelected(date, event, true);
    }
  };

  handleSelect = (date, event, monthSelectedIn) => {
    if (this.props.shouldCloseOnSelect && !this.props.showTimeSelect) {
      // Preventing onFocus event to fix issue
      // https://github.com/Hacker0x01/react-datepicker/issues/628
      this.sendFocusBackToInput();
    }
    if (this.props.onChangeRaw) {
      this.props.onChangeRaw(event);
    }
    if (this.props.showWeekPicker) {
      date = getStartOfWeek(
        date,
        this.props.locale,
        this.props.calendarStartDay,
      );
    }
    this.setSelected(date, event, false, monthSelectedIn);
    if (this.props.showDateSelect) {
      this.setState({ isRenderAriaLiveMessage: true });
    }
    if (!this.props.shouldCloseOnSelect || this.props.showTimeSelect) {
      this.setPreSelection(date);
    } else if (!this.props.inline) {
      if (!this.props.selectsRange) {
        this.setOpen(false);
      }

      const { startDate, endDate } = this.props;

      if (startDate && !endDate && !isDateBefore(date, startDate)) {
        this.setOpen(false);
      }
    }
  };

  setSelected = (date, event, keepInput, monthSelectedIn) => {
    let changedDate = date;

    if (this.props.showYearPicker) {
      if (
        changedDate !== null &&
        isYearDisabled(getYear(changedDate), this.props)
      ) {
        return;
      }
    } else if (this.props.showMonthYearPicker) {
      if (changedDate !== null && isMonthDisabled(changedDate, this.props)) {
        return;
      }
    } else {
      if (changedDate !== null && isDayDisabled(changedDate, this.props)) {
        return;
      }
    }

    const { onChange, selectsRange, startDate, endDate } = this.props;

    if (
      !isEqual(this.props.selected, changedDate) ||
      this.props.allowSameDay ||
      selectsRange
    ) {
      if (changedDate !== null) {
        if (
          this.props.selected &&
          (!keepInput ||
            (!this.props.showTimeSelect &&
              !this.props.showTimeSelectOnly &&
              !this.props.showTimeInput))
        ) {
          changedDate = setTime(changedDate, {
            hour: getHours(this.props.selected),
            minute: getMinutes(this.props.selected),
            second: getSeconds(this.props.selected),
          });
        }
        if (!this.props.inline) {
          this.setState({
            preSelection: changedDate,
          });
        }
        if (!this.props.focusSelectedMonth) {
          this.setState({ monthSelectedIn: monthSelectedIn });
        }
      }
      if (selectsRange) {
        const noRanges = !startDate && !endDate;
        const hasStartRange = startDate && !endDate;
        const isRangeFilled = startDate && endDate;
        if (noRanges) {
          onChange([changedDate, null], event);
        } else if (hasStartRange) {
          if (isDateBefore(changedDate, startDate)) {
            onChange([changedDate, null], event);
          } else {
            onChange([startDate, changedDate], event);
          }
        }
        if (isRangeFilled) {
          onChange([changedDate, null], event);
        }
      } else {
        onChange(changedDate, event);
      }
    }

    if (!keepInput) {
      this.props.onSelect(changedDate, event);
      this.setState({ inputValue: null });
    }
  };

  // When checking preSelection via min/maxDate, times need to be manipulated via startOfDay/endOfDay
  setPreSelection = (date) => {
    const hasMinDate = typeof this.props.minDate !== "undefined";
    const hasMaxDate = typeof this.props.maxDate !== "undefined";
    let isValidDateSelection = true;
    if (date) {
      if (this.props.showWeekPicker) {
        date = getStartOfWeek(
          date,
          this.props.locale,
          this.props.calendarStartDay,
        );
      }
      const dateStartOfDay = startOfDay(date);
      if (hasMinDate && hasMaxDate) {
        // isDayinRange uses startOfDay internally, so not necessary to manipulate times here
        isValidDateSelection = isDayInRange(
          date,
          this.props.minDate,
          this.props.maxDate,
        );
      } else if (hasMinDate) {
        const minDateStartOfDay = startOfDay(this.props.minDate);
        isValidDateSelection =
          isAfter(date, minDateStartOfDay) ||
          isEqual(dateStartOfDay, minDateStartOfDay);
      } else if (hasMaxDate) {
        const maxDateEndOfDay = endOfDay(this.props.maxDate);
        isValidDateSelection =
          isBefore(date, maxDateEndOfDay) ||
          isEqual(dateStartOfDay, maxDateEndOfDay);
      }
    }
    if (isValidDateSelection) {
      this.setState({
        preSelection: date,
      });
    }
  };

  toggleCalendar = () => {
    this.setOpen(!this.state.open);
  };

  handleTimeChange = (time) => {
    const selected = this.props.selected
      ? this.props.selected
      : this.getPreSelection();
    let changedDate = this.props.selected
      ? time
      : setTime(selected, {
          hour: getHours(time),
          minute: getMinutes(time),
        });

    this.setState({
      preSelection: changedDate,
    });

    this.props.onChange(changedDate);
    if (this.props.shouldCloseOnSelect) {
      this.sendFocusBackToInput();
      this.setOpen(false);
    }
    if (this.props.showTimeInput) {
      this.setOpen(true);
    }
    if (this.props.showTimeSelectOnly || this.props.showTimeSelect) {
      this.setState({ isRenderAriaLiveMessage: true });
    }
    this.setState({ inputValue: null });
  };

  onInputClick = () => {
    if (!this.props.disabled && !this.props.readOnly) {
      this.setOpen(true);
    }

    this.props.onInputClick();
  };

  onInputKeyDown = (event) => {
    this.props.onKeyDown(event);
    const eventKey = event.key;

    if (
      !this.state.open &&
      !this.props.inline &&
      !this.props.preventOpenOnFocus
    ) {
      if (
        eventKey === "ArrowDown" ||
        eventKey === "ArrowUp" ||
        eventKey === "Enter"
      ) {
        this.onInputClick();
      }
      return;
    }

    // if calendar is open, these keys will focus the selected item
    if (this.state.open) {
      if (eventKey === "ArrowDown" || eventKey === "ArrowUp") {
        event.preventDefault();
        const selectorString =
          this.props.showWeekPicker && this.props.showWeekNumbers
            ? '.react-datepicker__week-number[tabindex="0"]'
            : '.react-datepicker__day[tabindex="0"]';
        const selectedItem =
          this.calendar.componentNode &&
          this.calendar.componentNode.querySelector(selectorString);
        selectedItem && selectedItem.focus({ preventScroll: true });

        return;
      }

      const copy = newDate(this.state.preSelection);
      if (eventKey === "Enter") {
        event.preventDefault();
        if (
          this.inputOk() &&
          this.state.lastPreSelectChange === PRESELECT_CHANGE_VIA_NAVIGATE
        ) {
          this.handleSelect(copy, event);
          !this.props.shouldCloseOnSelect && this.setPreSelection(copy);
        } else {
          this.setOpen(false);
        }
      } else if (eventKey === "Escape") {
        event.preventDefault();
        this.sendFocusBackToInput();
        this.setOpen(false);
      } else if (eventKey === "Tab") {
        this.setOpen(false);
      }

      if (!this.inputOk()) {
        this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
      }
    }
  };

  onPortalKeyDown = (event) => {
    const eventKey = event.key;
    if (eventKey === "Escape") {
      event.preventDefault();
      this.setState(
        {
          preventFocus: true,
        },
        () => {
          this.setOpen(false);
          setTimeout(() => {
            this.setFocus();
            this.setState({ preventFocus: false });
          });
        },
      );
    }
  };

  // keyDown events passed down to day.jsx
  onDayKeyDown = (event) => {
    this.props.onKeyDown(event);
    const eventKey = event.key;

    const copy = newDate(this.state.preSelection);
    if (eventKey === "Enter") {
      event.preventDefault();
      this.handleSelect(copy, event);
      !this.props.shouldCloseOnSelect && this.setPreSelection(copy);
    } else if (eventKey === "Escape") {
      event.preventDefault();

      this.setOpen(false);
      if (!this.inputOk()) {
        this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
      }
    } else if (!this.props.disabledKeyboardNavigation) {
      let newSelection;
      switch (eventKey) {
        case "ArrowLeft":
          if (this.props.showWeekPicker) {
            newSelection = subWeeks(copy, 1);
          } else {
            newSelection = subDays(copy, 1);
          }
          break;
        case "ArrowRight":
          if (this.props.showWeekPicker) {
            newSelection = addWeeks(copy, 1);
          } else {
            newSelection = addDays(copy, 1);
          }
          break;
        case "ArrowUp":
          newSelection = subWeeks(copy, 1);
          break;
        case "ArrowDown":
          newSelection = addWeeks(copy, 1);
          break;
        case "PageUp":
          newSelection = subMonths(copy, 1);
          break;
        case "PageDown":
          newSelection = addMonths(copy, 1);
          break;
        case "Home":
          newSelection = getStartOfWeek(
            copy,
            this.props.locale,
            this.props.calendarStartDay,
          );
          break;
        case "End":
          newSelection = getEndOfWeek(copy);
          break;
        default:
          newSelection = null;
          break;
      }
      if (!newSelection) {
        if (this.props.onInputError) {
          this.props.onInputError({ code: 1, msg: INPUT_ERR_1 });
        }
        return;
      }
      event.preventDefault();
      this.setState({ lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE });
      if (this.props.adjustDateOnChange) {
        this.setSelected(newSelection);
      }
      this.setPreSelection(newSelection);
      // need to figure out whether month has changed to focus day in inline version
      if (this.props.inline) {
        const prevMonth = getMonth(copy);
        const newMonth = getMonth(newSelection);
        const prevYear = getYear(copy);
        const newYear = getYear(newSelection);

        if (prevMonth !== newMonth || prevYear !== newYear) {
          // month has changed
          this.setState({ shouldFocusDayInline: true });
        } else {
          // month hasn't changed
          this.setState({ shouldFocusDayInline: false });
        }
      }
    }
  };

  // handle generic key down events in the popper that do not adjust or select dates
  // ex: while focusing prev and next month buttons
  onPopperKeyDown = (event) => {
    const eventKey = event.key;
    if (eventKey === "Escape") {
      event.preventDefault();
      this.sendFocusBackToInput();
    }
  };

  onClearClick = (event) => {
    if (event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }

    this.sendFocusBackToInput();

    if (this.props.selectsRange) {
      this.props.onChange([null, null], event);
    } else {
      this.props.onChange(null, event);
    }
    this.setState({ inputValue: null });
  };

  clear = () => {
    this.onClearClick();
  };

  onScroll = (event) => {
    if (
      typeof this.props.closeOnScroll === "boolean" &&
      this.props.closeOnScroll
    ) {
      if (
        event.target === document ||
        event.target === document.documentElement ||
        event.target === document.body
      ) {
        this.setOpen(false);
      }
    } else if (typeof this.props.closeOnScroll === "function") {
      if (this.props.closeOnScroll(event)) {
        this.setOpen(false);
      }
    }
  };

  renderCalendar = () => {
    if (!this.props.inline && !this.isCalendarOpen()) {
      return null;
    }
    return (
      <WrappedCalendar
        ref={(elem) => {
          this.calendar = elem;
        }}
        locale={this.props.locale}
        calendarStartDay={this.props.calendarStartDay}
        chooseDayAriaLabelPrefix={this.props.chooseDayAriaLabelPrefix}
        disabledDayAriaLabelPrefix={this.props.disabledDayAriaLabelPrefix}
        weekAriaLabelPrefix={this.props.weekAriaLabelPrefix}
        monthAriaLabelPrefix={this.props.monthAriaLabelPrefix}
        adjustDateOnChange={this.props.adjustDateOnChange}
        setOpen={this.setOpen}
        shouldCloseOnSelect={this.props.shouldCloseOnSelect}
        dateFormat={this.props.dateFormatCalendar}
        useWeekdaysShort={this.props.useWeekdaysShort}
        formatWeekDay={this.props.formatWeekDay}
        dropdownMode={this.props.dropdownMode}
        selected={this.props.selected}
        preSelection={this.state.preSelection}
        onSelect={this.handleSelect}
        onWeekSelect={this.props.onWeekSelect}
        openToDate={this.props.openToDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selectsStart={this.props.selectsStart}
        selectsEnd={this.props.selectsEnd}
        selectsRange={this.props.selectsRange}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        excludeDateIntervals={this.props.excludeDateIntervals}
        filterDate={this.props.filterDate}
        onClickOutside={this.handleCalendarClickOutside}
        formatWeekNumber={this.props.formatWeekNumber}
        highlightDates={this.state.highlightDates}
        holidays={getHolidaysMap(this.modifyHolidays())}
        includeDates={this.props.includeDates}
        includeDateIntervals={this.props.includeDateIntervals}
        includeTimes={this.props.includeTimes}
        injectTimes={this.props.injectTimes}
        inline={this.props.inline}
        shouldFocusDayInline={this.state.shouldFocusDayInline}
        peekNextMonth={this.props.peekNextMonth}
        showMonthDropdown={this.props.showMonthDropdown}
        showPreviousMonths={this.props.showPreviousMonths}
        useShortMonthInDropdown={this.props.useShortMonthInDropdown}
        showMonthYearDropdown={this.props.showMonthYearDropdown}
        showWeekNumbers={this.props.showWeekNumbers}
        showYearDropdown={this.props.showYearDropdown}
        withPortal={this.props.withPortal}
        forceShowMonthNavigation={this.props.forceShowMonthNavigation}
        showDisabledMonthNavigation={this.props.showDisabledMonthNavigation}
        scrollableYearDropdown={this.props.scrollableYearDropdown}
        scrollableMonthYearDropdown={this.props.scrollableMonthYearDropdown}
        todayButton={this.props.todayButton}
        weekLabel={this.props.weekLabel}
        outsideClickIgnoreClass={outsideClickIgnoreClass}
        fixedHeight={this.props.fixedHeight}
        monthsShown={this.props.monthsShown}
        monthSelectedIn={this.state.monthSelectedIn}
        onDropdownFocus={this.handleDropdownFocus}
        onMonthChange={this.props.onMonthChange}
        onYearChange={this.props.onYearChange}
        dayClassName={this.props.dayClassName}
        weekDayClassName={this.props.weekDayClassName}
        monthClassName={this.props.monthClassName}
        timeClassName={this.props.timeClassName}
        showDateSelect={this.props.showDateSelect}
        showTimeSelect={this.props.showTimeSelect}
        showTimeSelectOnly={this.props.showTimeSelectOnly}
        onTimeChange={this.handleTimeChange}
        timeFormat={this.props.timeFormat}
        timeIntervals={this.props.timeIntervals}
        minTime={this.props.minTime}
        maxTime={this.props.maxTime}
        excludeTimes={this.props.excludeTimes}
        filterTime={this.props.filterTime}
        timeCaption={this.props.timeCaption}
        className={this.props.calendarClassName}
        container={this.props.calendarContainer}
        yearItemNumber={this.props.yearItemNumber}
        yearDropdownItemNumber={this.props.yearDropdownItemNumber}
        previousMonthAriaLabel={this.props.previousMonthAriaLabel}
        previousMonthButtonLabel={this.props.previousMonthButtonLabel}
        nextMonthAriaLabel={this.props.nextMonthAriaLabel}
        nextMonthButtonLabel={this.props.nextMonthButtonLabel}
        previousYearAriaLabel={this.props.previousYearAriaLabel}
        previousYearButtonLabel={this.props.previousYearButtonLabel}
        nextYearAriaLabel={this.props.nextYearAriaLabel}
        nextYearButtonLabel={this.props.nextYearButtonLabel}
        timeInputLabel={this.props.timeInputLabel}
        disabledKeyboardNavigation={this.props.disabledKeyboardNavigation}
        renderCustomHeader={this.props.renderCustomHeader}
        popperProps={this.props.popperProps}
        renderDayContents={this.props.renderDayContents}
        renderMonthContent={this.props.renderMonthContent}
        renderQuarterContent={this.props.renderQuarterContent}
        renderYearContent={this.props.renderYearContent}
        onDayMouseEnter={this.props.onDayMouseEnter}
        onMonthMouseLeave={this.props.onMonthMouseLeave}
        onYearMouseEnter={this.props.onYearMouseEnter}
        onYearMouseLeave={this.props.onYearMouseLeave}
        selectsDisabledDaysInRange={this.props.selectsDisabledDaysInRange}
        showTimeInput={this.props.showTimeInput}
        showMonthYearPicker={this.props.showMonthYearPicker}
        showFullMonthYearPicker={this.props.showFullMonthYearPicker}
        showTwoColumnMonthYearPicker={this.props.showTwoColumnMonthYearPicker}
        showFourColumnMonthYearPicker={this.props.showFourColumnMonthYearPicker}
        showYearPicker={this.props.showYearPicker}
        showQuarterYearPicker={this.props.showQuarterYearPicker}
        showWeekPicker={this.props.showWeekPicker}
        excludeScrollbar={this.props.excludeScrollbar}
        handleOnKeyDown={this.props.onKeyDown}
        handleOnDayKeyDown={this.onDayKeyDown}
        isInputFocused={this.state.focused}
        customTimeInput={this.props.customTimeInput}
        setPreSelection={this.setPreSelection}
      >
        {this.props.children}
      </WrappedCalendar>
    );
  };

  renderAriaLiveRegion = () => {
    const { dateFormat, locale } = this.props;
    const isContainsTime =
      this.props.showTimeInput || this.props.showTimeSelect;
    const longDateFormat = isContainsTime ? "PPPPp" : "PPPP";
    let ariaLiveMessage;

    if (this.props.selectsRange) {
      ariaLiveMessage = `Selected start date: ${safeDateFormat(
        this.props.startDate,
        {
          dateFormat: longDateFormat,
          locale,
        },
      )}. ${
        this.props.endDate
          ? "End date: " +
            safeDateFormat(this.props.endDate, {
              dateFormat: longDateFormat,
              locale,
            })
          : ""
      }`;
    } else {
      if (this.props.showTimeSelectOnly) {
        ariaLiveMessage = `Selected time: ${safeDateFormat(
          this.props.selected,
          { dateFormat, locale },
        )}`;
      } else if (this.props.showYearPicker) {
        ariaLiveMessage = `Selected year: ${safeDateFormat(
          this.props.selected,
          { dateFormat: "yyyy", locale },
        )}`;
      } else if (this.props.showMonthYearPicker) {
        ariaLiveMessage = `Selected month: ${safeDateFormat(
          this.props.selected,
          { dateFormat: "MMMM yyyy", locale },
        )}`;
      } else if (this.props.showQuarterYearPicker) {
        ariaLiveMessage = `Selected quarter: ${safeDateFormat(
          this.props.selected,
          {
            dateFormat: "yyyy, QQQ",
            locale,
          },
        )}`;
      } else {
        ariaLiveMessage = `Selected date: ${safeDateFormat(
          this.props.selected,
          {
            dateFormat: longDateFormat,
            locale,
          },
        )}`;
      }
    }

    return (
      <span
        role="alert"
        aria-live="polite"
        className="react-datepicker__aria-live"
      >
        {ariaLiveMessage}
      </span>
    );
  };

  renderDateInput = () => {
    const className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: this.state.open,
    });

    const customInput = this.props.customInput || <input type="text" />;
    const customInputRef = this.props.customInputRef || "ref";
    const inputValue =
      typeof this.props.value === "string"
        ? this.props.value
        : typeof this.state.inputValue === "string"
        ? this.state.inputValue
        : this.props.selectsRange
        ? safeDateRangeFormat(
            this.props.startDate,
            this.props.endDate,
            this.props,
          )
        : safeDateFormat(this.props.selected, this.props);

    return React.cloneElement(customInput, {
      [customInputRef]: (input) => {
        this.input = input;
      },
      value: inputValue,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      onKeyDown: this.onInputKeyDown,
      id: this.props.id,
      name: this.props.name,
      form: this.props.form,
      autoFocus: this.props.autoFocus,
      placeholder: this.props.placeholderText,
      disabled: this.props.disabled,
      autoComplete: this.props.autoComplete,
      className: classnames(customInput.props.className, className),
      title: this.props.title,
      readOnly: this.props.readOnly,
      required: this.props.required,
      tabIndex: this.props.tabIndex,
      "aria-describedby": this.props.ariaDescribedBy,
      "aria-invalid": this.props.ariaInvalid,
      "aria-labelledby": this.props.ariaLabelledBy,
      "aria-required": this.props.ariaRequired,
    });
  };

  renderClearButton = () => {
    const {
      isClearable,
      disabled,
      selected,
      startDate,
      endDate,
      clearButtonTitle,
      clearButtonClassName = "",
      ariaLabelClose = "Close",
    } = this.props;
    if (
      isClearable &&
      (selected != null || startDate != null || endDate != null)
    ) {
      return (
        <button
          type="button"
          className={classnames(
            "react-datepicker__close-icon",
            clearButtonClassName,
            { "react-datepicker__close-icon--disabled": disabled },
          )}
          disabled={disabled}
          aria-label={ariaLabelClose}
          onClick={this.onClearClick}
          title={clearButtonTitle}
          tabIndex={-1}
        />
      );
    } else {
      return null;
    }
  };

  renderInputContainer() {
    const { showIcon, icon, calendarIconClassname, toggleCalendarOnIconClick } =
      this.props;
    const { open } = this.state;

    return (
      <div
        className={`react-datepicker__input-container${
          showIcon ? " react-datepicker__view-calendar-icon" : ""
        }`}
      >
        {showIcon && (
          <CalendarIcon
            icon={icon}
            className={`${calendarIconClassname} ${
              open && "react-datepicker-ignore-onclickoutside"
            }`}
            {...(toggleCalendarOnIconClick
              ? {
                  onClick: this.toggleCalendar,
                }
              : null)}
          />
        )}
        {this.state.isRenderAriaLiveMessage && this.renderAriaLiveRegion()}
        {this.renderDateInput()}
        {this.renderClearButton()}
      </div>
    );
  }

  render() {
    const calendar = this.renderCalendar();

    if (this.props.inline) return calendar;

    if (this.props.withPortal) {
      let portalContainer = this.state.open ? (
        <TabLoop enableTabLoop={this.props.enableTabLoop}>
          <div
            className="react-datepicker__portal"
            tabIndex={-1}
            onKeyDown={this.onPortalKeyDown}
          >
            {calendar}
          </div>
        </TabLoop>
      ) : null;

      if (this.state.open && this.props.portalId) {
        portalContainer = (
          <Portal
            portalId={this.props.portalId}
            portalHost={this.props.portalHost}
          >
            {portalContainer}
          </Portal>
        );
      }

      return (
        <div>
          {this.renderInputContainer()}
          {portalContainer}
        </div>
      );
    }

    return (
      <PopperComponent
        className={this.props.popperClassName}
        wrapperClassName={this.props.wrapperClassName}
        hidePopper={!this.isCalendarOpen()}
        portalId={this.props.portalId}
        portalHost={this.props.portalHost}
        popperModifiers={this.props.popperModifiers}
        targetComponent={this.renderInputContainer()}
        popperContainer={this.props.popperContainer}
        popperComponent={calendar}
        popperPlacement={this.props.popperPlacement}
        popperProps={this.props.popperProps}
        popperOnKeyDown={this.onPopperKeyDown}
        enableTabLoop={this.props.enableTabLoop}
        showArrow={this.props.showPopperArrow}
      />
    );
  }
}

const PRESELECT_CHANGE_VIA_INPUT = "input";
const PRESELECT_CHANGE_VIA_NAVIGATE = "navigate";
