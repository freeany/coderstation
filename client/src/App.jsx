import { useEffect } from 'react'
import { Layout, message } from 'antd'
import { useDispatch } from 'react-redux'
import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import { getInfo, getUserById } from './api/user.js'
import './css/App.css'
import './fonts/iconfont.css'
import RouterConfig from './router/index.jsx'
import { initUserInfo, setLoginStatus } from './store/userSlice.js'

const { Header, Footer, Content } = Layout

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
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
		const userToken = localStorage.getItem('userToken')
		if (userToken) {
			fetchUserInfo()
		}
	}, [dispatch])

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
