import { useState, useEffect } from 'react'
import { formatDate } from '../utils/tools.js'
import styles from '../css/IssueItem.module.css'
import { Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getUserById } from '../api/user'

/**
 * 每一条问答的项目
 */
function IssueItem(props) {
	const { typeList } = useSelector(state => state.type)
	const [userInfo, setUserInfo] = useState({}) // 存储用户的信息
	const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']
	useEffect(() => {
		// 发送请求获取用户的信息
		async function fetchUserData() {
			const { data } = await getUserById(props.issueInfo.userId)
			setUserInfo(data)
		}
		fetchUserData()
	}, [props.issueInfo.userId, typeList.length])

	const type = typeList.find(item => item._id === props.issueInfo.typeId)
	return (
		<div className={styles.container}>
			{/* 回答数 */}
			<div className={styles.issueNum}>
				<div>{props.issueInfo.commentNumber}</div>
				<div>回答</div>
			</div>
			{/* 浏览数 */}
			<div className={styles.issueNum}>
				<div>{props.issueInfo.scanNumber}</div>
				<div>浏览</div>
			</div>
			{/* 问题内容 */}
			<div className={styles.issueContainer}>
				<div className={styles.top}>{props.issueInfo.issueTitle}</div>
				<div className={styles.bottom}>
					<div className={styles.left}>
						<Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
					</div>
					<div className={styles.right}>
						<Tag color="volcano">{userInfo.nickname}</Tag>
						<span>{formatDate(props.issueInfo.issueDate, 'year')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default IssueItem
