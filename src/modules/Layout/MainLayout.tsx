import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from '../../components/UXLib/Menu/Menu';
import type { MenuItem } from '../../components/UXLib/Menu/Menu.types';
import type { RootState } from '../../api/store/store';
import './MainLayout.scss';
import { ReportEquipment } from '../Tickets/ReportEquipment/ReportEquipment';
import { EquipmentStand } from '../Inventory/EquipmentStand/EquipmentStand';
import { MyRequests } from '../Tickets/MyRequests/MyRequests';
import { MyEquipment } from '../Inventory/MyEquipment/MyEquipment';
import { AdminPanel } from '../Admin/AdminPanel/AdminPanel';

export const MainLayout: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState('report');

    const menuItems: MenuItem[] = [
        {
            id: 'report',
            label: 'Report Equipment',
            icon: 'pencil',
            active: activeTab === 'report',
            onClick: () => setActiveTab('report'),
        },
        {
            id: 'stand',
            label: 'Equipment Stand',
            icon: 'th-list',
            active: activeTab === 'stand' || activeTab.startsWith('stand-'),
            subItems: [
                {
                    id: 'stand-computing',
                    label: 'Computing Equipment',
                    active: activeTab === 'stand-computing',
                    onClick: () => setActiveTab('stand-computing')
                },
                {
                    id: 'stand-accessories',
                    label: 'Accessories',
                    active: activeTab === 'stand-accessories',
                    onClick: () => setActiveTab('stand-accessories')
                },
                {
                    id: 'stand-network',
                    label: 'Network',
                    active: activeTab === 'stand-network',
                    onClick: () => setActiveTab('stand-network')
                },
            ],
            onClick: () => setActiveTab('stand'),
        },
        {
            id: 'requests',
            label: 'My Requests',
            icon: 'form',
            active: activeTab === 'requests',
            onClick: () => setActiveTab('requests'),
        },
        {
            id: 'equipment',
            label: 'My Equipment',
            icon: 'home',
            active: activeTab === 'equipment',
            onClick: () => setActiveTab('equipment'),
        },
    ];

    const secondaryItems: MenuItem[] = [
        {
            id: 'admin',
            label: 'Admin Panel',
            icon: 'cog',
            active: activeTab === 'admin' || activeTab.startsWith('admin-'),
            subItems: [
                {
                    id: 'admin-users',
                    label: 'Users',
                    active: activeTab === 'admin-users',
                    onClick: () => setActiveTab('admin-users')
                },
                {
                    id: 'admin-inventory',
                    label: 'Inventory',
                    active: activeTab === 'admin-inventory',
                    onClick: () => setActiveTab('admin-inventory')
                },
                {
                    id: 'admin-requests',
                    label: 'Requests',
                    active: activeTab === 'admin-requests',
                    onClick: () => setActiveTab('admin-requests')
                },
                {
                    id: 'admin-infrastructure',
                    label: 'Infraestructura',
                    active: activeTab === 'admin-infrastructure',
                    onClick: () => setActiveTab('admin-infrastructure')
                },
                {
                    id: 'admin-notifications',
                    label: 'Notifications',
                    active: activeTab === 'admin-notifications',
                    onClick: () => setActiveTab('admin-notifications')
                },
            ],
            onClick: () => setActiveTab('admin'),
        },
    ];

    const findLabel = (items: MenuItem[], id: string): string | undefined => {
        for (const item of items) {
            if (item.id === id) return item.label as string;
            if (item.subItems) {
                const subItem = item.subItems.find(sub => sub.id === id);
                if (subItem) return subItem.label;
            }
        }
        return undefined;
    };

    const currentLabel = findLabel([...menuItems, ...secondaryItems], activeTab) || 'Content';

    const renderContent = () => {
        switch (activeTab) {
            case 'report':
                return <ReportEquipment />;
            case 'stand':
            case 'stand-computing':
            case 'stand-accessories':
            case 'stand-network':
                return <EquipmentStand />;
            case 'requests':
                return <MyRequests />;
            case 'equipment':
                return <MyEquipment />;
            case 'admin':
            case 'admin-users':
            case 'admin-inventory':
            case 'admin-requests':
            case 'admin-infrastructure':
            case 'admin-notifications':
                return <AdminPanel activeSubTab={activeTab} />;
            default:
                return (
                    <>
                        <h1>{currentLabel}</h1>
                        <div className="main-layout__page-content">
                            <p>This is the content area for <strong>{currentLabel}</strong>.</p>
                            <p>Development of this module will follow in subsequent stages.</p>
                        </div>
                    </>
                );
        }
    };

    const user = useSelector((state: RootState) => state.auth.user);
    const userRole = user?.role;

    const filteredSecondaryItems = secondaryItems.filter(item =>
        item.id !== 'admin' || userRole === 'ADMIN'
    );

    return (
        <div className="main-layout">
            <Menu
                expanded={expanded}
                onToggleExpand={setExpanded}
                brandName="Inventory"
                items={menuItems}
                secondaryItems={filteredSecondaryItems}
                user={{
                    name: user?.name || 'Guest',
                    email: user?.email || '',
                    avatar: '',
                }}
            />
            <main className="main-layout__content">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainLayout;
