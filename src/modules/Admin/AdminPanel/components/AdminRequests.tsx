import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../../../components/UXLib/Table/Table';
import { Button } from '../../../../components/UXLib/Button/Button';
import { Modal } from '../../../../components/UXLib/Modal/Modal';
import { CmpFieldText } from '../../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { fetchRequests, updateRequestStatus } from '../../../../api/store/slices/requestSlice';
import type { AppDispatch, RootState } from '../../../../api/store/store';
import type { TableColumn } from '../../../../components/UXLib/Table/Table.types';

export const AdminRequests: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.requests);
    const [selectedReq, setSelectedReq] = useState<any>(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    const handleAction = async (status: string) => {
        if (!selectedReq) return;
        if (status === 'REJECTED' && !comment) return alert('Comment is required for rejection');
        await dispatch(updateRequestStatus({ id: selectedReq.id, status, adminComment: comment }));
        setSelectedReq(null);
        setComment('');
    };

    const columns: TableColumn<any>[] = [
        { key: 'createdAt', header: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
        { key: 'user', header: 'User', render: (val: any) => val?.name || 'N/A' },
        { key: 'category', header: 'Type', render: (val: any) => val?.name || 'N/A' },
        { key: 'description', header: 'Description' },
        { key: 'status', header: 'Status' },
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, item: any) => (
                <Button nameBtn="Review" variant="outlined" onClick={() => setSelectedReq(item)} />
            )
        },
    ];

    return (
        <div className="admin-requests">
            <h3>Standardized Requests Management</h3>
            <Table id="requests-table" columns={columns} data={items} striped />

            <Modal
                isOpen={!!selectedReq}
                onClose={() => setSelectedReq(null)}
                title="Review Ticket"
                footer={
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button nameBtn="Approve" variant="contained" color="primary" onClick={() => handleAction('APPROVED')} />
                        <Button nameBtn="Reject" variant="outlined" color="secondary" onClick={() => handleAction('REJECTED')} />
                    </div>
                }
            >
                {selectedReq && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p><strong>User:</strong> {selectedReq.user?.name}</p>
                        <p><strong>Equipment:</strong> {selectedReq.equipment?.brand} ({selectedReq.equipment?.serial})</p>
                        <p><strong>Description:</strong> {selectedReq.description}</p>
                        <CmpFieldText id="comment" label="Admin Comment / Ticket Status" value={comment} onChange={setComment} template="outlined" />
                    </div>
                )}
            </Modal>
        </div>
    );
};
