import React from 'react';
import { Card } from '../../../components/UXLib/Card/Card';
import './AdminPanel.scss';

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
                <div className="admin-panel__placeholder">
                    <h3>{getSubTabLabel(activeSubTab)}</h3>
                    <div className="admin-panel__empty-state">
                        <p>This module is currently under development.</p>
                        <p>Soon you will be able to manage <strong>{getSubTabLabel(activeSubTab).toLowerCase()}</strong> from this section.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;
