---
title: "Publications"
date: 2023-10-25T00:00:00+00:00
draft: false
---

Here you can find a list of my publications, automatically updated from ORCID.

<div id="publications-list">
    <i class="fas fa-spinner fa-spin"></i> Loading publications...
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // TODO: Replace 'PUT_YOUR_ORCID_HERE' with your actual ORCID iD (e.g., '0000-0002-1825-0097')
        const orcidId = '0009-0008-2880-6715'; 
        
        if (orcidId === 'PUT_YOUR_ORCID_HERE') {
            document.getElementById('publications-list').innerHTML = 'Please update the ORCID iD in content/publications.md';
            return;
        }
        
        const apiUrl = `https://pub.orcid.org/v3.0/${orcidId}/works`;

        fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const works = data.group;
            const listContainer = document.getElementById('publications-list');
            listContainer.innerHTML = ''; // Clear loading message

            if (works.length === 0) {
                listContainer.innerHTML = 'No publications found.';
                return;
            }

            const ul = document.createElement('ul');

            works.forEach(group => {
                const workSummary = group['work-summary'][0];
                const title = workSummary.title.title.value;
                const year = workSummary['publication-date'] ? workSummary['publication-date'].year.value : 'n.d.';
                const journal = workSummary['journal-title'] ? workSummary['journal-title'].value : '';
                const url = workSummary.url ? workSummary.url.value : `https://doi.org/${workSummary['external-ids']['external-id'][0]['external-id-value']}`;
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong><a href="${url}" target="_blank">${title}</a></strong> (${year})
                    <br>
                    ${journal}
                `;
                ul.appendChild(li);
            });

            listContainer.appendChild(ul);
        })
        .catch(error => {
            console.error('Error fetching ORCID data:', error);
            document.getElementById('publications-list').innerHTML = 'Failed to load publications. Please check the ORCID iD.';
        });
    });
</script>
