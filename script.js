document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const DATA_SOURCE_URL = '/data.csv';

    // State Variables
    let allCards = [];
    let filteredCards = [];
    let compareList = []; // Max 4 cards
    const CARDS_PER_PAGE = 12;
    let visibleCardsCount = CARDS_PER_PAGE;
    let isInitialLoad = true;
    let allowModalOpen = false;
    const initialPathname = window.location.pathname;

    const FIELDS = {
        name: 'Card Service',
        logo: 'IMG',
        cardType: 'Card Type',
        custody: 'Custody',
        network: 'Visa or Mastercard',
        issuanceFee: 'Card Issuance Fee',
        annualFee: 'Annual Fee',
        cashback: 'Cashback',
        regions: 'Regions KYC Available',
        fxFee: 'FX Fee',
        topUpMethods: 'Top-up Methods',
        spendLimit: 'Daily Spending Limit',
        atmLimit: 'ATM Withdrawal Limit',
        pros: 'Pros',
        cons: 'Cons',
        description: 'Marketing Description',
        mainPageCashback: 'Main Page Cashback'
    };

    // Helper functions
    const getSlug = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };
    const stripParens = (str) => str ? str.replace(/\s*\([^)]*\)/g, '').trim() : '';
    const getSimplifiedNetwork = (networkStr) => {
        const net = stripParens(networkStr);
        if (!net) return '';
        const low = net.toLowerCase();
        if (low.includes('mastercard') && low.includes('visa')) return 'Visa + Mastercard';
        if (low.includes('mastercard')) return 'Mastercard';
        if (low.includes('visa')) return 'Visa';
        return net;
    };

    // DOM Elements
    const cardsGrid = document.getElementById('cardsGrid');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const searchInput = document.getElementById('searchInput');
    const custodyFilter = document.getElementById('custodyFilter');
    const networkFilter = document.getElementById('networkFilter');
    const typeFilter = document.getElementById('typeFilter');
    const regionFilter = document.getElementById('regionFilter');
    const countryFilter = document.getElementById('countryFilter');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const cardModal = document.getElementById('cardModal');
    const modalContent = document.getElementById('modalContent');
    const cardModalCloseBtn = document.getElementById('cardModalClose');

    const compareBar = document.getElementById('compareBar');
    const compareCount = document.getElementById('compareCount');
    const compareSlots = document.getElementById('compareSlots');
    const clearCompareBtn = document.getElementById('clearCompareBtn');
    const compareNowBtn = document.getElementById('compareNowBtn');
    const compareModal = document.getElementById('compareModal');
    const compareTable = document.getElementById('compareTable');
    const compareModalCloseBtn = document.getElementById('compareModalClose');

    // Fetch data
    Papa.parse(DATA_SOURCE_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            allCards = results.data.filter(card => {
                if (!card[FIELDS.name] || card[FIELDS.name].trim() === '') return false;

                const cardType = (card[FIELDS.cardType] || '').toLowerCase();
                const regions = (card[FIELDS.regions] || '').toLowerCase();

                // Remove cards with unavailable data
                if (cardType.includes('data not available') || cardType.includes('not yet disclosed')) return false;
                if (regions.includes('data not available') || regions.includes('not yet disclosed')) return false;

                return true;
            });
            loadingIndicator.style.display = 'none';
            populateRegionFilter();
            populateCountryFilter('all');
            handleInitialRouting();
            resetFilters();
        },
        error: function (error) {
            console.error('Error fetching CSV:', error);
            loadingIndicator.innerHTML = '<p>Error loading data. Please check if data.csv exists.</p>';
        }
    });

    // Event Listeners
    searchInput.addEventListener('input', applyFilters);
    custodyFilter.addEventListener('change', applyFilters);
    networkFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    if (regionFilter) {
        regionFilter.addEventListener('change', () => {
            populateCountryFilter(regionFilter.value);
            applyFilters();
        });
    }
    if (countryFilter) countryFilter.addEventListener('change', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);

    loadMoreBtn.addEventListener('click', () => {
        visibleCardsCount += CARDS_PER_PAGE;
        renderCards();
    });

    cardModalCloseBtn.addEventListener('click', closeCardModal);
    cardModal.addEventListener('click', (e) => {
        if (e.target === cardModal) closeCardModal();
    });

    compareModalCloseBtn.addEventListener('click', closeCompareModal);
    compareModal.addEventListener('click', (e) => {
        if (e.target === compareModal) closeCompareModal();
    });

    clearCompareBtn.addEventListener('click', clearCompare);
    compareNowBtn.addEventListener('click', openCompareModal);

    window.addEventListener('popstate', handleRoutingChange);

    function handleRoutingChange(event) {
        if (isInitialLoad) return;

        const currentPath = window.location.pathname.replace(/\/$/, "");
        const startPath = initialPathname.replace(/\/$/, "");

        if (currentPath === startPath) {
            closeCardModal(false);
            return;
        }

        const slug = getSlugFromURL();
        if (slug) {
            const card = allCards.find(c => getSlug(c[FIELDS.name]) === slug);
            if (card) {
                openModal(card, false); // false = don't push state
            } else {
                closeCardModal(false);
            }
        } else {
            closeCardModal(false);
        }
    }

    function getSlugFromURL() {
        // Handle both /cards/slug and /cards/slug/
        const path = window.location.pathname.replace(/\/$/, "");
        const match = path.match(/\/cards\/([^\/]+)$/);
        if (match) return match[1];

        // Fallback for query param if needed
        const params = new URLSearchParams(window.location.search);
        return params.get('card');
    }

    function handleInitialRouting() {
        const slug = getSlugFromURL();
        if (slug) {
            const card = allCards.find(c => getSlug(c[FIELDS.name]) === slug);
            if (card) {
                injectStaticCardDetails(card);
            }
        }
        isInitialLoad = false;
        allowModalOpen = true;
    }

    function injectStaticCardDetails(card) {
        if (document.getElementById('card-detail-static')) return;
        
        const name = card[FIELDS.name] || 'Unknown Card';
        const description = card[FIELDS.description] || 'No description available for this card.';
        const issuanceFee = card[FIELDS.issuanceFee] || 'N/A';
        const annualFee = card[FIELDS.annualFee] || 'N/A';
        const fxFee = card[FIELDS.fxFee] || 'N/A';
        const atmLimit = card[FIELDS.atmLimit] || 'N/A';
        const spendLimit = card[FIELDS.spendLimit] || 'N/A';
        const cardType = card[FIELDS.cardType] || 'N/A';
        const cashback = card[FIELDS.cashback] || 'N/A';
        const topUpMethods = card[FIELDS.topUpMethods] || 'N/A';
        const regions = card[FIELDS.regions] || 'Worldwide';
        const pros = card[FIELDS.pros] ? expandList(card[FIELDS.pros]) : '<p>Not specified.</p>';
        const cons = card[FIELDS.cons] ? expandList(card[FIELDS.cons]) : '<p>Not specified.</p>';

        const section = document.createElement('section');
        section.id = 'card-detail-static';
        section.className = 'card-detail-static';
        
        section.innerHTML = `
            <div class="container">
                <div class="static-card-wrapper">
                    <h1>${name} Review 2026 — Fees, Cashback & Availability</h1>
                    <p class="static-desc">${description}</p>
                    
                    <div class="static-grid">
                        <div class="static-table-container">
                            <h3><i class="fa-solid fa-money-bill-transfer"></i> Fees & Limits</h3>
                            <table class="static-table">
                                <tbody>
                                    <tr><td>Issuance Fee</td><td>${issuanceFee}</td></tr>
                                    <tr><td>Annual Fee</td><td>${annualFee}</td></tr>
                                    <tr><td>FX Fee</td><td>${fxFee}</td></tr>
                                    <tr><td>ATM Limit</td><td>${atmLimit}</td></tr>
                                    <tr><td>Spending Limit</td><td>${spendLimit}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="static-features">
                            <h3><i class="fa-solid fa-star"></i> Core Features</h3>
                            <ul>
                                <li><strong>Card Type:</strong> ${cardType}</li>
                                <li><strong>Cashback:</strong> ${cashback}</li>
                                <li><strong>Top up with:</strong> ${topUpMethods}</li>
                                <li><strong>Available Regions:</strong> ${regions}</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="static-pros-cons">
                        <div class="static-pro">
                            <h4><i class="fa-solid fa-check-circle"></i> Key Strengths</h4>
                            ${pros}
                        </div>
                        <div class="static-con">
                            <h4><i class="fa-solid fa-times-circle"></i> Considerations</h4>
                            ${cons}
                        </div>
                    </div>

                    <div class="static-faq">
                        <h3><i class="fa-solid fa-circle-question"></i> Frequently Asked Questions</h3>
                        <div class="faq-item">
                            <h4>What is the ${name}?</h4>
                            <p>${description}</p>
                        </div>
                        <div class="faq-item">
                            <h4>What are the fees for ${name}?</h4>
                            <p>The issuance fee is ${issuanceFee}, and the annual fee is ${annualFee}. Foreign exchange fees are ${fxFee}.</p>
                        </div>
                        <div class="faq-item">
                            <h4>Where is ${name} available?</h4>
                            <p>This card is available in ${regions}.</p>
                        </div>
                    <div class="static-similar">
                        <h3>Similar Cards You Might Like</h3>
                        <div class="similar-cards-list" id="similar-cards-list"></div>
                    </div>
                </div>
            </div>
            <div class="static-separator"></div>
        `;
        
        const discoverSection = document.getElementById('discover');
        if (discoverSection) {
            discoverSection.parentNode.insertBefore(section, discoverSection);
        }

        // Populate Similar Cards
        const similarList = document.getElementById('similar-cards-list');
        if (similarList) {
            const others = allCards.filter(c => c[FIELDS.name] !== card[FIELDS.name]);
            const randoms = others.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            randoms.forEach(c => {
                const link = document.createElement('a');
                link.href = `/cards/${getSlug(c[FIELDS.name])}`;
                link.className = 'similar-card-link';
                link.textContent = c[FIELDS.name];
                similarList.appendChild(link);
            });
        }

        const jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `What is the ${name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": description
                    }
                },
                {
                    "@type": "Question",
                    "name": `What are the fees for ${name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `The issuance fee is ${issuanceFee}, and the annual fee is ${annualFee}. Foreign exchange fees are ${fxFee}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Where is ${name} available?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `This card is available in ${regions}.`
                    }
                }
            ]
        });
        document.head.appendChild(jsonLd);
    }
    // Apply all active filters
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const custodyVal = custodyFilter.value;
        const networkVal = networkFilter.value.toLowerCase();
        const typeVal = typeFilter.value.toLowerCase();
        const regionVal = regionFilter ? regionFilter.value : 'all';
        const countryVal = countryFilter ? countryFilter.value : 'all';

        filteredCards = allCards.filter(card => {
            // Check Search
            let matchesSearch = true;
            if (searchTerm) {
                const name = (card[FIELDS.name] || '').toLowerCase();
                const desc = (card[FIELDS.description] || '').toLowerCase();
                const crypto = (card[FIELDS.topUpMethods] || '').toLowerCase();
                matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm) || crypto.includes(searchTerm);
            }

            // Check Custody
            let matchesCustody = true;
            if (custodyVal !== 'all') {
                const custody = (card[FIELDS.custody] || '');
                if (custodyVal === 'Custodial' && !custody.toLowerCase().includes('custodial')) matchesCustody = false;
                if (custodyVal === 'Self-custody' && !custody.toLowerCase().includes('self-custody')) matchesCustody = false;
                if (custodyVal === 'Hybrid' && !custody.toLowerCase().includes('hybrid')) matchesCustody = false;

                if (custodyVal === 'Custodial') {
                    matchesCustody = custody.toLowerCase() === 'custodial' || custody.toLowerCase() === 'fully custodial';
                }
            }

            // Check Network
            let matchesNetwork = true;
            if (networkVal !== 'all') {
                const network = (card[FIELDS.network] || '').toLowerCase();
                matchesNetwork = network.includes(networkVal);
            }

            // Check Type
            let matchesType = true;
            if (typeVal !== 'all') {
                const type = (card[FIELDS.cardType] || '').toLowerCase();
                matchesType = type.includes(typeVal);
            }

            // Check Region
            let matchesRegion = true;
            if (regionVal !== 'all') {
                const regions = (card[FIELDS.regions] || '').toLowerCase();
                matchesRegion = regions.includes(regionVal.toLowerCase());
            }

            // Check Country
            let matchesCountry = true;
            if (countryVal !== 'all') {
                const countriesRaw = (card['P Countries Available'] || card['Counties Available'] || card['Countries Available'] || '').toLowerCase();
                matchesCountry = countriesRaw.includes(countryVal.toLowerCase());
            }

            return matchesSearch && matchesCustody && matchesNetwork && matchesType && matchesRegion && matchesCountry;
        });

        visibleCardsCount = CARDS_PER_PAGE;
        renderCards();
    }

    function resetFilters() {
        searchInput.value = '';
        custodyFilter.value = 'all';
        networkFilter.value = 'all';
        typeFilter.value = 'all';
        if (regionFilter) regionFilter.value = 'all';
        if (countryFilter) countryFilter.value = 'all';
        applyFilters();
    }

    // Helper to transform Google Drive URLs to format to avoid CORB/ORB/403 issues
    function transformGDriveUrl(url) {
        if (!url || typeof url !== 'string') return url;

        // Match various Google Drive URL patterns to extract the ID
        const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);

        if (idMatch && idMatch[1]) {
            const fileId = idMatch[1];
            // Using the uc endpoint which is more reliable for direct embedding
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }

        return url;
    }

    function populateRegionFilter() {
        if (!regionFilter) return;

        const predefinedRegions = [
            "Global",
            "Worldwide",
            "USA",
            "UK",
            "Europe",
            "EEA",
            "Asia",
            "Latin America",
            "Africa",
            "Australia",
            "Canada"
        ];

        predefinedRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.toLowerCase();
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }

    const getCodeFromIntl = () => {
        const map = new Map();
        try {
            const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
            for (let i = 65; i <= 90; i++) {
                for (let j = 65; j <= 90; j++) {
                    const code = String.fromCharCode(i) + String.fromCharCode(j);
                    try {
                        const name = displayNames.of(code);
                        if (name) {
                            map.set(name.toLowerCase(), code);
                        }
                    } catch (e) { }
                }
            }
        } catch (e) { }
        return map;
    };

    let countryCodeMap = null;
    function getFlagEmoji(countryName) {
        if (!countryCodeMap) {
            countryCodeMap = getCodeFromIntl();
            // Extensive alias map for common problematic country names
            const aliases = {
                'usa': 'US', 'united states': 'US', 'united states of america': 'US', 'uk': 'GB', 'united kingdom': 'GB',
                'great britain': 'GB', 'uae': 'AE', 'united arab emirates': 'AE', 'europe': 'EU', 'eea': 'EU',
                'global': '🌍', 'worldwide': '🌍', 'the netherlands': 'NL', 'netherlands': 'NL',
                'czech republic': 'CZ', 'czechia': 'CZ', 'south korea': 'KR', 'republic of korea': 'KR',
                'north korea': 'KP', 'russia': 'RU', 'russian federation': 'RU', 'turkey': 'TR', 'turkiye': 'TR',
                'vietnam': 'VN', 'viet nam': 'VN', 'taiwan': 'TW', 'swaziland': 'SZ', 'eswatini': 'SZ',
                'macedonia': 'MK', 'north macedonia': 'MK', 'moldova': 'MD', 'republic of moldova': 'MD',
                'ivory coast': 'CI', 'cote d\'ivoire': 'CI', "côte d'ivoire": 'CI', 'syria': 'SY',
                'syrian arab republic': 'SY', 'iran': 'IR', 'islamic republic of iran': 'IR',
                'venezuela': 'VE', 'bolivarian republic of venezuela': 'VE', 'bolivia': 'BO',
                'plurinational state of bolivia': 'BO', 'tanzania': 'TZ', 'united republic of tanzania': 'TZ',
                'brunei': 'BN', 'brunei darussalam': 'BN', 'laos': 'LA', "lao people's democratic republic": 'LA',
                'macau': 'MO', 'macao': 'MO', 'hong kong': 'HK', 'cape verde': 'CV', 'cabo verde': 'CV',
                'vatican city': 'VA', 'vatican': 'VA', 'holy see': 'VA', 'palestine': 'PS', 'state of palestine': 'PS',
                'micronesia': 'FM', 'federated states of micronesia': 'FM', 'the bahamas': 'BS', 'bahamas': 'BS',
                'the gambia': 'GM', 'gambia': 'GM', 'democratic republic of the congo': 'CD', 'drc': 'CD',
                'republic of the congo': 'CG', 'congo': 'CG', 'south africa': 'ZA', 'el salvador': 'SV',
                'saint vincent and the grenadines': 'VC', 'saint kitts and nevis': 'KN', 'saint lucia': 'LC',
                'sao tome and principe': 'ST', 'antigua and barbuda': 'AG', 'trinidad and tobago': 'TT',
                'bosnia and herzegovina': 'BA', 'papua new guinea': 'PG', 'solomon islands': 'SB', 'marshall islands': 'MH',
                'timor-leste': 'TL', 'east timor': 'TL', 'central african republic': 'CF', 'equatorial guinea': 'GQ',
                'guinea-bissau': 'GW', 'samoa': 'WS', 'san marino': 'SM', 'liechtenstein': 'LI', 'monaco': 'MC', 'andorra': 'AD',
                'burkina faso': 'BF', 'cabo verde': 'CV', 'djibouti': 'DJ', 'eritrea': 'ER', 'mauritius': 'MU',
                'sao tome and principe': 'ST', 'seychelles': 'SC', 'south sudan': 'SS'
            };

            for (const [key, val] of Object.entries(aliases)) {
                countryCodeMap.set(key, val);
            }
        }

        const lookup = countryName.trim().toLowerCase();
        let code = countryCodeMap.get(lookup);

        if (!code) {
            if (lookup.includes('united states')) code = 'US';
            else if (lookup.includes('kingdom')) code = 'GB';
            else if (lookup.includes('global') || lookup.includes('world')) return '🌍';
        }

        if (!code) return '🌎';

        if (code.length > 2) return code;

        return String.fromCodePoint(...[...code].map(c => c.charCodeAt() + 127397));
    }

    const regionToCountries = {
        'usa': ['United States', 'USA', 'US'],
        'uk': ['United Kingdom', 'UK', 'Great Britain', 'England', 'Scotland', 'Wales', 'Northern Ireland'],
        'europe': ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'The Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'],
        'eea': ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Republic of Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Iceland', 'Liechtenstein', 'Norway'],
        'asia': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'],
        'latin america': ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Puerto Rico', 'Uruguay', 'Venezuela'],
        'africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
        'australia': ['Australia'],
        'canada': ['Canada']
    };

    function populateCountryFilter(selectedRegion = 'all') {
        if (!countryFilter) return;

        const currentSelection = countryFilter.value;
        countryFilter.innerHTML = '<option value="all">All Countries</option>';

        const uniqueCountries = new Set();
        allCards.forEach(card => {
            const countriesStr = card['Countries Available'] || card['P Countries Available'] || card['Counties Available'] || '';
            if (countriesStr && countriesStr !== '#NAME?') {
                countriesStr.split(',').forEach(c => {
                    const country = c.trim();
                    if (country) {
                        if (selectedRegion === 'all' || selectedRegion === 'global' || selectedRegion === 'worldwide') {
                            uniqueCountries.add(country);
                        } else {
                            const regionList = regionToCountries[selectedRegion.toLowerCase()];
                            if (regionList && regionList.some(r => r.toLowerCase() === country.toLowerCase())) {
                                uniqueCountries.add(country);
                            }
                        }
                    }
                });
            }
        });

        const sortedCountries = Array.from(uniqueCountries).sort();
        sortedCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.toLowerCase();
            const flag = getFlagEmoji(country);
            option.textContent = flag ? `${flag} ${country}` : country;
            countryFilter.appendChild(option);
        });

        // Try to keep the previous selection if it's still available in the list
        if (Array.from(countryFilter.options).some(opt => opt.value === currentSelection)) {
            countryFilter.value = currentSelection;
        } else {
            countryFilter.value = 'all';
        }
    }

    function renderCards() {
        cardsGrid.innerHTML = '';
        resultsCount.textContent = filteredCards.length;

        if (filteredCards.length === 0) {
            noResults.classList.remove('hidden');
            loadMoreContainer.style.display = 'none';
            return;
        }

        noResults.classList.add('hidden');

        const cardsToRender = filteredCards.slice(0, visibleCardsCount);

        cardsToRender.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'crypto-card';
            cardEl.dataset.index = index;

            // Safe getters
            const name = card[FIELDS.name] || 'Unknown Card';
            const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=18181b&color=fff&size=400`;

            const rawLogo = card[FIELDS.logo] || '';
            let logo = rawLogo;

            if (rawLogo.includes('drive.google.com')) {
                logo = transformGDriveUrl(rawLogo);
            } else if (!rawLogo.startsWith('http')) {
                logo = fallbackImage;
            }

            const networkRaw = getSimplifiedNetwork(card[FIELDS.network] || '');
            const custody = stripParens(card[FIELDS.custody] || 'Unknown');
            const cardType = stripParens(card[FIELDS.cardType] || 'Unknown Type');

            const cashbackRaw = stripParens(card[FIELDS.cashback] || 'None');
            const mainPageCashback = stripParens(card[FIELDS.mainPageCashback] || cashbackRaw || 'None');
            let cashbackText = mainPageCashback;
            if (mainPageCashback.toLowerCase() === 'none' || mainPageCashback === '') {
                cashbackText = 'NO CASHBACK';
            }

            const regionsRaw = stripParens(card[FIELDS.regions] || card['Counties Available'] || 'Worldwide');
            const formattedRegions = regionsRaw.length > 40 ? regionsRaw.substring(0, 40) + '...' : regionsRaw;

            const isCompared = compareList.some(c => c[FIELDS.name] === name);

            cardEl.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${logo}" alt="${name} — ${networkRaw} crypto debit card" class="card-full-image" referrerpolicy="no-referrer" onerror="this.src='${fallbackImage}'">
                </div>
                
                <div class="card-content-bottom">
                    <div class="card-meta-tags">
                        <span class="badge badge-custody">${custody.toUpperCase()}</span>
                        ${networkRaw ? `<span class="badge badge-network">${networkRaw.toUpperCase()}</span>` : ''}
                    </div>

                    <h3 class="card-title-large">${name.toUpperCase()}</h3>

                    <div class="outline-pill" title="${cardType}">${cardType.split(',')[0].toUpperCase()}</div>
                    <div class="outline-pill" title="${cashbackRaw}">CASHBACK: ${cashbackText.toUpperCase()}</div>
                    <div class="outline-pill" title="${regionsRaw}">REGION: ${formattedRegions.toUpperCase()}</div>

                    <div style="margin-top: auto; width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="get-card-btn" onclick="event.stopPropagation(); window.open('#', '_blank')">Get Card</button>
                        <button class="compare-btn ${isCompared ? 'active' : ''}" data-name="${name}">
                            <i class="fa-solid fa-plus"></i> ${isCompared ? 'Added to Compare' : 'Add to Compare'}
                        </button>
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', (e) => {
                // Prevent opening modal if clicking specific buttons
                if (e.target.closest('.compare-btn') || e.target.closest('.get-card-btn')) return;
                openModal(card);
            });

            // Compare Button Logic
            const compareBtn = cardEl.querySelector('.compare-btn');
            compareBtn.addEventListener('click', (e) => {
                toggleCompare(card);
            });

            cardsGrid.appendChild(cardEl);
        });

        if (visibleCardsCount < filteredCards.length) {
            loadMoreContainer.style.display = 'flex';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    // Open Modal with full details
    function openModal(card, pushState = true) {
        if (!allowModalOpen) return;
        
        const name = card[FIELDS.name] || 'Unknown Card';
        const slug = getSlug(name);

        document.title = `${name} | Sweepbase`;

        if (pushState) {
            history.pushState({ cardSlug: slug }, '', `/cards/${slug}`);
        }

        const rawLogo = card[FIELDS.logo] || '';
        const fallbackLogo = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=0f172a&color=fff';
        let logo = rawLogo;

        if (rawLogo.includes('drive.google.com')) {
            logo = transformGDriveUrl(rawLogo);
        } else if (!rawLogo.startsWith('http')) {
            logo = fallbackLogo;
        }

        const description = card[FIELDS.description] || 'No description available for this card.';
        const pros = card[FIELDS.pros] || '';
        const cons = card[FIELDS.cons] || '';

        modalContent.innerHTML = `
            <div class="modal-header">
                <img src="${logo}" alt="${name}" class="modal-img" referrerpolicy="no-referrer" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff'">
                <div class="modal-title-area">
                    <h2 class="modal-title">${name}</h2>
                    <div class="card-tags" style="margin-bottom:0;">
                        <span class="tag tag-virtual">${getSimplifiedNetwork(card[FIELDS.network] || 'Card')}</span>
                        <span class="tag ${card[FIELDS.custody]?.toLowerCase().includes('self') ? 'tag-self-custody' : 'tag-custodial'}">${card[FIELDS.custody] || 'Unknown Custody'}</span>
                    </div>
                    <p class="modal-desc">${description}</p>
                </div>
            </div>

            <div class="modal-grid-2col">
                <div class="modal-section">
                    <h3 class="modal-section-title"><i class="fa-solid fa-wallet"></i> Fees & Limits</h3>
                    <div class="modal-list">
                        <div class="modal-list-item">
                            <span class="modal-list-label">Issuance Fee</span>
                            <span class="modal-list-value">${card[FIELDS.issuanceFee] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">Annual Fee</span>
                            <span class="modal-list-value">${card[FIELDS.annualFee] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">FX / Conversion Fee</span>
                            <span class="modal-list-value">${card[FIELDS.fxFee] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">Spending Limit</span>
                            <span class="modal-list-value">${card[FIELDS.spendLimit] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">ATM Limit</span>
                            <span class="modal-list-value">${card[FIELDS.atmLimit] || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3 class="modal-section-title"><i class="fa-solid fa-bolt"></i> Features</h3>
                    <div class="modal-list">
                        <div class="modal-list-item">
                            <span class="modal-list-label">Card Type</span>
                            <span class="modal-list-value">${card[FIELDS.cardType] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">Cashback / Rewards</span>
                            <span class="modal-list-value">${card[FIELDS.cashback] || 'N/A'}</span>
                        </div>
                        <div class="modal-list-item">
                            <span class="modal-list-label">Top-up Methods / Cryptos</span>
                            <span class="modal-list-value">${card[FIELDS.topUpMethods] || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-pros-cons">
                <div class="pro-box">
                    <h4 class="pro-title"><i class="fa-solid fa-check-circle"></i> Key Strengths</h4>
                    <p class="pro-text">${pros ? expandList(pros) : 'Not specified.'}</p>
                </div>
                <div class="con-box">
                    <h4 class="con-title"><i class="fa-solid fa-times-circle"></i> Considerations</h4>
                    <p class="con-text">${cons ? expandList(cons) : 'Not specified.'}</p>
                </div>
            </div>
        `;

        cardModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeCardModal(pushState = true) {
        cardModal.classList.add('hidden');
        document.body.style.overflow = '';

        document.title = 'Sweepbase | Find Your Perfect Crypto Card';

        if (pushState) {
            history.pushState(null, '', initialPathname);
        }
    }

    // COMPARE FUNCTIONALITY
    function toggleCompare(card) {
        const index = compareList.findIndex(c => c[FIELDS.name] === card[FIELDS.name]);
        if (index > -1) {
            compareList.splice(index, 1);
        } else {
            if (compareList.length >= 4) {
                alert('You can compare up to 4 cards at a time.');
                return;
            }
            compareList.push(card);
        }
        updateCompareBar();
        renderCards(); // Re-render to update button states
    }

    function removeCompareByIndex(index) {
        compareList.splice(index, 1);
        updateCompareBar();
        renderCards();
    }

    function clearCompare() {
        compareList = [];
        updateCompareBar();
        renderCards();
    }

    function updateCompareBar() {
        compareCount.textContent = compareList.length;

        if (compareList.length > 0) {
            compareBar.classList.remove('hidden');
        } else {
            compareBar.classList.add('hidden');
        }

        compareSlots.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'compare-slot';
            if (i < compareList.length) {
                const card = compareList[i];
                const name = card[FIELDS.name] || 'Card';
                const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fff&color=000`;
                let logo = card[FIELDS.logo] || fallbackLogo;
                if (logo.includes('drive.google.com')) logo = transformGDriveUrl(logo);

                slot.innerHTML = `
                    <img title="${name}" src="${logo}" referrerpolicy="no-referrer" onerror="this.src='${fallbackLogo}'">
                    <div class="remove-slot" title="Remove" data-idx="${i}"><i class="fa-solid fa-xmark"></i></div>
                `;
            } else {
                slot.innerHTML = `<span style="color:var(--text-muted); font-size: 0.8rem;">+</span>`;
            }
            compareSlots.appendChild(slot);
        }

        // Re-attach removal events to tiny slots
        const removeBtns = compareSlots.querySelectorAll('.remove-slot');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                removeCompareByIndex(idx);
            });
        });

        compareNowBtn.disabled = compareList.length < 2;
    }

    function openCompareModal() {
        if (compareList.length < 2) return;

        // Construct Table Head
        let theadHtml = `
            <tr>
                <th>Feature</th>
                ${compareList.map(card => {
            const name = card[FIELDS.name] || 'Unknown';
            const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fff&color=000`;
            let logo = card[FIELDS.logo] || fallbackLogo;
            if (logo.includes('drive.google.com')) logo = transformGDriveUrl(logo);
            return `
                        <th>
                            <div class="compare-card-header">
                                <img src="${logo}" alt="${name}" referrerpolicy="no-referrer" onerror="this.src='${fallbackLogo}'">
                                <h3>${name}</h3>
                            </div>
                        </th>
                    `;
        }).join('')}
            </tr>
        `;

        // The specific rows to compare
        const rows = [
            { label: 'Card Type', field: FIELDS.cardType },
            { label: 'Network', field: FIELDS.network },
            { label: 'Custody', field: FIELDS.custody },
            { label: 'Cashback', field: FIELDS.cashback },
            { label: 'Issuance Fee', field: FIELDS.issuanceFee },
            { label: 'Annual Fee', field: FIELDS.annualFee },
            { label: 'FX Fee', field: FIELDS.fxFee },
            { label: 'Spending Limit', field: FIELDS.spendLimit },
            { label: 'ATM Limit', field: FIELDS.atmLimit },
            { label: 'Regions available', field: FIELDS.regions },
            { label: 'Pros', field: FIELDS.pros, render: expandList },
            { label: 'Cons', field: FIELDS.cons, render: expandList }
        ];

        let tbodyHtml = '';
        rows.forEach(row => {
            tbodyHtml += `
                <tr>
                    <td>${row.label}</td>
                    ${compareList.map(card => {
                let value = card[row.field] || 'N/A';
                if (row.render && value !== 'N/A') {
                    value = row.render(value);
                }
                return `<td>${value}</td>`;
            }).join('')}
                </tr>
            `;
        });

        compareTable.innerHTML = `
            <thead>${theadHtml}</thead>
            <tbody>${tbodyHtml}</tbody>
        `;

        compareModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCompareModal() {
        compareModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Helper to format semicolon-separated lists
    function expandList(str) {
        if (!str) return '';
        const items = str.split(';').map(s => s.trim()).filter(Boolean);
        if (items.length <= 1) return str;
        return `<ul style="padding-left:1.2rem; margin:0;">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
});
