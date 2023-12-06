import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isLogin: false,
		userInfo: {}
	},
	reducers: {
		initUserInfo(state, { payload }) {
			state.userInfo = payload
		},
		setLoginStatus(state, { payload }) {
			state.isLogin = payload
		},
		clearLoginInfo(state) {
			state.isLogin = false
			state.userInfo = {}
			localStorage.removeItem('userToken')
		}
	}
})

export const { initUserInfo, setLoginStatus, clearLoginInfo } = userSlice.actions
export default userSlice.reducer
