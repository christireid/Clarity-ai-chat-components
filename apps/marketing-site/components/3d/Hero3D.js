'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
// Animated gradient orb component
function GradientOrb({ className, color1, color2, delay = 0, }) {
    return (_jsx("div", { className: `absolute rounded-full blur-3xl animate-pulse ${className}`, style: {
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
            animationDelay: `${delay}s`,
            animationDuration: '4s',
        } }));
}
// Floating particle
function Particle({ x, y, size, color, delay, }) {
    return (_jsx("div", { className: "absolute rounded-full animate-float", style: {
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            animationDelay: `${delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
        } }));
}
// Neural connection line
function ConnectionLine({ x1, y1, x2, y2, delay, }) {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    return (_jsx("div", { className: "absolute h-px animate-pulse origin-left", style: {
            left: `${x1}%`,
            top: `${y1}%`,
            width: `${length}%`,
            transform: `rotate(${angle}deg)`,
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
            animationDelay: `${delay}s`,
            animationDuration: '2s',
        } }));
}
// Neural node
function NeuralNode({ x, y, size, color, delay, }) {
    return (_jsx("div", { className: "absolute rounded-full animate-pulse", style: {
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${size}px ${color}`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${delay}s`,
            animationDuration: '2s',
        } }));
}
// Central AI core
function AICore() {
    return (_jsxs("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", children: [_jsx("div", { className: "absolute w-48 h-48 -left-24 -top-24 rounded-full border border-clarity-400/30 animate-spin", style: { animationDuration: '20s' } }), _jsx("div", { className: "absolute w-36 h-36 -left-18 -top-18 rounded-full border border-cosmic-400/30 animate-spin", style: {
                    animationDuration: '15s',
                    animationDirection: 'reverse',
                    left: '-72px',
                    top: '-72px',
                } }), _jsx("div", { className: "absolute w-24 h-24 rounded-full border border-pink-400/30 animate-spin", style: { animationDuration: '10s', left: '-48px', top: '-48px' } }), _jsx("div", { className: "absolute w-20 h-20 -left-10 -top-10 rounded-full bg-gradient-to-r from-clarity-500 to-cosmic-500 blur-xl opacity-60 animate-pulse" }), _jsx("div", { className: "relative w-16 h-16 -left-8 -top-8 rounded-2xl bg-gradient-to-br from-clarity-400 to-cosmic-500 shadow-2xl shadow-clarity-400/30 flex items-center justify-center animate-float", children: _jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) })] }));
}
// Chat bubble
function ChatBubble({ x, y, isAI, delay, }) {
    const color = isAI ? 'clarity' : 'cosmic';
    return (_jsx("div", { className: "absolute animate-float", style: {
            left: `${x}%`,
            top: `${y}%`,
            animationDelay: `${delay}s`,
            animationDuration: '3s',
        }, children: _jsx("div", { className: `px-4 py-2 rounded-xl bg-gradient-to-r ${isAI
                ? 'from-clarity-500/20 to-clarity-400/20 border-clarity-400/30'
                : 'from-cosmic-500/20 to-cosmic-400/20 border-cosmic-400/30'} border backdrop-blur-sm`, children: _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${isAI ? 'bg-clarity-400' : 'bg-cosmic-400'} animate-pulse` }), _jsx("div", { className: `w-1.5 h-1.5 rounded-full ${isAI ? 'bg-clarity-400' : 'bg-cosmic-400'} animate-pulse`, style: { animationDelay: '0.2s' } }), _jsx("div", { className: `w-1.5 h-1.5 rounded-full ${isAI ? 'bg-clarity-400' : 'bg-cosmic-400'} animate-pulse`, style: { animationDelay: '0.4s' } })] }) }) }));
}
// Static fallback
function StaticFallback() {
    return (_jsxs("div", { className: "absolute inset-0 flex items-center justify-center overflow-hidden", children: [_jsx(GradientOrb, { className: "w-64 h-64", color1: "rgba(0, 212, 255, 0.2)", color2: "rgba(168, 85, 247, 0.2)" }), _jsx(GradientOrb, { className: "w-48 h-48 -translate-x-20 translate-y-10", color1: "rgba(168, 85, 247, 0.2)", color2: "rgba(236, 72, 153, 0.2)", delay: 1 }), _jsx("div", { className: "relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-clarity-500 to-cosmic-600 flex items-center justify-center shadow-2xl shadow-clarity-500/20", children: _jsx("svg", { className: "w-12 h-12 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) })] }));
}
export default function Hero3D() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (e) => {
            setPrefersReducedMotion(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    if (!mounted) {
        return _jsx("div", { className: "absolute inset-0" });
    }
    if (prefersReducedMotion) {
        return _jsx(StaticFallback, {});
    }
    // Neural network nodes
    const nodes = [
        { x: 15, y: 25, size: 12, color: 'rgba(0, 212, 255, 0.6)' },
        { x: 85, y: 20, size: 10, color: 'rgba(168, 85, 247, 0.6)' },
        { x: 20, y: 75, size: 14, color: 'rgba(236, 72, 153, 0.6)' },
        { x: 80, y: 80, size: 11, color: 'rgba(0, 212, 255, 0.6)' },
        { x: 35, y: 40, size: 8, color: 'rgba(168, 85, 247, 0.6)' },
        { x: 65, y: 35, size: 9, color: 'rgba(236, 72, 153, 0.6)' },
        { x: 40, y: 65, size: 10, color: 'rgba(0, 212, 255, 0.6)' },
        { x: 60, y: 60, size: 8, color: 'rgba(168, 85, 247, 0.6)' },
    ];
    // Connection lines (from nodes to center)
    const connections = nodes.map((node, i) => ({
        x1: node.x,
        y1: node.y,
        x2: 50,
        y2: 50,
        delay: i * 0.3,
    }));
    // Floating particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: i % 3 === 0
            ? 'rgba(0, 212, 255, 0.4)'
            : i % 3 === 1
                ? 'rgba(168, 85, 247, 0.4)'
                : 'rgba(236, 72, 153, 0.4)',
        delay: Math.random() * 2,
    }));
    return (_jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx(GradientOrb, { className: "w-96 h-96 -left-20 top-1/4", color1: "rgba(0, 212, 255, 0.15)", color2: "rgba(168, 85, 247, 0.15)", delay: 0 }), _jsx(GradientOrb, { className: "w-80 h-80 -right-20 bottom-1/4", color1: "rgba(168, 85, 247, 0.15)", color2: "rgba(236, 72, 153, 0.15)", delay: 1 }), _jsx(GradientOrb, { className: "w-64 h-64 left-1/3 -bottom-10", color1: "rgba(236, 72, 153, 0.1)", color2: "rgba(0, 212, 255, 0.1)", delay: 2 }), particles.map((particle, i) => (_jsx(Particle, { ...particle }, i))), connections.map((conn, i) => (_jsx(ConnectionLine, { ...conn }, i))), nodes.map((node, i) => (_jsx(NeuralNode, { ...node, delay: i * 0.2 }, i))), _jsx(AICore, {}), _jsx(ChatBubble, { x: 10, y: 30, isAI: true, delay: 0 }), _jsx(ChatBubble, { x: 75, y: 25, isAI: false, delay: 0.5 }), _jsx(ChatBubble, { x: 15, y: 70, isAI: false, delay: 1 }), _jsx(ChatBubble, { x: 80, y: 65, isAI: true, delay: 1.5 })] }));
}
//# sourceMappingURL=Hero3D.js.map