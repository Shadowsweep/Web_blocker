document.addEventListener('DOMContentLoaded', () => {
    const blockForm = document.getElementById('blockForm');
    const websiteInput = document.getElementById('websiteUrl');
    const blockedSitesList = document.getElementById('blockedSitesList');
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownContent = document.getElementById('dropdownContent');
    const actionButtons = document.getElementById('actionButtons');
    const removeButton = document.getElementById('removeSelected');

    // Load blocked websites initially
    loadBlockedSites();

    // Handle form submission (both button click and Enter key)
    blockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddWebsite();
    });

    // Toggle dropdown
    dropdownToggle.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
        actionButtons.classList.toggle('show');
        if (dropdownContent.classList.contains('show')) {
            loadBlockedSites();
        }
    });

    // Function to handle adding a website
    function handleAddWebsite() {
        let url = websiteInput.value.trim().toLowerCase();
        
        // Basic validation
        if (!url) {
            alert('Please enter a website URL');
            return;
        }

        // Extract domain
        let domain = url;
        try {
            // Remove common prefixes
            domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
            // Remove anything after the first slash
            domain = domain.split('/')[0];
            
            // Validate domain format
            if (!domain.includes('.')) {
                throw new Error('Invalid domain format');
            }
        } catch (e) {
            alert('Please enter a valid website URL (e.g., facebook.com)');
            return;
        }

        // Save to storage
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            
            if (blockedSites.includes(domain)) {
                alert('This website is already blocked');
                return;
            }

            blockedSites.push(domain);
            chrome.storage.sync.set({ blockedSites }, () => {
                websiteInput.value = '';
                loadBlockedSites();
                alert(`${domain} has been blocked successfully`);
                console.log('Updated blocked sites:', blockedSites); // Debug log
            });
        });
    }

    // Remove selected websites
    removeButton.addEventListener('click', () => {
        const selectedOptions = Array.from(blockedSitesList.selectedOptions);
        if (selectedOptions.length === 0) {
            alert('Please select websites to remove');
            return;
        }

        const selectedSites = selectedOptions.map(option => option.value);
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            const updatedSites = blockedSites.filter(site => !selectedSites.includes(site));
            chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
                loadBlockedSites();
                alert('Selected websites have been unblocked');
                console.log('Updated blocked sites after removal:', updatedSites); // Debug log
            });
        });
    });

    // Load blocked sites into select element
    function loadBlockedSites() {
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            console.log('Current blocked sites:', blockedSites); // Debug log
            
            blockedSitesList.innerHTML = '';
            
            if (blockedSites.length === 0) {
                const option = document.createElement('option');
                option.textContent = 'No websites blocked';
                option.disabled = true;
                blockedSitesList.appendChild(option);
            } else {
                blockedSites.sort().forEach(site => {
                    const option = document.createElement('option');
                    option.value = site;
                    option.textContent = site;
                    blockedSitesList.appendChild(option);
                });
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.blocked-sites')) {
            dropdownContent.classList.remove('show');
            actionButtons.classList.remove('show');
        }
    });
});