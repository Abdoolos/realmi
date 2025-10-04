import React from 'react';
import FinancialPlanner from '@/components/FinancialPlanner';
import ProtectedRoute from '@/components/ProtectedRoute';

function FinancialPlannerPage() {
    return (
        <div>
            <FinancialPlanner />
        </div>
    )
}

export default () => (
    <ProtectedRoute>
        <FinancialPlannerPage />
    </ProtectedRoute>
)