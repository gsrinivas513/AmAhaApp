import React from 'react';

export const DashboardIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
    <rect x="13" y="3" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.85" />
    <rect x="13" y="9" width="8" height="12" rx="1.5" fill="currentColor" opacity="0.6" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

export const CategoriesIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" fill="currentColor" />
  </svg>
);

export const TrophyIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 3h12v2a4 4 0 01-4 4H10A4 4 0 016 5V3z" fill="currentColor" />
    <path d="M8 13v2a4 4 0 004 4 4 4 0 004-4v-2" stroke="currentColor" strokeWidth="0" fill="currentColor" opacity="0.95" />
    <path d="M3 5h2" stroke="currentColor" strokeWidth="0" />
  </svg>
);

export const PaletteIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-1.38-.56-2.63-1.46-3.54A3.5 3.5 0 1116 10c0-1.1-.9-2-2-2-.74 0-1.4.4-1.75 1.01A4 4 0 0012 2z" fill="currentColor" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DocumentIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="currentColor" />
    <path d="M14 2v6h6" fill="currentColor" opacity="0.9" />
  </svg>
);

export const ChartIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="10" width="3" height="10" rx="1" fill="currentColor" />
    <rect x="10.5" y="6" width="3" height="14" rx="1" fill="currentColor" opacity="0.9" />
    <rect x="17" y="2" width="3" height="18" rx="1" fill="currentColor" opacity="0.7" />
  </svg>
);

export const FilmIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
    <path d="M7 7h.01M7 11h.01M7 15h.01M17 7h.01M17 11h.01M17 15h.01" stroke="#fff" strokeWidth="0" />
  </svg>
);

export const PuzzleIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 11a2 2 0 012-2h2v2a2 2 0 01-2 2H8v2H6v-2a2 2 0 01-2-2V9h2v2z" fill="currentColor" />
    <path d="M18 13a2 2 0 01-2 2h-2v-2a2 2 0 012-2h2v-2h2v2a2 2 0 01-2 2z" fill="currentColor" opacity="0.95" />
  </svg>
);

export const GearIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" fill="currentColor" />
    <path d="M19.4 15a7.7 7.7 0 000-6l2.1-1.6-2-3.4-2.6.7A7.8 7.8 0 0012 2.6 7.8 7.8 0 0010.1 3.7L7.5 3 5.5 6.4 7.6 8A7.7 7.7 0 006 12c0 .9.15 1.8.44 2.6L4.3 17l2 3.4 2.6-.7c.6.5 1.3.9 2.1 1.2l.8 2.9h3.4l.8-2.9c.8-.2 1.6-.6 2.2-1.1l2.6.7 2-3.4-2.1-1.6c.28-.8.43-1.7.43-2.6z" fill="currentColor" opacity="0.9" />
  </svg>
);
