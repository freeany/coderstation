import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getType } from '../api/type'

export const getTypeList = createAsyncThunk('type/getTypeList', async (_extraData, { dispatch }) => {
	const response = await getType()
	dispatch(setTypeList(response.data))
	// 填充返回的数据到状态仓库
	// response.data
})

const typeSlice = createSlice({
	name: 'type',
	initialState: {
		typeList: [] // 存储所有的类型
	},
	reducers: {
		setTypeList(state, { payload }) {
			state.typeList = payload
		}
	}
	// 专门处理异步的 reducer
	// extraReducers: {
	// 	// 这里就会有三种状态
	// 	[getTypeList.fulfilled]: (state, { payload }) => {
	// 		state.typeList = payload
	// 	}
	// }
})

export const { setTypeList } = typeSlice.actions
export default typeSlice.reducer
