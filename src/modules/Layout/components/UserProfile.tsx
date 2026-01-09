import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../../components/UXLib/Avatar/Avatar';
import { Button } from '../../../components/UXLib/Button/Button';
import { logout } from '../../../api/store/slices/authSlice';
import type { RootState } from '../../../api/store/store';
import type { AppDispatch } from '../../../api/store/store';
import './UserProfile.scss';

export const UserProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    if (!user) return null;

    return (
        <div className="user-profile" ref={dropdownRef}>
            <div
                className="user-profile__trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                role="button"
                tabIndex={0}
            >
                <Avatar
                    name={user.name}
                    size={40}
                    shape="circle"
                    className="user-profile__avatar"
                />
                <div className="user-profile__info">
                    <span className="user-profile__name">{user.name}</span>
                    <span className="user-profile__role">{user.role}</span>
                </div>
            </div>

            {dropdownOpen && (
                <div className="user-profile__dropdown">
                    <div className="user-profile__dropdown-header">
                        <span className="user-profile__email">{user.email}</span>
                    </div>
                    <div className="user-profile__dropdown-divider" />
                    <Button
                        nameBtn="Cerrar Sesión"
                        variant="text"
                        icon="logout"
                        iconPosition="left"
                        onClick={handleLogout}
                        className="user-profile__logout-btn"
                    />
                </div>
            )}
        </div>
    );
};
