import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../../../components/UXLib/Table/Table';
import { Button } from '../../../../components/UXLib/Button/Button';
import { Modal } from '../../../../components/UXLib/Modal/Modal';
import { CmpFieldText } from '../../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { CmpFieldSelect } from '../../../../components/UXLib/cmpFields/fields/CmpFieldSelect';
import { fetchInventory, createEquipment, updateEquipment, deleteEquipment, assignEquipment } from '../../../../api/store/slices/inventorySlice';
import { fetchUsers } from '../../../../api/store/slices/userSlice';
import type { AppDispatch, RootState } from '../../../../api/store/store';
import type { TableColumn } from '../../../../components/UXLib/Table/Table.types';

export const AdminInventory: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.inventory);
    const { items: users } = useSelector((state: RootState) => state.users);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

    // Form State
    const [type, setType] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState('AVAILABLE');
    const [assignUserId, setAssignUserId] = useState<string>('');

    useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleCreateOrUpdate = async () => {
        if (!type || !brand || !serial) return alert('Fill required fields');
        if (selectedEquipment) {
            await dispatch(updateEquipment({ id: selectedEquipment.id, data: { type, brand, model, serial, status } }));
        } else {
            await dispatch(createEquipment({ type, brand, model, serial, status }));
        }
        closeModal();
    };

    const handleAssign = async () => {
        if (!selectedEquipment) return;
        await dispatch(assignEquipment({ id: selectedEquipment.id, userId: assignUserId ? Number(assignUserId) : null }));
        setIsAssignModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEquipment(null);
        setType(''); setBrand(''); setModel(''); setSerial(''); setStatus('AVAILABLE');
    };

    const openEditModal = (item: any) => {
        setSelectedEquipment(item);
        setType(item.type); setBrand(item.brand); setModel(item.model); setSerial(item.serial); setStatus(item.status);
        setIsModalOpen(true);
    };

    const columns: TableColumn<any>[] = [
        { key: 'type', header: 'Type', sortable: true },
        { key: 'brand', header: 'Brand', sortable: true },
        { key: 'model', header: 'Model' },
        { key: 'serial', header: 'Serial' },
        { key: 'status', header: 'Status' },
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, item: any) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button nameBtn="Edit" variant="outlined" onClick={() => openEditModal(item)} />
                    <Button nameBtn="Assign" variant="contained" onClick={() => { setSelectedEquipment(item); setIsAssignModalOpen(true); }} />
                    <Button nameBtn="Delete" variant="outlined" color="secondary" onClick={() => { if (confirm('Delete?')) dispatch(deleteEquipment(item.id)) }} />
                </div>
            )
        },
    ];

    const userOptions: Record<string, string> = { '': 'Unassigned' };
    users.forEach(u => { userOptions[u.id.toString()] = u.name });

    return (
        <div className="admin-inventory">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Inventory Management</h3>
                <Button nameBtn="Add Equipment" variant="contained" onClick={() => setIsModalOpen(true)} />
            </div>

            <Table id="inventory-table" columns={columns} data={items} striped />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedEquipment ? "Edit Equipment" : "Add Equipment"} onConfirm={handleCreateOrUpdate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <CmpFieldText id="type" label="Type" value={type} onChange={setType} mandatory />
                    <CmpFieldText id="brand" label="Brand" value={brand} onChange={setBrand} mandatory />
                    <CmpFieldText id="model" label="Model" value={model} onChange={setModel} />
                    <CmpFieldText id="serial" label="Serial" value={serial} onChange={setSerial} mandatory />
                    <CmpFieldSelect id="status" label="Status" value={status} onChange={(v) => setStatus(v as string)} foreignDao={{ 'AVAILABLE': 'Available', 'ASSIGNED': 'Assigned', 'MAINTENANCE': 'Maintenance', 'DISCHARGED': 'Discharged' }} />
                </div>
            </Modal>

            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Equipment" onConfirm={handleAssign}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p>Assigning: <strong>{selectedEquipment?.brand} {selectedEquipment?.serial}</strong></p>
                    <CmpFieldSelect id="assignUser" label="Select User" value={assignUserId} onChange={(v) => setAssignUserId(v as string)} foreignDao={userOptions} />
                </div>
            </Modal>
        </div>
    );
};
