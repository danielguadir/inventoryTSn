import React from 'react';
import { Card } from '../../../components/UXLib/Card/Card';
import './AdminPanel.scss';
import { AdminUsers } from './components/AdminUsers';
import { AdminInventory } from './components/AdminInventory';
import { AdminRequests } from './components/AdminRequests';
import { AdminCategories } from './components/AdminCategories';

interface AdminPanelProps {
    activeSubTab: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ activeSubTab }) => {
    // Determine the label based on the sub-tab ID
    const getSubTabLabel = (id: string) => {
        switch (id) {
            case 'admin-users': return 'Users Management';
            case 'admin-inventory': return 'Inventory Administration';
            case 'admin-requests': return 'Service Requests Control';
            case 'admin-notifications': return 'System Notifications';
            default: return 'Admin Overview';
        }
    };

    return (
        <div className="admin-panel">
            <header className="admin-panel__header">
                <h2>Admin Panel</h2>
                <p>Advanced system controls and administrative settings.</p>
            </header>

            <Card variant="elevated">
                <div className="admin-panel__content">
                    {/* {getSubTabLabel(activeSubTab)} */}
                    {activeSubTab === 'admin-users' && <AdminUsers />}
                    {activeSubTab === 'admin-inventory' && <AdminInventory />}
                    {activeSubTab === 'admin-requests' && <AdminRequests />}
                    {activeSubTab === 'admin-categories' && <AdminCategories />}
                    {activeSubTab === 'admin-notifications' && (
                        <div className="admin-panel__empty-state">
                            <p>System Notifications module coming soon.</p>
                        </div>
                    )}
                    {/* Default view or Dashboard could go here */}
                    {!['admin-users', 'admin-inventory', 'admin-requests', 'admin-notifications'].includes(activeSubTab) && (
                        <div className="admin-panel__dashboard">
                            <h3>Admin Dashboard</h3>
                            <p>Select a module from the sidebar to manage the system.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;
