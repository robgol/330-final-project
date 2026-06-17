/**
 * @class WeatherProcessor
 * @description Decodes complex dynamic aviation weather payloads (METAR/TAF) into human-readable UI components in English.
 */
export default class WeatherProcessor {
  constructor(elementId) {
    this.container = document.getElementById(elementId);
  }

  /**
   * Renders the weather component after parsing the dynamic nested JSON tree.
   * @param {Object} metar - Raw JSON response for METAR
   * @param {Object} taf - Raw JSON response for TAF (Forecast)
   */
  render(metar, taf) {
    if (!metar) {
      this.container.innerHTML = `
                <div class="bg-[#112240] rounded-xl p-6 border border-slate-800 shadow-md">
                    <p class="text-amber-500 font-mono text-xs">Meteorological telemetry link offline.</p>
                </div>
            `;
      return;
    }

    const station = metar.station || '---';
    const rawMetar = metar.raw || 'No operational raw data streams.';
    const flightRules = metar.flight_rules || 'VFR';
    const temp = metar.temperature?.value ?? 'N/A';
    const dewpoint = metar.dewpoint?.value ?? 'N/A';
    const windSpeed = metar.wind_speed?.value ?? 0;
    const windDir = metar.wind_direction?.value ?? 0;
    const visibility = metar.visibility?.value ?? 'N/A';

    let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (flightRules === 'VFR') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (flightRules === 'IFR') badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';

    let tafHtml = '';
    if (taf && taf.forecast && Array.isArray(taf.forecast)) {
      const forecastPeriods = taf.forecast.slice(0, 3).map(period => {
        const start = period.start_time?.repr || period.start_time || '---';
        const wSpeed = period.wind_speed?.value ?? period.wind_speed ?? null;
        const wDir = period.wind_direction?.value ?? period.wind_direction ?? 0;

        const wind = wSpeed !== null ? `${wDir}° @ ${wSpeed}KT` : 'Variable / Light';
        const rules = period.flight_rules || 'VFR';
        const cleanStart = start.includes('T') ? start.split('T')[1].substring(0, 5) : start;

        return `
                    <div class="bg-[#0a192f]/40 p-2.5 rounded border border-slate-800 flex flex-col justify-between font-mono">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-bold text-amber-400">⏱️ From ${cleanStart}Z</span>
                            <span class="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-800 text-slate-300">${rules}</span>
                        </div>
                        <p class="text-xs text-slate-300">Wind: <strong class="text-white">${wind}</strong></p>
                    </div>
                `;
      }).join('');

      tafHtml = `
                <div class="mt-5 pt-4 border-t border-slate-800">
                    <h4 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 font-mono">Aerodrome Forecast (TAF) — Upcoming Variations</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${forecastPeriods}
                    </div>
                    <code class="text-[10px] text-slate-500 block mt-2.5 break-words font-mono bg-[#0b192c]/50 p-2 rounded border border-slate-800/60">${taf.raw || ''}</code>
                </div>
            `;
    } else {
      tafHtml = `
                <div class="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 italic font-mono">
                    TAF forecast unavailable for this aerodrome at this time.
                </div>
            `;
    }

    this.container.innerHTML = `
          <div class="bg-[#112240] rounded-xl p-6 border border-slate-800 shadow-md">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <h3 class="text-xl font-bold text-white tracking-tight">Weather Report — ${station}</h3>
              </div>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded border ${badgeColor} font-mono tracking-wider">
                ${flightRules}
              </span>
            </div>

            <div class="bg-[#0b192c] p-3 rounded border border-slate-800 mb-4">
              <code class="text-xs text-amber-400 block break-words font-mono">${rawMetar}</code>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Wind</span>
                <span class="text-white font-medium font-mono">${windDir}° @ ${windSpeed} KT</span>
              </div>
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Visibility</span>
                <span class="text-white font-medium font-mono">${visibility} SM</span>
              </div>
              <div class="bg-[#0f243e]/40 p-3 rounded border border-slate-800/50 col-span-2 md:col-span-1">
                <span class="text-slate-500 block text-[11px] uppercase font-bold font-mono">Temp / Dewpoint</span>
                <span class="text-white font-medium font-mono">${temp}°C / ${dewpoint}°C</span>
              </div>
            </div>

            ${tafHtml}
          </div>
        `;
  }
}