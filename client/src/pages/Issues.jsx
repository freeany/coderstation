import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PageHeader from '../components/PageHeader'
import { getIssueByPage } from '../api/issue'
import styles from '../css/Issue.module.css'
import IssueItem from '../components/IssueItem'
import { getTypeList } from '../store/typeSlice'

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

	useEffect(() => {
		const fetchList = async () => {
			const { data } = await getIssueByPage({
				current: pageInfo.current,
				pageSize: pageInfo.pageSize,
				issueStatus: true
			})
			setIssueList(data.data)
			setPageInfo({
				currentPage: data.currentPage,
				pageSize: data.eachPage,
				total: data.count
			})
		}
		fetchList()
	}, [pageInfo])
	return (
		<div className={styles.container}>
			{/* 上面的头部 */}
			<PageHeader title="问答列表" />
			{/* 下面的列表内容区域 */}
			<div className={styles.issueContainer}>
				{/* 左边区域 */}
				<div className={styles.leftSide}>
					{issuseList.map((item, index) => {
						return <IssueItem key={index} issueInfo={item} />
					})}
				</div>
				{/* 右边区域 */}
				<div className={styles.rightSide}></div>
			</div>
		</div>
	)
}

export default Issues
