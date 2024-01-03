import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    id: '',
    access_token: '',
    isAdmin: false,
    city: '',
    refreshToken: ''
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', phone = '', address = '', avatar = '', _id = '', isAdmin, city= '', refreshToken = '' } = action.payload
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.id = _id;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city ? city : state.city;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
        },
        resetUser: (state) => {
          state.name = '';
          state.email = '';
          state.phone = '';
          state.address = '';
          state.avatar = '';
          state.id = '';
          state.access_token = '';
          state.isAdmin = false;
          state.city = '';
          state.refreshToken = ''
      },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer