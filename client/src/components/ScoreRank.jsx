import { Card } from 'antd'
import { useEffect, useState } from 'react'
import { getUserByPointsRank } from '../api/user'
import ScoreItem from './ScoreItem'

export default function ScoreRank() {
	const [rankList, setRankList] = useState([])

	useEffect(() => {
		async function getRankList() {
			const { data } = await getUserByPointsRank()
			setRankList(data)
		}
		getRankList()
	}, [])

	return (
		<Card title="积分排行榜">
			{rankList.map((rank, index) => (
				<ScoreItem key={rank._id} rankInfo={rank} index={index}></ScoreItem>
			))}
		</Card>
	)
}
