import React from 'react';
import type { Moment } from 'moment';

import StatisticsForm from './StatisticsForm';
import StatisticsTable from './StatisticsTable';

export default function StatisticsTab() {
    const [range, setRange] = React.useState<[Moment, Moment] | undefined>();

    return (
        <div>
            <h3>Thống kê & Báo cáo</h3>
            <StatisticsForm onFilter={setRange} />
            <StatisticsTable dateRange={range} />
        </div>
    );
}