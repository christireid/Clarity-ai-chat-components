export interface FeedbackButtonsProps {
    messageId: string;
    onFeedback?: (messageId: string, type: 'positive' | 'negative', comment?: string) => void;
    className?: string;
}
export declare function FeedbackButtons({ messageId, onFeedback, className }: FeedbackButtonsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FeedbackButtons.d.ts.map