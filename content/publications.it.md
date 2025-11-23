+++
title = "Pubblicazioni"
date = "2024-01-01"
author = "Alessandro Petruzzelli"
+++

Questa è una lista delle mie pubblicazioni, aggiornata automaticamente dal mio [ORCID profile](https://orcid.org/0009-0008-2880-6715).

<div id="publications-list">
    <div class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Caricamento pubblicazioni...
    </div>
</div>

<style>
    .loading-message {
        text-align: center;
        padding: 20px;
        font-size: 1.2rem;
        color: #666;
    }
    
    .year-group {
        margin-bottom: 2.5rem;
    }
    
    .year-heading {
        border-bottom: 2px solid var(--primary-color, #212121);
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 1.8rem; /* Increased font size */
        font-weight: bold;
    }
    
    .publication-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(150, 150, 150, 0.2);
    }
    
    .publication-item:last-child {
        border-bottom: none;
    }
    
    .pub-title {
        font-size: 1.7rem; /* Increased font size */
        font-weight: 600;
        margin-bottom: 0.4rem;
        display: block;
        line-height: 1.4;
    }
    
    .pub-title a {
        text-decoration: none;
    }

    .pub-title a:hover {
        text-decoration: underline;
    }
    
    .pub-journal {
        font-size: 1.1rem; /* Increased font size */
        font-style: italic;
        color: #555;
        display: block;
        margin-top: 0.2rem;
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
        .year-heading { border-color: #e0e0e0; }
        .pub-journal { color: #bbb; }
        .publication-item { border-color: rgba(255, 255, 255, 0.1); }
    }
    
    body.colorscheme-dark .year-heading { border-color: #e0e0e0; }
    body.colorscheme-dark .pub-journal { color: #bbb; }
    body.colorscheme-dark .publication-item { border-color: rgba(255, 255, 255, 0.1); }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const orcidId = '0009-0008-2880-6715'; 
        const apiUrl = `https://pub.orcid.org/v3.0/${orcidId}/works`;

        const listContainer = document.getElementById('publications-list');

        fetch(apiUrl, {
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const groups = data.group;
            listContainer.innerHTML = ''; // Clear loading message

            if (!groups || groups.length === 0) {
                listContainer.innerHTML = '<p>No publications found on ORCID.</p>';
                return;
            }

            // 1. Parse Data
            const works = groups.map(group => {
                const summary = group['work-summary'][0];
                
                const title = summary.title.title.value;
                
                // Parse date components safely
                const pubDate = summary['publication-date'];
                const yearVal = pubDate?.year?.value ? parseInt(pubDate.year.value) : 0;
                const monthVal = pubDate?.month?.value ? parseInt(pubDate.month.value) : 0;
                const dayVal = pubDate?.day?.value ? parseInt(pubDate.day.value) : 0;

                const displayYear = yearVal > 0 ? yearVal : 'n.d.';
                const journal = summary['journal-title']?.value || null;
                
                // Links: Prioritize DOI
                let link = null;
                const externalIds = summary['external-ids']?.['external-id'] || [];
                const doiObj = externalIds.find(id => id['external-id-type'] === 'doi');
                
                if (doiObj) {
                    link = `https://doi.org/${doiObj['external-id-value']}`;
                } else if (summary.url?.value) {
                    link = summary.url.value;
                }

                return { 
                    title, 
                    displayYear,
                    yearVal,
                    monthVal,
                    dayVal,
                    journal, 
                    link 
                };
            });

            // 2. Sort: Recent First (Descending)
            // Compares Year -> Month -> Day
            works.sort((a, b) => {
                if (b.yearVal !== a.yearVal) return b.yearVal - a.yearVal;
                if (b.monthVal !== a.monthVal) return b.monthVal - a.monthVal;
                return b.dayVal - a.dayVal;
            });

            // 3. Group by Year (for display headings)
            // We use a Map to preserve the insertion order (which is already sorted)
            const worksByYear = new Map();
            works.forEach(work => {
                const y = work.displayYear;
                if (!worksByYear.has(y)) worksByYear.set(y, []);
                worksByYear.get(y).push(work);
            });

            // 4. Render
            worksByYear.forEach((yearWorks, year) => {
                // Year Container
                const yearGroup = document.createElement('div');
                yearGroup.className = 'year-group';

                // Year Heading
                const heading = document.createElement('h3');
                heading.className = 'year-heading';
                heading.textContent = year;
                yearGroup.appendChild(heading);

                // Works List
                const ul = document.createElement('div');
                
                yearWorks.forEach(work => {
                    const item = document.createElement('div');
                    item.className = 'publication-item';
                    
                    // Title
                    const titleEl = document.createElement('span');
                    titleEl.className = 'pub-title';
                    if (work.link) {
                        titleEl.innerHTML = `<a href="${work.link}" target="_blank" rel="noopener noreferrer">${work.title} <i class="fas fa-external-link-alt fa-xs" style="font-size: 0.7em; opacity: 0.7;"></i></a>`;
                    } else {
                        titleEl.textContent = work.title;
                    }
                    item.appendChild(titleEl);

                    // Conference / Journal Name
                    if (work.journal) {
                        const journalEl = document.createElement('span');
                        journalEl.className = 'pub-journal';
                        journalEl.textContent = `In ${work.journal}`;
                        item.appendChild(journalEl);
                    }

                    ul.appendChild(item);
                });

                yearGroup.appendChild(ul);
                listContainer.appendChild(yearGroup);
            });
        })
        .catch(error => {
            console.error('Error fetching ORCID data:', error);
            listContainer.innerHTML = '<p style="color:red;">Failed to load publications.</p>';
        });
    });
</script>