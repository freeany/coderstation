import { useEffect } from 'react'
import { Layout, message } from 'antd'
import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import { getInfo, getUserById } from './api/user.js'
import './css/App.css'
import RouterConfig from './router/index.jsx'
import { useDispatch } from 'react-redux'
import { initUserInfo, setLoginStatus } from './store/userSlice.js'

const { Header, Footer, Content } = Layout

function App() {
	const dispatch = useDispatch()
	async function fetchUserInfo() {
		const result = await getInfo()
		if (result.code === 406) {
			message.warning(result.msg)
		} else {
			const { data } = await getUserById(result.data._id)
			dispatch(initUserInfo(data))
			dispatch(setLoginStatus(true))
		}
	}
	useEffect(() => {
		const userToken = localStorage.getItem('userToken')
		if (userToken) {
			fetchUserInfo()
		}
	}, [])

	return (
		<div className="App">
			{/* 头部 */}
			<Header className="header">
				<NavHeader />
			</Header>
			{/* 匹配上的路由页面 */}
			<Content className="content">
				<RouterConfig />
			</Content>
			{/* 底部 */}
			<Footer className="footer">
				<PageFooter />
			</Footer>
		</div>
	)
}

export default App
