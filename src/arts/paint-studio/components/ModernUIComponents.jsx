/**
 * Paint Studio Modern UI Component Examples
 * 
 * Complete, copy-paste ready components showing modern styling in action.
 * Import ModernUI.css for these to work properly.
 */

import React from 'react';
import '../styles/ModernUI.css';

// ============================================================================
// EXAMPLE 1: Modern Button Components
// ============================================================================

export const ModernButton = ({ 
  variant = 'primary', 
  disabled = false, 
  children, 
  onClick,
  className = '',
  ...props 
}) => {
  const classMap = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    selection: 'btn-selection',
    toggle: 'btn-toggle'
  };
  
  return (
    <button
      className={`${classMap[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================================
// EXAMPLE 2: Modern Toolbar Section
// ============================================================================

export const ModernToolbar = ({ children }) => {
  return (
    <div className="paint-toolbar">
      {children}
    </div>
  );
};

export const ToolbarSection = ({ label, children, divider = true }) => {
  return (
    <>
      <div className="toolbar-section">
        {label && <span className="section-label">{label}</span>}
        {children}
      </div>
      {divider && <div className="toolbar-divider" />}
    </>
  );
};

// ============================================================================
// EXAMPLE 3: Modern Panel Card
// ============================================================================

export const ModernPanel = ({ title, children, glass = false }) => {
  const panelClass = glass ? 'panel-glass' : 'panel-card';
  
  return (
    <div className={panelClass}>
      {title && (
        <div className="panel-title">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export const PanelSection = ({ label, children }) => {
  return (
    <div className="panel-section">
      {label && <label className="panel-label">{label}</label>}
      {children}
    </div>
  );
};

export const PanelRow = ({ label, children }) => {
  return (
    <div className="panel-row">
      {label && <label>{label}</label>}
      <div>{children}</div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Modern Slider with Label
// ============================================================================

export const ModernSlider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100,
  unit = ''
}) => {
  return (
    <PanelSection label={label}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ 
          minWidth: '50px', 
          textAlign: 'right',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {value}{unit}
        </span>
      </div>
    </PanelSection>
  );
};

// ============================================================================
// EXAMPLE 5: Modern Button Group
// ============================================================================

export const ModernButtonGroup = ({ 
  buttons = [], 
  vertical = false,
  onSelect
}) => {
  const groupClass = vertical ? 'btn-group-vertical' : 'btn-group';
  
  return (
    <div className={groupClass}>
      {buttons.map((btn) => (
        <ModernButton
          key={btn.id}
          variant={btn.variant || 'primary'}
          disabled={btn.disabled}
          onClick={() => onSelect(btn.id)}
        >
          {btn.label}
        </ModernButton>
      ))}
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Modern List Item (for Presets, Selections)
// ============================================================================

export const ModernListItem = ({
  title,
  meta,
  active = false,
  onClick,
  onAction,
  actions = []
}) => {
  return (
    <div
      className={`list-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="list-item-content">
        <div className="list-item-title">{title}</div>
        {meta && <div className="list-item-meta">{meta}</div>}
      </div>
      {actions.length > 0 && (
        <div className="list-item-action">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={(e) => {
                e.stopPropagation();
                onAction(action.id);
              }}
              title={action.title}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Complete Selection Tools Toolbar (READY TO USE)
// ============================================================================

export const ModernSelectionToolbar = ({
  activeSelectionTool,
  onToolSelect,
  zoom,
  onZoom
}) => {
  return (
    <ModernToolbar>
      {/* Edit Actions */}
      <ToolbarSection label="Edit" divider>
        <ModernButton variant="secondary">↶ Undo</ModernButton>
        <ModernButton variant="secondary">↷ Redo</ModernButton>
      </ToolbarSection>
      
      {/* Selection Tools */}
      <ToolbarSection label="Select" divider>
        <ModernButton
          variant="selection"
          className={activeSelectionTool === 'rect' ? 'active' : ''}
          onClick={() => onToolSelect('rect')}
          title="Rectangle Select (R)"
        >
          □ Rect
        </ModernButton>
        <ModernButton
          variant="selection"
          className={activeSelectionTool === 'free' ? 'active' : ''}
          onClick={() => onToolSelect('free')}
          title="Free Select (F)"
        >
          ✏ Lasso
        </ModernButton>
        <ModernButton
          variant="selection"
          className={activeSelectionTool === 'wand' ? 'active' : ''}
          onClick={() => onToolSelect('wand')}
          title="Magic Wand (W)"
        >
          ✨ Wand
        </ModernButton>
        <ModernButton
          variant="selection"
          className={activeSelectionTool === 'move' ? 'active' : ''}
          onClick={() => onToolSelect('move')}
          title="Move Tool (M)"
        >
          ⤢ Move
        </ModernButton>
      </ToolbarSection>
      
      {/* View Controls */}
      <ToolbarSection label="View" divider>
        <ModernButton 
          variant="secondary"
          onClick={() => onZoom('out')}
        >
          🔍−
        </ModernButton>
        <span style={{ padding: '8px 12px', color: '#B0B0B0' }}>
          {zoom}%
        </span>
        <ModernButton 
          variant="secondary"
          onClick={() => onZoom('in')}
        >
          🔍+
        </ModernButton>
        <ModernButton 
          variant="secondary"
          onClick={() => onZoom('reset')}
        >
          100%
        </ModernButton>
      </ToolbarSection>
      
      {/* File Operations */}
      <ToolbarSection label="File" divider={false}>
        <ModernButton variant="primary">🧹 Clear</ModernButton>
        <ModernButton variant="primary">📥 Download</ModernButton>
        <ModernButton variant="toggle">🎨 Presets</ModernButton>
        <ModernButton variant="toggle">🎨 Color</ModernButton>
        <ModernButton variant="toggle">⚙️ Options</ModernButton>
        <ModernButton variant="toggle">✂️ Selection</ModernButton>
        <ModernButton variant="toggle">🔄 Transform</ModernButton>
        <ModernButton variant="toggle">📐 Layers</ModernButton>
      </ToolbarSection>
    </ModernToolbar>
  );
};

// ============================================================================
// EXAMPLE 8: Modern Selection Panel (READY TO USE)
// ============================================================================

export const ModernSelectionPanel = ({
  bounds = { x: 0, y: 0, width: 100, height: 100 },
  onPropertyChange,
  onAction
}) => {
  return (
    <ModernPanel title="Selection" glass>
      {/* Position & Size */}
      <PanelSection label="Position & Size">
        <PanelRow label="X">
          <input
            type="number"
            value={bounds.x}
            onChange={(e) => onPropertyChange('x', parseInt(e.target.value))}
          />
        </PanelRow>
        <PanelRow label="Y">
          <input
            type="number"
            value={bounds.y}
            onChange={(e) => onPropertyChange('y', parseInt(e.target.value))}
          />
        </PanelRow>
        <PanelRow label="Width">
          <input
            type="number"
            value={bounds.width}
            onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
          />
        </PanelRow>
        <PanelRow label="Height">
          <input
            type="number"
            value={bounds.height}
            onChange={(e) => onPropertyChange('height', parseInt(e.target.value))}
          />
        </PanelRow>
      </PanelSection>
      
      {/* Feather & Anti-alias */}
      <PanelSection label="Effects">
        <ModernSlider
          label="Feather"
          value={3}
          onChange={(val) => onPropertyChange('feather', val)}
          min={0}
          max={50}
          unit="px"
        />
        <PanelRow>
          <label>
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => onPropertyChange('antiAlias', e.target.checked)}
            />
            {' '}Anti-alias
          </label>
        </PanelRow>
      </PanelSection>
      
      {/* Action Buttons */}
      <PanelSection>
        <div className="btn-group-vertical">
          <ModernButton 
            variant="primary"
            onClick={() => onAction('invert')}
          >
            Invert
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('grow')}
          >
            Grow
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('shrink')}
          >
            Shrink
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('clear')}
          >
            Clear
          </ModernButton>
        </div>
      </PanelSection>
    </ModernPanel>
  );
};

// ============================================================================
// EXAMPLE 9: Modern Transform Menu (READY TO USE)
// ============================================================================

export const ModernTransformMenu = ({ onAction }) => {
  return (
    <ModernPanel title="Transform">
      {/* Flip Operations */}
      <PanelSection label="Flip">
        <div className="btn-group-vertical">
          <ModernButton 
            variant="primary"
            onClick={() => onAction('flip', 'horizontal')}
          >
            Flip Horizontal
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('flip', 'vertical')}
          >
            Flip Vertical
          </ModernButton>
        </div>
      </PanelSection>
      
      {/* Rotate Operations */}
      <PanelSection label="Rotate">
        <div className="btn-group-vertical">
          <ModernButton 
            variant="primary"
            onClick={() => onAction('rotate', 90)}
          >
            90° CW
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('rotate', 180)}
          >
            180°
          </ModernButton>
          <ModernButton 
            variant="primary"
            onClick={() => onAction('rotate', 270)}
          >
            90° CCW
          </ModernButton>
        </div>
      </PanelSection>
      
      {/* Scale Operations */}
      <PanelSection label="Scale">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="number"
            placeholder="Percent"
            defaultValue={100}
            min={10}
            max={400}
            style={{ flex: 1 }}
          />
          <span style={{ padding: '8px', whiteSpace: 'nowrap' }}>%</span>
        </div>
        <ModernButton 
          variant="primary"
          onClick={() => onAction('scale', 100)}
          style={{ width: '100%' }}
        >
          Apply Scale
        </ModernButton>
      </PanelSection>
    </ModernPanel>
  );
};

// ============================================================================
// EXAMPLE 10: Modern Brush Presets Panel (READY TO USE)
// ============================================================================

export const ModernBrushPresetsPanel = ({
  presets = [],
  activePreset,
  onSelectPreset,
  onDeletePreset,
  onSavePreset
}) => {
  return (
    <ModernPanel title="Brush Presets">
      {/* Search */}
      <PanelSection>
        <input
          type="text"
          placeholder="Search presets..."
          style={{ width: '100%' }}
        />
      </PanelSection>
      
      {/* Presets List */}
      <PanelSection>
        {presets.map((preset) => (
          <ModernListItem
            key={preset.id}
            title={preset.name}
            meta={`Size: ${preset.size}px • Opacity: ${preset.opacity}%`}
            active={activePreset === preset.id}
            onClick={() => onSelectPreset(preset.id)}
            onAction={(action) => {
              if (action === 'delete') onDeletePreset(preset.id);
            }}
            actions={[
              { id: 'delete', label: '✕', title: 'Delete preset' }
            ]}
          />
        ))}
      </PanelSection>
      
      {/* Save New */}
      <PanelSection>
        <ModernButton
          variant="primary"
          onClick={onSavePreset}
          style={{ width: '100%' }}
        >
          Save Current Preset
        </ModernButton>
      </PanelSection>
    </ModernPanel>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  ModernButton,
  ModernToolbar,
  ToolbarSection,
  ModernPanel,
  PanelSection,
  PanelRow,
  ModernSlider,
  ModernButtonGroup,
  ModernListItem,
  ModernSelectionToolbar,
  ModernSelectionPanel,
  ModernTransformMenu,
  ModernBrushPresetsPanel
};
