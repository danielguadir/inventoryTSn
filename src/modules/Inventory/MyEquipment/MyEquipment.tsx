import React from 'react';
import { Card } from '../../../components/UXLib/Card/Card';

export const MyEquipment: React.FC = () => {
    return (
        <div className="my-equipment">
            <Card title="My Equipment" variant="elevated">
                <p>This module will show the equipment currently assigned to the logged-in user.</p>
            </Card>
        </div>
    );
};

export default MyEquipment;
