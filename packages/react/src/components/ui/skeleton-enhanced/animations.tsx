/**
 * CSS Animations for Enhanced Skeleton Components
 */

import * as React from 'react'

export const EnhancedSkeletonStyles = () => (
  <style>{`
    /* Enhanced skeleton animations */
    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @keyframes skeleton-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes skeleton-wave {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes skeleton-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes skeleton-dots {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      80%, 100% { opacity: 0; }
    }

    /* Transition animations */
    @keyframes skeleton-fade-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }

    @keyframes skeleton-slide-up-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(-10px) scale(0.98); }
    }

    @keyframes skeleton-slide-down-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(10px) scale(0.98); }
    }

    @keyframes skeleton-scale-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.8); }
    }

    @keyframes skeleton-morph-out {
      from {
        opacity: 1;
        transform: scale(1);
        filter: blur(0px);
      }
      to {
        opacity: 0;
        transform: scale(1.02);
        filter: blur(4px);
      }
    }

    @keyframes content-fade-in {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes content-slide-up-in {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes content-slide-down-in {
      from { opacity: 0; transform: translateY(-10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes content-scale-in {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes content-morph-in {
      from {
        opacity: 0;
        transform: scale(1.02);
        filter: blur(4px);
      }
      to {
        opacity: 1;
        transform: scale(1);
        filter: blur(0px);
      }
    }

    /* Performance monitoring */
    .skeleton-performance {
      position: relative;
    }

    .skeleton-performance::after {
      content: attr(data-performance-id);
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 10px;
      color: #666;
      opacity: 0.5;
    }

    /* Accessibility improvements */
    .skeleton-accessible {
      position: relative;
    }

    .skeleton-accessible::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: skeleton-shimmer 2s infinite;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-pulse,
      .skeleton-shimmer,
      .skeleton-wave,
      .skeleton-gradient,
      .skeleton-dots {
        animation: none;
        opacity: 0.6;
      }
    }

    /* Responsive skeleton sizing */
    .skeleton-responsive {
      container-type: inline-size;
    }

    @container (max-width: 640px) {
      .skeleton-responsive .skeleton-mobile-hide {
        display: none;
      }
    }

    @container (min-width: 641px) {
      .skeleton-responsive .skeleton-desktop-hide {
        display: none;
      }
    }
  `}</style>
)
