import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../../../components/UXLib/Table/Table';
import { Button } from '../../../../components/UXLib/Button/Button';
import { Modal } from '../../../../components/UXLib/Modal/Modal';
import { CmpFieldText } from '../../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { fetchCategories, createCategory } from '../../../../api/store/slices/categorySlice';
import type { AppDispatch, RootState } from '../../../../api/store/store';
import type { TableColumn } from '../../../../components/UXLib/Table/Table.types';

export const AdminCategories: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCreate = async () => {
        if (!name) return alert('Name is required');
        await dispatch(createCategory(name));
        setIsModalOpen(false);
        setName('');
    };

    const columns: TableColumn<any>[] = [
        { key: 'id', header: 'ID', sortable: true },
        { key: 'name', header: 'Category Name', sortable: true },
        { key: 'active', header: 'Active', render: (val: boolean) => val ? 'Yes' : 'No' },
    ];

    return (
        <div className="admin-categories">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Damage Categories</h3>
                <Button nameBtn="Add Category" variant="contained" onClick={() => setIsModalOpen(true)} />
            </div>

            <Table id="categories-table" columns={columns} data={items} striped />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Category" onConfirm={handleCreate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <CmpFieldText id="cat-name" label="Category Name" value={name} onChange={setName} mandatory template="outlined" />
                </div>
            </Modal>
        </div>
    );
};
