import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUser } from './userAPI';

const initialState = {
  data: {
    first_name: '-',
    last_name: '-'
  },
  status: 'idle',
  lastError: ""
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    try {
      const response = await fetchUser();
      return response.data.data;
    } catch (error) {
      throw new Error(error.message)
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    update: (state, action) => {
      state.data = action.payload;
    },
    isUserAuthorized: (state, action) => {
      console.log(`isAuth: ${action.payload}`)
      state.authorized = action.payload
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.lastError = '';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
        state.lastError = '';
      })
      .addCase(getUser.rejected, (state, { payload, error }) => {
        state.status = 'idle';
        state.lastError = error.message;
      });
  },
});

export const { increment, decrement, incrementByAmount } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state) => state.user;

export default userSlice.reducer;
