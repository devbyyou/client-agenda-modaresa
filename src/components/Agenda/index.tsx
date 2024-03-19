import React, { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './index.scss';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addAppointments, editAppointments, getAllAppointments, toggleIsOpen } from '../../store/reducers/appointments';
import { addMinutes, format } from 'date-fns';
import { getBuyers } from '../../store/reducers/buyers';
import { getVendors } from '../../store/reducers/vendors';
import { getUsers } from '../../store/reducers/users';
import { NavLink, Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Liste from '../Liste';
import { FC } from 'react';
// import FullCalendar, { EventApi, DateSelectArg } from '@fullcalendar/react';

function Agenda() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector((state) => state.appointments.isOpen);
  const credential = useAppSelector((state) => state.appointments.credentials);
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const buyers = useAppSelector((state) => state.buyers.buyers);
  const vendors = useAppSelector((state) => state.vendors.vendors);
  const users = useAppSelector((state) => state.users.users);

  if (!appointments) {
    return <div>Loading...</div>;
  }
  useEffect(() => {

    dispatch(getAllAppointments())
    dispatch(getBuyers())
    dispatch(getVendors())
    dispatch(getUsers())
  }, [dispatch])

  // const {
  //   appointmentType,
  //   date,
  //   description,
  //   duration,
  //   participantType,
  //   time, } = credential

  const calendarEvents = appointments.map(appointment => ({
    title: appointment.title,
    start: appointment.start_time,
    end: appointment.end_time,
  }));


  const [formData, setFormData] = useState({
    description: '',
    date: '',
    time: '',
    duration: '30',
    participantType: '',
    appointmentType: '',
    name: '',
    company: '',
    location: '',
  });




  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await dispatch(addAppointments(
      {
        appointmentType: formData.appointmentType,
        date: formData.date,
        description: formData.description,
        duration: formData.duration,
        participantType: formData.participantType,
        time: formData.time,
        name: formData.name,
        company: formData.company,
        location: formData.location,
      }
    ))
    await dispatch(getAllAppointments())
    dispatch(toggleIsOpen());

  }

  const handleDateSelect = (selectInfo: any) => {
    setFormData({
      ...formData,
      date: selectInfo.startStr.substring(0, 10),
    });
  };

  const toggleModal = cn('modal', {
    'toggleModal': !isOpen,
  });

  function handleCloseModal() {
    // dispatch(toggleIsOpen());
  }

  const handleChangeInput = (field: string) => (event: ChangeEvent<HTMLInputElement> | any) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleClickedRdv = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    dispatch(toggleIsOpen());
  }

  const handleManageAppointments = (event: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    navigate('/liste')
  }
  function handleClickedClose() {
    dispatch(toggleIsOpen());
  }
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Esc') {
      dispatch(toggleIsOpen());
    }
  }
  interface Props {
    calendarEvents: any[]; // Définir le type des événements du calendrier
    handleDateSelect: (selectInfo: any) => void; // Définir le type de la fonction handleDateSelect
    handleClickedRdv: () => void; // Définir le type de la fonction handleClickedRdv
    handleManageAppointments: () => void; // Définir le type de la fonction handleManageAppointments
  }

  
    return (
      <div>
        {/* Modal */}
        <div onClick={handleCloseModal} className={toggleModal}>
          <div className='modal-content'>
            <div onClick={handleClickedClose} onKeyDown={handleKeyDown} role="button" tabIndex={0} className="modal-header">
              <button type="button" className="close " data-dismiss="modal" aria-hidden="true">
                x
              </button>
            </div>
            <h2>Choose a new Appointment</h2>
            <form onSubmit={handleSubmitForm} action="" className="my-form">
              {/* Form Content */}
              <div className="content-content">
                {/* Appointment Details */}
                <div className="content">
                  <div className="newrdvField">
                    <label>
                      Description
                      <input
                        placeholder="Please write a note here"
                        name="description"
                        onChange={handleChangeInput('description')}
                        type="text"
                      />
                    </label>
                    <label>
                      Date
                      <input name="date" onChange={handleChangeInput('date')} value={formData.date} type="date" />
                    </label>
                    <label>
                      Time
                      <input name="time" onChange={handleChangeInput('time')} value={formData.time} type="time" />
                    </label>
                    <label>
                      Duration
                      <select name="duration" onChange={handleChangeInput('duration')} value={formData.duration}>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1 hour 30 minutes</option>
                      </select>
                    </label>
                  </div>
                </div>
                {/* User Type */}
                <div className="content-right">
                  <div>
                    <p>You are ?</p>
                    <div>
                      {users.map((user, index) => (
                        <label key={index}>
                          {` A ${user.name}`}
                          <input
                            type='radio'
                            name="participantType"
                            value={user.name}
                            onChange={handleChangeInput('participantType')}
                          />
                          {user.name === 'vendors' && (
                            <input
                              placeholder="Name here"
                              name="name"
                              onChange={handleChangeInput('name')}
                              type="text"
                              hidden={formData.participantType !== 'vendors'}
                            />
                          )}
                          {user.name === 'buyers' && (
                            <>
                              <input
                                placeholder="Name here"
                                name="name"
                                onChange={handleChangeInput('name')}
                                type="text"
                                hidden={formData.participantType !== 'buyers'}
                              />
                              <input
                                placeholder="Company here"
                                name="company"
                                onChange={handleChangeInput('company')}
                                type="text"
                                hidden={formData.participantType !== 'buyers'}
                              />
                            </>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Appointment Type */}
                  <div>
                    <p>Type ?</p>
                    <div>
                      <label>
                        Physical
                        <input
                          type='radio'
                          name="appointmentType"
                          value="physical"
                          onChange={handleChangeInput('appointmentType')}
                        />
                        <input
                          placeholder='Please write a location'
                          type="text"
                          name="location"
                          onChange={handleChangeInput('location')}
                          hidden={formData.appointmentType !== 'physical'}

                        />
                      </label>
                      <label>
                        Virtual
                        <input
                          type='radio'
                          name="appointmentType"
                          value="virtual"
                          onChange={handleChangeInput('appointmentType')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className='buttondiv'>
                <button type="submit">Valider</button>
              </div>
            </form>
          </div>
        </div>
        {/* FullCalendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'myCustomButton,manageAppointmentsButton, dayGridMonth,timeGridWeek,timeGridDay',
          }}
          customButtons={{
            myCustomButton: {
              text: 'Make an appointment',
              click: handleClickedRdv as any,
            },
            manageAppointmentsButton: {
              text: 'Manage yours appointments',
              click: handleManageAppointments as any,
            },
          }}
          height="90vh"
          events={calendarEvents}
          selectable={true}
          select={handleDateSelect}
        />

      </div>
    );
  };


  export default Agenda;
