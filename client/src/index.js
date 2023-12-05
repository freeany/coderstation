import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.min.css'
import zhCN from 'antd/es/locale/zh_CN' // 中文语言包
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<ConfigProvider locale={zhCN}>
				<App />
			</ConfigProvider>
		</BrowserRouter>
	</Provider>
)
