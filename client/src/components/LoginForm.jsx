import { Modal } from 'antd'
export default function LoginForm({ isModalOpen, handleLoginCancel }) {
	const handleOk = () => {
		console.log('ok...')
		handleLoginCancel(false)
	}
	const handleCancel = () => {
		console.log('cancel')
		handleLoginCancel(false)
	}
	return (
		<>
			<Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</>
	)
}
