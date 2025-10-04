import { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { getFamilyData } from '@/api/functions';

const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

export function useFamily() {
    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchFamilyData = useCallback(async (attempt = 0) => {
        try {
            setIsLoading(true);
            setError(null);

            const { data, status } = await getFamilyData();
            
            if (status === 401) {
                // Force re-login
                await User.loginWithRedirect(window.location.href);
                return;
            }

            if (status === 404 && attempt === 0) {
                // Retry once for 404 (backend will create family)
                setTimeout(() => fetchFamilyData(1), 500);
                return;
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setFamily(data.family);
            setMembers(data.members || []);
            setCurrentUser(data.currentUser);
            setRetryCount(0);

        } catch (err) {
            console.error('Family fetch error:', err.message);
            
            if (attempt < RETRY_DELAYS.length) {
                setTimeout(() => fetchFamilyData(attempt + 1), RETRY_DELAYS[attempt]);
                return;
            }

            setError(err.message);
            setRetryCount(attempt);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFamilyData();
    }, [fetchFamilyData]);

    const retry = useCallback(() => {
        setError(null);
        setRetryCount(0);
        fetchFamilyData();
    }, [fetchFamilyData]);

    const hasFamily = Boolean(family);
    const isAdmin = currentUser?.data?.family_role === 'admin';
    const hasFamilyPlan = currentUser?.plan && ['family_monthly', 'family_yearly'].includes(currentUser.plan);
    const canManage = isAdmin && hasFamilyPlan;

    return {
        family,
        members,
        currentUser,
        isLoading,
        error,
        hasFamily,
        isAdmin,
        hasFamilyPlan,
        canManage,
        retry,
        refetch: fetchFamilyData
    };
}