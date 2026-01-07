import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
    // Mocking Redux selectors to match the user's JSX structure
    const user = useSelector((s: any) => s.auth?.currentUserName || 'Daniel Guadir');
    const lastId = useSelector((s: any) => s.requests?.lastCreatedId);
    const req = useSelector((s: any) => s.requests?.list?.find((r: any) => r.id === lastId));

    // Inventory items for the "My equipment" selector
    const inventoryItems = useSelector((s: any) => (s.inventory?.items || []));
    const confirmedItems = inventoryItems.filter((i: any) => i.assignedTo === user && i.confirmedByUser);

    // Fallback Mock Data for demo if store is empty
    const demoItems = confirmedItems.length > 0 ? confirmedItems : [
        { marca: 'Dell', serial: 'LAP-001', assignedTo: 'Daniel Guadir', confirmedByUser: true },
        { marca: 'HP', serial: 'MON-045', assignedTo: 'Daniel Guadir', confirmedByUser: true }
    ];

    // const dispatch = useDispatch();

    const [tipo, setTipo] = useState('');
    const [otroNombre, setOtroNombre] = useState('');
    const [serial, setSerial] = useState('');
    const [falla, setFalla] = useState('');
    const [foto, setFoto] = useState<string | null>(null);
    const [selectedConfirmed, setSelectedConfirmed] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function validateFalla() {
        const text = (falla || '').trim();
        if (text.length > MAX_FAILA_LEN) return false;
        const words = text.split(/\s+/).filter(Boolean);
        return words.length >= 2;
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // if no equipment selected manually, require minimum 2 words description
        if ((!selectedConfirmed || selectedConfirmed === 'manual') && !validateFalla()) {
            return alert('Please describe the failure with at least 2 words (max 100 characters)');
        }

        setSubmitting(true);
        console.log('Form submission attempted:', { tipo, serial, falla, foto });

        alert('Functionality temporarily disabled');
        setSubmitting(false);
        return;
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
                            label="Type"
                            template="outlined"
                            mandatory
                            value={tipo}
                            onChange={(val) => setTipo(val as string)}
                            foreignDao={REQUEST_TYPES}
                        />
                    </div>

                    {tipo === 'Other' ? (
                        <div className="form-group">
                            <CmpFieldText
                                id="otroNombre"
                                label='"Other" Name'
                                template="outlined"
                                mandatory
                                value={otroNombre}
                                onChange={(val) => setOtroNombre(val)}
                            />
                        </div>
                    ) : <div className="form-group" />}

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
