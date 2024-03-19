/* eslint-disable no-console */
import { createAction, createReducer } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { createAppAsyncThunk } from '../../utils/redux';
interface AppointmentsState {
  loading: boolean,
  error: null,
  isOpen: boolean,
  appointments: {
    title: string,
    start_time: string,
    end_time: string,
    customer: string
    type: string
    location: string
    appointment_id: string
  }[]
  credentials: {
    description: string
    date: string
    time: string
    duration: string
    participantType: string
    appointmentType: string
  }
}
const initialState: AppointmentsState = {
  loading: false,
  error: null,
  isOpen: true,
  appointments: [{
    title: '',
    start_time: '',
    end_time: '',
    customer: '',
    type: '',
    location: '',
    appointment_id: '',
  }],
  credentials: {
    description: '',
    date: '',
    time: '',
    duration: '',
    participantType: '',
    appointmentType: '',
  }
};
export const toggleIsOpen = createAction('appointments/TOGGLE_IS_OPEN');

export const getAllAppointments = createAppAsyncThunk(
  'appointments/GET_ALL_APPOINTMENTS',
  async () => {
    try {
      const response = await axiosInstance.get('/appointments');

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

export const addAppointments = createAppAsyncThunk(
  'appointments/ADD_APPOINTMENTS',
  async ({
    appointmentType,
    date,
    description,
    duration,
    participantType,
    time,
    name,
    company,
    location,
  }: {
    appointmentType: string,
    date: string,
    description: string,
    duration: string,
    participantType: string,
    time: string,
    name: string,
    company: string,
    location: string,
  }, thunkAPI) => {
    // const state = thunkAPI.getState();
    // const {
    // appointmentType,
    // date,
    // description,
    // duration,
    // participantType,
    // time,
    // } = state.appointments.credentials;
    const response = await axiosInstance.post(`/appointments`, {
      appointmentType,
      date,
      description,
      duration,
      participantType,
      time,
      name,
      location,
      company,
    });
    return response.data;
  },
);

export const deleteAppointments = createAppAsyncThunk(
  'appointments/DELETE_APPOINTEMENT',
  async ({ appointment_id }: { appointment_id: string | undefined }) => {
    const { data } = await axiosInstance.delete(`/appointments/${appointment_id}`);
    return data;
  },
);
export const editAppointments = createAppAsyncThunk(
  'appointments/UPDATE_APPOINTMENTS',
  async ({
    id,
    appointmentType,
    date,
    description,
    duration,
    participantType,
    time,
    name,
    company,
    location, }: {
      id: string,
      appointmentType: string,
      date: string,
      description: string,
      duration: string,
      participantType: string,
      time: string,
      name: string,
      company: string,
      location: string,
    }, thunkAPI) => {

    const { data } = await axiosInstance.put(`/appointments/${id}`, {
      id,
      appointmentType,
      date,
      description,
      duration,
      participantType,
      time,
      name,
      company,
      location,
    });
    return data;
  },
);
// export const changeCredentialsField = createAction<{
//   field: keyof initialState['credentials'];
//   value: string
// }>('appointments/CHANGE_CREDENTIALS_FIELD');

const AppointmentsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addAppointments.pending, (state) => {
      alert("Loading... Submission in progress Please wait.")
    })
    .addCase(addAppointments.fulfilled, (state) => {
      alert('Bravo ! Vous avez bien ajouter un rendez-vous.')
    })
    .addCase(getAllAppointments.fulfilled, (state, action) => {
      state.appointments = action.payload;
    })
    .addCase(addAppointments.rejected, (state) => {
      alert('A problem has occurred, please try again later.')
    })
    .addCase(toggleIsOpen, (state) => {
      state.isOpen = !state.isOpen;
    })
    // .addCase(changeCredentialsField, (state, action) => {
    //   const { field, value } = action.payload;
    //   // state.error = action.error.message;
    //   state.credentials[field] = value;
    // })
    .addCase(deleteAppointments.fulfilled, (state, action) => {
      // state.loading = false;
      state.appointments = action.payload;
      alert('Suppression réussi');
    })
    .addCase(deleteAppointments.pending, (state, action) => {
      // state.loading = false;
      state.appointments = action.payload as any;
      alert('Loading... Submission in progress Please wait.');
    })
    .addCase(editAppointments.fulfilled, (state, action) => {
      state.appointments = action.payload;
      // state.user.nom = action.payload;
      alert('Mise à jour réussi');

    });
});

export default AppointmentsReducer;
