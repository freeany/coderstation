import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ScoreRank from '../components/ScoreRank'
import Recommend from '../components/Recommend'
import { useParams } from 'react-router-dom'
import { Avatar } from 'antd'
import { getIssueById } from '../api/issue'
import { getUserById } from '../api/user'
// import { updateIssue } from '../api/issue'
import styles from '../css/IssueDetail.module.css'
import { formatDate } from '../utils/tools'
import Discuss from '../components/Discuss'

function IssueDetail(props) {
	const { id } = useParams() // 获取可能传递过来的 id
	const [issueInfo, setIssueInfo] = useState({})
	const [issueUser, setIssueUserName] = useState(null)

	// 根据传递过来的 id 获取面试题详情
	useEffect(() => {
		async function fetchData() {
			// 根据问答 id 获取该问答具体的信息
			const { data } = await getIssueById(id)
			setIssueInfo(data)
			// 获取 userId 对应的用户
			const result = await getUserById(data.userId)
			setIssueUserName(result.data)
		}
		fetchData()
	}, [id])
	return (
		<div className={styles.container}>
			<PageHeader title="问题详情" />
			<div className={styles.detailContainer}>
				<div className={styles.leftSide}>
					<div className={styles.question}>
						<Avatar size="small" src={'http://localhost:7001/' + issueUser?.avatar} />
						<span className={styles.user}>{issueUser?.nickname}</span>
						<span>发布于：{formatDate(issueInfo?.issueDate)}</span>
					</div>
					<div className={styles.content}>
						<div dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}></div>
					</div>
					{/* 下方评论模块 */}
					<Discuss commentType={1} issueInfo={issueInfo}></Discuss>
				</div>
				{/* 右侧 */}
				<div className={styles.rightSide}>
					<div style={{ marginBottom: 20 }}>
						<Recommend />
					</div>
					<div style={{ marginBottom: 20 }}>
						<ScoreRank />
					</div>
				</div>
			</div>
		</div>
	)
}

export default IssueDetail
