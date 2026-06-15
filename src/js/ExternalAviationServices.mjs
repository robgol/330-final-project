/**
 * @class ExternalAviationServices
 * @description Inbound async data provider architecture. Fetches, normalizes, and filters
 * multi-layered JSON telemetry from Aviationstack and AVWX APIs with built-in sandbox fallbacks.
 */
export default class ExternalAviationServices {
    constructor() {
        // Official API Base Endpoints
        this.flightApiUrl = 'https://api.aviationstack.com/v1/flights';
        this.weatherApiUrl = 'https://avwx.rest/api/metar';

        // Developer Credentials (To be populated with live keys during production deployment)
        this.flightApiKey = '';
        this.weatherApiKey = '';
    }

    /**
     * Fetches real-time aeronautical meteorological observations.
     * @param {string} airport - Airport code (Handles dynamic conversion)
     * @returns {Object} Deeply nested JSON weather report structure
     */
    async getAirportWeather(airport) {
        // AVWX demands a 4-letter ICAO code. If user enters 3-letter IATA (e.g., RAI), we gracefully map it.
        let icao = airport.trim().toUpperCase();
        if (icao.length === 3) {
            if (icao === 'RAI') icao = 'GVNP';
            else if (icao === 'LIS') icao = 'LPPT';
            else if (icao === 'SID') icao = 'GVAC';
            else icao = `G${icao}`; // Standard geographical prefix approximation
        }

        // If API Keys are missing, immediately pipe the rich offline simulation mode
        if (!this.weatherApiKey) {
            return this._getSandboxWeather(icao);
        }

        try {
            const response = await fetch(`${this.weatherApiUrl}/${icao}`, {
                headers: { 'Authorization': `BEARER ${this.weatherApiKey}` }
            });
            if (!response.ok) throw new Error(`AVWX Telemetry HTTP Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn(`AVWX API offline or throttled. Engaging local meteorological sandbox for ${icao}.`);
            return this._getSandboxWeather(icao);
        }
    }

    /**
     * Fetches real-time flight telemetry schedules for a specific node.
     * @param {string} airportIata - 3-letter IATA airport identification code
     * @param {string} type - 'departure' or 'arrival' trilateral classification
     * @returns {Array} List of complex flight objects with +6 required parameters
     */
    async getAirportFlights(airportIata, type = 'departure') {
        const iata = airportIata.trim().toUpperCase().substring(0, 3);

        if (!this.flightApiKey) {
            return this._getSandboxFlights(iata, type);
        }

        try {
            const url = `${this.flightApiUrl}?access_key=${this.flightApiKey}&${type}_iata=${iata}&limit=20`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Aviationstack HTTP Error: ${response.status}`);
            const payload = await response.json();
            return payload.data || [];
        } catch (error) {
            console.warn(`Aviationstack API throttled. Engaging local flight operations sandbox for ${iata}.`);
            return this._getSandboxFlights(iata, type);
        }
    }

    /**
     * Internal Sandbox Proving Grounds - Weather Data Matrix
     */
    _getSandboxWeather(icao) {
        return {
            station: icao,
            raw: `${icao} 142200Z 21012KT 9999 FEW018 BKN250 24/18 Q1014 NOSIG`,
            flight_rules: 'VFR',
            temperature: { value: 24 },
            dewpoint: { value: 18 },
            wind_speed: { value: 12 },
            wind_direction: { value: 210 },
            visibility: { value: 10 },
            altimeter: { value: 1014 },
            clouds: [
                { repr: 'FEW', altitude: 18 },
                { repr: 'BKN', altitude: 250 }
            ]
        };
    }

    /**
     * Internal Sandbox Proving Grounds - Complex Flight Objects Mapping
     * Hardcodes over 6 attributes per element to securely validate the UI filters.
     */
    _getSandboxFlights(iata, type) {
        const isDeparture = type === 'departure';
        return [
            {
                flight_date: "2026-06-14",
                flight_status: "active",
                flight: { number: "VR601" },
                airline: { name: "Cabo Verde Airlines" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "3", delay: 0 },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "A12", delay: 0 }
            },
            {
                flight_date: "2026-06-14",
                flight_status: "delayed",
                flight: { number: "TP1492" },
                airline: { name: "TAP Air Portugal" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "1", delay: 55 },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "B04", delay: 45 }
            },
            {
                flight_date: "2026-06-14",
                flight_status: "scheduled",
                flight: { number: "AT931" },
                airline: { name: "Royal Air Maroc" },
                departure: { airport: "Mohammed V Intl", iata: "CMN", icao: "GMMN", terminal: "T2", gate: "F2", delay: 10 },
                arrival: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "2", delay: 0 }
            }
        ].filter(f => isDeparture ? f.departure.iata === iata : f.arrival.iata === iata);
    }
}