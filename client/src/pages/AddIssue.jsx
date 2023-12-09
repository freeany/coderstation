import { Form, Button, Input, message, Select } from 'antd'
import { useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { Editor } from '@toast-ui/react-editor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from '../css/AddIssue.module.css'
import useTypeList from '../hooks/useTypeList'
import { addIssue } from '../api/issue'

function AddIssue() {
	const navigate = useNavigate()
	const [typeList] = useTypeList()
	const { userInfo } = useSelector(state => state.user)
	const editorRef = useRef()
	const [form] = Form.useForm()
	const onFinish = values => {
		console.log('Success:', values)
		const html = editorRef.current.getInstance().getHTML()
		const params = {
			...values,
			issueContent: html,
			userId: userInfo._id // 用户 id
		}
		addIssue(params)
		// 跳转回首页
		navigate('/issues')
		message.success('你的问题已提交，审核通过后将会进行展示')
	}
	const handleChange = value => {
		console.log(`selected ${value}`)
	}

	return (
		<div className={styles.container}>
			<Form
				name="basic"
				autoComplete="off"
				onFinish={onFinish}
				form={form}
				labelCol={{
					span: 2
				}}
				wrapperCol={{
					span: 22
				}}
			>
				{/* 问答标题 */}
				<Form.Item label="标题" name="issueTitle" rules={[{ required: true, message: '请输入标题' }]}>
					<Input placeholder="请输入标题" size="large" />
				</Form.Item>

				{/* 问题类型 */}
				<Form.Item label="问题分类" name="typeId" rules={[{ required: true, message: '请选择问题所属分类' }]}>
					<Select
						style={{ width: 200 }}
						onChange={handleChange}
						options={typeList.map(type => {
							return {
								label: type.typeName,
								value: type._id
							}
						})}
					></Select>
				</Form.Item>

				{/* 问答内容 */}
				<Form.Item label="问题描述" name="issueContent" rules={[{ required: true, message: '请输入问题描述' }]}>
					<Editor initialValue="" previewStyle="vertical" height="600px" initialEditType="wysiwyg" useCommandShortcut={true} language="zh-CN" ref={editorRef} />
				</Form.Item>

				{/* 确认修改按钮 */}
				<Form.Item wrapperCol={{ offset: 3, span: 16 }}>
					<Button type="primary" htmlType="submit">
						确认新增
					</Button>

					<Button type="link" htmlType="submit" className="resetBtn">
						重置
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default AddIssue
