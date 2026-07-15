
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import styles from "./LoginPage.module.css";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await apiLogin({ email, password });
            login(response.user);
            navigate("/home");
        } catch (err) {
            const error = axios.isAxiosError(err) ? err.response?.data?.message : "Login failed. Please check your credentials.";
            setError(error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div>
                    <h2 className={styles.loginTitle}>Sign In</h2>
                </div>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={styles.loginInput}
                            placeholder="Email or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className={styles.loginInput}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className={styles.loginError}>{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.loginButton}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                    <div className={styles.loginOptions}>
                        <div className={styles.loginRemember}>
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                            />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        {/* <div>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div> */}
                    </div>
                </form>
                <div className={styles.loginFooter}>
                    New to English Test Generator?{' '}
                    <Link to="/register">Sign up now</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;