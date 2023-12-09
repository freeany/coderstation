import styles from '../css/ScoreItem.module.css'
import { Avatar } from 'antd'

export default function ScoreItem({ rankInfo, index }) {
	const ranking = index + 1
	const classes = 'iconfont icon-jiangbei f22'
	let rankNum = null
	switch (ranking) {
		case 1:
			rankNum = (
				<div
					style={{
						color: '#ffda23'
					}}
					className={classes}
				></div>
			)
			break

		case 2:
			rankNum = (
				<div
					style={{
						color: '#c5c5c5'
					}}
					className={classes}
				></div>
			)
			break

		case 3:
			rankNum = (
				<div
					style={{
						color: '#cd9a62'
					}}
					className={classes}
				></div>
			)
			break

		default:
			rankNum = <div className={styles.rank}>{ranking}</div>
			break
	}
	return (
		<div className={styles.container}>
			<div className={styles.left}>
				{rankNum}
				<div className={styles.avatar}>
					<Avatar size="small" src={'http://localhost:7001/' + rankInfo.avatar} />
				</div>
				<div className={styles.nickname}>{rankInfo.nickname}</div>
			</div>
			<div className={styles.right}>{rankInfo.points}</div>
		</div>
	)
}
