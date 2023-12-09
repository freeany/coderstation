import { Button, message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AddIssue() {
	const { isLogin } = useSelector(state => state.user)
	const navigation = useNavigate()
	const handleClick = () => {
		if (isLogin) {
			navigation('/addissue')
		} else {
			message.warning('请先登陆')
		}
	}
	return (
		<Button
			type="primary"
			size="large"
			style={{
				width: '100%',
				marginBottom: '30px'
			}}
			onClick={handleClick}
		>
			我要发问
		</Button>
	)
}
