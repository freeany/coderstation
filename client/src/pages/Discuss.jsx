import { Comment, Avatar, Button, Input, Form, message, List, Tooltip, Pagination } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { addComment, getIssueCommentById } from '../api/comment'
import { UserOutlined } from '@ant-design/icons'

import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { Editor } from '@toast-ui/react-editor'
import { formatDate } from '../utils/tools'
export default function Discuss({ issueInfo }) {
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 10
	})
	const [total, setTotal] = useState(0)
	const [commentList, setCommentList] = useState([])
	const { isLogin, userInfo } = useSelector(state => state.user)
	useEffect(() => {
		if (!issueInfo._id) return
		async function fetchData() {
			const { data } = await getIssueCommentById(issueInfo._id, pageInfo)
			setTotal(data.total)
			setCommentList(data.data)
		}
		fetchData()
	}, [issueInfo._id, pageInfo])
	const onChange = page => {
		setPageInfo({
			current: page,
			pageSize: 10
		})
	}
	// 头像
	let avatar = null
	if (isLogin) {
		avatar = <Avatar src={'http://localhost:7001/' + userInfo.avatar} alt="用户头像" />
	} else {
		avatar = <Avatar icon={<UserOutlined />} />
	}
	const editorRef = useRef()
	return (
		<>
			<Comment
				avatar={avatar}
				content={
					<>
						<Editor
							initialValue=""
							previewStyle="vertical"
							height="200px"
							initialEditType="wysiwyg"
							useCommandShortcut={true}
							language="zh-CN"
							ref={editorRef}
						/>
						<Button type="primary" disabled={!isLogin} style={{ marginTop: '20px' }}>
							添加评论
						</Button>
					</>
				}
			/>
			{/* 评论列表 */}
			{commentList?.length > 0 && (
				<List
					dataSource={commentList}
					header="当前评论"
					itemLayout="horizontal"
					renderItem={function (props) {
						return (
							<Comment
								avatar={<Avatar src={props.userInfo?.avatar} />}
								content={<div dangerouslySetInnerHTML={{ __html: props.commentContent }}></div>}
								datetime={
									<Tooltip title={formatDate(props.commentDate)}>
										<span>{formatDate(props.commentDate, 'year')}</span>
									</Tooltip>
								}
							/>
						)
					}}
				/>
			)}
			{/* 评论分页 */}
			<div style={{ margin: '20px 0' }}>
				<Pagination onChange={onChange} total={total} />
			</div>
		</>
	)
}
