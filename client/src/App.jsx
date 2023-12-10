import { useEffect, useState } from 'react'
import { Layout, message } from 'antd'
import { useDispatch } from 'react-redux'
import Context from './context'
import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import { getInfo, getUserById } from './api/user.js'
import { initUserInfo, setLoginStatus } from './store/userSlice.js'
import RouterBefore from './router/RouterBefore.jsx'
import './css/App.css'
import './fonts/iconfont.css'

const { Header, Footer, Content } = Layout

const AppContainer = () => {
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
				<RouterBefore />
			</Content>
			{/* 底部 */}
			<Footer className="footer">
				<PageFooter />
			</Footer>
		</div>
	)
}

function App() {
	const [ctx, setCtx] = useState({
		issueTypeId: 'all',
		bookTypeId: 'all'
	})
	return (
		<Context.Provider value={{ ctx, setCtx }}>
			<AppContainer></AppContainer>
		</Context.Provider>
	)
}
export default App
