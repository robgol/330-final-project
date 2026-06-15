/**
 * @class WeatherProcessor
 * @description Decodes complex dynamic aviation weather payloads (METAR/TAF) into human-readable UI components.
 */
export default class WeatherProcessor {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
    }

    /**
     * Renders the weather component after parsing the dynamic nested JSON tree.
     * @param {Object} weatherData - Raw JSON response from AVWX API
     */
    render(weatherData) {
        if (!weatherData) {
            this.container.innerHTML = `<p class="text-amber-500">Meteorological data unavailable.</p>`;
            return;
        }

        // Extraction of dynamic and nested attributes (JSON Complexity requirement)
        const station = weatherData.station || '---';
        const rawMetar = weatherData.raw || 'No raw data available.';
        const flightRules = weatherData.flight_rules || 'VFR'; // VFR, MVFR, IFR
        const temp = weatherData.temperature?.value ?? 'N/A';
        const dewpoint = weatherData.dewpoint?.value ?? 'N/A';
        const windSpeed = weatherData.wind_speed?.value ?? 0;
        const windDir = weatherData.wind_direction?.value ?? 0;
        const visibility = weatherData.visibility?.value ?? 'N/A';

        // Processing nested clouds array
        let cloudsSummary = 'Sky Clear';
        if (weatherData.clouds && weatherData.clouds.length > 0) {
            cloudsSummary = weatherData.clouds
                .map(c => `${c.repr} at ${c.altitude * 100} ft`)
                .join(', ');
        }

        // Determine badge styling based on Flight Rules
        const badgeColor = flightRules === 'VFR'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

        this.container.innerHTML = `
      <div class="bg-[#153053] rounded-xl p-6 border border-slate-700 shadow-xl transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-white">Meteorological Report (${station})</h3>
          <span class="px-3 py-1 text-xs font-semibold rounded-full border ${badgeColor}">
            ${flightRules}
          </span>
        </div>

        <div class="bg-[#0b192c] p-3 rounded border border-slate-800 mb-4">
          <code class="text-xs text-amber-400 block break-words font-mono">${rawMetar}</code>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Wind</span>
            <span class="text-white font-medium">${windDir}° @ ${windSpeed} KT</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Visibility</span>
            <span class="text-white font-medium">${visibility} SM</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Temp / Dewpoint</span>
            <span class="text-white font-medium">${temp}°C / ${dewpoint}°C</span>
          </div>
          <div class="bg-[#0f243e] p-3 rounded border border-slate-800/50 col-span-2 md:col-span-3">
            <span class="text-slate-400 block text-xs uppercase font-semibold">Cloud Layers</span>
            <span class="text-white font-medium">${cloudsSummary}</span>
          </div>
        </div>
      </div>
    `;
    }
}