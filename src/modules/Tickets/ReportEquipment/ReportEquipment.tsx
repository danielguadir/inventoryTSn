import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRequest, fetchRequests } from '../../../api/store/slices/requestSlice';
import { fetchInventory } from '../../../api/store/slices/inventorySlice';
import { fetchCategories } from '../../../api/store/slices/categorySlice';
import type { AppDispatch, RootState } from '../../../api/store/store';
import { Card } from '../../../components/UXLib/Card/Card';
import { CmpFieldText } from '../../../components/UXLib/cmpFields/fields/CmpFieldText';
import { CmpFieldSelect } from '../../../components/UXLib/cmpFields/fields/CmpFieldSelect';
import FileUploaderWithPreview from '../../../components/UXLib/cmpFields/fields/CmpFieldUpload';
import { Button } from '../../../components/UXLib/Button/Button';
import './ReportEquipment.scss';

// Mock Link component since react-router-dom is not installed
const Link: React.FC<{ to: string, style?: any, children: React.ReactNode }> = ({ children, style }) => (
    <span style={{ ...style, cursor: 'pointer', textDecoration: 'underline' }}>{children}</span>
);

// Constants
// Constants
const REQUEST_TYPES = {
    'Monitor': 'Monitor',
    'Computer': 'Computer',
    'Mouse': 'Mouse',
    'Charger': 'Charger',
    'Laptop Stand': 'Laptop Stand',
    'Other': 'Other'
};
const MAX_FAILA_LEN = 100;

export const ReportEquipment: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);
    const { items: requests, loading: submitting } = useSelector((state: RootState) => state.requests);
    const { items: categories } = useSelector((state: RootState) => state.categories);

    // Get latest request for status display
    const req = requests.length > 0 ? requests[requests.length - 1] : null;

    // Fetch data on mount
    React.useEffect(() => {
        dispatch(fetchInventory());
        dispatch(fetchCategories());
        dispatch(fetchRequests());
    }, [dispatch]);

    const confirmedItems = inventoryItems.filter((i: any) => i.assignedToUserId === user?.id);
    const demoItems = confirmedItems; // Use real items

    const [tipoId, setTipoId] = useState<string>('');
    const [serial, setSerial] = useState('');
    const [falla, setFalla] = useState('');
    const [foto, setFoto] = useState<string | null>(null);
    const [selectedConfirmed, setSelectedConfirmed] = useState('');

    function validateFalla() {
        const text = (falla || '').trim();
        if (text.length > MAX_FAILA_LEN) return false;
        const words = text.split(/\s+/).filter(Boolean);
        return words.length >= 2;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tipoId || !falla) return alert('Please fill required fields');

        if ((!selectedConfirmed || selectedConfirmed === 'manual') && !validateFalla()) {
            return alert('Please describe the failure with at least 2 words');
        }

        const requestData = {
            categoryId: Number(tipoId),
            description: falla,
            priority: 'MEDIUM',
            equipmentId: selectedConfirmed !== 'manual' ? inventoryItems.find(i => `${i.brand} - ${i.serial}` === selectedConfirmed)?.id : null,
        };

        await dispatch(createRequest(requestData));
        alert('Report submitted successfully');
    };

    const getCategoryOptions = () => {
        const options: Record<string, string> = {};
        categories.forEach((c: any) => {
            options[c.id.toString()] = c.name;
        });
        return options;
    };

    const getEquipmentOptions = () => {
        const options: Record<string, string> = {};
        demoItems.forEach((i: any) => {
            const key = `${i.marca || 'Equipment'} - ${i.serial}`;
            options[key] = key;
        });
        options['manual'] = 'Other / Enter manually';
        return options;
    };

    return (
        <div className="report-equipment">
            <Card
                title="Report Equipment"
                subtitle={`User: ${user}`}
                variant="elevated"
            >
                <form onSubmit={onSubmit} className="report-form">
                    <div className="form-group">
                        <CmpFieldSelect
                            id="tipo"
                            label="Problem Category"
                            template="outlined"
                            mandatory
                            value={tipoId}
                            onChange={(val) => setTipoId(val as string)}
                            foreignDao={getCategoryOptions()}
                        />
                    </div>

                    {demoItems.length > 0 && (
                        <div className="form-group full-width">
                            <CmpFieldSelect
                                id="myEquipment"
                                label="Which equipment has the issue?"
                                template="outlined"
                                value={selectedConfirmed}
                                onChange={(v) => {
                                    const val = v as string;
                                    setSelectedConfirmed(val);
                                    if (val === 'manual') setSerial('');
                                    else if (val) {
                                        const parts = val.split(' - ');
                                        setSerial(parts[parts.length - 1] || '');
                                    }
                                }}
                                foreignDao={getEquipmentOptions()}
                            />
                        </div>
                    )}

                    {/* Show manual serial field ONLY if 'manual' is selected OR no items available */}
                    {(selectedConfirmed === 'manual' || demoItems.length === 0) && (
                        <div className="form-group">
                            <CmpFieldText
                                id="serial"
                                label="Enter Serial manually"
                                template="outlined"
                                mandatory
                                value={serial}
                                onChange={(val) => setSerial(val)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <FileUploaderWithPreview
                            id="foto"
                            label="Photo (optional)"
                            onFileSelect={(file: any) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => setFoto(String(ev.target?.result));
                                reader.readAsDataURL(file);
                            }}
                            onChange={() => { }}
                            error={null}
                            description="Upload a photo of the failure"
                        />
                    </div>

                    <div className="form-group full-width">
                        <CmpFieldText
                            id="falla"
                            label={`Failure Description (${MAX_FAILA_LEN - falla.length} remaining)`}
                            template="outlined"
                            mandatory
                            value={falla}
                            onChange={(val) => {
                                if (val.length <= MAX_FAILA_LEN) {
                                    setFalla(val);
                                }
                            }}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            variant="contained"
                            color="primary"
                            nameBtn={submitting ? 'Sending...' : 'Report'}
                            type="submit"
                            disabled={submitting}
                        />

                        {req && req.userName === user && (
                            <div className="report-status">
                                {req.status === 'approved' ? (
                                    <Link to="/app/mis" style={{ color: '#06c', textDecoration: 'underline' }}>
                                        Latest request download available in My Requests
                                    </Link>
                                ) : (
                                    <span style={{ color: '#666' }}>Waiting for admin to review the report</span>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ReportEquipment;
