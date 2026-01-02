// src/admin/utils/templateGuards.js
// Utility to ensure templates only provide content fields expected by each editor

export function sanitizeTemplateForEditor(template, editorKind) {
  const schema = template?.schema || {};
  switch (editorKind) {
    case 'picture-word': {
      const pairs = Array.isArray(schema.pairs) ? schema.pairs.map(p => ({
        imageUrl: p?.imageUrl || '',
        word: p?.word || ''
      })) : [];
      return { pairs };
    }
    case 'picture-shadow': {
      const pairs = Array.isArray(schema.pairs) ? schema.pairs.map(p => ({
        imageUrl: p?.imageUrl || '',
        shadowUrl: p?.shadowUrl || ''
      })) : [];
      return { pairs };
    }
    case 'find-pair': {
      const pairs = Array.isArray(schema.pairs) ? schema.pairs.map(p => ({
        left: p?.left || '',
        right: p?.right || '',
        leftImageUrl: p?.leftImageUrl || '',
        rightImageUrl: p?.rightImageUrl || ''
      })) : [];
      return { pairs };
    }
    case 'word-search': {
      const gridRows = Array.isArray(schema.gridRows) ? schema.gridRows.map(r => String(r || '').trim()).filter(Boolean) : [];
      const words = Array.isArray(schema.words) ? schema.words.map(w => String(w || '').trim()).filter(Boolean) : [];
      return { gridRows, words };
    }
    case 'spot-difference': {
      const baseImageUrl = schema?.baseImageUrl || '';
      const alteredImageUrl = schema?.alteredImageUrl || '';
      const differencePoints = Array.isArray(schema.differencePoints) ? schema.differencePoints.map(p => ({ x: Number(p?.x || 0), y: Number(p?.y || 0) })) : [];
      return { baseImageUrl, alteredImageUrl, differencePoints };
    }
    case 'ordering': {
      const items = Array.isArray(schema.items) ? schema.items.map((label, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        label: typeof label === 'string' ? label : String(label?.label || ''),
        order: idx + 1
      })) : [];
      return { items };
    }
    case 'jigsaw': {
      const rows = Number(schema.rows || 3);
      const cols = Number(schema.cols || 4);
      const imageUrl = schema.imageUrl || ''; // image provided via execution/params, may be empty here
      return { rows, cols, imageUrl };
    }
    default:
      return {};
  }
}
