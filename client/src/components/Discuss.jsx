import { Comment, Avatar, Button, message, List, Tooltip, Pagination } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { Editor } from '@toast-ui/react-editor'
import { useDispatch } from 'react-redux'
import { formatDate } from '../utils/tools'
import { addComment, getIssueCommentById, getBookCommentById } from '../api/comment'
import { updateIssue } from '../api/issue'
import { getUserById } from '../api/user'
import { updateBook } from '../api/book'
import { updateUserInfo } from '../store/userSlice'
import styles from '../css/Discuss.module.css'

export default function Discuss({ issueInfo, commentType, bookInfo }) {
	const dispatch = useDispatch()
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 10
	})
	const [total, setTotal] = useState(0)
	const [commentList, setCommentList] = useState([])
	const { isLogin, userInfo } = useSelector(state => state.user)
	const [refresh, setRefresh] = useState(false)
	useEffect(() => {
		if (!issueInfo._id) return

		async function fetchCommentList() {
			let p = null
			// 根据该问答或者书籍 id 获取对应的评论
			if (commentType === 1) {
				// 传递过来的是问答 id
				p = getIssueCommentById
			} else if (commentType === 2) {
				// 传递过来的是书籍 id
				p = getBookCommentById
			}
			const { data } = await p(issueInfo._id, pageInfo)

			// 获取每条评论对应的用户信息
			for (let i = 0; i < data.data.length; i++) {
				const result = await getUserById(data.data[i].userId)
				data.data[i].userInfo = result.data
			}
			setTotal(data.count)
			setCommentList(data.data)
		}
		fetchCommentList()
	}, [commentType, issueInfo._id, pageInfo, refresh])

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
	const handleAddComment = () => {
		let newComment = null
		if (commentType === 1) {
			// 新增问答评论
			newComment = editorRef.current.getInstance().getHTML()
		} else if (commentType === 2) {
			// 新增书籍评论
			// newComment = value;
		}
		if (!newComment || newComment === '<p><br></p>') {
			message.warning('请输入评论内容')
			return
		} else {
			// 用户提交评论
			addComment({
				userId: userInfo._id,
				bookId: bookInfo?._id,
				issueId: issueInfo?._id,
				typeId: issueInfo ? issueInfo.typeId : bookInfo.typeId,
				commentContent: newComment,
				commentType: commentType
			})

			// 该条问答或者书籍的评论数量加一 ?
			if (commentType === 1) {
				// 问答评论数 +1
				updateIssue(issueInfo._id, {
					commentNumber: ++issueInfo.commentNumber
				})
				editorRef.current.getInstance().setHTML('')
				// 重置userInfo信息 增加对应用户的积分
			} else if (commentType === 2) {
				// 书籍评论数 + 1
				updateBook(bookInfo._id, {
					commentNumber: ++bookInfo.commentNumber
				})
				// setValue('')
			}
			dispatch(
				updateUserInfo({
					userId: userInfo._id,
					newInfo: {
						points: userInfo.points + (commentType === 1 ? 4 : 2)
					}
				})
			)
			message.success(`评论添加成功，积分+${commentType === 1 ? 4 : 2}`)

			setRefresh(!refresh)
		}
	}
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
						<Button type="primary" onClick={handleAddComment} disabled={!isLogin} style={{ marginTop: '20px' }}>
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
								avatar={<Avatar src={'http://localhost:7001/' + props.userInfo?.avatar} />}
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
			{commentList?.length > 0 ? (
				<div className={styles.paginationContainer}>
					<Pagination showQuickJumper onChange={onChange} current={pageInfo.current} total={total} />
				</div>
			) : (
				<div
					style={{
						fontWeight: '200',
						textAlign: 'center',
						margin: '50px'
					}}
				>
					暂无评论
				</div>
			)}
		</>
	)
}
