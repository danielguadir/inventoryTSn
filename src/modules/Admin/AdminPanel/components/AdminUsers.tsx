import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../../../components/UXLib/Table/Table';
import { Button } from '../../../../components/UXLib/Button/Button';
import { Modal } from '../../../../components/UXLib/Modal/Modal';
import { CmpFieldText } from '../../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { CmpFieldSelect } from '../../../../components/UXLib/cmpFields/fields/CmpFieldSelect';
import { fetchUsers, createUser, updateUser } from '../../../../api/store/slices/userSlice';
import type { AppDispatch, RootState } from '../../../../api/store/store';
import type { TableColumn } from '../../../../components/UXLib/Table/Table.types';

export const AdminUsers: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.users);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleCreate = async () => {
        if (!name || !email || !password) return alert('Fill all fields');
        await dispatch(createUser({ name, email, password, role }));
        setIsModalOpen(false);
        // Reset form
        setName(''); setEmail(''); setPassword(''); setRole('USER');
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        await dispatch(updateUser({ id, data: { active: !currentStatus } }));
    };

    const handleResetPassword = async (id: number) => {
        const newPassword = prompt('Enter new password for this user:');
        if (!newPassword) return;
        await dispatch(updateUser({ id, data: { password: newPassword } }));
        alert('Password updated successfully');
    };

    const columns: TableColumn<any>[] = [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Name', sortable: true },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'active', header: 'Active', render: (val: boolean) => val ? 'Yes' : 'No' },
        {
            key: 'actions',
            header: 'Actions',
            render: (_: any, item: any) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button
                        nameBtn={item.active ? 'Deactivate' : 'Activate'}
                        variant="outlined"
                        color={item.active ? 'secondary' : 'primary'}
                        onClick={() => handleToggleActive(item.id, item.active)}
                    />
                    <Button
                        nameBtn="Reset Pass"
                        variant="outlined"
                        onClick={() => handleResetPassword(item.id)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="admin-users">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Users Management</h3>
                <Button nameBtn="Add User" variant="contained" onClick={() => setIsModalOpen(true)} />
            </div>

            <Table
                id="users-table"
                columns={columns}
                data={items}
                striped
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New User"
                onConfirm={handleCreate}
                confirmText="Create"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <CmpFieldText id="name" label="Name" value={name} onChange={setName} mandatory template="outlined" />
                    <CmpFieldText id="email" label="Email" value={email} onChange={setEmail} mandatory template="outlined" />
                    <CmpFieldText id="password" label="Password" value={password} onChange={setPassword} mandatory template="outlined" type="password" />
                    <CmpFieldSelect
                        id="role"
                        label="Role"
                        value={role}
                        onChange={(v) => setRole(v as string)}
                        template="outlined"
                        foreignDao={{ 'USER': 'User', 'ADMIN': 'Admin' }}
                    />
                </div>
            </Modal>
        </div>
    );
};

