import React, { createContext, useContext, useState } from 'react';
import { SYSTEM_DEFAULTS } from '../constants/defaultValues';
import type { AppConfig, ConfigContextType } from '../types/config.types';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'app-defaults-v1';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<AppConfig>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to parse saved defaults", e);
        }
        return SYSTEM_DEFAULTS;
    });

    const updateConfig = (newConfig: AppConfig) => {
        setConfig(newConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    };

    const resetToSystemDefaults = () => {
        if (window.confirm("Reset ADMIN defaults to system original? This does not affect user data.")) {
            setConfig(SYSTEM_DEFAULTS);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetToSystemDefaults }}>
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