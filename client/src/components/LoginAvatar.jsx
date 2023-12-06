// import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Popover, List, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import styles from '../css/LoginAvatar.module.css'
export default function LoginAvatar({ handleLogin }) {
	const { isLogin, userInfo } = useSelector(state => state.user)
	// console.log(isLogin, userInfo)
	function handleClickLogin() {
		handleLogin()
	}

	let isLoginJsx = null
	if (isLogin) {
		isLoginJsx = (
			<div className={styles.avatarContainer}>
				<Popover content={<List dataSource={['个人中心', '退出登陆']} renderItem={item => <List.Item style={{ cursor: 'pointer' }}>{item}</List.Item>} />}>
					<Avatar size={40} icon={<UserOutlined />} />
				</Popover>
			</div>
		)
	} else {
		isLoginJsx = (
			<Button type="primary" size="large" onClick={handleClickLogin}>
				注册/登录
			</Button>
		)
	}

	return <>{isLoginJsx}</>
}
