import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';
import api from '../api/axios';

const STORAGE_KEY = 'resumecraft_visitor_id';
const HEARTBEAT_INTERVAL = 30_000;

const createVisitorId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().replace(/-/g, '');
    }

    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

const getVisitorId = () => {
    try {
        const storedId = window.localStorage.getItem(STORAGE_KEY);
        if (storedId && /^[a-zA-Z0-9_-]{16,128}$/.test(storedId)) return storedId;

        const newId = createVisitorId();
        window.localStorage.setItem(STORAGE_KEY, newId);
        return newId;
    } catch {
        return createVisitorId();
    }
};

const ActiveUsersBadge = () => {
    const location = useLocation();
    const [online, setOnline] = useState(null);
    const isEditor = location.pathname.startsWith('/editor');
    const positionClass = isEditor ? 'bottom-24 sm:bottom-24' : 'bottom-5';

    useEffect(() => {
        let active = true;
        const visitorId = getVisitorId();

        const refreshPresence = async () => {
            try {
                await api.post('/presence/heartbeat', { visitorId });
                const { data } = await api.get('/presence/online');
                if (active && Number.isFinite(data?.online)) setOnline(data.online);
            } catch {
                // Presence is non-critical; hide the badge when the API or database is unavailable.
            }
        };

        refreshPresence();
        const intervalId = window.setInterval(refreshPresence, HEARTBEAT_INTERVAL);
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') refreshPresence();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            active = false;
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    if (online === null) return null;

    return (
        <div className={`fixed ${positionClass} right-5 z-[70] hidden items-center gap-2 rounded-full border border-emerald-200/80 bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-[0_12px_36px_rgba(15,23,42,0.14)] backdrop-blur sm:flex`} aria-live="polite">
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <Users className="h-3.5 w-3.5 text-emerald-600" />
            <span>{online} {online === 1 ? 'person' : 'people'} building now</span>
        </div>
    );
};

export default ActiveUsersBadge;

