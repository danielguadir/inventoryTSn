import React, { useState } from 'react';
import { Card } from '../../../components/UXLib/Card/Card';
import { Table } from '../../../components/UXLib/Table/Table';
import type { TableColumn } from '../../../components/UXLib/Table/Table.types';
import './EquipmentStand.scss';

// Extend Record<string, any> to satisfy the generic Table<T extends Record<string, unknown>>
interface Equipment extends Record<string, any> {
    id: string;
    brand: string;
    model: string;
    serial: string;
    type: string;
    assignedTo: string | null;
    status: 'Available' | 'Assigned' | 'Maintenance';
}

const MOCK_EQUIPMENT: Equipment[] = [
    { id: '1', brand: 'Dell', model: 'Latitude 5420', serial: 'DL-5420-001', type: 'Laptop', assignedTo: 'Anna Taylor', status: 'Assigned' },
    { id: '2', brand: 'HP', model: 'EliteBook 840', serial: 'HP-840-002', type: 'Laptop', assignedTo: null, status: 'Available' },
    { id: '3', brand: 'Lenovo', model: 'ThinkPad T14', serial: 'LN-T14-003', type: 'Laptop', assignedTo: 'John Doe', status: 'Assigned' },
    { id: '4', brand: 'LG', model: '27" Ultrafine', serial: 'LG-MON-004', type: 'Monitor', assignedTo: null, status: 'Maintenance' },
    { id: '5', brand: 'Logitech', model: 'MX Master 3', serial: 'LOG-MSE-005', type: 'Mouse', assignedTo: 'Anna Taylor', status: 'Assigned' },
];

export const EquipmentStand: React.FC = () => {
    const [sortKey, setSortKey] = useState<string>('brand');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc');

    const columns: TableColumn<Equipment>[] = [
        { key: 'brand', header: 'Brand', sortable: true },
        { key: 'model', header: 'Model', sortable: true },
        { key: 'serial', header: 'Serial #', sortable: true },
        { key: 'type', header: 'Type' },
        {
            key: 'assignedTo',
            header: 'Assigned To',
            render: (val) => (val as string) || <span style={{ color: '#adb5bd', fontStyle: 'italic' }}>Unassigned</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (val) => {
                const statusStr = (val as string) || '';
                return (
                    <span className={`status-tag status-tag--${statusStr.toLowerCase()}`}>
                        {statusStr}
                    </span>
                );
            }
        },
    ];

    const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
        setSortKey(key);
        setSortDirection(direction);
    };

    return (
        <div className="equipment-stand">
            <header className="equipment-stand__header">
                <h2>Equipment Stand</h2>
                <p>This module displays all equipment currently available in the inventory, along with their status.</p>
            </header>

            <Card variant="elevated">
                <Table
                    id="equipment-stand-table"
                    columns={columns}
                    data={MOCK_EQUIPMENT}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={handleSort}
                    striped
                    hoverable
                />
            </Card>
        </div>
    );
};

export default EquipmentStand;
