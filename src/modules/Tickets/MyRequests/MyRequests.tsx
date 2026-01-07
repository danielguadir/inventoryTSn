import React from 'react';
import { Card } from '../../../components/UXLib/Card/Card';

export const MyRequests: React.FC = () => {
    return (
        <div className="my-requests">
            <Card title="My Requests" variant="elevated">
                <p>This module will allow users to track their equipment reports and requests.</p>
            </Card>
        </div>
    );
};

export default MyRequests;
