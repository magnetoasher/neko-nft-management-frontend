import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { DayType } from '../../../ts-generalTypes/propTypes';
import { MonthCalendarEvent } from './MonthCalendarEvent/MonthCalendarEvent';
import {
  openEventCreatorWindow,
  changeCalendarView,
} from '../../../redux/actions/actionsUI';
import {
  setSelectedEventId,
  setSelectedDate,
} from '../../../redux/actions/actionsCalendar';
import { CalendarEventData } from '../../../ts-generalTypes/InitialStateInterfaces';
import { setListOfEventsInStorage } from '../../../redux/selectors';

type MonthCalendarCellProps = Pick<
  DayType,
  'id' | 'day' | 'isCurrentMonth' | 'isToday' | 'size'
> & {
  children?: JSX.Element;
};

export const MonthCalendarCell: React.FC<MonthCalendarCellProps> = (props) => {
  const { id, day, isCurrentMonth, isToday, size } = props;
  const dispatch = useDispatch();
  const listOfEventsInStorage = useSelector(setListOfEventsInStorage)! || [];
  const listOfEventsThisDay = listOfEventsInStorage.filter(
    (item: CalendarEventData) => item.date === id
  );
  const clickOnCellHandler = (event: React.MouseEvent) => {
    const currentTarget = event.target as HTMLDivElement;
    if (currentTarget.className.includes('badge')) {
      dispatch(changeCalendarView('day'));
      dispatch(setSelectedDate(id));
    }

    if (!currentTarget.className.includes('day-cell')) {
      return;
    } else {
      dispatch(setSelectedEventId(id));
      dispatch(openEventCreatorWindow());
    }
  };
  let unniqueKey = uniqid();

  return (
    <div
      onClick={clickOnCellHandler}
      key={unniqueKey}
      className={
        size === 'small'
          ? 'day-cell flex-1 w-1/4 items-stretch border-solid border-[1px] border-[#cccccc] overflow-auto font-medium cursor-pointer text-center hover:bg-[#f1f5f6] border-none w-[34px] h-[34px] overflow-hidden font-normal'
          : !isCurrentMonth
          ? 'day-cell flex-1 w-1/4 items-stretch border-solid border-[1px] border-[#cccccc] overflow-auto font-medium cursor-pointer text-center hover:bg-[#f1f5f6] text-[#b9b7b7]'
          : 'day-cell flex-1 w-1/4 items-stretch border-solid border-[1px] border-[#cccccc] overflow-auto font-medium cursor-pointer text-center hover:bg-[#f1f5f6]'
      }
    >
      <div
        className="badge inline-block py-[5px] px-[8px] text-black rounded-[50%] hover:bg-[#f1f5f6]"
        style={{
          backgroundColor: isToday ? '#000' : '',
          color: isToday ? '#fff' : '#000',
        }}
      >
        {day}
      </div>
      {size === 'small' && listOfEventsThisDay.length > 0 ? (
        <div className="w-[auto] h-[2px] bg-[#1192f6] my-0 mx-auto"></div>
      ) : (
        listOfEventsThisDay.map((event: CalendarEventData) => (
          <MonthCalendarEvent key={unniqueKey} events={event} size={size} />
        ))
      )}
    </div>
  );
};
