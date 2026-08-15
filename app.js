/**
 * European Winter Itinerary & Schengen Travel Visualizer
 * Interactive Map & Mobile-Optimized Route Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentTrip = 'all'; // 'all', 'trip1', 'trip2'
  let currentBudgetOption = 2; // 1: Budget Saver, 2: Full Experience
  let currentCategory = 'all';
  let activeMarkerIndex = 0;
  let isTourPlaying = false;
  let tourInterval = null;

  // Itinerary Master Data
  const locations = [
    // --- UK Connection ---
    {
      id: 'loc-sou',
      name: 'Southampton Airport (SOU)',
      trip: 'trip1',
      day: 1,
      date: 'Dec 16 / Dec 27 / Jan 3',
      category: 'transit',
      country: 'United Kingdom',
      coords: [50.9503, -1.3568],
      icon: 'fa-plane-departure',
      costOpt1: '€110.00 (Flight)',
      costOpt2: '€120.00 (Flight)',
      desc: 'UK departure point for KLM Flight 1070 to Amsterdam and easyJet return flights. Close to Aunt Maria’s location.',
      tips: 'Direct train connection or coach link to London Victoria / Southampton central.',
      safety: 'Quiet regional airport, quick security clearance.'
    },
    // --- Trip 1: Amsterdam ---
    {
      id: 'loc-ams-hostel',
      name: 'Amsterdam Hostel Leidseplein',
      trip: 'trip1',
      day: 1,
      date: 'Dec 16 – 18 (2 Nights)',
      category: 'hotel',
      country: 'Netherlands',
      coords: [52.3638, 4.8829],
      icon: 'fa-hotel',
      costOpt1: '€21.18 / night (€42.37 total)',
      costOpt2: '€21.18 / night (€42.37 total)',
      desc: 'Central base in the heart of Amsterdam’s entertainment quarter. Walking distance to canals and museums.',
      tips: 'Check-in from 15:00. Airport Express Bus 397 drops off directly nearby (€6.50).',
      safety: 'Vibrant, safe area with constant foot traffic and police presence.'
    },
    {
      id: 'loc-ams-light',
      name: 'Amsterdam Light Festival',
      trip: 'trip1',
      day: 1,
      date: 'Dec 16, 2026',
      category: 'sight',
      country: 'Netherlands',
      coords: [52.3667, 4.8936],
      icon: 'fa-wand-magic-sparkles',
      costOpt1: 'Free (Walking) / €0',
      costOpt2: 'Free (Walking) / €0',
      desc: 'Spectacular illuminated winter art installations along the UNESCO canal ring and Amstel River.',
      tips: 'Stroll along the Herengracht for the most concentrated display of light sculptures.',
      safety: 'Pedestrian-friendly and safe at night; watch out for cyclists on designated bike lanes.'
    },
    {
      id: 'loc-ams-rijks',
      name: 'Rijksmuseum & Museumplein',
      trip: 'trip1',
      day: 2,
      date: 'Dec 17, 2026',
      category: 'sight',
      country: 'Netherlands',
      coords: [52.3599, 4.8852],
      icon: 'fa-landmark',
      costOpt1: 'Free (Exterior Walk)',
      costOpt2: '€25.00 (Museum Ticket)',
      desc: 'World-famous national museum housing Rembrandt’s Night Watch and Dutch Masterpieces.',
      tips: 'Pre-book timed-entry slots online to skip queue lines during peak holiday season.',
      safety: 'Spacious, well-patrolled public museum district.'
    },
    {
      id: 'loc-ams-ice',
      name: 'Ice Village Christmas Market',
      trip: 'trip1',
      day: 2,
      date: 'Dec 17, 2026',
      category: 'market',
      country: 'Netherlands',
      coords: [52.3584, 4.8811],
      icon: 'fa-gifts',
      costOpt1: 'Free entry',
      costOpt2: '€25.00 (Skating & Food)',
      desc: 'Festive winter market with an ice-skating rink directly in front of the iconic Rijksmuseum backdrop.',
      tips: 'Try warm Dutch Oliebollen and Poffertjes from the traditional wooden stalls.',
      safety: 'Family-friendly festive atmosphere.'
    },
    // --- Trip 1: Cologne ---
    {
      id: 'loc-cgn-station',
      name: 'Köln Hauptbahnhof (Central Station)',
      trip: 'trip1',
      day: 3,
      date: 'Dec 18, 2026',
      category: 'transit',
      country: 'Germany',
      coords: [50.9432, 6.9586],
      icon: 'fa-train',
      costOpt1: '€40.00 (ICE Train)',
      costOpt2: '€45.00 (ICE 123 from AMS)',
      desc: 'High-speed ICE 123 arrives here directly from Amsterdam in 2 hours 40 minutes.',
      tips: 'Step right out the front doors for an immediate, breathtaking view of Cologne Cathedral.',
      safety: 'Busy railway hub with 24/7 security. Keep your bags zipped in crowded platforms.'
    },
    {
      id: 'loc-cgn-dom',
      name: 'Cologne Cathedral Market (Kölner Dom)',
      trip: 'trip1',
      day: 3,
      date: 'Dec 18, 2026',
      category: 'market',
      country: 'Germany',
      coords: [50.9413, 6.9583],
      icon: 'fa-church',
      costOpt1: 'Free to explore',
      costOpt2: 'Free to explore',
      desc: 'One of Europe’s most magnificent Christmas markets, nestled beneath the towering Gothic twin spires.',
      tips: 'Market closes Dec 23! Excellent for hot grilled German sausages and Spießbraten.',
      safety: 'Safe, densely visited square with active security.'
    },
    {
      id: 'loc-cgn-hotel',
      name: 'Hotel Innception (Cologne)',
      trip: 'trip1',
      day: 3,
      date: 'Dec 18 – 20 (2 Nights)',
      category: 'hotel',
      country: 'Germany',
      coords: [50.9405, 6.9398],
      icon: 'fa-hotel',
      costOpt1: '€84.11 / night (€168.21 total)',
      costOpt2: '€84.11 / night (€168.21 total)',
      desc: 'Modern hotel located on Hohenzollernring right by Friesenplatz U-Bahn.',
      tips: 'Direct 5-minute subway connection to Köln Hbf for the inter-city trains.',
      safety: 'Central commercial ring with active nightlife and well-lit sidewalks.'
    },
    {
      id: 'loc-cgn-chocolate',
      name: 'Lindt Chocolate Museum & Heinzels Market',
      trip: 'trip1',
      day: 4,
      date: 'Dec 19, 2026',
      category: 'sight',
      country: 'Germany',
      coords: [50.9322, 6.9644],
      icon: 'fa-cookie-bite',
      costOpt1: 'Free (Old Town Walk)',
      costOpt2: '€15.00 (Museum) + €30.00 (Stalls)',
      desc: 'Interactive chocolate museum by the Rhine plus the rustic Heinzels Wintermärchen market.',
      tips: 'Features a massive outdoor ice skating rink and authentic handcrafted woodwork stalls.',
      safety: 'Scenic riverside promenade, safe for evening strolls.'
    },
    // --- Trip 1: Alsace / Kehl / Strasbourg / Colmar ---
    {
      id: 'loc-kehl-hotel',
      name: 'DORMERO Hotel Kehl (Alsace Base)',
      trip: 'trip1',
      day: 5,
      date: 'Dec 20 – 22 (2 Nights)',
      category: 'hotel',
      country: 'Germany/France Border',
      coords: [48.5724, 7.8105],
      icon: 'fa-hotel',
      costOpt1: '€60.30 / night (€120.60 total)',
      costOpt2: '€60.30 / night (€120.60 total)',
      desc: 'Strategic cross-border hotel base on the German side with affordable accommodation and bakery options.',
      tips: 'Take Strasbourg cross-border Tram Line D (10-min walk to Kehl Rathaus) straight into France.',
      safety: 'Quiet, peaceful, safe suburban border town.'
    },
    {
      id: 'loc-strasbourg',
      name: 'Strasbourg Christkindelsmärik & Place Kléber',
      trip: 'trip1',
      day: 5,
      date: 'Dec 20, 2026',
      category: 'market',
      country: 'France',
      coords: [48.5833, 7.7458],
      icon: 'fa-tree',
      costOpt1: '€1.90 (Tram D ride)',
      costOpt2: '€1.90 (Tram D ride)',
      desc: 'The official "Capital of Christmas" with its historic 1570 market and 30-meter Grand Christmas Tree.',
      tips: 'Tram D drops off at Place Kléber. Stroll through the cobblestone alleys around Notre-Dame Cathedral.',
      safety: 'Heavy pedestrian zoning with airport-style security bags check at bridges during market hours.'
    },
    {
      id: 'loc-colmar',
      name: 'Colmar & Petite Venise',
      trip: 'trip1',
      day: 6,
      date: 'Dec 21, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.0742, 7.3593],
      icon: 'fa-house-chimney-window',
      costOpt1: '€16.00 (TER Train return)',
      costOpt2: '€16.00 (TER Train return)',
      desc: 'Fairytale gingerbread-style town with half-timbered Alsatian houses and illuminated canals.',
      tips: 'Direct 30-min TER regional train from Strasbourg. Perfect for taking iconic winter photos.',
      safety: 'Idyllic, very safe tourist enclave.'
    },
    // --- Trip 1: Paris & Versailles ---
    {
      id: 'loc-paris-station',
      name: 'Paris Gare de l’Est',
      trip: 'trip1',
      day: 7,
      date: 'Dec 22, 2026',
      category: 'transit',
      country: 'France',
      coords: [48.8768, 2.3592],
      icon: 'fa-train-subway',
      costOpt1: '€65.00 (TGV INOUI 2412)',
      costOpt2: '€65.00 (TGV INOUI 2412)',
      desc: 'High-speed TGV arrival into Paris from Strasbourg in just 1 hour 48 minutes.',
      tips: 'Connect easily to Metro networks heading to your hotel in the 18th Arrondissement.',
      safety: 'Major Parisian terminal. Keep phones and passports secured.'
    },
    {
      id: 'loc-paris-hotel',
      name: 'Ibis Budget Paris Porte de la Chapelle',
      trip: 'trip1',
      day: 7,
      date: 'Dec 22 – 27 (5 Nights)',
      category: 'hotel',
      country: 'France',
      coords: [48.8988, 2.3595],
      icon: 'fa-hotel',
      costOpt1: '€40.60 / night (€203.00 total)',
      costOpt2: '€40.60 / night (€203.00 total)',
      desc: 'Budget hotel in Paris 18th Arrondissement with direct Metro Line 12 right outside.',
      tips: 'Metro Line 12 takes you directly to Abbesses (Montmartre) and Concorde without transfers.',
      safety: 'Busy urban transit hub. Practice standard city awareness when returning late at night.'
    },
    {
      id: 'loc-paris-sacrecoeur',
      name: 'Sacré-Cœur & Montmartre',
      trip: 'trip1',
      day: 7,
      date: 'Dec 22, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.8867, 2.3431],
      icon: 'fa-panorama',
      costOpt1: 'Free Panoramic View',
      costOpt2: '€15.00 (Ferris Wheel)',
      desc: 'Perched on the summit of the butte Montmartre with sweeping panoramic views of the entire Parisian skyline.',
      tips: 'Walk down through the artist square (Place du Tertre) for cozy bistro dining.',
      safety: 'Watch out for street string peddlers on the main staircase; use the funicular or side pathways.'
    },
    {
      id: 'loc-paris-louvre',
      name: 'Louvre Museum & Galeries Lafayette',
      trip: 'trip1',
      day: 8,
      date: 'Dec 23, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.8606, 2.3376],
      icon: 'fa-palette',
      costOpt1: 'Free (Exterior Walk)',
      costOpt2: '€22.00 (Louvre Entry)',
      desc: 'Admire the famous glass pyramid, and explore Galeries Lafayette’s legendary animated holiday windows.',
      tips: 'The giant indoor Christmas tree inside Galeries Lafayette Haussmann is free to view!',
      safety: 'High security area. Guard purses inside crowded shopping galleries.'
    },
    {
      id: 'loc-paris-cruise',
      name: 'Seine River Cruise (Christmas Eve)',
      trip: 'trip1',
      day: 9,
      date: 'Dec 24, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.8640, 2.3010],
      icon: 'fa-ship',
      costOpt1: 'Free (Riverbank Stroll)',
      costOpt2: '€120.00 (Dinner Cruise)',
      desc: 'Magical Christmas Eve boat cruise with views of the illuminated bridges and sparkling Eiffel Tower.',
      tips: 'Departs near Pont de l’Alma. Book several weeks in advance for Christmas Eve slots.',
      safety: 'Peaceful, romantic, and memorable evening setting.'
    },
    {
      id: 'loc-paris-eiffel',
      name: 'Eiffel Tower & Luxembourg Gardens',
      trip: 'trip1',
      day: 10,
      date: 'Dec 25, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.8584, 2.2945],
      icon: 'fa-tower-observation',
      costOpt1: 'Free (Champ de Mars view)',
      costOpt2: '€28.00 (Tower Summit Lift)',
      desc: 'Spend Christmas Day strolling the Luxembourg Gardens and visiting the Eiffel Tower (open on Christmas!).',
      tips: 'Enjoy a classic French café lunch near Saint-Germain-des-Prés.',
      safety: 'High police presence around Champ de Mars.'
    },
    {
      id: 'loc-paris-versailles',
      name: 'Palace of Versailles & Royal Gardens',
      trip: 'trip1',
      day: 11,
      date: 'Dec 26, 2026',
      category: 'sight',
      country: 'France',
      coords: [48.8049, 2.1204],
      icon: 'fa-crown',
      costOpt1: '€15.00 (Transit Only)',
      costOpt2: '€35.00 (Transit + Palace Ticket)',
      desc: 'Royal residence of Louis XIV featuring the Hall of Mirrors, King’s Grand Chambers, and winter gardens.',
      tips: 'Take the RER C train from central Paris directly to Versailles Château Rive Gauche.',
      safety: 'Safe suburban royal estate with clear signage.'
    },
    {
      id: 'loc-paris-cdg',
      name: 'Paris Charles de Gaulle (CDG) Exit',
      trip: 'trip1',
      day: 12,
      date: 'Dec 27, 2026',
      category: 'transit',
      country: 'France',
      coords: [49.0097, 2.5479],
      icon: 'fa-plane-departure',
      costOpt1: '€85.00 (easyJet to SOU)',
      costOpt2: '€85.00 (easyJet to SOU)',
      desc: 'Schengen Port of Exit for direct easyJet return flight back to Southampton Airport.',
      tips: 'RER B connects directly from central Paris to Terminal 2 in ~35 minutes (€13.00).',
      safety: 'International gateway with comprehensive border control.'
    },

    // --- Trip 2: Switzerland (Jan 3 – Jan 6) ---
    {
      id: 'loc-gva-airport',
      name: 'Geneva Airport (GVA)',
      trip: 'trip2',
      day: 1,
      date: 'Jan 3, 2027',
      category: 'transit',
      country: 'Switzerland',
      coords: [46.2370, 6.1092],
      icon: 'fa-plane-arrival',
      costOpt1: '€110.00 (easyJet from SOU)',
      costOpt2: '€110.00 (easyJet from SOU)',
      desc: 'Direct easyJet flight from Southampton (SOU 08:00 ➔ GVA 10:40) to start your Swiss journey.',
      tips: 'Take the free 7-minute train from the airport station straight to Geneva Cornavin (Main Station).',
      safety: 'Ultra-modern, highly efficient Swiss airport.'
    },
    {
      id: 'loc-gva-hotel',
      name: 'MEININGER Hotel Genève Centre Charmilles',
      trip: 'trip2',
      day: 1,
      date: 'Jan 3 – 6 (3 Nights)',
      category: 'hotel',
      country: 'Switzerland',
      coords: [46.2115, 6.1208],
      icon: 'fa-hotel',
      costOpt1: '€57.50 / night (€172.50 total)',
      costOpt2: '€57.50 / night (€172.50 total)',
      desc: 'Clean, modern hotel base in the residential Charmilles district with supermarkets nearby.',
      tips: 'Hotel provides a FREE Geneva Transport Card for unlimited local buses and boats (Zone 10)!',
      safety: 'Extremely safe, quiet Swiss neighborhood.'
    },
    {
      id: 'loc-lausanne',
      name: 'Lausanne & Bô Noël Market',
      trip: 'trip2',
      day: 2,
      date: 'Jan 4, 2027',
      category: 'market',
      country: 'Switzerland',
      coords: [46.5197, 6.6323],
      icon: 'fa-gifts',
      costOpt1: '€20.00 (Train ride)',
      costOpt2: '€20.00 (Train ride)',
      desc: 'Charming city along Lake Geneva with glowing light art and one of the few Swiss markets open into January.',
      tips: 'Direct scenic 35-minute SBB train along the shores of Lac Léman from Geneva.',
      safety: 'Impeccable safety and pedestrianized town squares.'
    },
    {
      id: 'loc-glacier3000',
      name: 'Glacier 3000 & Peak Walk by Tissot',
      trip: 'trip2',
      day: 3,
      date: 'Jan 5, 2027',
      category: 'sight',
      country: 'Switzerland',
      coords: [46.3533, 7.2067],
      icon: 'fa-mountain-sun',
      costOpt1: 'Free (Alpine base view)',
      costOpt2: '€90.00 (Glacier 3000 Pass)',
      desc: 'Ultimate Swiss snow experience: suspension bridge connecting two alpine mountain peaks at 3,000 meters.',
      tips: 'Finish with traditional Swiss cheese fondue at the summit restaurant with Matterhorn views.',
      safety: 'Wear warm thermal layers, gloves, and sunglasses for high alpine snow reflection.'
    }
  ];

  // Route Paths Data (Coordinates for lines)
  const routePolylines = {
    // Flight Paths
    flights: [
      {
        name: 'Flight KLM 1070: SOU ➔ AMS',
        trip: 'trip1',
        coords: [[50.9503, -1.3568], [51.5, 1.5], [52.3105, 4.7683]],
        color: '#06b6d4',
        dashArray: '6, 8'
      },
      {
        name: 'Flight easyJet: CDG ➔ SOU',
        trip: 'trip1',
        coords: [[49.0097, 2.5479], [50.1, 0.5], [50.9503, -1.3568]],
        color: '#06b6d4',
        dashArray: '6, 8'
      },
      {
        name: 'Flight easyJet: SOU ➔ GVA (Roundtrip)',
        trip: 'trip2',
        coords: [[50.9503, -1.3568], [48.5, 2.5], [46.2370, 6.1092]],
        color: '#ec4899',
        dashArray: '6, 8'
      }
    ],
    // High Speed & Regional Train Lines
    trains: [
      {
        name: 'ICE 123: Amsterdam Centraal ➔ Cologne Hbf',
        trip: 'trip1',
        coords: [[52.3638, 4.8829], [52.0907, 5.1214], [51.2277, 6.7735], [50.9432, 6.9586]],
        color: '#f59e0b'
      },
      {
        name: 'Regional Express: Cologne ➔ Kehl / Alsace',
        trip: 'trip1',
        coords: [[50.9432, 6.9586], [50.0782, 8.2398], [48.9999, 8.4038], [48.5724, 7.8105]],
        color: '#f59e0b'
      },
      {
        name: 'TER Train: Strasbourg ➔ Colmar',
        trip: 'trip1',
        coords: [[48.5833, 7.7458], [48.3300, 7.4500], [48.0742, 7.3593]],
        color: '#f59e0b'
      },
      {
        name: 'TGV INOUI 2412: Strasbourg ➔ Paris Est',
        trip: 'trip1',
        coords: [[48.5833, 7.7458], [48.6921, 6.1844], [48.9560, 4.3638], [48.8768, 2.3592]],
        color: '#f59e0b'
      },
      {
        name: 'RER C: Paris Central ➔ Palace of Versailles',
        trip: 'trip1',
        coords: [[48.8584, 2.2945], [48.8350, 2.2200], [48.8049, 2.1204]],
        color: '#10b981'
      },
      {
        name: 'SBB Train: Geneva Cornavin ➔ Lausanne',
        trip: 'trip2',
        coords: [[46.2115, 6.1208], [46.3833, 6.2333], [46.5197, 6.6323]],
        color: '#ec4899'
      },
      {
        name: 'Mountain Train & Cable Car: Geneva ➔ Glacier 3000',
        trip: 'trip2',
        coords: [[46.5197, 6.6323], [46.3167, 6.9667], [46.3533, 7.2067]],
        color: '#ec4899'
      }
    ],
    // Local Cross-border Tram Lines
    trams: [
      {
        name: 'Strasbourg Tram Line D (Kehl Rathaus ➔ Place Kléber)',
        trip: 'trip1',
        coords: [[48.5724, 7.8105], [48.5775, 7.7850], [48.5833, 7.7458]],
        color: '#10b981',
        dashArray: '3, 4'
      }
    ]
  };

  // Initialize Leaflet Map
  const map = L.map('map', {
    center: [49.5, 4.5],
    zoom: 6,
    zoomControl: false,
    attributionControl: false
  });

  // Re-position Zoom control
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Map Tile Layer Providers
  const tileLayers = {
    darkmatter: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }),
    light: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    })
  };

  // Start with Dark Carto Matter
  tileLayers.darkmatter.addTo(map);

  // Layer groups for markers & routes
  const markersLayerGroup = L.layerGroup().addTo(map);
  const routesLayerGroup = L.layerGroup().addTo(map);
  const markerInstances = [];

  // Helper: Create custom Pin Icon
  function createPinIcon(loc, isActive = false) {
    let pinClass = 'pin-bubble';
    if (loc.category === 'hotel') pinClass += ' hotel-pin';
    else if (loc.category === 'market') pinClass += ' market-pin';
    else if (loc.category === 'sight') pinClass += ' sight-pin';
    else if (loc.category === 'transit') pinClass += ' airport-pin';
    
    if (loc.trip === 'trip2') pinClass += ' swiss-pin';
    if (isActive) pinClass += ' active-pin';

    return L.divIcon({
      className: 'custom-pin',
      html: `<div class="${pinClass}"><i class="fa-solid ${loc.icon}"></i></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
  }

  // Draw Polylines on the Map
  function renderRoutes() {
    routesLayerGroup.clearLayers();

    // Flights
    routePolylines.flights.forEach(f => {
      if (currentTrip !== 'all' && f.trip !== currentTrip) return;
      L.polyline(f.coords, {
        color: f.color,
        weight: 3,
        opacity: 0.85,
        dashArray: f.dashArray,
        lineCap: 'round'
      }).bindTooltip(f.name, { sticky: true, className: 'route-tooltip' }).addTo(routesLayerGroup);
    });

    // Trains
    routePolylines.trains.forEach(t => {
      if (currentTrip !== 'all' && t.trip !== currentTrip) return;
      L.polyline(t.coords, {
        color: t.color,
        weight: 4,
        opacity: 0.9,
        lineCap: 'round'
      }).bindTooltip(t.name, { sticky: true, className: 'route-tooltip' }).addTo(routesLayerGroup);
    });

    // Trams
    routePolylines.trams.forEach(tr => {
      if (currentTrip !== 'all' && tr.trip !== currentTrip) return;
      L.polyline(tr.coords, {
        color: tr.color,
        weight: 3.5,
        opacity: 0.95,
        dashArray: tr.dashArray
      }).bindTooltip(tr.name, { sticky: true, className: 'route-tooltip' }).addTo(routesLayerGroup);
    });
  }

  // Render Markers on Map
  function renderMarkers() {
    markersLayerGroup.clearLayers();
    markerInstances.length = 0;

    const filtered = getFilteredLocations();

    filtered.forEach((loc, idx) => {
      const isCurrent = idx === activeMarkerIndex;
      const marker = L.marker(loc.coords, {
        icon: createPinIcon(loc, isCurrent),
        title: loc.name
      });

      const costText = currentBudgetOption === 1 ? loc.costOpt1 : loc.costOpt2;

      // Popup content
      marker.bindPopup(`
        <div class="popup-tag">${loc.country} • Day ${loc.day}</div>
        <div class="popup-title">${loc.name}</div>
        <div class="popup-desc">${loc.desc}</div>
        <div class="popup-cost"><i class="fa-solid fa-coins"></i> ${costText}</div>
      `);

      marker.on('click', () => {
        selectLocation(idx, true);
      });

      marker.addTo(markersLayerGroup);
      markerInstances.push({ marker, loc, originalIndex: idx });
    });
  }

  // Filter Locations helper
  function getFilteredLocations() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    return locations.filter(loc => {
      const matchTrip = (currentTrip === 'all' || loc.trip === currentTrip);
      const matchCat = (currentCategory === 'all' || loc.category === currentCategory);
      const matchQuery = !query || 
        loc.name.toLowerCase().includes(query) || 
        loc.country.toLowerCase().includes(query) || 
        loc.desc.toLowerCase().includes(query) ||
        loc.tips.toLowerCase().includes(query);
      return matchTrip && matchCat && matchQuery;
    });
  }

  // Render Sidebar Timeline List
  function renderTimelineList() {
    const listContainer = document.getElementById('timelineList');
    const filtered = getFilteredLocations();
    document.getElementById('locationCount').textContent = `${filtered.length} locations`;

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding: 30px 10px; color: var(--text-dim);">
          <i class="fa-solid fa-compass-slash" style="font-size:24px; margin-bottom:8px; display:block;"></i>
          No locations match your search or filters.
        </div>
      `;
      return;
    }

    filtered.forEach((loc, idx) => {
      const isSelected = idx === activeMarkerIndex;
      const costText = currentBudgetOption === 1 ? loc.costOpt1 : loc.costOpt2;
      const isTrip2 = loc.trip === 'trip2';

      const card = document.createElement('div');
      card.className = `timeline-item ${isSelected ? 'active' : ''}`;
      card.innerHTML = `
        <div class="day-badge-col">
          <span class="day-pill ${isTrip2 ? 'trip2-pill' : ''}">D${loc.day}</span>
          <div class="icon-circle">
            <i class="fa-solid ${loc.icon}"></i>
          </div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title-row">
            <span class="timeline-title">${loc.name}</span>
            <span class="cost-tag">${costText.split(' ')[0]}</span>
          </div>
          <div class="timeline-meta">
            <span><i class="fa-solid fa-earth-europe"></i> ${loc.country}</span>
            <span>•</span>
            <span><i class="fa-solid fa-clock"></i> ${loc.date}</span>
          </div>
          <p class="timeline-desc">${loc.desc}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        selectLocation(idx, true);
        // On mobile, close timeline drawer if opened
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.remove('mobile-open');
          updateMobileNavActive('map');
        }
      });

      listContainer.appendChild(card);
    });
  }

  // Select Location Action
  function selectLocation(index, flyTo = false) {
    const filtered = getFilteredLocations();
    if (!filtered || filtered.length === 0 || index < 0 || index >= filtered.length) return;

    activeMarkerIndex = index;
    const loc = filtered[index];

    // Update Bottom Step Display
    document.getElementById('bottomStepBadge').textContent = `Day ${loc.day}`;
    document.getElementById('bottomStepName').textContent = `${loc.name} (${loc.country})`;

    // Update Floating Detail Card
    const detailPanel = document.getElementById('detailPanel');
    detailPanel.style.display = 'block';
    
    document.getElementById('detailTag').textContent = `${loc.trip === 'trip1' ? 'Trip 1' : 'Trip 2'} • Day ${loc.day} (${loc.category.toUpperCase()})`;
    document.getElementById('detailTitle').textContent = loc.name;
    document.getElementById('detailSubtitle').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${loc.country} • ${loc.date}`;
    document.getElementById('detailDescription').textContent = loc.desc;
    document.getElementById('detailDate').textContent = loc.date;
    document.getElementById('detailCost').textContent = currentBudgetOption === 1 ? loc.costOpt1 : loc.costOpt2;
    document.getElementById('detailTips').textContent = loc.tips;
    document.getElementById('detailSafety').textContent = loc.safety;

    // Google Maps link
    document.getElementById('googleMapsBtn').onclick = () => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${loc.coords[0]},${loc.coords[1]}`, '_blank');
    };

    document.getElementById('focusMapBtn').onclick = () => {
      map.flyTo(loc.coords, 14, { duration: 1.2 });
    };

    // Update marker pins
    markerInstances.forEach((item, i) => {
      if (item.marker) {
        item.marker.setIcon(createPinIcon(item.loc, i === index));
        if (i === index) {
          item.marker.openPopup();
        }
      }
    });

    // Update Sidebar active state
    renderTimelineList();
    const activeCard = document.querySelectorAll('.timeline-item')[index];
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (flyTo) {
      map.flyTo(loc.coords, 13, { duration: 1.0 });
    }
  }

  // Update Budget Summary Stats
  function updateBudgetDisplay() {
    const costElem = document.getElementById('statCost');
    const costLabel = document.getElementById('statCostLabel');

    if (currentTrip === 'trip1') {
      if (currentBudgetOption === 1) {
        costElem.textContent = '€915';
        costLabel.textContent = 'Trip 1 Saver (pp)';
      } else {
        costElem.textContent = '€1,236';
        costLabel.textContent = 'Trip 1 Full (pp)';
      }
    } else if (currentTrip === 'trip2') {
      if (currentBudgetOption === 1) {
        costElem.textContent = '€302';
        costLabel.textContent = 'Trip 2 Saver (pp)';
      } else {
        costElem.textContent = '€482';
        costLabel.textContent = 'Trip 2 Full (pp)';
      }
    } else {
      if (currentBudgetOption === 1) {
        costElem.textContent = '€1,217';
        costLabel.textContent = 'Both Trips Saver (pp)';
      } else {
        costElem.textContent = '€1,718';
        costLabel.textContent = 'Both Trips Full (pp)';
      }
    }

    // Update Mobile Modal Budget figures
    if (currentBudgetOption === 1) {
      document.getElementById('mCostT1').textContent = '€915.18 pp';
      document.getElementById('mCostT1Two').textContent = '€1,830.36';
      document.getElementById('mCostT2').textContent = '€302.50 pp';
      document.getElementById('mCostT2Two').textContent = '€605.00';
      document.getElementById('mCostGrand').textContent = '€1,217.68';
      document.getElementById('mCostGrandTwo').textContent = '€2,435.36';
    } else {
      document.getElementById('mCostT1').textContent = '€1,236.18 pp';
      document.getElementById('mCostT1Two').textContent = '€2,472.36';
      document.getElementById('mCostT2').textContent = '€482.50 pp';
      document.getElementById('mCostT2Two').textContent = '€965.00';
      document.getElementById('mCostGrand').textContent = '€1,718.68';
      document.getElementById('mCostGrandTwo').textContent = '€3,437.36';
    }

    renderMarkers();
    renderTimelineList();
    if (markerInstances[activeMarkerIndex]) {
      selectLocation(activeMarkerIndex, false);
    }
  }

  // Set Trip Filter across both Desktop and Mobile buttons
  function setTrip(tripKey) {
    currentTrip = tripKey;
    activeMarkerIndex = 0;

    // Desktop tabs
    document.querySelectorAll('.trip-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.trip === tripKey);
    });

    // Mobile pills
    document.querySelectorAll('.m-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.trip === tripKey);
    });

    renderRoutes();
    renderMarkers();
    renderTimelineList();
    updateBudgetDisplay();
    fitAllView();
  }

  // Fit all visible markers on map
  function fitAllView() {
    const filtered = getFilteredLocations();
    if (filtered.length === 0) return;
    const group = L.featureGroup(filtered.map(l => L.marker(l.coords)));
    map.fitBounds(group.getBounds().pad(0.18));
  }

  function updateMobileNavActive(viewName) {
    document.querySelectorAll('.m-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
  }

  // --------------------------------------------------------------------------
  // Event Listeners
  // --------------------------------------------------------------------------

  // Desktop Trip Tabs
  const tabs = [document.getElementById('tabAll'), document.getElementById('tabTrip1'), document.getElementById('tabTrip2')];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => setTrip(tab.dataset.trip));
  });

  // Mobile Header Trip Pills
  const mTabs = [document.getElementById('mTabAll'), document.getElementById('mTabTrip1'), document.getElementById('mTabTrip2')];
  mTabs.forEach(tab => {
    tab.addEventListener('click', () => setTrip(tab.dataset.trip));
  });

  // Budget Option Pills (Desktop)
  const opt1Btn = document.getElementById('budgetOpt1Btn');
  const opt2Btn = document.getElementById('budgetOpt2Btn');
  opt1Btn.addEventListener('click', () => {
    opt1Btn.classList.add('active');
    opt2Btn.classList.remove('active');
    document.getElementById('mBudgetOpt1Btn').classList.add('active');
    document.getElementById('mBudgetOpt2Btn').classList.remove('active');
    currentBudgetOption = 1;
    updateBudgetDisplay();
  });
  opt2Btn.addEventListener('click', () => {
    opt2Btn.classList.add('active');
    opt1Btn.classList.remove('active');
    document.getElementById('mBudgetOpt2Btn').classList.add('active');
    document.getElementById('mBudgetOpt1Btn').classList.remove('active');
    currentBudgetOption = 2;
    updateBudgetDisplay();
  });

  // Budget Option Pills (Mobile Modal)
  const mOpt1Btn = document.getElementById('mBudgetOpt1Btn');
  const mOpt2Btn = document.getElementById('mBudgetOpt2Btn');
  mOpt1Btn.addEventListener('click', () => {
    mOpt1Btn.classList.add('active');
    mOpt2Btn.classList.remove('active');
    opt1Btn.classList.add('active');
    opt2Btn.classList.remove('active');
    currentBudgetOption = 1;
    updateBudgetDisplay();
  });
  mOpt2Btn.addEventListener('click', () => {
    mOpt2Btn.classList.add('active');
    mOpt1Btn.classList.remove('active');
    opt2Btn.classList.add('active');
    opt1Btn.classList.remove('active');
    currentBudgetOption = 2;
    updateBudgetDisplay();
  });

  // Category Pills
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.cat;
      activeMarkerIndex = 0;
      renderMarkers();
      renderTimelineList();
      fitAllView();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    activeMarkerIndex = 0;
    renderMarkers();
    renderTimelineList();
  });
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    activeMarkerIndex = 0;
    renderMarkers();
    renderTimelineList();
    fitAllView();
  });

  // Step Navigation Buttons (Prev / Next)
  document.getElementById('prevDayBtn').addEventListener('click', () => {
    const filtered = getFilteredLocations();
    if (filtered.length === 0) return;
    const nextIdx = (activeMarkerIndex - 1 + filtered.length) % filtered.length;
    selectLocation(nextIdx, true);
  });

  document.getElementById('nextDayBtn').addEventListener('click', () => {
    const filtered = getFilteredLocations();
    if (filtered.length === 0) return;
    const nextIdx = (activeMarkerIndex + 1) % filtered.length;
    selectLocation(nextIdx, true);
  });

  // Reset View
  document.getElementById('resetViewBtn').addEventListener('click', fitAllView);

  // Close Detail Panel
  document.getElementById('closePanelBtn').addEventListener('click', () => {
    document.getElementById('detailPanel').style.display = 'none';
  });

  // Sidebar Collapse (Desktop)
  const sidebar = document.getElementById('sidebar');
  const sidebarBtn = document.getElementById('sidebarCollapseBtn');
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarBtn.querySelector('i').classList.toggle('fa-chevron-right');
    sidebarBtn.querySelector('i').classList.toggle('fa-chevron-left');
    setTimeout(() => { map.invalidateSize(); }, 400);
  });

  // Tour Auto-Play Mode
  function toggleTour() {
    const filtered = getFilteredLocations();
    if (filtered.length === 0) return;

    if (isTourPlaying) {
      clearInterval(tourInterval);
      isTourPlaying = false;
      playTourBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto-Play Tour';
      playTourBtn.classList.remove('playing');
      document.getElementById('mNavTour').classList.remove('active');
    } else {
      isTourPlaying = true;
      playTourBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Tour';
      playTourBtn.classList.add('playing');
      document.getElementById('mNavTour').classList.add('active');

      tourInterval = setInterval(() => {
        const next = (activeMarkerIndex + 1) % filtered.length;
        selectLocation(next, true);
      }, 4000);
    }
  }

  const playTourBtn = document.getElementById('playTourBtn');
  playTourBtn.addEventListener('click', toggleTour);

  // Mobile Bottom Navigation Handlers
  const mobileBudgetModal = document.getElementById('mobileBudgetModal');
  document.getElementById('closeBudgetModal').addEventListener('click', () => {
    mobileBudgetModal.classList.remove('open');
    updateMobileNavActive('map');
  });

  document.getElementById('mNavMap').addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    mobileBudgetModal.classList.remove('open');
    updateMobileNavActive('map');
    setTimeout(() => map.invalidateSize(), 300);
  });

  document.getElementById('mNavTimeline').addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    mobileBudgetModal.classList.remove('open');
    updateMobileNavActive('timeline');
  });

  document.getElementById('mNavBudget').addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    mobileBudgetModal.classList.add('open');
    updateMobileNavActive('budget');
  });

  document.getElementById('mNavTour').addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    mobileBudgetModal.classList.remove('open');
    toggleTour();
  });

  // Tile Layer Switcher
  const layerBtns = document.querySelectorAll('.layer-btn');
  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const style = btn.dataset.layer;
      Object.values(tileLayers).forEach(layer => map.removeLayer(layer));

      if (style === 'dark') tileLayers.darkmatter.addTo(map);
      else if (style === 'light') tileLayers.light.addTo(map);
      else if (style === 'satellite') tileLayers.satellite.addTo(map);
    });
  });

  // Initial Boot
  renderRoutes();
  renderMarkers();
  renderTimelineList();
  updateBudgetDisplay();
  fitAllView();

  // Select first item after 400ms
  setTimeout(() => {
    selectLocation(0, false);
  }, 400);
});
