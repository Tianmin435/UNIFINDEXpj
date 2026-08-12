
const THEME_STORAGE_KEY = 'theme';
const LEGACY_THEME_STORAGE_KEY = 'siteTheme';
const ACTIVE_PAGE_STORAGE_KEY = 'activePage';
const root = document.documentElement;
const themeSwitches = document.querySelectorAll('.theme-switch');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);

  themeSwitches.forEach((button) => {
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.classList.toggle('is-dark', isDark);

    const knob = button.querySelector('.switch-knob');
    if (knob) {
      knob.textContent = isDark ? '🌙' : '☀';
    }
  });

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY) || 'dark';
applyTheme(savedTheme);

themeSwitches.forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
});

const landingPage = document.getElementById('landingPage');
const mainApp = document.getElementById('mainApp');
const form = document.getElementById('recommendationForm');
const searchInput = document.getElementById('searchInput');
const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
const pageSections = {
  dashboard: document.getElementById('dashboardPage'),
  recommended: document.getElementById('recommendedPage'),
  universities: document.getElementById('universitiesPage'),
  locations: document.getElementById('locationsPage')
};

const universityData = [
  
  { name: 'Yangon Technological University (YTU)', type: ['technology', 'computer'], region: ['Yangon'],
    url: 'YTU/ytu.html',
  image: 'https://tse4.mm.bing.net/th/id/OIP.AYFHAclvQ7mj__IZCnSVIQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'Mandalay Technological University (MTU)', type: ['technology'], region: ['Mandalay'],
  url: 'MTU/mtu.html',
  image: 'https://images.squarespace-cdn.com/content/v1/5aa92cacec4eb7d0913878ce/1595477158967-F60ZPJLGM8J6CN5X6JGW/MTU_Mandalay_Technological+University.png'
   },
  { name: 'University of Information Technology (UIT)', type: ['technology', 'computer'], region: ['Yangon'],
  url: 'UIT/uit.html',
  image: 'https://tse3.mm.bing.net/th/id/OIP.OFx0m5xST3tQSSOn1CGldAHaGo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'University of Computer Studies, Yangon (UCSY)', type: ['computer', 'technology'], region: ['Yangon'],
    url: 'UCSY/ucsy1.html',
  image: 'https://ucsy.edu.mm/img/ucsylogo.png'
   },
  { name: 'Yezin Agricultural University (YAU)', type: ['agriculture'], region: ['Naypyidaw'],
  image: 'https://tse3.mm.bing.net/th/id/OIP.X-ThP6csnY-2HSt6AgcbfAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'University of Medicine 1, Yangon', type: ['medicine'], region: ['Yangon'],
  url: 'Medicine1/med1.html',
  image: 'https://cdn.imgbin.com/16/5/11/imgbin-university-of-yangon-university-of-medicine-2-yangon-university-of-medicine-taunggyi-university-of-medicine-mandalay-medical-universities-foreign-certificates-dstsZZ9rKSZnBJsmRpzEJcyZt.jpg'
   },
  { name: 'University of Medicine 2, Yangon', type: ['medicine'], region: ['Yangon'],
  url: 'Medicine2/med2.html',
  image: 'https://cdn.imgbin.com/16/5/11/imgbin-university-of-yangon-university-of-medicine-2-yangon-university-of-medicine-taunggyi-university-of-medicine-mandalay-medical-universities-foreign-certificates-dstsZZ9rKSZnBJsmRpzEJcyZt.jpg'
   },
  { name: 'University of Medicine, Mandalay', type: ['medicine'], region: ['Mandalay'],
  image: 'https://tse2.mm.bing.net/th/id/OIP.IYnjW52N-cYXvhnSodkTtQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'University of Dental Medicine, Yangon', type: ['medicine'], region: ['Yangon'],
  image: 'https://media.licdn.com/dms/image/v2/C560BAQEfqZ0IMaQqEw/company-logo_200_200/company-logo_200_200/0/1630647112162?e=2147483647&v=beta&t=of3Ayt-UHEpcW8gidRloopwpNsbiO5K-ZD1jq3d6OJQ'
   },
  { name: 'University of Dental Medicine, Mandalay', type: ['medicine'], region: ['Mandalay'],
  image: 'https://www.udmmandalay.info/wp-content/uploads/2021/01/cropped-udmm-new-logo-wavy-moto-2020-copy.png'
   },
  { name: 'University of Pharmacy, Yangon', type: ['medicine'], region: ['Yangon'],
  url: 'UOP/uop1.html',
  image: 'https://tse4.mm.bing.net/th/id/OIP.wwqwR1AoUTESGN1XfpRq7gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'University of Pharmacy, Mandalay', type: ['medicine'], region: ['Mandalay'],
    url: 'UOP/uop1.html',
    image: 'https://tse4.mm.bing.net/th/id/OIP.wwqwR1AoUTESGN1XfpRq7gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
   },
  { name: 'University of Nursing, Yangon', type: ['medicine'], region: ['Yangon'], 
  url: '#',
  image: 'https://tse1.explicit.bing.net/th/id/OIP.fWJWgYKKluplCAeWgLDW6gHaKj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  { name: 'University of Nursing, Mandalay', type: ['medicine'], region: ['Mandalay'], 
  url: '#',
  image: 'https://e7.pngegg.com/pngimages/286/225/png-clipart-university-of-nursing-mandalay-university-of-nursing-yangon-mandalay-university-university-of-yangon-school-text-logo-thumbnail.png'
  },
  { name: 'Mandalay University', type: ['general'], region: ['Mandalay'],
  image: 'https://www.igroupnet.com/wp-content/uploads/2021/04/C-University-of-Mandalay.png'
   },
  { name: 'University of Yangon', type: ['general'], region: ['Yangon'],
  url: 'YU/yu.html',
  image: 'https://www.iro-su.edu.la/wp-content/uploads/2022/04/Picture6.jpg'
   },
];

const locationPoints = [
  { name: 'Yangon Technological University (YTU)', coords: [16.8072, 96.1489], description: 'YTU, Yangon' },
  { name: 'Mandalay Technological University (MTU)', coords: [21.9366, 96.0581], description: 'MTU, Mandalay' },
  { name: 'University of Information Technology (UIT)', coords: [16.8247, 96.1488], description: 'UIT, Yangon' },
  { name: 'University of Computer Studies, Yangon (UCSY)', coords: [16.8075, 96.1255], description: 'UCSY, Yangon' },
  { name: 'Yezin Agricultural University (YAU)', coords: [19.7545, 96.1189], description: 'YAU, Yesagyo / Naypyidaw' },
  { name: 'University of Medicine 1, Yangon', coords: [16.8017, 96.1320], description: 'Medicine 1, Yangon' },
  { name: 'University of Medicine 2, Yangon', coords: [16.8209, 96.1377], description: 'Medicine 2, Yangon' },
  { name: 'University of Medicine, Mandalay', coords: [21.9848, 96.0964], description: 'Medicine, Mandalay' },
  { name: 'University of Dental Medicine, Yangon', coords: [16.8255, 96.1318], description: 'Dental Medicine, Yangon' },
  { name: 'University of Dental Medicine, Mandalay', coords: [21.9614, 96.0805], description: 'Dental Medicine, Mandalay' },
  { name: 'University of Pharmacy, Yangon', coords: [16.8289, 96.1411], description: 'Pharmacy, Yangon' },
  { name: 'University of Pharmacy, Mandalay', coords: [21.9785, 96.1008], description: 'Pharmacy, Mandalay' },
  { name: 'University of Nursing, Yangon', coords: [16.7991, 96.1369], description: 'Nursing, Yangon' },
  { name: 'University of Nursing, Mandalay', coords: [21.9704, 96.0802], description: 'Nursing, Mandalay' },
  { name: 'Yangon University of Foreign Languages', coords: [16.8079, 96.1383], description: 'YUFL, Yangon' },
  { name: 'Yangon University of Economics', coords: [16.8020, 96.1477], description: 'YUE, Yangon' },
  { name: 'Myanmar Maritime University', coords: [16.7928, 96.1478], description: 'MMU, Thanlyin, Yangon' },
  { name: 'University of Yangon', coords: [16.7969, 96.1475], description: 'University of Yangon' },
  { name: 'Mandalay University', coords: [21.9581, 96.0831], description: 'Mandalay University' }
];

let locationMap;
let mapMarkers = [];
let locationMapInitialized = false;

function initLocationMap() {
  if (locationMapInitialized) return;

  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  locationMap = L.map(mapElement).setView([20.0, 96.0], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(locationMap);

  locationPoints.forEach((location, index) => {
    const marker = L.marker(location.coords).addTo(locationMap);
    marker.bindPopup(`<strong>${location.name}</strong><br>${location.description}`);
    marker.on('click', () => highlightLocationItem(index));
    mapMarkers.push(marker);
  });

  renderLocationItems(locationPoints);
  locationMapInitialized = true;
}

function highlightLocationItem(index) {
  const items = document.querySelectorAll('.location-item');
  items.forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });
}

function renderLocationItems(locations) {
  const container = document.getElementById('locationItems');
  if (!container) return;

  container.innerHTML = '';
  locations.forEach((location, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'location-item';
    item.innerHTML = `
      <strong>${location.name}</strong>
      <span>${location.description}</span>
    `;

    item.addEventListener('click', () => {
      const markerIndex = locationPoints.findIndex(pt => pt.name === location.name && pt.description === location.description);
      if (locationMap && markerIndex >= 0 && mapMarkers[markerIndex]) {
        locationMap.flyTo(location.coords, 13, { duration: 0.8 });
        mapMarkers[markerIndex].openPopup();
      }
      highlightLocationItem(index);
    });

    container.appendChild(item);
  });
}

function filterLocationItems(query) {
  const lowered = query.trim().toLowerCase();
  const filtered = locationPoints.filter(item => item.name.toLowerCase().includes(lowered) || item.description.toLowerCase().includes(lowered));
  renderLocationItems(filtered);
}

function updateLocationMapAfterShow() {
  if (locationMap) {
    setTimeout(() => {
      locationMap.invalidateSize();
    }, 120);
  }
}

function getUniversityImage(name) {
  const initials = name.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'>
      <rect width='180' height='180' rx='28' fill='%230f172a'/>
      <rect x='18' y='18' width='144' height='144' rx='24' fill='%232f5bd7'/>
      <circle cx='90' cy='74' r='32' fill='white' fill-opacity='0.9'/>
      <path d='M54 138c9-24 24-36 36-36s27 12 36 36' fill='white' fill-opacity='0.92'/>
      <text x='50%' y='152' text-anchor='middle' font-size='16' fill='white' font-family='Segoe UI, sans-serif'>${initials}</text>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function createCard(university, isLink) {
  const card = document.createElement('article');
  card.className = 'university-card';
  const linkUrl = university.url || '#';
  
 //condition...if there is no img, display default
  const imgSrc = university.image || getUniversityImage(university.name);

  card.innerHTML = `
    <img src="${imgSrc}" alt="${university.name}" />
    <h4>${isLink ? `<a href="${linkUrl}">${university.name}</a>` : university.name}</h4>
  `;
  return card;
}

function filterUniversities(score, selectedTypes, region) {
  const normalizedTypes = selectedTypes.map(type => type.toLowerCase());
  const matching = universityData.filter(university => {
    const typeMatch = normalizedTypes.length === 0 || normalizedTypes.some(type => university.type.includes(type));
    const regionMatch = !region || region === 'Other' || university.region.includes(region);
    let scoreMatch = true;

    if (normalizedTypes.includes('medicine')) {
      scoreMatch = score >= 450;
    } else if (normalizedTypes.includes('technology') || normalizedTypes.includes('computer')) {
      scoreMatch = score >= 350;
    } else if (normalizedTypes.includes('economics')) {
      scoreMatch = score >= 300;
    } else if (normalizedTypes.includes('agriculture')) {
      scoreMatch = score >= 320;
    }

    return typeMatch && regionMatch && scoreMatch;
  });

  if (matching.length === 0) {
    return universityData.filter(university => university.region.includes(region) || region === 'Other' || region === '');
  }

  return matching;
}

function renderList(container, universities, isLink = false) {
  if (!container) return;
  container.innerHTML = '';
  if (!universities.length) {
    container.innerHTML = '<div class="empty-state">No universities matched your search.</div>';
    return;
  }
  universities.forEach(university => container.appendChild(createCard(university, isLink)));
}

function switchPage(pageName) {
  Object.entries(pageSections).forEach(([key, section]) => {
    if (section) section.classList.toggle('active', key === pageName);
  });
  navButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.page === pageName);
  });
  localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, pageName);
}

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const score = Number(document.getElementById('score').value);
    const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const region = document.getElementById('region').value;

    if (!Number.isFinite(score) || score < 0 || score > 600) {
      alert('Please enter a valid Grade-12 score between 0 and 600.');
      return;
    }

    if (!selectedTypes.length) {
      alert('Please select at least one university type.');
      return;
    }

    if (!region) {
      alert('Please choose a preferred region.');
      return;
    }

    const recommended = filterUniversities(score, selectedTypes, region);
    localStorage.setItem('recommendedUniversities', JSON.stringify(recommended));
    localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, 'recommended');
    window.location.href = 'main.html';
  });

  form.addEventListener('reset', function () {
    if (landingPage && mainApp) {
      landingPage.style.display = 'flex';
      mainApp.style.display = 'none';
    }
  });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    switchPage(button.dataset.page);
    if (button.dataset.page === 'locations') {
      initLocationMap();
      updateLocationMapAfterShow();
    }
  });
});

const initialPage = localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY) || 'dashboard';
if (pageSections[initialPage]) {
  switchPage(initialPage);
}

const locationSearchInput = document.getElementById('locationSearch');
if (locationSearchInput) {
  locationSearchInput.addEventListener('input', function () {
    filterLocationItems(this.value);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    const filtered = universityData.filter(university => university.name.toLowerCase().includes(query));
    renderList(document.getElementById('dashboardResults'), filtered, true);
  });
}

const recResults = document.getElementById('recommendedResults');
const allUniResults = document.getElementById('allUniversitiesResults');
const dashResults = document.getElementById('dashboardResults');

if (allUniResults) renderList(allUniResults, universityData, true);
if (dashResults) renderList(dashResults, universityData, true);

if (recResults) {
  const savedRecs = JSON.parse(localStorage.getItem('recommendedUniversities')) || universityData;
  renderList(recResults, savedRecs, true);
}

