// ArtStorageService.js - Handle local storage for artwork

const STORAGE_KEY = 'amaha_artworks';

export const generateId = () => {
  return `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const saveArtwork = (artwork) => {
  try {
    const artworks = getAllArtwork();
    artworks.push(artwork);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
    return artwork.id;
  } catch (error) {
    console.error('Error saving artwork:', error);
    throw error;
  }
};

export const getAllArtwork = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading artworks:', error);
    return [];
  }
};

export const getArtwork = (id) => {
  try {
    const artworks = getAllArtwork();
    return artworks.find(art => art.id === id);
  } catch (error) {
    console.error('Error loading artwork:', error);
    return null;
  }
};

export const deleteArtwork = (id) => {
  try {
    const artworks = getAllArtwork();
    const filtered = artworks.filter(art => art.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting artwork:', error);
    throw error;
  }
};

export const updateArtwork = (id, updates) => {
  try {
    const artworks = getAllArtwork();
    const index = artworks.findIndex(art => art.id === id);
    if (index !== -1) {
      artworks[index] = { ...artworks[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
      return artworks[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating artwork:', error);
    throw error;
  }
};

export const clearAllArtwork = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing artworks:', error);
    throw error;
  }
};

export const exportArtwork = (id) => {
  try {
    const artwork = getArtwork(id);
    if (!artwork) return null;

    const link = document.createElement('a');
    link.href = artwork.imageData;
    link.download = `${artwork.title}.png`;
    link.click();
    return true;
  } catch (error) {
    console.error('Error exporting artwork:', error);
    throw error;
  }
};
