import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
    const [user, setUser] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Check if the user has admin privileges
                user.getIdTokenResult().then((idTokenResult) => {
                    if (idTokenResult.claims.admin) {
                        setUser(user);
                    }
                });
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return <Navigate to="/shop-login" replace />;
    }

    return children;
};

export default PrivateRoute;
