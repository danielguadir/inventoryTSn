import React, { useState } from 'react';
import { Card } from '../../components/UXLib/Card/Card';
import { CmpFieldText } from '../../components/UXLib/cmpFields/fields/CmpFieldText';
import { FieldPassword } from '../../components/UXLib/cmpFields/fields/FieldPassword';
import { Button } from '../../components/UXLib/Button/Button';
import './LoginPage.scss';

export const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { username, password });
        // Simulated login: any input works
        if (username.trim()) {
            onLogin();
        } else {
            alert('Please enter a username (login is free for demo purposes)');
        }
    };

    return (
        <div className="login-page">
            <Card className="login-page__card" variant="elevated">
                <div className="login-page__header">
                    <h1>Welcome</h1>
                </div>

                <form className="login-page__form" onSubmit={handleLogin}>
                    <CmpFieldText
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(val) => setUsername(val)}
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
                            nameBtn="Login"
                            variant="contained"
                            className="login-page__login-btn"
                            onClick={handleLogin}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
