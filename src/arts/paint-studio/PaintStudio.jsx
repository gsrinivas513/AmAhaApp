/**
 * PaintStudio Main Component
 * Orchestrates all paint features into a cohesive application
 */

import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CanvasCore } from './components/CanvasCore';
import { Toolbar } from './components/Toolbar';
import { LayerPanel } from './components/LayerPanel';
import BrushPresetsPanel from './components/BrushPresetsPanel';
import ColorWheelSelector from './components/ColorWheelSelector';
import ToolOptionsPanel from './components/ToolOptionsPanel';
import RectangleSelectTool from './components/RectangleSelectTool';
import FreeSelectTool from './components/FreeSelectTool';
import MagicWandTool from './components/MagicWandTool';
import MoveTool from './components/MoveTool';
import SelectionPanel from './components/SelectionPanel';
import TransformTools from './components/TransformTools';
import TransformMenu from './components/TransformMenu';
import { useTools } from './hooks/useTools';
import { useLayers } from './hooks/useLayers';
import { useHistory } from './hooks/useHistory';
import { useToolOptions } from './hooks/useToolOptions';
import { useSelection } from './hooks/useSelection';
import { CANVAS_DEFAULTS } from './utils/constants';
import './styles/ModernUI.css';
import { ModernButton, ModernToolbar, ToolbarSection } from './components/ModernUIComponents';

const PaintStudio = () => {
  const { theme } = useTheme();
  const [canvasReady, setCanvasReady] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [showBrushPresets, setShowBrushPresets] = useState(true);
  const [expandedRightPanel, setExpandedRightPanel] = useState('tools'); // 'tools' | 'color' | 'brushes' | 'layers' | 'selection' | 'transform' | null
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeSelectionTool, setActiveSelectionTool] = useState(null); // 'rect' | 'free' | 'wand' | null
  const [transformMode, setTransformMode] = useState('rotate'); // 'rotate' | 'scale'
  const [historyUpdate, setHistoryUpdate] = useState(0); // Force re-render on history changes

  const toolManager = useTools();
  const layerManager = useLayers(CANVAS_DEFAULTS.WIDTH, CANVAS_DEFAULTS.HEIGHT);
  const history = useHistory();
  const toolOptionsManager = useToolOptions();
  const selectionManager = useSelection();

  const canvasContextRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCanvasReady = useCallback((context) => {
    canvasContextRef.current = context;
    canvasRef.current = context.canvas;
    setCanvasReady(true);
  }, []);

  const handleUndo = () => {
    if (history.canUndo) {
      history.undo();
      const state = history.getHistoryState();
      if (state && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = state;
      }
      setHistoryUpdate(prev => prev + 1); // Force re-render
    }
  };

  const handleRedo = () => {
    if (history.canRedo) {
      history.redo();
      const state = history.getHistoryState();
      if (state && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = state;
      }
      setHistoryUpdate(prev => prev + 1); // Force re-render
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current && window.confirm('Clear canvas? This cannot be undone.')) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      history.pushHistory(canvasRef.current.toDataURL());
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = `artwork-${Date.now()}.png`;
      link.click();
    }
  };

  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoomLevel((prev) => Math.min(400, prev + 10));
    } else if (direction === 'out') {
      setZoomLevel((prev) => Math.max(25, prev - 10));
    } else {
      setZoomLevel(100);
    }
  };

  const handleApplyPreset = (preset) => {
    toolManager.setBrushSize(preset.size);
    toolManager.setOpacity(preset.opacity);
    if (toolManager.setHardness) {
      toolManager.setHardness(preset.hardness);
    }
    if (toolManager.setSpacing) {
      toolManager.setSpacing(preset.spacing);
    }
  };

  const handleSetBlendingMode = useCallback((layerId, blendMode) => {
    layerManager.setLayerBlendMode(layerId, blendMode);
  }, [layerManager]);

  const handleColorChange = useCallback((color) => {
    toolManager.setColor(color);
  }, [toolManager]);

  const handleToolOptionChange = useCallback((optionId, value) => {
    toolOptionsManager.setToolOption(optionId, value);
  }, [toolOptionsManager]);

  const handleSelectionChange = useCallback((selection) => {
    selectionManager.setRectangleSelection(selection.bounds.x, selection.bounds.y, selection.bounds.width, selection.bounds.height);
  }, [selectionManager]);

  const handleMoveSelection = useCallback((deltaX, deltaY) => {
    if (selectionManager.bounds) {
      const newBounds = {
        ...selectionManager.bounds,
        x: selectionManager.bounds.x + deltaX,
        y: selectionManager.bounds.y + deltaY,
      };
      selectionManager.setRectangleSelection(newBounds.x, newBounds.y, newBounds.width, newBounds.height);
    }
  }, [selectionManager]);

  const handleSelectionAction = useCallback((action, value) => {
    switch (action) {
      case 'invert':
        selectionManager.invertSelection();
        break;
      case 'grow':
        selectionManager.growSelection(value || 5);
        break;
      case 'shrink':
        selectionManager.shrinkSelection(value || 5);
        break;
      case 'clear':
        selectionManager.clearSelection();
        setActiveSelectionTool(null);
        break;
      case 'feather':
        selectionManager.featherSelection(value || 3);
        break;
      default:
        break;
    }
  }, [selectionManager]);

  const handleTransformAction = useCallback((action, value) => {
    console.log('Transform action:', action, value);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: theme.background || '#fff',
        color: theme.textPrimary || '#000',
      }}
    >
      {/* Main Content Area - Full Height */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          gap: 0,
        }}
      >
        {/* Canvas Area - Maximized */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            background: '#f0f0f0',
            position: 'relative',
            padding: '4px',
          }}
        >
          <CanvasCore
            ref={canvasRef}
            contextRef={canvasContextRef}
            toolManager={toolManager}
            layerManager={layerManager}
            historyManager={history}
            onCanvasReady={() => setCanvasReady(true)}
            zoomLevel={zoomLevel}
            width={CANVAS_DEFAULTS.WIDTH}
            height={CANVAS_DEFAULTS.HEIGHT}
          />
        </div>

        {/* Right Sidebar - Compact Grid Layout */}
        <div style={{ display: 'flex', height: '100%', background: theme.surfaceSecondary || '#f0f0f0', borderLeft: `1px solid ${theme.border || '#ddd'}`, flexShrink: 0 }}>
          
          {/* Right Toolbar Grid - Consistent 2 columns */}
          <div style={{ width: '90px', display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 2px', background: theme.surfaceSecondary || '#f0f0f0', borderRight: `1px solid ${theme.border || '#ddd'}`, overflowY: 'auto' }}>
            
            {/* Drawing Tools - 2 cols grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <button
                onClick={() => toolManager.selectTool('pencil')}
                title="Pencil"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'pencil' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'pencil' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => toolManager.selectTool('brush')}
                title="Brush"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'brush' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'brush' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🖌️
              </button>
              <button
                onClick={() => toolManager.selectTool('eraser')}
                title="Eraser"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'eraser' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'eraser' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🧹
              </button>
              <button
                onClick={() => toolManager.selectTool('bucket')}
                title="Bucket Fill"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'bucket' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'bucket' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🪣
              </button>
              <button
                onClick={() => toolManager.selectTool('line')}
                title="Line"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'line' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'line' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                📏
              </button>
              <button
                onClick={() => toolManager.selectTool('rectangle')}
                title="Rectangle"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: toolManager.currentTool === 'rectangle' ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: toolManager.currentTool === 'rectangle' ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ◼️
              </button>
            </div>

            <div style={{ width: '100%', height: '1px', background: theme.border || '#ddd', margin: '2px 0' }} />

            {/* Edit Section - 2 cols */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <button
                onClick={handleUndo}
                disabled={!history.canUndo}
                title="Undo"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  background: history.canUndo ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: history.canUndo ? 'white' : 'rgba(0,0,0,0.5)',
                  cursor: history.canUndo ? 'pointer' : 'not-allowed',
                  opacity: history.canUndo ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ↶
              </button>
              <button
                onClick={handleRedo}
                disabled={!history.canRedo}
                title="Redo"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: history.canRedo ? '#667EEA' : 'rgba(0,0,0,0.05)',
                  color: history.canRedo ? 'white' : 'rgba(0,0,0,0.5)',
                  cursor: history.canRedo ? 'pointer' : 'not-allowed',
                  opacity: history.canRedo ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ↷
              </button>
            </div>

            <div style={{ width: '100%', height: '1px', background: theme.border || '#ddd', margin: '2px 0' }} />

            {/* Selection Tools - 2 cols */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <button
                onClick={() => setActiveSelectionTool(activeSelectionTool === 'rect' ? null : 'rect')}
                title="Rectangle Select"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeSelectionTool === 'rect' ? '#00D4FF' : 'rgba(0,0,0,0.05)',
                  color: activeSelectionTool === 'rect' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: activeSelectionTool === 'rect' ? '0 0 8px rgba(0,212,255,0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                □
              </button>
              <button
                onClick={() => setActiveSelectionTool(activeSelectionTool === 'free' ? null : 'free')}
                title="Free Select"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeSelectionTool === 'free' ? '#00D4FF' : 'rgba(0,0,0,0.05)',
                  color: activeSelectionTool === 'free' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: activeSelectionTool === 'free' ? '0 0 8px rgba(0,212,255,0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✏
              </button>
              <button
                onClick={() => setActiveSelectionTool(activeSelectionTool === 'wand' ? null : 'wand')}
                title="Magic Wand"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeSelectionTool === 'wand' ? '#00D4FF' : 'rgba(0,0,0,0.05)',
                  color: activeSelectionTool === 'wand' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: activeSelectionTool === 'wand' ? '0 0 8px rgba(0,212,255,0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✨
              </button>
            </div>

            <div style={{ width: '100%', height: '1px', background: theme.border || '#ddd', margin: '2px 0' }} />

            {/* Panel Toggles - 2 cols */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'tools' ? null : 'tools')}
                title="Tool Options"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'tools' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'tools' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'tools' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⚙️
              </button>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'color' ? null : 'color')}
                title="Color"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'color' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'color' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'color' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🌈
              </button>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'brushes' ? null : 'brushes')}
                title="Brushes"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'brushes' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'brushes' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'brushes' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🎨
              </button>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'transform' ? null : 'transform')}
                title="Transform"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'transform' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'transform' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'transform' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔄
              </button>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'layers' ? null : 'layers')}
                title="Layers"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'layers' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'layers' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'layers' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                📐
              </button>
              <button
                onClick={() => setExpandedRightPanel(expandedRightPanel === 'zoom' ? null : 'zoom')}
                title="Zoom"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: expandedRightPanel === 'zoom' ? '#FF6B35' : 'rgba(0,0,0,0.05)',
                  color: expandedRightPanel === 'zoom' ? 'white' : '#333',
                  cursor: 'pointer',
                  boxShadow: expandedRightPanel === 'zoom' ? '0 2px 6px rgba(255,107,53,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Expandable Right Panel - Full Height */}
          <div style={{ width: expandedRightPanel ? '320px' : '0', height: '100%', overflow: 'hidden', transition: 'width 0.3s ease', background: '#f8f8f8', borderLeft: `1px solid ${theme.border || '#ddd'}`, display: 'flex', flexDirection: 'column' }}>
            
            {expandedRightPanel === 'tools' && (
              <ToolOptionsPanel
                currentTool={toolManager.currentTool}
                toolOptions={toolOptionsManager.toolOptions}
                onOptionChange={handleToolOptionChange}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'color' && (
              <ColorWheelSelector
                color={toolManager.color}
                onColorChange={toolManager.setColor}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'brushes' && (
              <BrushPresetsPanel
                currentBrush={{
                  size: toolManager.brushSize,
                  hardness: toolManager.hardness || 0.5,
                  opacity: toolManager.opacity,
                  spacing: 8,
                }}
                onApplyPreset={handleApplyPreset}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'selection' && selectionManager.isActive && (
              <SelectionPanel
                bounds={selectionManager.bounds}
                feather={selectionManager.feather}
                antiAlias={selectionManager.antiAlias}
                type={selectionManager.type}
                onPropertyChange={(prop, value) => {
                  if (prop === 'bounds') {
                    selectionManager.setRectangleSelection(value.x, value.y, value.width, value.height);
                  }
                }}
                onAction={handleSelectionAction}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'transform' && (
              <TransformMenu
                selection={selectionManager}
                onTransformAction={handleTransformAction}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'layers' && (
              <LayerPanel
                layers={layerManager.layers}
                activeLayerId={layerManager.activeLayerId}
                onSelectLayer={layerManager.selectLayer}
                onAddLayer={layerManager.addLayer}
                onDeleteLayer={layerManager.deleteLayer}
                onRenameLayer={layerManager.renameLayer}
                onToggleVisibility={layerManager.toggleVisibility}
                onChangeOpacity={layerManager.setOpacity}
                theme={theme?.isDark ? 'dark' : 'light'}
              />
            )}

            {expandedRightPanel === 'zoom' && (
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#333' }}>Zoom</h3>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button onClick={() => handleZoom('out')} style={{ flex: 1, padding: '6px', background: '#667EEA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>−</button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 600, fontSize: '12px' }}>{zoomLevel}%</span>
                  <button onClick={() => handleZoom('in')} style={{ flex: 1, padding: '6px', background: '#667EEA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>+</button>
                </div>
                <button onClick={() => handleZoom('reset')} style={{ padding: '6px', background: '#667EEA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reset</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintStudio;
