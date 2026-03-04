import React, { useState } from 'react';
import { Card, Button, Space, Table, Typography, Tag } from 'antd';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface HistoryRecord {
	key: number;
	round: number;
	player: Choice;
	computer: Choice;
	result: Result;
}

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

const OanTuTi: React.FC = () => {
	const [history, setHistory] = useState<HistoryRecord[]>([]);
	const [round, setRound] = useState(1);

	const play = (playerChoice: Choice) => {
		const computerChoice = choices[Math.floor(Math.random() * choices.length)];
		let result: Result = 'Hòa';

		if (playerChoice !== computerChoice) {
			if (
				(playerChoice === 'Kéo' && computerChoice === 'Bao') ||
				(playerChoice === 'Búa' && computerChoice === 'Kéo') ||
				(playerChoice === 'Bao' && computerChoice === 'Búa')
			) {
				result = 'Thắng';
			} else {
				result = 'Thua';
			}
		}

		const newRecord: HistoryRecord = {
			key: round,
			round,
			player: playerChoice,
			computer: computerChoice,
			result,
		};

		setHistory([newRecord, ...history]);
		setRound(round + 1);
	};

	const columns = [
		{ title: 'Ván', dataIndex: 'round', key: 'round' },
		{ title: 'Người chơi', dataIndex: 'player', key: 'player' },
		{ title: 'Máy tính', dataIndex: 'computer', key: 'computer' },
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			render: (res: Result) => {
				const color = res === 'Thắng' ? 'green' : res === 'Thua' ? 'red' : 'orange';
				return <Tag color={color}>{res}</Tag>;
			},
		},
	];

	return (
		<Card title='Trò Chơi Oẳn Tù Tì'>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				<Space>
					<Text strong>Chọn:</Text>
					<Button type='primary' onClick={() => play('Kéo')}>
						Kéo
					</Button>
					<Button type='primary' danger onClick={() => play('Búa')}>
						Búa
					</Button>
					<Button style={{ background: '#52c41a', color: 'white' }} onClick={() => play('Bao')}>
						Bao
					</Button>
				</Space>

				<div>
					<Title level={5}>Lịch sử đấu</Title>
					<Table dataSource={history} columns={columns} pagination={{ pageSize: 5 }} />
				</div>
			</Space>
		</Card>
	);
};

export default OanTuTi;
