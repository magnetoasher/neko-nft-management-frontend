import React from 'react';
import Draggable from 'react-draggable';
import { TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';
import 'antd/dist/antd.css';
import { toast } from 'react-toastify';
import moment from 'moment';

import { closeEventCreatorWindow } from '../../../redux/actions/actionsUI';
import { addNewEventToList } from '../../../redux/actions/actionsCalendar';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../../helpers/local-storage-utils';
import { selectCurrentSelectedEventId } from '../../../redux/selectors';
import { useInput } from '../../../hooks/useInput';
import { useTextArea } from '../../../hooks/useTextArea';
import { useTimePicker } from '../../../hooks/useTimePicker';

const EventCreatorDialog = () => {
  const dispatch = useDispatch();
  const eventId = useSelector(selectCurrentSelectedEventId);
  const timePickerFromObj = useTimePicker('', true);
  const timePickerToObj = useTimePicker('', true);
  const inputValue = useInput('', true);
  const textAreaValue = useTextArea('', true);

  const storageValue = getLocalStorageData('events') || [];

  const generatedUniqueEventId = uniqid();

  const hadleFormData = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    let f: any = moment(timePickerFromObj.timeOption, 'HH:mm');
    let t: any = moment(timePickerToObj.timeOption, 'HH:mm');
    if (f._d > t._d) {
      toast.error('Date From should be greater than date To!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      return;
    }

    const payload = {
      uniqueEventId: generatedUniqueEventId,
      date: eventId,
      title: inputValue.value!,
      timeFrom: timePickerFromObj.timeOption,
      timeTo: timePickerToObj.timeOption,
      description: textAreaValue.value!,
    };
    dispatch(addNewEventToList(payload));

    setLocalStorageData('events', JSON.stringify([...storageValue, payload]));
    toast.success('Event succefully created!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    setTimeout(() => dispatch(closeEventCreatorWindow()), 10);
  };

  return (
    <Draggable>
      <form
        onSubmit={hadleFormData}
        className="absolute bottom-[5vh] left-[45vw] flex flex-col w-[400px] p-[50px] min-h-[200px] box-border bg-[#f3f0f0] rounded-[10px]"
      >
        <span className="event-data font-semibold text-2xl text-center">
          {eventId}
        </span>
        <input
          className="border-none outline-none p-2.5 text-xl focus:border-solid focus:border-b-2 focus:border-[#2c7eea]"
          placeholder="Title"
          required
          {...inputValue}
        />
        {inputValue.error && (
          <span className="text-red-500 my-2">{inputValue.error}</span>
        )}

        <div className="selectTime-wrapper flex justify-between my-5">
          <TimePicker format="HH:mm" minuteStep={15} {...timePickerFromObj} />
          <TimePicker format="HH:mm" {...timePickerToObj} minuteStep={15} />
        </div>
        <textarea
          className="mx-0 p-2.5 border-none outline-none"
          placeholder="Description"
          cols={30}
          rows={10}
          required
          {...textAreaValue}
        ></textarea>
        {textAreaValue.error && (
          <span className="text-red-500 my-2">{textAreaValue.error}</span>
        )}

        <button
          type="submit"
          className="w-[150px] h-[50px] mt-5 text-xl font-medium bg-[#2c7eea] border-none outline-none text-white self-center cursor-pointer"
        >
          Save task
        </button>

        <button
          type="submit"
          className="absolute w-[30px] h-[30px] top-2.5 right-2.5 p-2.5 mt-5 border-none before:content[''] before:block before:relative before:w-[25px] before:h-[2px] before:bg-black before:rotate-[-45deg] before:right-2.5 after:content-[''] after:block after:relative after:right-2.5 after:bottom-[2px] after:w-[25px] after:h-[2px] after:bg-black after:rotate-45"
          onClick={() => dispatch(closeEventCreatorWindow())}
        ></button>
      </form>
    </Draggable>
  );
};

export default EventCreatorDialog;
