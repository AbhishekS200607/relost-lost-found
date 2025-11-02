// Browse page functionality
let currentUser = null;
let allItems = [];
let filteredItems = [];
let searchTimeout = null;
let activeCategory = '';

// Category icons mapping
const categoryIcons = {
    WALLET: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
    KEYS: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a3 3 0 100 6 3 3 0 000-6z"></path></svg>`,
    PHONE: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`,
    LAPTOP: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.01v.008H12v-.008z"></path></svg>`,
    WATCH: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    CARDS: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"></path></svg>`,
    BOOK: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>`,
    BAG: `<svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.007z"></path></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    setupFilters();
    setupFilterToggle();
    setupItemForm();
    setupPhotoPreview();
    currentUser = localStorage.getItem('username');
    updateAuthUI();
});

async function loadItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        allItems = items;
        filteredItems = items;
        displayItems(filteredItems);
    } catch (error) {
        console.error('Error loading items:', error);
        document.getElementById('items-grid').innerHTML = '<p class="text-center text-muted-foreground">Failed to load items. Please try again later.</p>';
    }
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const dateFilter = document.getElementById('date-filter');
    const sortFilter = document.getElementById('sort-filter');

    // Live search with debouncing
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        showLoadingState();
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });

    [categoryFilter, locationFilter, dateFilter, sortFilter].forEach(input => {
        input.addEventListener('change', applyFilters);
    });
}

function setupFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    
    filterToggle.addEventListener('click', () => {
        const isVisible = filtersPanel.style.display !== 'none';
        
        if (isVisible) {
            filtersPanel.style.display = 'none';
            filterToggle.classList.remove('active');
        } else {
            filtersPanel.style.display = 'block';
            filterToggle.classList.add('active');
        }
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const dateFilter = document.getElementById('date-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    filteredItems = allItems.filter(item => {
        const matchesSearch = !searchTerm || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = (!categoryFilter || item.category === categoryFilter) && 
                               (!activeCategory || item.category === activeCategory);
        
        const matchesLocation = !locationFilter || 
            item.locationFound.toLowerCase().includes(locationFilter);
        
        const matchesDate = !dateFilter || item.dateFound === dateFilter;

        return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });

    // Apply sorting
    filteredItems.sort((a, b) => {
        switch (sortFilter) {
            case 'date-asc':
                return new Date(a.dateFound) - new Date(b.dateFound);
            case 'date-desc':
                return new Date(b.dateFound) - new Date(a.dateFound);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'location':
                return a.locationFound.localeCompare(b.locationFound);
            default:
                return new Date(b.dateFound) - new Date(a.dateFound);
        }
    });

    displayItems(filteredItems);
}

function filterByCategory(category) {
    activeCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Clear category filter dropdown to avoid conflicts
    document.getElementById('category-filter').value = '';
    
    applyFilters();
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('location-filter').value = '';
    document.getElementById('date-filter').value = '';
    document.getElementById('sort-filter').value = 'date-desc';
    
    // Reset category tab
    activeCategory = '';
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.category-tab').classList.add('active');
    
    applyFilters();
}

function showLoadingState() {
    const itemsGrid = document.getElementById('items-grid');
    itemsGrid.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Searching items...</p>
        </div>
    `;
}

function displayItems(items) {
    const itemsGrid = document.getElementById('items-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    // Update section title based on active category
    const sectionTitle = document.querySelector('.section-title');
    if (activeCategory) {
        const categoryName = activeCategory.toLowerCase();
        sectionTitle.textContent = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}S`;
    } else {
        sectionTitle.textContent = 'BROWSE ALL ITEMS';
    }
    
    // Update results counter
    if (resultsCount) {
        resultsCount.textContent = `Showing ${items.length} of ${allItems.length} items`;
    }
    
    if (items.length === 0) {
        itemsGrid.style.display = 'none';
        noResults.style.display = 'block';
        // Update no results message based on filters
        const hasFilters = document.getElementById('search-input').value || 
                          document.getElementById('category-filter').value ||
                          document.getElementById('location-filter').value ||
                          document.getElementById('date-filter').value;
        
        const noResultsText = hasFilters ? 
            'No items match your search criteria. Try adjusting your filters.' :
            'No items found yet. Be the first to post a found item!';
        
        noResults.querySelector('p').textContent = noResultsText;
        return;
    }
    
    itemsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    itemsGrid.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'card';
        itemCard.onclick = () => showItemDetail(item);
        
        const canDelete = currentUser && item.user && item.user.username === currentUser;
        const icon = categoryIcons[item.category] || categoryIcons.BAG;
        const formattedDate = new Date(item.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        
        const photoHtml = item.photoUrl ? `<div class="card-image"><img src="${item.photoUrl}" alt="${item.category}"></div>` : `<div class="card-icon">${icon}</div>`;
        
        itemCard.innerHTML = `
            ${photoHtml}
            <div class="card-details">
                <p class="text-title">${item.category}</p>
                <p class="text-body">${item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}</p>
                <p class="text-meta">${item.locationFound} | ${formattedDate}</p>
            </div>
            <button class="card-button" onclick="event.stopPropagation(); showItemDetailById(${item.id})">More info</button>
        `;
        
        itemsGrid.appendChild(itemCard);
    });
}

// Reuse functions from main.js
function showItemDetail(item) {
    const modal = document.getElementById('item-modal');
    const content = document.getElementById('item-detail-content');
    
    const canDelete = currentUser && item.user && item.user.username === currentUser;
    const photoHtml = item.photoUrl ? `<img src="${item.photoUrl}" alt="${item.category}" style="max-width: 300px; border-radius: var(--radius); margin-bottom: 1rem;">` : '';
    
    content.innerHTML = `
        <h2 class="modal-title">${item.category} FOUND</h2>
        ${photoHtml}
        <div class="space-y-4">
            <div>
                <h3 class="form-label">Description</h3>
                <p class="text-foreground">${item.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="form-label">Location Found</h3>
                    <p class="text-foreground">${item.locationFound}</p>
                </div>
                <div>
                    <h3 class="form-label">Date Found</h3>
                    <p class="text-foreground">${new Date(item.dateFound).toLocaleDateString()}</p>
                </div>
            </div>
            <div>
                <h3 class="form-label">Posted By</h3>
                <p class="text-foreground">${item.user ? item.user.username : 'Anonymous User'}</p>
            </div>
            <div class="pt-4 flex gap-3">
                <button class="share-button" onclick="shareItem(${item.id}, '${item.category}')">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="share-icon">
                        <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"></path>
                    </svg>
                    Share
                </button>
                ${canDelete ? `
                    <button class="delete-btn flex-1" onclick="deleteItem(${item.id}); hideItemModal();">Delete This Item</button>
                ` : `
                    <button class="btn-primary flex-1" onclick="contactUser('${item.user ? item.user.email : ''}', '${item.category}', ${item.id})">Contact Owner</button>
                `}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showItemDetailById(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
        showItemDetail(item);
    }
}

function hideItemModal() {
    document.getElementById('item-modal').style.display = 'none';
}

function showPostModal() {
    document.getElementById('post-modal').style.display = 'flex';
}

function hidePostModal() {
    document.getElementById('post-modal').style.display = 'none';
    document.getElementById('item-form').reset();
    document.getElementById('photo-preview').innerHTML = '';
}

function updateAuthUI() {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (token && username) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.textContent = `Logout (${username})`;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

function setupItemForm() {
    const itemForm = document.getElementById('item-form');
    if (itemForm) {
        itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert('Please login to post items');
                return;
            }
            
            let photoUrl = null;
            const photoFile = document.getElementById('photo').files[0];
            
            if (photoFile) {
                if (photoFile.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                if (!photoFile.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                
                const formData = new FormData();
                formData.append('file', photoFile);
                
                try {
                    const uploadResponse = await fetch('/api/files/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (uploadResponse.ok) {
                        const uploadResult = await uploadResponse.json();
                        photoUrl = uploadResult.url;
                    } else {
                        const errorResult = await uploadResponse.json();
                        alert('Photo upload failed: ' + errorResult.error);
                        return;
                    }
                } catch (error) {
                    console.error('Photo upload failed:', error);
                    alert('Photo upload failed. Please try again.');
                    return;
                }
            }
            
            const itemData = {
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                locationFound: document.getElementById('locationFound').value,
                dateFound: document.getElementById('dateFound').value,
                photoUrl: photoUrl
            };
            
            try {
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(itemData)
                });
                
                if (response.ok) {
                    hidePostModal();
                    loadItems();
                    alert('Item posted successfully!');
                } else {
                    const error = await response.json();
                    alert('Failed to post item: ' + error.error);
                }
            } catch (error) {
                alert('Failed to post item: ' + error.message);
            }
        });
    }
}

function setupPhotoPreview() {
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('photo-preview');
            const fileStatus = document.getElementById('file-status');
            
            if (file) {
                // Update file status
                if (fileStatus) {
                    fileStatus.textContent = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                if (fileStatus) {
                    fileStatus.textContent = 'No file selected';
                }
                preview.innerHTML = '';
            }
        });
    }
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Please login to delete items');
        return;
    }
    
    try {
        const response = await fetch(`/api/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
        if (response.ok) {
            loadItems();
            alert('Item deleted successfully!');
        } else {
            const error = await response.json();
            alert('Failed to delete item: ' + error.error);
        }
    } catch (error) {
        alert('Failed to delete item: ' + error.message);
    }
}

function shareItem(itemId, category) {
    const url = `${window.location.origin}/browse.html#item-${itemId}`;
    const text = `Found Item: ${category} - Check out this found item on Lost & Found`;
    
    if (navigator.share) {
        navigator.share({
            title: `Found Item: ${category}`,
            text: text,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            prompt('Copy this link:', url);
        });
    }
}

function contactUser(email, itemCategory, itemId) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Please login to start a chat.');
        return;
    }
    
    window.location.href = `chat.html?itemId=${itemId}`;
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const postModal = document.getElementById('post-modal');
    const itemModal = document.getElementById('item-modal');
    
    if (event.target === postModal) {
        hidePostModal();
    }
    if (event.target === itemModal) {
        hideItemModal();
    }
}