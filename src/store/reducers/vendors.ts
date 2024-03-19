/* eslint-disable no-console */
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { createAppAsyncThunk } from '../../utils/redux';

const initialState = {
  vendors: [],
  loading: false,
  error: null,
  isOpen: true,
  credential:{}
};
export const toggleIsOpen = createAction('vendors/TOGGLE_IS_OPEN');

export const getVendors = createAppAsyncThunk('vendors/GET_BUYERS', 
async () => {
  try {
    const response = await axiosInstance.get('/vendors');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const VendorsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getVendors.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getVendors.fulfilled, (state, action) => {
      state.loading = false;
      state.vendors = action.payload;
    })
    .addCase(getVendors.rejected, (state) => {
      state.loading = false;
    })
    .addCase(toggleIsOpen, (state) => {
      state.isOpen = !state.isOpen;
    })
});

export default VendorsReducer;
