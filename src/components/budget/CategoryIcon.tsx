import React from 'react';
import { ICON_MAP } from "./iconMap.ts";

interface Props {
    iconKey?: string;
    className?: string;
    size?: number;
}

export const CategoryIcon: React.FC<Props> = ({ iconKey, className, size = 18 }) => {
    if (!iconKey || !ICON_MAP[iconKey]) return null;

    const IconComponent = ICON_MAP[iconKey];
    return <IconComponent className={className} size={size} />;
};