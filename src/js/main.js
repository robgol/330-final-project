import '../css/main.css';
import ExternalAviationServices from './ExternalAviationServices.mjs';

(async () => {
    // Initialize the data service
    const aviationService = new ExternalAviationServices();
    const mainDisplay = document.getElementById('dashboard-content');

    try {
        console.log("Aviation Dashboard Initialized.");

        // Asynchronously fetch data from the API
        const alerts = await aviationService.getLiveAviationData();

        // Clear "Loading..." text
        mainDisplay.innerHTML = '';

        if (alerts.length === 0) {
            mainDisplay.innerHTML = `<p class="text-slate-400">No operational data available at the moment.</p>`;
            return;
        }

        // Dynamically create HTML structure based on received data
        const listContainer = document.createElement('div');
        listContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        alerts.forEach(item => {
            const properties = item.properties || {};
            const card = document.createElement('div');
            card.className = 'p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm hover:border-blue-500/50 transition-colors';

            card.innerHTML = `
        <span class="inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-red-500/10 text-red-400 mb-2">
          ${properties.severity || 'Alert'}
        </span>
        <h3 class="text-lg font-bold text-slate-100">${properties.event || 'Unknown Event'}</h3>
        <p class="text-sm text-slate-400 mt-2 line-clamp-3">${properties.headline || 'No additional details available.'}</p>
        <div class="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-2">
          Origin: ${properties.senderName || 'N/A'}
        </div>
      `;
            listContainer.appendChild(card);
        });

        mainDisplay.appendChild(listContainer);

    } catch (error) {
        // Visual error handling in compliance with course standards
        mainDisplay.innerHTML = `
      <div class="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
        <h2 class="font-bold">System Error</h2>
        <p class="text-sm mt-1">Unable to load tactical aviation data. Please try again later.</p>
      </div>
    `;
    }
})();