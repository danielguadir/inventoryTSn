import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from '../../components/UXLib/Menu/Menu';
import type { MenuItem } from '../../components/UXLib/Menu/Menu.types';
import type { RootState } from '../../api/store/store';
import { UserProfile } from './components/UserProfile';
import './MainLayout.scss';

export const MainLayout: React.FC = () => {
    const [expanded, setExpanded] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab from URL
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/app/report')) return 'report';
        if (path.includes('/app/stand')) return 'stand';
        if (path.includes('/app/requests')) return 'requests';
        if (path.includes('/app/equipment')) return 'equipment';
        if (path.includes('/app/admin')) return 'admin';
        return 'report';
    };

    const activeTab = getActiveTab();

    const menuItems: MenuItem[] = [
        {
            id: 'report',
            label: 'Report Equipment',
            icon: 'pencil',
            active: activeTab === 'report',
            onClick: () => navigate('/app/report'),
        },
        {
            id: 'stand',
            label: 'Equipment Stand',
            icon: 'th-list',
            active: activeTab === 'stand',
            subItems: [
                {
                    id: 'stand-computing',
                    label: 'Computing Equipment',
                    active: location.pathname === '/app/stand/computing',
                    onClick: () => navigate('/app/stand/computing')
                },
                {
                    id: 'stand-accessories',
                    label: 'Accessories',
                    active: location.pathname === '/app/stand/accessories',
                    onClick: () => navigate('/app/stand/accessories')
                },
                {
                    id: 'stand-network',
                    label: 'Network',
                    active: location.pathname === '/app/stand/network',
                    onClick: () => navigate('/app/stand/network')
                },
            ],
            onClick: () => navigate('/app/stand'),
        },
        {
            id: 'requests',
            label: 'My Requests',
            icon: 'form',
            active: activeTab === 'requests',
            onClick: () => navigate('/app/requests'),
        },
        {
            id: 'equipment',
            label: 'My Equipment',
            icon: 'home',
            active: activeTab === 'equipment',
            onClick: () => navigate('/app/equipment'),
        },
    ];

    const secondaryItems: MenuItem[] = [
        {
            id: 'admin',
            label: 'Admin Panel',
            icon: 'cog',
            active: activeTab === 'admin',
            subItems: [
                {
                    id: 'admin-users',
                    label: 'Users',
                    active: location.pathname === '/app/admin/users',
                    onClick: () => navigate('/app/admin/users')
                },
                {
                    id: 'admin-inventory',
                    label: 'Inventory',
                    active: location.pathname === '/app/admin/inventory',
                    onClick: () => navigate('/app/admin/inventory')
                },
                {
                    id: 'admin-requests',
                    label: 'Requests',
                    active: location.pathname === '/app/admin/requests',
                    onClick: () => navigate('/app/admin/requests')
                },
                {
                    id: 'admin-infrastructure',
                    label: 'Infraestructura',
                    active: location.pathname === '/app/admin/infrastructure',
                    onClick: () => navigate('/app/admin/infrastructure')
                },
                {
                    id: 'admin-notifications',
                    label: 'Notifications',
                    active: location.pathname === '/app/admin/notifications',
                    onClick: () => navigate('/app/admin/notifications')
                },
            ],
            onClick: () => navigate('/app/admin/users'),
        },
    ];

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
            />
            <div className="main-layout__container">
                <header className="main-layout__header">
                    <div className="main-layout__header-content">
                        <UserProfile />
                    </div>
                </header>
                <main className="main-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
