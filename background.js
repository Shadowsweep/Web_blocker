// Initialize blocked sites on extension installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['blockedSites'], (result) => {
        if (!result.blockedSites) {
            chrome.storage.sync.set({ blockedSites: [] });
        }
    });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        checkIfBlocked(tabId, changeInfo.url);
    }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            checkIfBlocked(tab.id, tab.url);
        }
    });
});

// Function to check if URL is blocked
function checkIfBlocked(tabId, url) {
    try {
        // Extract domain from URL
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/^www\./, '');
        
        chrome.storage.sync.get(['blockedSites'], (result) => {
            const blockedSites = result.blockedSites || [];
            console.log('Checking domain:', domain, 'against blocked sites:', blockedSites); // Debug log
            
            if (blockedSites.some(site => domain.includes(site))) {
                console.log('Blocking access to:', domain); // Debug log
                chrome.tabs.update(tabId, {
                    url: chrome.runtime.getURL('blocked.html')
                });
            }
        });
    } catch (e) {
        console.error('Error checking URL:', e);
    }
}