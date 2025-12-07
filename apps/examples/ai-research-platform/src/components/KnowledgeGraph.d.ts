interface Node {
    id: string;
    label: string;
    type: 'concept' | 'document' | 'entity';
}
interface Edge {
    source: string;
    target: string;
    strength: number;
}
interface KnowledgeGraphProps {
    nodes: Node[];
    edges: Edge[];
}
export declare function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=KnowledgeGraph.d.ts.map