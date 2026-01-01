// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✨ New content available, please refresh');
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Check for PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  const installButton = document.createElement('button');
  installButton.textContent = '📱 Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: #8b5cf6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    z-index: 9999;
    transition: transform 0.2s;
  `;
  
  installButton.addEventListener('mouseover', () => {
    installButton.style.transform = 'scale(1.05)';
  });
  
  installButton.addEventListener('mouseout', () => {
    installButton.style.transform = 'scale(1)';
  });
  
  installButton.addEventListener('click', async () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
  });
  
  document.body.appendChild(installButton);
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully!');
  deferredPrompt = null;
});
