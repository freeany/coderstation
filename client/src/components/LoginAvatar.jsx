// import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Popover, List, Avatar, Image } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { clearLoginInfo } from '../store/userSlice'

import styles from '../css/LoginAvatar.module.css'
export default function LoginAvatar({ handleLogin }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { isLogin, userInfo } = useSelector(state => state.user)
	const { avatar } = userInfo
	const handleClickLogin = () => {
		handleLogin()
	}
	const handleClickList = item => {
		if (item === '个人中心') {
			// 跳转到个人中心
		} else if (item === '退出登陆') {
			dispatch(clearLoginInfo())
			navigate('/')
		}
	}

	let isLoginJsx = null
	if (isLogin) {
		isLoginJsx = (
			<div className={styles.avatarContainer}>
				<Popover
					content={
						<List
							dataSource={['个人中心', '退出登陆']}
							renderItem={item => (
								<List.Item style={{ cursor: 'pointer' }} onClick={() => handleClickList(item)}>
									{item}
								</List.Item>
							)}
						/>
					}
				>
					<Avatar src={<Image preview={false} src={'http://127.0.0.1:7001' + avatar} />} size={40} icon={<UserOutlined />} />
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
