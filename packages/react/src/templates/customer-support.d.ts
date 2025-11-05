/**
 * Customer Support Chat Template
 *
 * Pre-configured chat interface for customer support scenarios
 */
import type { Message } from '@clarity-chat/types';
export interface CustomerSupportTemplateProps {
    companyName?: string;
    supportCategories?: string[];
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
    onEscalate?: (conversation: Message[]) => void;
    apiEndpoint?: string;
}
/**
 * Customer Support Chat Template
 *
 * Features:
 * - Professional corporate theme
 * - FAQ quick responses
 * - Escalation to human agent
 * - Ticket creation
 * - Order lookup capabilities
 *
 * @example
 * ```tsx
 * <CustomerSupportTemplate
 *   companyName="Acme Corp"
 *   supportCategories={['Orders', 'Returns', 'Technical']}
 *   onEscalate={(conversation) => console.log('Escalate:', conversation)}
 * />
 * ```
 */
export declare function CustomerSupportTemplate({ companyName, supportCategories, faqs, onEscalate, apiEndpoint, }: CustomerSupportTemplateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=customer-support.d.ts.map