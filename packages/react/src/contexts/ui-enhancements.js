'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../utils/cn';
const defaultContextValue = {
    quantumAnimations: false,
    glassmorphism: false,
    auroraGradients: false,
    neumorphism: false,
    voiceIntegration: false,
    adaptiveColors: false,
    wcagAAA: false,
    isEnhanced: false,
};
export const UIEnhancementsContext = React.createContext(defaultContextValue);
export const UIEnhancementsProvider = ({ children, value, }) => {
    const contextValue = React.useMemo(() => ({
        ...value,
        isEnhanced: Object.values(value).some(Boolean),
    }), [value]);
    return (_jsx(UIEnhancementsContext.Provider, { value: contextValue, children: children }));
};
export const useUIEnhancements = () => {
    const context = React.useContext(UIEnhancementsContext);
    if (context === undefined) {
        throw new Error('useUIEnhancements must be used within a UIEnhancementsProvider');
    }
    return context;
};
export const useQuantumAnimation = () => {
    const { quantumAnimations } = useUIEnhancements();
    return quantumAnimations ?? false;
};
export const useGlassmorphism = () => {
    const { glassmorphism } = useUIEnhancements();
    return glassmorphism ?? false;
};
export const useAuroraGradients = () => {
    const { auroraGradients } = useUIEnhancements();
    return auroraGradients ?? false;
};
export const useVoiceIntegration = () => {
    const { voiceIntegration } = useUIEnhancements();
    return voiceIntegration ?? false;
};
export const useWCAGAAA = () => {
    const { wcagAAA } = useUIEnhancements();
    return wcagAAA ?? false;
};
export const getEnhancedClassName = ({ className, quantumAnimations = false, glassmorphism = false, auroraGradients = false, neumorphism = false, voiceIntegration = false, adaptiveColors = false, wcagAAA = false, }) => {
    return cn(className, quantumAnimations && 'quantum-animations', glassmorphism && 'glassmorphism-enabled', auroraGradients && 'aurora-gradients-enabled', neumorphism && 'neumorphism-enabled', voiceIntegration && 'voice-integration-enabled', adaptiveColors && 'adaptive-colors-enabled', wcagAAA && 'wcag-aaa-compliant');
};
export default {
    UIEnhancementsContext,
    UIEnhancementsProvider,
    useUIEnhancements,
    useQuantumAnimation,
    useGlassmorphism,
    useAuroraGradients,
    useVoiceIntegration,
    useWCAGAAA,
    getEnhancedClassName,
};
//# sourceMappingURL=ui-enhancements.js.map