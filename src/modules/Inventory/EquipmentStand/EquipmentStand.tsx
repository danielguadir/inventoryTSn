import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/UXLib/Card/Card';
import { Table } from '../../../components/UXLib/Table/Table';
import type { TableColumn } from '../../../components/UXLib/Table/Table.types';
import { CmpFieldText } from '../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { CmpFieldSelect } from '../../../components/UXLib/cmpFields/fields/CmpFieldSelect';
import { fetchInventory } from '../../../api/store/slices/inventorySlice';
import type { AppDispatch, RootState } from '../../../api/store/store';
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

export const EquipmentStand: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.inventory);
    const [sortKey, setSortKey] = useState<string>('brand');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    const filteredItems = items.filter((item: any) => {
        const matchesSearch =
            item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? item.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

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
                <p>This module displays all equipment currently available in the inventory.</p>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <CmpFieldText
                        id="search"
                        label="Search (Serial, Brand, Model)"
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)}
                        template="outlined"
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <CmpFieldSelect
                        id="statusFilter"
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as string)}
                        template="outlined"
                        foreignDao={{ '': 'All', 'AVAILABLE': 'Available', 'ASSIGNED': 'Assigned', 'MAINTENANCE': 'Maintenance' }}
                    />
                </div>
            </div>

            <Card variant="elevated">
                {loading ? <p>Loading inventory...</p> : (
                    <Table
                        id="equipment-stand-table"
                        columns={columns}
                        data={filteredItems}
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSortChange={handleSort}
                        striped
                        hoverable
                    />
                )}
            </Card>
        </div>
    );
};

export default EquipmentStand;
