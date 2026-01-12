import React from 'react';

function ChartBarSvg({ data = [], color = '#6C63FF', isFloat = false }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = 36;
  const paddingLeft = 140;
  const svgHeight = Math.max(60, data.length * rowH);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} preserveAspectRatio="xMinYMin meet">
        <defs>
          <linearGradient id="barGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const y = i * rowH + 8;
          const w = Math.round(((d.value || 0) / (max || 1)) * 700);
          const label = isFloat ? (Math.round(d.value * 100) / 100) : Math.round(d.value || 0);
          return (
            <g key={d.id}>
              <text x={8} y={y + 14} style={{ fontSize: 13, fill: '#333' }}>{d.id}</text>
              <rect x={paddingLeft} y={y} width={w} height={18} rx={8} fill="url(#barGrad)" />
              <text x={paddingLeft + w + 12} y={y + 14} style={{ fontSize: 13, fill: '#333' }}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default ChartBarSvg;
