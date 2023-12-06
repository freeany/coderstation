import { Modal, Radio, Form, Input, Button, Checkbox, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import styles from '../css/LoginForm.module.css'
import { getCaptcha } from '../api/user'
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
	const [value, setValue] = useState(1)
	const [formLogin] = Form.useForm()
	const [formRegistry] = Form.useForm()
	const [captcha, setCaptcha] = useState(null)

	useEffect(() => {
		captchaClickHandle()
	}, [value])
	// 成功的回调
	const onFinishLogin = values => {
		console.log('SuccessLogin:', values)
	}
	const onResetLogin = () => {
		formLogin.resetFields()
	}
	const onFinishRegistry = values => {
		console.log('SuccessRegistry:', values)
	}
	const onResetRegistry = () => {
		formRegistry.resetFields()
	}
	const captchaClickHandle = async () => {
		const res = await getCaptcha()
		setCaptcha(res)
	}

	const handleOk = () => {
		console.log('ok...')
		handleLoginCancel(false)
	}
	const handleCancel = () => {
		console.log('cancel')
		handleLoginCancel(false)
	}

	function onChange(e) {
		setValue(e.target.value)
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
						name="logincaptcha"
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
							}
						]}
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
						name="registercaptcha"
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
			<Modal title="注册/登陆" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
