/* eslint-disable no-console */
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { createAppAsyncThunk } from '../../utils/redux';

const initialState = {
  buyers: [],
  loading: false,
  error: null,
  isOpen: true,
  credential:{}
};
export const toggleIsOpen = createAction('buyers/TOGGLE_IS_OPEN');

export const getBuyers = createAppAsyncThunk('buyers/GET_BUYERS', 
async () => {
  try {
    const response = await axiosInstance.get('/buyers');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const BuyersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getBuyers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getBuyers.fulfilled, (state, action) => {
      state.loading = false;
      state.buyers = action.payload;
    })
    .addCase(getBuyers.rejected, (state) => {
      state.loading = false;
    })
    .addCase(toggleIsOpen, (state) => {
      state.isOpen = !state.isOpen;
    })
});

export default BuyersReducer;
