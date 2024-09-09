import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [isPastJobs, setIsPastJobs] = useState(false);

    return (
        <DashboardContext.Provider value={{ isPastJobs, setIsPastJobs }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);
