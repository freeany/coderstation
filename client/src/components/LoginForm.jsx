import { Modal, Radio, Form, Input, Button, Checkbox, Row, Col, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { initUserInfo, setLoginStatus } from '../store/userSlice'
import styles from '../css/LoginForm.module.css'
import { getCaptcha, userIsExist, addUser, userLogin, getUserById } from '../api/user'
const formAttr = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 18
	},
	style: {
		maxWidth: 600
	},
	autoComplete: 'off'
}

export default function LoginForm({ isModalOpen, handleLoginCancel }) {
	const dispatch = useDispatch()
	const [value, setValue] = useState(1)
	const [formLogin] = Form.useForm()
	const [formRegistry] = Form.useForm()
	const [captcha, setCaptcha] = useState(null)

	useEffect(() => {
		captchaClickHandle()
	}, [value])
	// 成功的回调
	const onFinishLogin = async values => {
		// console.log('SuccessLogin:', values)
		const result = await userLogin(values)
		if (result.code === 406) {
			message.warning('验证码错误')
			captchaClickHandle()
			return
		}
		if (result.code === 0) {
			const { data } = result
			// 如果没有data,那么登陆名或者密码错误
			if (!data.data) {
				message.warning('登陆名或者密码错误')
				return
			}
			console.log(data.data, 'xxx')
			if (!data.data.enabled) {
				message.warning('账号被冻结，请联系管理员')
			} else {
				message.success('登陆成功')
				localStorage.setItem('userToken', data.token)
				const userInfo = await getUserById(data.data._id)
				dispatch(initUserInfo(userInfo.data))
				handleLoginCancel(false)
				dispatch(setLoginStatus(true))
			}
		}
	}
	const onResetLogin = () => {
		formLogin.resetFields()
	}
	const onFinishRegistry = async values => {
		// console.log('SuccessRegistry:', values)
		const data = await addUser(values)
		if (data.code === 0) {
			message.success('注册成功')
			dispatch(initUserInfo(data.data))
			handleLoginCancel(false)
			dispatch(setLoginStatus(true))
		} else if (data.code === 406) {
			message.warning('验证码错误')
			captchaClickHandle()
		}
	}
	const onResetRegistry = () => {
		formRegistry.resetFields()
	}
	const captchaClickHandle = async () => {
		const res = await getCaptcha()
		setCaptcha(res)
	}

	const handleCancel = () => {
		handleLoginCancel(false)
	}

	function onChange(e) {
		setValue(e.target.value)
	}
	const checkLoginIdIsExist = async () => {
		const loginId = formRegistry.getFieldValue('loginId')
		if (!loginId) return
		// return Promise.reject('www')
		const { data } = await userIsExist(loginId)
		if (data) {
			return Promise.reject('已存在该用户')
		}
	}

	let container = null
	if (value === 1) {
		container = (
			<div className={styles.container}>
				<Form
					key={'basic1'}
					name="basic"
					form={formLogin}
					initialValues={{
						remember: true
					}}
					onFinish={onFinishLogin}
					{...formAttr}
				>
					<Form.Item
						label="登陆账号"
						name="loginId"
						rules={[
							{
								required: true,
								message: '请输入账号！'
							}
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="登录密码"
						name="loginPwd"
						rules={[
							{
								required: true,
								message: '请输入密码！'
							}
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name="captcha"
						label="验证码"
						rules={[
							{
								required: true,
								message: '请输入验证码'
							}
						]}
					>
						<Row align="middle">
							<Col span={16}>
								<Input />
							</Col>
							<Col span={6}>
								<div className={styles.captchaImg} onClick={captchaClickHandle} dangerouslySetInnerHTML={{ __html: captcha }}></div>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item
						name="remember"
						valuePropName="checked"
						wrapperCol={{
							offset: 8,
							span: 16
						}}
					>
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16
						}}
					>
						<Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
							Submit
						</Button>
						<Button htmlType="button" onClick={onResetLogin}>
							Reset
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	} else {
		container = (
			<div className={styles.container}>
				<Form key={'basic2'} name="basic2" form={formRegistry} onFinish={onFinishRegistry} {...formAttr}>
					<Form.Item
						label="登录账号"
						name="loginId"
						rules={[
							{
								required: true,
								message: '请输入账号，仅此项为必填项!'
							},
							// 验证用户是否已经存在
							{ validator: checkLoginIdIsExist }
						]}
						validateTrigger="onBlur"
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="用户昵称"
						name="nickname"
						rules={[
							{
								required: true,
								message: '请输入昵称!'
							}
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="captcha"
						label="验证码"
						rules={[
							{
								required: true,
								message: '请输入验证码'
							}
						]}
					>
						<Row align="middle">
							<Col span={16}>
								<Input />
							</Col>
							<Col span={6}>
								<div className={styles.captchaImg} onClick={captchaClickHandle} dangerouslySetInnerHTML={{ __html: captcha }}></div>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16
						}}
					>
						<Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
							Submit
						</Button>
						<Button htmlType="button" onClick={onResetRegistry}>
							Reset
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}

	return (
		<>
			<Modal title="注册/登陆" open={isModalOpen} onCancel={handleCancel} footer={null}>
				<Radio.Group onChange={onChange} className={styles.radioGroup} defaultValue={value} optionType="button" buttonStyle="solid">
					<Radio.Button value={1} className={styles.radioButton}>
						登录
					</Radio.Button>
					<Radio.Button value={2} className={styles.radioButton}>
						注册
					</Radio.Button>
				</Radio.Group>
				{container}
			</Modal>
		</>
	)
}
