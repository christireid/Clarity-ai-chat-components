import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CitationCard } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Components/CitationCard',
    component: CitationCard,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
**Citation Card** - Beautiful RAG (Retrieval-Augmented Generation) source display:

- 📚 Source attribution with confidence scores
- 🎨 Color-coded confidence indicators (High/Medium/Low/Very Low)
- 📖 Expandable preview for long citations
- 🔗 External link support to source documents
- 📋 Rich metadata display (author, date, page number, section)
- ♿ Full keyboard navigation support
- 🌙 Dark mode compatible
- 🎭 Smooth animations and transitions

Perfect for displaying sources in AI chat apps with RAG, document Q&A systems, and research assistants.
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        defaultExpanded: {
            control: 'boolean',
            description: 'Start with citation expanded',
        },
        previewLength: {
            control: { type: 'number', min: 50, max: 500, step: 50 },
            description: 'Maximum characters before truncation',
        },
        showConfidence: {
            control: 'boolean',
            description: 'Display confidence score badge',
        },
    },
};
export default meta;
// Mock citations with various scenarios
const highConfidenceCitation = {
    id: 'cite_1',
    source: 'React Official Documentation - Hooks API Reference',
    chunkText: 'useState is a React Hook that lets you add a state variable to your component. Call useState at the top level of your component to declare a state variable. The convention is to name state variables like [something, setSomething] using array destructuring.',
    confidence: 0.95,
    url: 'https://react.dev/reference/react/useState',
    metadata: {
        author: 'React Team',
        date: '2024-01-15',
        section: 'Hooks Reference',
    },
};
const mediumConfidenceCitation = {
    id: 'cite_2',
    source: 'MDN Web Docs - JavaScript Array Methods',
    chunkText: 'The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. It is often used to transform arrays of data.',
    confidence: 0.72,
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
    metadata: {
        date: '2023-12-08',
        page: 42,
    },
};
const lowConfidenceCitation = {
    id: 'cite_3',
    source: 'Stack Overflow Discussion - React Performance',
    chunkText: 'According to some developers, memoization can help with performance but should only be used when you have measured performance bottlenecks. Premature optimization is often discouraged.',
    confidence: 0.58,
    url: 'https://stackoverflow.com/questions/12345/react-performance',
    metadata: {
        author: 'Community Discussion',
        date: '2023-06-20',
    },
};
const veryLowConfidenceCitation = {
    id: 'cite_4',
    source: 'Blog Post - Web Development Tips',
    chunkText: 'There are many ways to approach this problem, and different developers have different opinions on what works best.',
    confidence: 0.35,
    url: 'https://example.com/blog/web-dev-tips',
};
const longCitation = {
    id: 'cite_5',
    source: 'TypeScript Deep Dive - Advanced Types',
    chunkText: `TypeScript's type system is extremely powerful and allows for very precise type definitions. Union types, intersection types, conditional types, mapped types, and template literal types can be combined to create sophisticated type definitions that provide excellent tooling support and catch bugs at compile time. The type system is Turing complete, which means you can express complex type-level computations. However, with great power comes great responsibility - overly complex types can make code harder to understand and maintain. It's important to strike a balance between type safety and readability. Most of the time, simple types like string, number, boolean, and basic interfaces will serve you well. Only reach for advanced types when you need them to solve specific problems.`,
    confidence: 0.88,
    url: 'https://basarat.gitbook.io/typescript/type-system',
    metadata: {
        author: 'Basarat Ali Syed',
        date: '2024-02-01',
        page: 156,
        section: 'Advanced Types',
    },
};
const noCitationfidence = {
    id: 'cite_6',
    source: 'Tutorial - Getting Started with React',
    chunkText: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
    url: 'https://react.dev/learn',
};
const withoutURL = {
    id: 'cite_7',
    source: 'Internal Knowledge Base - React Best Practices',
    chunkText: 'Always lift state up to the nearest common ancestor when multiple components need to share state. This makes data flow more predictable and easier to debug.',
    confidence: 0.91,
    metadata: {
        section: 'State Management',
        page: 23,
    },
};
// Basic Stories
export const HighConfidence = {
    args: {
        citation: highConfidenceCitation,
    },
};
export const MediumConfidence = {
    args: {
        citation: mediumConfidenceCitation,
    },
};
export const LowConfidence = {
    args: {
        citation: lowConfidenceCitation,
    },
};
export const VeryLowConfidence = {
    args: {
        citation: veryLowConfidenceCitation,
    },
};
export const LongText = {
    args: {
        citation: longCitation,
    },
};
export const DefaultExpanded = {
    args: {
        citation: longCitation,
        defaultExpanded: true,
    },
};
export const ShortPreviewLength = {
    args: {
        citation: longCitation,
        previewLength: 100,
    },
};
export const WithoutConfidence = {
    args: {
        citation: noConfidenceCitation,
        showConfidence: false,
    },
};
export const WithoutURL = {
    args: {
        citation: withoutURL,
    },
};
export const NoMetadata = {
    args: {
        citation: {
            id: 'cite_8',
            source: 'Simple Citation',
            chunkText: 'This citation has no metadata attached to it.',
            confidence: 0.85,
            url: 'https://example.com',
        },
    },
};
export const RichMetadata = {
    args: {
        citation: {
            id: 'cite_9',
            source: 'Research Paper - AI in Healthcare',
            chunkText: 'Machine learning models have shown promising results in early disease detection, with accuracy rates exceeding 95% in some studies.',
            confidence: 0.94,
            url: 'https://example.com/research/ai-healthcare.pdf',
            metadata: {
                author: 'Dr. Jane Smith',
                date: '2024-03-15',
                page: 12,
                section: 'Results and Discussion',
            },
        },
    },
};
// Interactive Stories
const InteractiveExample = () => {
    const [clicked, setClicked] = useState(null);
    const handleClick = (citation) => {
        setClicked(`Clicked on: ${citation.source}`);
    };
    const handleSourceClick = (url) => {
        setClicked(`Source link clicked: ${url}`);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: _jsx("p", { className: "text-sm text-blue-900 dark:text-blue-100", children: "\uD83D\uDCA1 Click on the citation card or the external link icon to trigger callbacks" }) }), _jsx(CitationCard, { citation: highConfidenceCitation, onClick: handleClick, onSourceClick: handleSourceClick }), clicked && (_jsx("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 rounded-lg", children: _jsx("p", { className: "text-sm font-medium text-green-900 dark:text-green-100", children: clicked }) }))] }));
};
export const InteractiveCallbacks = {
    render: () => _jsx(InteractiveExample, {}),
};
const MultipleCitations = () => {
    const citations = [
        highConfidenceCitation,
        mediumConfidenceCitation,
        lowConfidenceCitation,
        longCitation,
    ];
    return (_jsxs("div", { className: "space-y-3 max-w-3xl", children: [_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4", children: [_jsxs("h3", { className: "font-semibold mb-2", children: ["Sources (", citations.length, ")"] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "References used to generate this response, sorted by relevance" })] }), citations.map((citation, index) => (_jsx(CitationCard, { citation: citation, onClick: () => console.log('Clicked citation:', citation.id) }, citation.id)))] }));
};
export const MultipleInList = {
    render: () => _jsx(MultipleCitations, {}),
};
const ConfidenceComparison = () => {
    const citations = [
        { ...highConfidenceCitation, id: 'high', source: 'High Confidence Source (95%)' },
        { ...mediumConfidenceCitation, id: 'medium', source: 'Medium Confidence Source (72%)', confidence: 0.72 },
        { ...lowConfidenceCitation, id: 'low', source: 'Low Confidence Source (58%)', confidence: 0.58 },
        { ...veryLowConfidenceCitation, id: 'verylow', source: 'Very Low Confidence Source (35%)', confidence: 0.35 },
    ];
    return (_jsxs("div", { className: "space-y-4 max-w-3xl", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-blue-900 dark:text-blue-100 mb-2", children: "Confidence Score Comparison" }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Citations are color-coded by confidence:" }), _jsxs("ul", { className: "mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [_jsxs("li", { children: ["\uD83D\uDFE2 ", _jsx("strong", { children: "High (90-100%):" }), " Green - Highly relevant and trustworthy"] }), _jsxs("li", { children: ["\uD83D\uDD35 ", _jsx("strong", { children: "Medium (70-89%):" }), " Blue - Reasonably relevant"] }), _jsxs("li", { children: ["\uD83D\uDFE1 ", _jsx("strong", { children: "Low (50-69%):" }), " Yellow - Marginally relevant"] }), _jsxs("li", { children: ["\uD83D\uDD34 ", _jsx("strong", { children: "Very Low (<50%):" }), " Red - Potentially not relevant"] })] })] }), citations.map((citation) => (_jsx(CitationCard, { citation: citation }, citation.id)))] }));
};
export const ConfidenceLevels = {
    render: () => _jsx(ConfidenceComparison, {}),
};
// Edge Cases
export const VeryShortText = {
    args: {
        citation: {
            id: 'cite_short',
            source: 'Quick Tip',
            chunkText: 'Use TypeScript.',
            confidence: 0.99,
            url: 'https://www.typescriptlang.org/',
        },
    },
};
export const NoSpacesLongWord = {
    args: {
        citation: {
            id: 'cite_long_word',
            source: 'Technical Documentation',
            chunkText: 'The method name is: supercalifragilisticexpialidociousMethodNameThatIsVeryLongAndHasNoSpacesWhatsoever',
            confidence: 0.80,
        },
    },
};
export const SpecialCharacters = {
    args: {
        citation: {
            id: 'cite_special',
            source: 'Code Example with Special Characters',
            chunkText: 'Here\'s a regex pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/ and some symbols: <>&"\'',
            confidence: 0.87,
            url: 'https://example.com',
            metadata: {
                section: 'Examples & Edge Cases',
            },
        },
    },
};
export const UnicodeEmoji = {
    args: {
        citation: {
            id: 'cite_emoji',
            source: 'Modern Documentation 🚀',
            chunkText: 'React Hooks make components more ✨ powerful and 💪 expressive. You can use emojis in documentation 🎉',
            confidence: 0.91,
            metadata: {
                author: 'Emoji Lover 😄',
            },
        },
    },
};
export const MinimalCitation = {
    args: {
        citation: {
            id: 'cite_minimal',
            source: 'Source',
            chunkText: 'Text',
        },
    },
};
//# sourceMappingURL=CitationCard.stories.js.map