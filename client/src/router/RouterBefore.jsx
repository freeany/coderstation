import { Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Router from './'
import routeBeforeConfig from './RouteBeforeConfig'

export default function RouterBefore() {
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname
	const route = routeBeforeConfig.find(route => route.path.toLocaleLowerCase() === pathname.toLocaleLowerCase())
	function handleClose() {
		navigate('/')
	}
	if (route && route.needLogin && !localStorage.getItem('userToken')) {
		return <Alert message="请先登陆" closable type="warning" onClose={handleClose}></Alert>
	}
	return (
		<>
			<Router />
		</>
	)
}
