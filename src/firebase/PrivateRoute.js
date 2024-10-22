import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/shop-login', { replace: true });
            }
        });

        return () => unsubscribe();
    }, []);

    return children;
};

export default PrivateRoute;
