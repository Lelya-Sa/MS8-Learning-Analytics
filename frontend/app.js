// MS8 Learning Analytics - Frontend Application

console.log('🚀 MS8 Learning Analytics Frontend Loaded');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Application initialized');
    
    // Update status badges based on actual connection status
    updateConnectionStatus();
    
    // Add interactive features
    addInteractiveFeatures();
});

function updateConnectionStatus() {
    // This would be updated based on actual API calls to check service status
    const statusItems = document.querySelectorAll('.status-item');
    
    statusItems.forEach(item => {
        const badge = item.querySelector('.status-badge');
        const icon = item.querySelector('.status-icon');
        
        // Simulate status check (replace with actual API calls)
        if (item.textContent.includes('Frontend')) {
            badge.textContent = 'Connected';
            badge.className = 'status-badge success';
            icon.textContent = '✅';
        }
    });
}

function addInteractiveFeatures() {
    // Add hover effects to status items
    const statusItems = document.querySelectorAll('.status-item');
    
    statusItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click handlers for features
    const featuresList = document.querySelectorAll('.features-list li');
    
    featuresList.forEach(feature => {
        feature.addEventListener('click', function() {
            this.style.backgroundColor = '#e0f2fe';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
        });
    });
}

// API connection functions (to be implemented)
async function checkBackendStatus() {
    try {
        // This would make an actual API call to the backend
        const response = await fetch('/api/health');
        return response.ok;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
}

async function checkDatabaseStatus() {
    try {
        // This would make an actual API call to check database status
        const response = await fetch('/api/database/status');
        return response.ok;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Export functions for potential module use
window.MS8LearningAnalytics = {
    updateConnectionStatus,
    checkBackendStatus,
    checkDatabaseStatus
};
