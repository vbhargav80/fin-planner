import React, { createContext, useContext, useState } from 'react';
import { SYSTEM_DEFAULTS } from '../constants/defaultValues';
import type { AppConfig, ConfigContextType } from '../types/config.types';
import { STORAGE_KEYS } from '../constants/storageKeys';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Config State
    const [config, setConfig] = useState<AppConfig>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.APP_DEFAULTS);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to parse saved defaults", e);
        }
        return SYSTEM_DEFAULTS;
    });

    // 2. Admin Mode State
    const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
        return localStorage.getItem(STORAGE_KEYS.ADMIN_MODE) === 'true';
    });

    const updateConfig = (newConfig: AppConfig) => {
        setConfig(newConfig);
        localStorage.setItem(STORAGE_KEYS.APP_DEFAULTS, JSON.stringify(newConfig));
    };

    const resetToSystemDefaults = () => {
        if (window.confirm("Reset ADMIN defaults to system original? This does not affect user data.")) {
            setConfig(SYSTEM_DEFAULTS);
            localStorage.removeItem(STORAGE_KEYS.APP_DEFAULTS);
        }
    };

    const toggleAdminMode = () => {
        setIsAdminMode(prev => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(next));
            return next;
        });
    };

    return (
        <ConfigContext.Provider value={{
            config,
            updateConfig,
            resetToSystemDefaults,
            isAdminMode,
            toggleAdminMode
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};