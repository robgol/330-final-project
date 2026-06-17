import '../css/main.css';
import ExternalAviationServices from './ExternalAviationServices.mjs';
import AirportDashboard from './AirportDashboard.mjs';
import WeatherProcessor from './WeatherProcessor.mjs';
import FavoritesManager from './FavoritesManager.mjs';

const apiService = new ExternalAviationServices();
const dashboard = new AirportDashboard('dashboard-content', 'search-form');
const weatherProcessor = new WeatherProcessor('weather-container');
const favoritesManager = new FavoritesManager();

let currentFlights = [];
let currentFilterType = 'departure';
let activeSearchCode = '';

/**
 * Intelligent Router: Detects whether input is an Airport Node (IATA/ICAO) or a Flight Number
 */
async function handleAirportSearch(inputString) {
    // Sanitização de Input: Remove espaços extra, caracteres especiais e converte para UPPERCASE
    const cleanInput = inputString.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!cleanInput) {
        dashboard.renderError("Invalid Input: Please enter a valid alphanumeric Airport Code or Flight Number.");
        return;
    }

    activeSearchCode = cleanInput;
    const isFlightNumber = /\d/.test(cleanInput);

    if (isFlightNumber) {
        try {
            // Regra tática: Ocultar controlos de filtro e limpar contentor de meteorologia no tracking individual
            document.getElementById('filter-controls')?.classList.add('hidden');
            document.getElementById('weather-container').innerHTML = '';

            const individualFlight = await apiService.getFlightByNumber(cleanInput);
            dashboard.renderFlights(individualFlight, true);

        } catch (error) {
            console.error('Flight Track Error:', error);
            dashboard.renderError(`Tracking Link Error: Unable to locate active flight vectors for identifier ${cleanInput}.`);
        }
    } else {
        try {
            const weatherData = await apiService.getAirportWeather(cleanInput);
            weatherProcessor.render(weatherData.metar, weatherData.taf);

            const flightsData = await apiService.getAirportFlights(cleanInput, currentFilterType);

            currentFlights = flightsData.map(f => ({
                ...f,
                arrival_board_active: currentFilterType === 'arrival'
            }));

            dashboard.renderFlights(currentFlights, false);
            renderFavoriteToggleBtn();

            // Mostrar os filtros apenas se for um painel de aeroporto válido
            document.getElementById('filter-controls')?.classList.remove('hidden');

        } catch (error) {
            console.error('Airport Board Error:', error);
            document.getElementById('filter-controls')?.classList.add('hidden');
            dashboard.renderError(`Operational Connection Failure: Unable to load telemetry for network node ${cleanInput}.`);
        }
    }
}

function renderFavoritesBar() {
    const container = document.getElementById('favorites-list');
    if (!container) return;

    const list = favoritesManager.getFavorites();
    if (list.length === 0) {
        container.innerHTML = `<span class="text-slate-600 italic font-mono">No nodes pinned. Click the star on a searched airport.</span>`;
        return;
    }

    container.innerHTML = list.map(code => `
        <button data-code="${code}" class="px-2.5 py-1 bg-[#153053] hover:bg-blue-600 text-slate-200 hover:text-white rounded font-mono font-bold transition-all border border-slate-700/50 shadow-sm flex items-center space-x-1">
           <span>📌</span> <span>${code}</span>
        </button>
    `).join('');

    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code');
            const input = document.querySelector('#search-form input[type="text"]');
            if (input) input.value = code;
            dashboard.showLoading();
            handleAirportSearch(code);
        });
    });
}

function renderFavoriteToggleBtn() {
    const titleHeader = document.querySelector('#weather-container h3');
    if (!titleHeader) return;

    const isFav = favoritesManager.isFavorite(activeSearchCode);
    let favBtn = document.getElementById('btn-favorite-toggle');
    if (!favBtn) {
        favBtn = document.createElement('button');
        favBtn.id = 'btn-favorite-toggle';
        titleHeader.parentElement.appendChild(favBtn);
    }

    favBtn.className = `ml-3 px-3 py-1 text-xs rounded-md border font-medium font-mono transition-all ${isFav ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
        }`;
    favBtn.innerHTML = isFav ? '★ Pinned' : '☆ Pin Node';

    favBtn.onclick = (e) => {
        e.preventDefault();
        favoritesManager.toggleFavorite(activeSearchCode);
        renderFavoriteToggleBtn();
        renderFavoritesBar();
    };
}

function setupFilterListeners() {
    const btnDepartures = document.getElementById('btn-departures');
    const btnArrivals = document.getElementById('btn-arrivals');
    const chkDelays = document.getElementById('chk-delays-45');

    btnDepartures?.addEventListener('click', () => {
        currentFilterType = 'departure';
        btnDepartures.classList.add('bg-blue-600', 'text-white');
        btnArrivals?.classList.remove('bg-blue-600', 'text-white');
        triggerRefetch();
    });

    btnArrivals?.addEventListener('click', () => {
        currentFilterType = 'arrival';
        btnArrivals.classList.add('bg-blue-600', 'text-white');
        btnDepartures?.classList.remove('bg-blue-600', 'text-white');
        triggerRefetch();
    });

    chkDelays?.addEventListener('change', (e) => {
        if (e.target.checked) {
            const delayedFlights = currentFlights.filter(f => {
                const currentFlow = currentFilterType === 'departure' ? f.departure : f.arrival;
                return (currentFlow?.delay || 0) > 45;
            });
            dashboard.renderFlights(delayedFlights);
        } else {
            dashboard.renderFlights(currentFlights, false);
        }
    });
}

function triggerRefetch() {
    const form = document.getElementById('search-form');
    const input = form?.querySelector('input[type="text"]');

    // Certificar que não fazemos refetch automático se o input atual for um número de voo
    if (input && form.checkValidity() && !/\d/.test(input.value)) {
        dashboard.showLoading();
        handleAirportSearch(input.value.trim().toUpperCase());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="text"]');
            if (input && input.value.trim() !== '') {
                dashboard.showLoading();
                handleAirportSearch(input.value.trim().toUpperCase());
            }
        });
    }

    setupFilterListeners();
    renderFavoritesBar();
});