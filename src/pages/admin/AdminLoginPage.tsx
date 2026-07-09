
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAdminLogin } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AdminLoginPage.module.css";

function AdminLoginPage() {
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
            const response = await apiAdminLogin({ email, password });

            // Check if user is actually admin
            if (response.user.role !== 'admin') {
                setError("Access denied. You are not an administrator.");
                return;
            }

            // Use AuthContext login to update global state
            login(response.user, response.token);

            // Redirect to admin dashboard
            navigate("/admin");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Admin login failed. Please check your credentials.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminLoginContainer}>
            <div className={styles.adminLoginBox}>
                <div>
                    <h2 className={styles.adminLoginTitle}>Admin Portal</h2>
                    <p className={styles.adminLoginSubtitle}>Authorized persons only</p>
                </div>
                <form className={styles.adminLoginForm} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={styles.adminLoginInput}
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className={styles.adminLoginInput}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className={styles.adminLoginError}>{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.adminLoginButton}
                    >
                        {loading ? "Verifying Access..." : "Enter Admin Panel"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLoginPage;
