import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Clarity Chat - Premium AI Chat Components';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';
export default async function Image() {
    return new ImageResponse(_jsxs("div", { style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
        }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                } }), _jsx("div", { style: {
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                } }), _jsx("div", { style: {
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                } }), _jsx("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                }, children: _jsx("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                        boxShadow: '0 0 60px rgba(0, 212, 255, 0.4)',
                    }, children: _jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }), _jsx("path", { d: "M8 10h.01" }), _jsx("path", { d: "M12 10h.01" }), _jsx("path", { d: "M16 10h.01" })] }) }) }), _jsxs("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }, children: [_jsx("h1", { style: {
                            fontSize: '72px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 8px 0',
                            letterSpacing: '-0.02em',
                        }, children: "Clarity Chat" }), _jsx("p", { style: {
                            fontSize: '32px',
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #00d4ff 0%, #a855f7 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            margin: '0 0 24px 0',
                        }, children: "Build AI Chat Faster Than Ever" }), _jsxs("p", { style: {
                            fontSize: '24px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxWidth: '800px',
                            textAlign: 'center',
                            margin: 0,
                            lineHeight: 1.4,
                        }, children: ["React components for AI chat.", _jsx("br", {}), "Multi-provider support, intelligent memory, 40%+ cost savings."] })] }), _jsx("div", { style: {
                    display: 'flex',
                    gap: '48px',
                    marginTop: '48px',
                }, children: [
                    { value: '50+', label: 'Components' },
                    { value: '3', label: 'AI Providers' },
                    { value: '40%', label: 'Cost Savings' },
                ].map((stat) => (_jsxs("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }, children: [_jsx("span", { style: {
                                fontSize: '36px',
                                fontWeight: 'bold',
                                color: '#00d4ff',
                            }, children: stat.value }), _jsx("span", { style: {
                                fontSize: '16px',
                                color: 'rgba(255, 255, 255, 0.5)',
                            }, children: stat.label })] }, stat.label))) }), _jsx("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00d4ff 0%, #a855f7 50%, #ec4899 100%)',
                } })] }), {
        ...size,
    });
}
//# sourceMappingURL=opengraph-image.js.map