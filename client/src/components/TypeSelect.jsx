import { useContext } from 'react'
import { Tag } from 'antd'
import { useLocation } from 'react-router-dom'
import useTypeList from '../hooks/useTypeList'
import context from '../context'

function TypeSelect(props) {
	const { ctx, setCtx } = useContext(context)
	const location = useLocation()
	const [typeList] = useTypeList()
	const colorArr = ['magenta', '#108ee9', '#2db7f5', '#ec8a48', 'green', '#87d068', 'blue', 'red', 'purple', 'skyblue', 'orange']
	const typeListAll = [{ _id: 'all', typeName: '全部' }, ...typeList]

	function changeType(typeId) {
		if (location.pathname === '/issues') {
			setCtx({
				...ctx,
				issueTypeId: typeId
			})
		} else if (location.pathname === '/books') {
			setCtx(typeId)
		}
	}

	return (
		<div>
			{typeListAll.map((type, index) => (
				<Tag color={colorArr[index % colorArr.length]} value={type._id} key={type._id} style={{ cursor: 'pointer' }} onClick={() => changeType(type._id)}>
					{type.typeName}
				</Tag>
			))}
		</div>
	)
}

export default TypeSelect
