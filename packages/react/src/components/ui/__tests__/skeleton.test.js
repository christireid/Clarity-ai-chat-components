import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '../skeleton';
describe('Zero-Dependency Skeleton Components', () => {
    it('renders base Skeleton with shimmer animation', () => {
        const { container } = render(_jsx(Skeleton, { variant: "shimmer", width: 100, height: 20 }));
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('skeleton-shimmer');
        expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
    });
    it('renders base Skeleton with pulse animation', () => {
        const { container } = render(_jsx(Skeleton, { variant: "pulse" }));
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('skeleton-pulse');
    });
    it('renders SkeletonText with multiple lines', () => {
        render(_jsx(SkeletonText, { lines: 3, variant: "shimmer" }));
        const skeletons = screen.getAllByRole('status');
        expect(skeletons).toHaveLength(3);
    });
    it('renders SkeletonAvatar', () => {
        const { container } = render(_jsx(SkeletonAvatar, { size: 40, variant: "shimmer" }));
        const skeleton = container.firstChild;
        expect(skeleton).toHaveStyle({ width: '40px', height: '40px' });
        expect(skeleton).toHaveClass('rounded-full');
    });
    it('renders SkeletonCard with all sections', () => {
        render(_jsx(SkeletonCard, { showImage: true, showHeader: true, showFooter: true, variant: "shimmer" }));
        // Should render without errors and maintain structure
        const card = screen.getByRole('status');
        expect(card).toBeInTheDocument();
    });
    it('applies correct border radius classes', () => {
        const { container, rerender } = render(_jsx(Skeleton, { rounded: "none" }));
        expect(container.firstChild).toHaveClass('rounded-none');
        rerender(_jsx(Skeleton, { rounded: "full" }));
        expect(container.firstChild).toHaveClass('rounded-full');
    });
    it('renders without animation when variant is none', () => {
        const { container } = render(_jsx(Skeleton, { variant: "none" }));
        const skeleton = container.firstChild;
        expect(skeleton).not.toHaveClass('skeleton-pulse');
        expect(skeleton).not.toHaveClass('skeleton-shimmer');
    });
});
//# sourceMappingURL=skeleton.test.js.map