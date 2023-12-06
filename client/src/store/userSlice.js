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
			console.log(payload, 'pa.')
			state.isLogin = payload
		}
	}
})

export const { initUserInfo, setLoginStatus } = userSlice.actions
export default userSlice.reducer
