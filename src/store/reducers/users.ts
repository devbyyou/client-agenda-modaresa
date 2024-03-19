/* eslint-disable no-console */
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { createAppAsyncThunk } from '../../utils/redux';
interface UserState {
  users: {
    name: string
  }[],
  loading: boolean,
  error: null,
  isOpen: boolean,
  credential: {}
}
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  isOpen: true,
  credential: {}
};
export const toggleIsOpen = createAction('users/TOGGLE_IS_OPEN');

export const getUsers = createAppAsyncThunk('users/GET_USERS',
  async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

const UsersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(getUsers.rejected, (state) => {
      state.loading = false;
    })
    .addCase(toggleIsOpen, (state) => {
      state.isOpen = !state.isOpen;
    })
});

export default UsersReducer;
