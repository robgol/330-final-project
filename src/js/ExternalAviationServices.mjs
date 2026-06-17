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

        // Developer Credentials - Live Production Keys Integrated
        this.flightApiKey = 'bb79973d3e878629926853ddce3ac4f1';
        this.weatherApiKey = 'AQr5Qk5OKrSKX_OZV7r-EP36M4azMnLYKinWdHZgiqE';
    }

    /**
     * Fetches real-time aeronautical meteorological observations.
     * @param {string} airport - Airport code (Handles dynamic conversion)
     * @returns {Object} Deeply nested JSON weather report structure
     */
    async getAirportWeather(airport) {
        let icao = airport.trim().toUpperCase();
        if (icao.length === 3) {
            if (icao === 'RAI') icao = 'GVNP';
            else if (icao === 'LIS') icao = 'LPPT';
            else if (icao === 'SID') icao = 'GVAC';
            else icao = `G${icao}`;
        }

        try {
            // A AVWX exige explicitamente o prefixo "Token " antes da chave de API
            const response = await fetch(`${this.weatherApiUrl}/${icao}`, {
                headers: {
                    'Authorization': `Token ${this.weatherApiKey}`
                }
            });

            if (!response.ok) throw new Error(`AVWX Telemetry HTTP Error: ${response.status}`);

            const data = await response.json();
            console.log("Live Weather Data Received:", data);
            return data;
        } catch (error) {
            console.warn(`AVWX API failure. Engaging local meteorological sandbox for ${icao}.`, error);
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

        try {
            // Parâmetro correto para a conta gratuita da Aviationstack filtrar por fluxo de tráfego
            const paramType = type === 'departure' ? 'dep_iata' : 'arr_iata';
            const url = `${this.flightApiUrl}?access_key=${this.flightApiKey}&${paramType}=${iata}&limit=20`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Aviationstack HTTP Error: ${response.status}`);

            const payload = await response.json();
            console.log("Live Flights Data Received:", payload);

            // Se a API retornar um array vazio devido a restrições de rotas gratuitas, ativa o sandbox
            if (!payload.data || payload.data.length === 0) {
                return this._getSandboxFlights(iata, type);
            }

            return payload.data;
        } catch (error) {
            console.warn(`Aviationstack API throttled. Engaging local flight operations sandbox for ${iata}.`, error);
            return this._getSandboxFlights(iata, type);
        }
    }

    /**
     * Internal Sandbox Proving Grounds - Weather Data Matrix
     */
    _getSandboxWeather(icao) {
        return {
            station: icao,
            raw: `${icao} 171930Z 21014KT 9999 FEW022 26/20 Q1013 NOSIG`,
            flight_rules: 'VFR',
            temperature: { value: 26 },
            dewpoint: { value: 20 },
            wind_speed: { value: 14 },
            wind_direction: { value: 210 },
            visibility: { value: 10 },
            altimeter: { value: 1013 },
            clouds: [
                { repr: 'FEW', altitude: 22 }
            ]
        };
    }

    /**
     * Internal Sandbox Proving Grounds - Complex Flight Objects Mapping
     */
    _getSandboxFlights(iata, type) {
        const isDeparture = type === 'departure';
        return [
            {
                flight_date: "2026-06-17",
                flight_status: "active",
                flight: { number: "VR601" },
                airline: { name: "Cabo Verde Airlines" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "3", delay: 0 },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "A12", delay: 0 }
            },
            {
                flight_date: "2026-06-17",
                flight_status: "delayed",
                flight: { number: "TP1492" },
                airline: { name: "TAP Air Portugal" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "1", delay: 55 },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "B04", delay: 45 }
            },
            {
                flight_date: "2026-06-17",
                flight_status: "scheduled",
                flight: { number: "AT931" },
                airline: { name: "Royal Air Maroc" },
                departure: { airport: "Mohammed V Intl", iata: "CMN", icao: "GMMN", terminal: "T2", gate: "F2", delay: 10 },
                arrival: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "2", delay: 0 }
            }
        ].filter(f => isDeparture ? f.departure.iata === iata : f.arrival.iata === iata);
    }
}