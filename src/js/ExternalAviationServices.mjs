/**
 * @class ExternalAviationServices
 * @description Inbound async data provider architecture. Fetches, normalizes, and filters
 * multi-layered JSON telemetry from Aviationstack and AVWX APIs with built-in sandbox fallbacks.
 */
export default class ExternalAviationServices {
    constructor() {
        this.flightApiUrl = 'https://api.aviationstack.com/v1/flights';
        this.weatherApiUrl = 'https://avwx.rest/api/metar';

        // Developer Credentials
        this.flightApiKey = 'bb79973d3e878629926853ddce3ac4f1';
        this.weatherApiKey = 'AQr5Qk5OKrSKX_OZV7r-EP36M4azMnLYKinWdHZgiqE';
    }

    /**
     * Fetches real-time METAR and TAF observations in parallel.
     */
    async getAirportWeather(airport) {
        let icao = airport.trim().toUpperCase();
        if (icao.length === 3) {
            if (icao === 'RAI') icao = 'GVNP';
            else if (icao === 'LIS') icao = 'LPPT';
            else if (icao === 'SID') icao = 'GVAC';
            else icao = `G${icao}`;
        }

        const apiKey = this.weatherApiKey;
        const metarUrl = `https://avwx.rest/api/metar/${icao}`;
        const tafUrl = `https://avwx.rest/api/taf/${icao}`;

        try {
            const [metarRes, tafRes] = await Promise.all([
                fetch(metarUrl, { headers: { 'Authorization': `Token ${apiKey}` } }),
                fetch(tafUrl, { headers: { 'Authorization': `Token ${apiKey}` } })
            ]);

            if (!metarRes.ok) throw new Error(`AVWX METAR HTTP Error: ${metarRes.status}`);

            const metarData = await metarRes.json();
            let tafData = null;

            if (tafRes.ok) {
                tafData = await tafRes.json();
            }

            return { metar: metarData, taf: tafData };

        } catch (error) {
            console.warn(`AVWX API link failed. Engaging backup simulation for ${icao}.`, error);
            return {
                metar: {
                    station: icao,
                    raw: `${icao} 171930Z 21014KT 9999 FEW022 26/20 Q1013 NOSIG`,
                    flight_rules: 'VFR',
                    temperature: { value: 26 },
                    dewpoint: { value: 20 },
                    wind_speed: { value: 14 },
                    wind_direction: { value: 210 },
                    visibility: { value: 10 },
                    altimeter: { value: 1013 },
                    clouds: [{ repr: 'FEW', altitude: 22 }]
                },
                taf: {
                    raw: `${icao} 171700Z 1718/1824 22012KT 9999 FEW020 TX28/1814Z TN22/1806Z BECMG 1722/1724 18008KT`,
                    forecast: [
                        { start_time: { repr: "18:00" }, end_time: "24:00", flight_rules: "VFR", wind_speed: { value: 12 }, wind_direction: { value: 220 } },
                        { start_time: { repr: "22:00" }, end_time: "00:00", flight_rules: "VFR", wind_speed: { value: 8 }, wind_direction: { value: 180 } }
                    ]
                }
            };
        }
    }

    /**
     * Fetches real-time flight telemetry schedules filtered by Airport Node.
     */
    async getAirportFlights(airportIata, type = 'departure') {
        const iata = airportIata.trim().toUpperCase().substring(0, 3);

        try {
            const paramType = type === 'departure' ? 'dep_iata' : 'arr_iata';
            const url = `${this.flightApiUrl}?access_key=${this.flightApiKey}&${paramType}=${iata}&limit=20`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Aviationstack HTTP Error: ${response.status}`);

            const payload = await response.json();

            if (!payload.data || payload.data.length === 0) {
                return this._getSandboxFlights(iata, type);
            }

            return payload.data;
        } catch (error) {
            console.warn(`Aviationstack API throttled. Engaging local airport sandbox for ${iata}.`, error);
            return this._getSandboxFlights(iata, type);
        }
    }

    /**
     * NEW: Tracks an individual commercial flight vector by its IATA flight number.
     * @param {string} flightNum - Example: "VR601" or "TP1492"
     * @returns {Array} List containing the targeted complex flight object
     */
    async getFlightByNumber(flightNum) {
        const cleanNum = flightNum.trim().toUpperCase().replace(/\s+/g, '');

        try {
            const url = `${this.flightApiUrl}?access_key=${this.flightApiKey}&flight_iata=${cleanNum}&limit=1`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Aviationstack Flight Query HTTP Error: ${response.status}`);

            const payload = await response.json();

            if (!payload.data || payload.data.length === 0) {
                return this._getSandboxFlightByNumber(cleanNum);
            }

            return payload.data;
        } catch (error) {
            console.warn(`Aviationstack Tracking Link failed. Extracting sandbox tracking matrix for ${cleanNum}.`, error);
            return this._getSandboxFlightByNumber(cleanNum);
        }
    }

    /**
     * Internal Sandbox Proving Grounds for individual tracking exceptions
     */
    _getSandboxFlightByNumber(flightNum) {
        const pool = [
            {
                flight_date: "2026-06-17",
                flight_status: "active",
                flight: { number: "601", iata: "VR601" },
                airline: { name: "Cabo Verde Airlines" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "3", delay: 0, timezone: "Atlantic/Cape_Verde", scheduled: "2026-06-17T14:30:00+00:00" },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "A12", delay: 0, timezone: "Europe/Lisbon", scheduled: "2026-06-17T18:45:00+00:00" }
            },
            {
                flight_date: "2026-06-17",
                flight_status: "delayed",
                flight: { number: "1492", iata: "TP1492" },
                airline: { name: "TAP Air Portugal" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "1", delay: 55, timezone: "Atlantic/Cape_Verde", scheduled: "2026-06-17T23:05:00+00:00" },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "B04", delay: 45, timezone: "Europe/Lisbon", scheduled: "2026-06-17T03:20:00+00:00" }
            }
        ];

        const match = pool.find(f => f.flight.iata === flightNum);
        return match ? [match] : pool; // Devolve o match ou o pool por defeito para testes rápidos
    }

    _getSandboxFlights(iata, type) {
        const isDeparture = type === 'departure';
        return [
            {
                flight_date: "2026-06-17",
                flight_status: "active",
                flight: { number: "VR601" },
                airline: { name: "Cabo Verde Airlines" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "3", delay: 0, timezone: "Atlantic/Cape_Verde", scheduled: "2026-06-17T14:30:00+00:00" },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "A12", delay: 0, timezone: "Europe/Lisbon", scheduled: "2026-06-17T18:45:00+00:00" }
            },
            {
                flight_date: "2026-06-17",
                flight_status: "delayed",
                flight: { number: "TP1492" },
                airline: { name: "TAP Air Portugal" },
                departure: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "1", delay: 55, timezone: "Atlantic/Cape_Verde", scheduled: "2026-06-17T23:05:00+00:00" },
                arrival: { airport: "Lisbon Humberto Delgado", iata: "LIS", icao: "LPPT", terminal: "T1", gate: "B04", delay: 45, timezone: "Europe/Lisbon", scheduled: "2026-06-17T03:20:00+00:00" }
            },
            {
                flight_date: "2026-06-17",
                flight_status: "scheduled",
                flight: { number: "AT931" },
                airline: { name: "Royal Air Maroc" },
                departure: { airport: "Mohammed V Intl", iata: "CMN", icao: "GMMN", terminal: "T2", gate: "F2", delay: 10, timezone: "Africa/Casablanca", scheduled: "2026-06-17T01:15:00+00:00" },
                arrival: { airport: "Nelson Mandela Intl", iata: "RAI", icao: "GVNP", terminal: "T1", gate: "2", delay: 0, timezone: "Atlantic/Cape_Verde", scheduled: "2026-06-17T04:20:00+00:00" }
            }
        ].filter(f => isDeparture ? f.departure.iata === iata : f.arrival.iata === iata);
    }
}