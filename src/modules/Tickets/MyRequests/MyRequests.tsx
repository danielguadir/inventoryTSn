import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/UXLib/Card/Card';
import { fetchRequests } from '../../../api/store/slices/requestSlice';
import type { AppDispatch, RootState } from '../../../api/store/store';
import './MyRequests.scss'; // Assuming you might want styles later

export const MyRequests: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.requests);

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    return (
        <div className="my-requests">
            <Card title="My Requests" variant="elevated">
                {loading && <p>Loading requests...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && items.length === 0 && <p>No requests found.</p>}

                {items.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '8px' }}>ID</th>
                                <th style={{ padding: '8px' }}>Description</th>
                                <th style={{ padding: '8px' }}>Status</th>
                                <th style={{ padding: '8px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px' }}>{req.id}</td>
                                    <td style={{ padding: '8px' }}>{req.description}</td>
                                    <td style={{ padding: '8px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: req.status === 'APPROVED' ? '#e6fffa' : '#fff5f5',
                                            color: req.status === 'APPROVED' ? '#047857' : '#c53030'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '8px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};

export default MyRequests;
