/**
 * useLayers Hook
 * Manages layer stack and layer operations
 */

import { useState, useCallback } from 'react';
import { LAYER_DEFAULTS } from '../utils/constants';

const createLayer = (id, name = 'Layer', width, height) => ({
  id,
  name,
  canvas: createOffscreenCanvas(width, height),
  visible: LAYER_DEFAULTS.VISIBLE,
  opacity: LAYER_DEFAULTS.OPACITY,
  blendingMode: LAYER_DEFAULTS.BLENDING_MODE,
  locked: false,
  index: 0,
});

const createOffscreenCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export const useLayers = (canvasWidth, canvasHeight) => {
  const [layers, setLayers] = useState([
    createLayer('layer-0', 'Background', canvasWidth, canvasHeight),
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('layer-0');

  const addLayer = useCallback((name = 'Layer') => {
    const newId = `layer-${Date.now()}`;
    const newLayer = createLayer(newId, name, canvasWidth, canvasHeight);
    setLayers((prev) => [newLayer, ...prev]);
    setSelectedLayerId(newId);
    return newId;
  }, [canvasWidth, canvasHeight]);

  const deleteLayer = useCallback((layerId) => {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
    if (selectedLayerId === layerId && layers.length > 0) {
      setSelectedLayerId(layers[0].id);
    }
  }, [selectedLayerId, layers]);

  const renameLayer = useCallback((layerId, newName) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, name: newName } : l))
    );
  }, []);

  const setLayerOpacity = useCallback((layerId, opacity) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, opacity } : l))
    );
  }, []);

  const setLayerBlendingMode = useCallback((layerId, blendingMode) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, blendingMode } : l))
    );
  }, []);

  const toggleLayerVisibility = useCallback((layerId) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const toggleLayerLock = useCallback((layerId) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l))
    );
  }, []);

  const reorderLayers = useCallback((fromIndex, toIndex) => {
    setLayers((prev) => {
      const newLayers = [...prev];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return newLayers;
    });
  }, []);

  const getSelectedLayer = useCallback(() => {
    return layers.find((l) => l.id === selectedLayerId);
  }, [layers, selectedLayerId]);

  const mergeDownLayer = useCallback((layerId) => {
    const layerIndex = layers.findIndex((l) => l.id === layerId);
    if (layerIndex === 0 || layerIndex === -1) return;

    const currentLayer = layers[layerIndex];
    const belowLayer = layers[layerIndex - 1];

    const ctx = belowLayer.canvas.getContext('2d');
    ctx.globalAlpha = currentLayer.opacity;
    ctx.globalCompositeOperation = currentLayer.blendingMode;
    ctx.drawImage(currentLayer.canvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    deleteLayer(layerId);
  }, [layers, deleteLayer]);

  return {
    layers,
    selectedLayerId,
    addLayer,
    deleteLayer,
    renameLayer,
    setLayerOpacity,
    setLayerBlendingMode,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
    setSelectedLayerId,
    getSelectedLayer,
    mergeDownLayer,
  };
};
