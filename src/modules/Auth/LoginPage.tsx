import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../components/UXLib/Card/Card';
import { CmpFieldText } from '../../components/UXLib/cmpFields/fields/CmpFieldText';
import { FieldPassword } from '../../components/UXLib/cmpFields/fields/FieldPassword';
import { Button } from '../../components/UXLib/Button/Button';
import { loginUser } from '../../api/store/slices/authSlice';
import type { AppDispatch, RootState } from '../../api/store/store';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && password.trim()) {
            dispatch(loginUser({ email, password }));
        }
    };

    return (
        <div className="login-page">
            <Card className="login-page__card" variant="elevated">
                <div className="login-page__header">
                    <h1>Welcome</h1>
                </div>

                <form className="login-page__form" onSubmit={handleLogin}>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <CmpFieldText
                        id="email"
                        label="Email"
                        value={email}
                        onChange={(val) => setEmail(val)}
                        mandatory
                        template="outlined"
                        iconPosition="left"
                        iconSelect="user"
                    />

                    <FieldPassword
                        id="password"
                        label="Password"
                        value={password}
                        onChange={(val) => setPassword(val as string)}
                        mandatory
                        template="outlined"
                    />

                    <div className="login-page__actions">
                        <Button
                            type="submit"
                            nameBtn={loading ? 'Loading...' : 'Login'}
                            variant="contained"
                            className="login-page__login-btn"
                            onClick={handleLogin}
                            disabled={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
