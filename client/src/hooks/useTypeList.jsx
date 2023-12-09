/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTypeList } from '../store/typeSlice'

export default function useTypeList() {
	const dispatch = useDispatch()
	const { typeList } = useSelector(state => state.type)

	useEffect(() => {
		if (typeList.length === 0) {
			dispatch(getTypeList())
		}
	}, [])
	return [typeList]
}
