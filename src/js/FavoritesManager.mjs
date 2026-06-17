/**
 * @class FavoritesManager
 * @description Manages persistent storage of favorite airport nodes using local client-side memory.
 */
export default class FavoritesManager {
    constructor() {
        this.storageKey = 'aerodash_favorites';
    }

    /**
     * Retrieves the array of saved airport codes
     * @returns {Array<string>} List of upper-cased codes
     */
    getFavorites() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Toggles the favorite status of an airport node
     * @param {string} airportCode - 3 or 4 letter code
     * @returns {boolean} True if added, false if removed
     */
    toggleFavorite(airportCode) {
        const code = airportCode.trim().toUpperCase();
        let favorites = this.getFavorites();
        const index = favorites.indexOf(code);

        if (index > -1) {
            favorites.splice(index, 1); // Remove se já existir
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
            return false;
        } else {
            favorites.push(code); // Adiciona se for novo
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
            return true;
        }
    }

    /**
     * Checks if a specific node is currently pinned
     * @param {string} airportCode 
     * @returns {boolean}
     */
    isFavorite(airportCode) {
        return this.getFavorites().includes(airportCode.trim().toUpperCase());
    }
}