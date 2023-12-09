import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Pagination } from 'antd'
import PageHeader from '../components/PageHeader'
import { getIssueByPage } from '../api/issue'
import styles from '../css/Issue.module.css'
import IssueItem from '../components/IssueItem'
import AddIssue from '../components/AddIssueButton'
import { getTypeList } from '../store/typeSlice'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'

function Issues(props) {
	const dispatch = useDispatch()
	const [issuseList, setIssueList] = useState([])

	useEffect(() => {
		dispatch(getTypeList())
	}, [dispatch])

	// 分页信息
	const [pageInfo, setPageInfo] = useState({
		current: 1,
		pageSize: 15,
		total: 0
	})
	const onChangePage = (page, pageSize) => {
		setPageInfo({
			...pageInfo,
			current: page,
			pageSize
		})
	}

	useEffect(() => {
		const fetchList = async () => {
			const { data } = await getIssueByPage({
				current: pageInfo.current,
				pageSize: pageInfo.pageSize,
				issueStatus: true
			})
			setIssueList(data.data)
			setPageInfo({
				...pageInfo,
				total: data.count
			})
		}
		fetchList()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageInfo.current, pageInfo.pageSize])
	return (
		<div className={styles.container}>
			{/* 上面的头部 */}
			<PageHeader title="问答列表" />
			{/* 下面的列表内容区域 */}
			<div className={styles.issueContainer}>
				{/* 左边区域 */}
				<div className={styles.leftSide}>
					{issuseList.map(item => {
						return <IssueItem key={item._id} issueInfo={item} />
					})}
					<div className="paginationContainer">
						<Pagination
							showTotal={total => `Total ${total} items`}
							pageSize={pageInfo.pageSize}
							current={pageInfo.current}
							showQuickJumper
							showSizeChanger
							total={pageInfo.total}
							onChange={onChangePage}
						/>
					</div>
				</div>
				{/* 右边区域 */}
				<div className={styles.rightSide}>
					<AddIssue></AddIssue>
					<Recommend></Recommend>
					<ScoreRank></ScoreRank>
				</div>
			</div>
		</div>
	)
}

export default Issues
