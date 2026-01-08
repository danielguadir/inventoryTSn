import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/UXLib/Card/Card';
import { fetchInventory } from '../../../api/store/slices/inventorySlice';
import type { AppDispatch, RootState } from '../../../api/store/store';

export const MyEquipment: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.inventory);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    // Filter items assigned to the current user
    const myItems = items.filter((item: any) => item.assignedToUserId === user?.id);

    return (
        <div className="my-equipment">
            <Card title="My Equipment" variant="elevated">
                {loading && <p>Loading...</p>}
                {!loading && myItems.length === 0 && <p>No equipment assigned to you yet.</p>}

                {myItems.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {myItems.map((item: any) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                                <h3>{item.brand} {item.model}</h3>
                                <p><strong>Serial:</strong> {item.serial}</p>
                                <p><strong>Type:</strong> {item.type}</p>
                                <p><strong>Status:</strong> {item.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MyEquipment;
