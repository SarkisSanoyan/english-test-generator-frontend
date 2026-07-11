import { NavLink } from 'react-router-dom';

import brainLogo from '../../assets/Brain.png';
import classes from './MainNavigation.module.css';


import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function MainNavigation() {
    const { isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/home', { replace: true });
    };

    if (loading) return null;

    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <NavLink to="/home">
                    <img src={brainLogo} alt="Brain Logo" />
                </NavLink>
                <span>English Test Generator</span>
            </div>

            <nav>
                <ul className={classes.links}>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        {isAuthenticated ? (
                            <NavLink
                                to="/login"
                                onClick={handleLogout}
                                className={({ isActive }) =>
                                    isActive ? classes.active : undefined
                                }
                            >
                                Logout
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? classes.active : undefined
                                }
                            >
                                Login
                            </NavLink>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}
export default MainNavigation;
