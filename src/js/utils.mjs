/**
 * @file utils.mjs
 * @description Global utilities for the AeroDash ecosystem, including time conversions and structural formatting.
 */

/**
 * Calculates the time zone difference in hours between two IANA time zone strings.
 * @param {string} tzOrigin - Example: "Atlantic/Cape_Verde"
 * @param {string} tzDestination - Example: "Europe/Lisbon"
 * @returns {string} Formatted difference string (e.g., "+2h", "-1h", "Same time")
 */
export function calculateTimezoneDifference(tzOrigin, tzDestination) {
    if (!tzOrigin || !tzDestination) return '';

    try {
        const date = new Date();

        // Obter os offsets em minutos para cada fuso horário no momento atual
        const formatterOrigin = new Intl.DateTimeFormat('en-US', { timeZone: tzOrigin, timeZoneName: 'longOffset' });
        const formatterDest = new Intl.DateTimeFormat('en-US', { timeZone: tzDestination, timeZoneName: 'longOffset' });

        const partsOrigin = formatterOrigin.formatToParts(date);
        const partsDest = formatterDest.formatToParts(date);

        const offsetOriginStr = partsOrigin.find(p => p.type === 'timeZoneName').value; // Ex: "GMT-1" ou "GMT+1"
        const offsetDestStr = partsDest.find(p => p.type === 'timeZoneName').value;

        const parseOffset = (str) => {
            if (str === 'GMT') return 0;
            const match = str.match(/GMT([+-])(\d+)(?::(\d+))?/);
            if (!match) return 0;
            const [_, sign, hours, minutes] = match;
            const val = parseInt(hours, 10) + (minutes ? parseInt(minutes, 10) / 60 : 0);
            return sign === '+' ? val : -val;
        };

        const offsetOrigin = parseOffset(offsetOriginStr);
        const offsetDest = parseOffset(offsetDestStr);

        const diff = offsetDest - offsetOrigin;

        if (diff === 0) return 'Same time';
        return diff > 0 ? `+${diff}h` : `${diff}h`;
    } catch (e) {
        console.warn("Failed to calculate timezone delta contextually", e);
        return '';
    }
}