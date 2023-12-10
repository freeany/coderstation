import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Input, Select } from 'antd'
import LoginAvatar from './LoginAvatar'
import LoginForm from './LoginForm'

function PageHeader() {
	const navigate = useNavigate()
	const [isShowLoginModal, setIsShowLoginModal] = useState(false)
	const [searchOptions, setSearchOption] = useState('issue')
	function handleLogin() {
		setIsShowLoginModal(true)
	}

	function onChange(value) {
		setSearchOption(value)
	}
	const onSearch = value => {
		if (value) {
			// 跳转到搜索页，将搜索内容传递过去
			navigate('/searchpage', {
				state: {
					value,
					searchOptions
				}
			})
		} else {
			navigate('/issues')
		}
	}

	function handleLoginCancel() {
		setIsShowLoginModal(false)
	}
	return (
		<div className="headerContainer">
			{/* 头部 logo */}
			<div className="logoContainer">
				<div className="logo"></div>
			</div>
			{/* 头部导航 */}
			<nav className="navContainer">
				<NavLink to="/" className="navgation">
					问答
				</NavLink>
				<NavLink to="/books" className="navgation">
					书籍
				</NavLink>
				<NavLink to="/interviews" className="navgation">
					面试题
				</NavLink>
				<a href="https://duyi.ke.qq.com/" className="navgation" target="_blank" rel="noreferrer">
					视频教程
				</a>
			</nav>
			{/* 搜索框 */}
			<div className="searchContainer">
				<Input.Group compact>
					<Select defaultValue="issue" size="large" style={{ width: '20%' }} onChange={onChange}>
						<Select.Option value="issue">问答</Select.Option>
						<Select.Option value="book">书籍</Select.Option>
					</Select>
					<Input.Search
						placeholder="请输入要搜索的内容"
						allowClear
						enterButton="搜索"
						size="large"
						style={{
							width: '80%'
						}}
						onSearch={onSearch}
					/>
				</Input.Group>
			</div>
			{/* 登录按钮 */}
			<div className="loginBtnContainer">
				<LoginAvatar handleLogin={handleLogin}></LoginAvatar>
				{isShowLoginModal && <LoginForm isModalOpen={isShowLoginModal} handleLoginCancel={handleLoginCancel} />}
			</div>
		</div>
	)
}

export default PageHeader
