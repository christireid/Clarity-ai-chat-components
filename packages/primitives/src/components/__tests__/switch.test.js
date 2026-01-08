import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';
describe('Switch Component', () => {
    it('renders label and description', () => {
        render(_jsx(Switch, { label: 'Enable feature', description: 'Extra context' }));
        expect(screen.getByText('Enable feature')).toBeInTheDocument();
        expect(screen.getByText('Extra context')).toBeInTheDocument();
    });
    it('calls onChange when toggled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(_jsx(Switch, { label: 'Enable feature', onChange: onChange }));
        const control = screen.getByRole('switch');
        await user.click(control);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
    it('syncs hidden input values for forms', () => {
        render(_jsx("form", { children: _jsx(Switch, { label: 'Opt in', name: 'optIn', defaultChecked: true }) }));
        const hiddenInput = document.querySelector('input[data-switch-hidden-input]');
        expect(hiddenInput).not.toBeNull();
        expect(hiddenInput).toHaveAttribute('name', 'optIn');
        expect(hiddenInput).toBeChecked();
    });
});
//# sourceMappingURL=switch.test.js.map