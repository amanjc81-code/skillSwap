import React, { useState } from 'react';

export const SkillGraphViewer = ({ nodes = [], edges = [], onSelectSkill }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No skill graph data available to render.
      </div>
    );
  }

  // Compute layout positions for nodes deterministically
  const width = 800;
  const height = 480;

  // Group nodes by category to create coherent layout columns
  const categories = Array.from(new Set(nodes.map((n) => n.category)));
  const categoryXMap = {};
  categories.forEach((cat, idx) => {
    categoryXMap[cat] = 120 + idx * ((width - 240) / Math.max(1, categories.length - 1));
  });

  const categoryCountMap = {};
  const nodePositions = {};

  nodes.forEach((node) => {
    const cat = node.category;
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
    const catIndex = categoryCountMap[cat];
    const totalInCat = nodes.filter((n) => n.category === cat).length;

    const x = categoryXMap[cat] || width / 2;
    const y = 80 + catIndex * ((height - 140) / (totalInCat + 1));
    nodePositions[node.id] = { x, y };
  });

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onSelectSkill) onSelectSkill(node);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Interactive Skill Dependency Graph
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Generated dynamically from database prerequisite relationships. Solid arrows denote prerequisites.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
            <span>Prerequisite Edge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Related Edge</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '700px', height: 'auto', display: 'block' }}
        >
          <defs>
            <marker
              id="prereq-arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2D4B3E" />
            </marker>
            <marker
              id="related-arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#285A43" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, idx) => {
            const sourcePos = nodePositions[edge.source];
            const targetPos = nodePositions[edge.target];
            if (!sourcePos || !targetPos) return null;

            const isPrereq = edge.type === 'prerequisite';

            return (
              <line
                key={`edge-${idx}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={isPrereq ? '#2D4B3E' : '#285A43'}
                strokeWidth={isPrereq ? '1.5' : '1.2'}
                strokeDasharray={isPrereq ? 'none' : '4,4'}
                markerEnd={isPrereq ? 'url(#prereq-arrow)' : 'url(#related-arrow)'}
                opacity={0.8}
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id] || { x: width / 2, y: height / 2 };
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={isSelected ? '24' : '20'}
                  fill={isSelected ? '#EBF3EE' : '#FFFFFF'}
                  stroke={isSelected ? '#2D4B3E' : '#D4D1C5'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  filter="drop-shadow(0px 2px 4px rgba(35,38,30,0.06))"
                />
                <text
                  textAnchor="middle"
                  dy="-26"
                  fill="#1C1E1B"
                  fontSize="11"
                  fontWeight="600"
                  style={{ userSelect: 'none' }}
                >
                  {node.name}
                </text>
                <text
                  textAnchor="middle"
                  dy="4"
                  fill={isSelected ? '#2D4B3E' : '#787D74'}
                  fontSize="9"
                  fontWeight="500"
                  style={{ userSelect: 'none' }}
                >
                  {node.category.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNode && (
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}
        >
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNode.name}</span>
            <span className="badge badge-indigo" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>
              {selectedNode.category}
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {selectedNode.description}
            </p>
          </div>
          <button onClick={() => setSelectedNode(null)} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      )}
    </div>
  );
};
