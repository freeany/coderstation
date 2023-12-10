import { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { Pagination, Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getIssueByPage } from '../api/issue'
import styles from '../css/Issue.module.css'
import IssueItem from '../components/IssueItem'
import AddIssue from '../components/AddIssueButton'
import { getTypeList } from '../store/typeSlice'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import TypeSelect from '../components/TypeSelect'
import context from '../context'

function Issues(props) {
	const navigate = useNavigate()
	const { ctx } = useContext(context)
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

	const handleGoAsk = () => {
		navigate('/addissue')
	}

	useEffect(() => {
		const fetchList = async () => {
			let searchParams = {
				current: pageInfo.current,
				pageSize: pageInfo.pageSize,
				issueStatus: true
			}
			if (ctx.issueTypeId !== 'all') {
				searchParams.typeId = ctx.issueTypeId
				// 如果按照分类进行查找，需要将当前页重新设置为第一页
				searchParams.current = 1
				setPageInfo({
					...pageInfo,
					current: 1
				})
			}
			const { data } = await getIssueByPage(searchParams)
			setIssueList(data.data)
			setPageInfo({
				...pageInfo,
				total: data.count
			})
		}
		fetchList()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageInfo.current, pageInfo.pageSize, ctx])
	return (
		<div className={styles.container}>
			{/* 上面的头部 */}
			<PageHeader title="问答列表">
				<TypeSelect></TypeSelect>
			</PageHeader>
			{/* 下面的列表内容区域 */}
			<div className={styles.issueContainer}>
				{/* 左边区域 */}
				<div className={styles.leftSide}>
					{issuseList.map(item => {
						return <IssueItem key={item._id} issueInfo={item} />
					})}
					{issuseList.length > 0 ? (
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
					) : (
						<Result
							status="403"
							title="oh"
							subTitle="暂无， 请去提问"
							extra={
								<Button type="primary" onClick={handleGoAsk}>
									去提问
								</Button>
							}
						/>
					)}
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
