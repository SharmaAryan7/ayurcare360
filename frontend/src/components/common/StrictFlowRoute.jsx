import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Guards routes that should only be accessible via a specific button click/flow,
 * preventing direct URL access or page refreshes.
 */
const StrictFlowRoute = ({ requiredStateKey, fallbackRoute }) => {
    const location = useLocation();

    // Check if the required state key was passed during navigation
    const hasValidFlowState = location.state && location.state[requiredStateKey];

    if (!hasValidFlowState) {
        // If accessed directly via URL, kick them back to the safe fallback route
        return <Navigate to={fallbackRoute} replace />;
    }

    return <Outlet />;
};

export default StrictFlowRoute;