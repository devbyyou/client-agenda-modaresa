import React, { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from 'react'
import './index.scss';
import { FaRegCalendarCheck } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { deleteAppointments, editAppointments, getAllAppointments, toggleIsOpen } from '../../store/reducers/appointments';
import { getBuyers } from '../../store/reducers/buyers';
import { getVendors } from '../../store/reducers/vendors';
import { getUsers } from '../../store/reducers/users';
import { addMinutes } from 'date-fns';
import cn from 'classnames';
import { TfiClose } from "react-icons/tfi";

const Liste = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isOpen = useAppSelector((state) => state.appointments.isOpen);
    const credential = useAppSelector((state) => state.appointments.credentials);
    const appointments = useAppSelector((state) => state.appointments.appointments);
    const buyers = useAppSelector((state) => state.buyers.buyers);
    const vendors = useAppSelector((state) => state.vendors.vendors);
    const users = useAppSelector((state) => state.users.users);
    const [appointmentId, setAppointmentId] = useState<string>('');
    // console.log("appointmentId is >", appointmentId);

    useEffect(() => {
        dispatch(getAllAppointments())
        dispatch(getBuyers())
        dispatch(getVendors())
        dispatch(getUsers())
    }, [dispatch])

    console.log(appointments);

    const handleEditAppointment = (appointment_id: string) => {


        dispatch(toggleIsOpen());
        setAppointmentId(appointment_id)
    }

    const handleDeleteAppointment = async (appointment_id: string) => {
        navigate('/')
        window.location.reload()
        await dispatch(deleteAppointments({ appointment_id }))
        await dispatch(getAllAppointments())

    }
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
        // const newEvent = {
        //     title: formData.description,
        //     start: `${formData.date}T${formData.time}`,
        //     end: `${formData.date}T${addMinutes(formData.time, parseInt(formData.duration))}`,
        // };
        // setEvents((prevEvents) => [...prevEvents, newEvent]);

        await dispatch(editAppointments(
            {
                id: appointmentId,
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
        dispatch(toggleIsOpen());
    }

    const [events, setEvents] = useState([]);

    const handleDateSelect = (selectInfo : any) => {
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
    function handleClickedClose() {
        dispatch(toggleIsOpen());
    }
    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
        if (event.key === 'Esc') {
            dispatch(toggleIsOpen());
        }
    }
    return (
        <div className="content-liste">
            {/* Modal */}
            <div onClick={handleCloseModal} className={toggleModal}>
                <div className='modal-content'>
                    <div onClick={handleClickedClose} onKeyDown={handleKeyDown} role="button" tabIndex={0} className="modal-header">
                        <button type="button" className="close " data-dismiss="modal" aria-hidden="true">
                            x
                        </button>
                    </div>
                    <h2>Modify yours Appointment</h2>
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

            <div className="upcoming-appointments card">
                <div className="card-header">
                    <h1>My appointments</h1>
                </div>
                <div className="card-body">
                    {appointments.map((appointment, index) => (
                        <div key={index} className="appointment">
                            <img className="image" src="https://img.freepik.com/psd-gratuit/icone-3d-pour-application-medias-sociaux_23-2150049569.jpg?t=st=1710756791~exp=1710757391~hmac=5205c837a67397ca100a9b00c79457067da7cdac9446d35efb2475c8858fa7cf" alt="Dr. Anthony Wagner" />
                            <span className="name">{appointment.title}</span>
                            <span className="title">Identity : {appointment.customer}</span>
                            <span className="title">Type : {appointment.type}</span>
                            <span className="title">Location : {appointment.location}</span>
                            <span className="date">
                                <FaRegCalendarCheck className="fa-calendar" />
                                {new Date(appointment.start_time).toLocaleDateString()}
                            </span>
                            <span className="time">
                                <GoClock className="fa-clock" />
                                {new Date(appointment.start_time).toLocaleTimeString()}
                                {" -- "}
                                {new Date(appointment.end_time).toLocaleTimeString()}
                            </span>
                            <span
                                className="cercle check"
                                onClick={() => handleEditAppointment(appointment.appointment_id)}>
                                <FaRegEdit className="fa-check-circle" />
                            </span>
                            <span
                                className="cercle times delete"
                                onClick={() => handleDeleteAppointment(appointment.appointment_id)}>
                                <RiDeleteBin5Line className="delete fa-times-circle" />
                            </span>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Liste