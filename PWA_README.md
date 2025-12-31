# Progressive Web App (PWA) Setup

## Overview
The QR-Based Attendance System is now a fully functional Progressive Web App (PWA) that can be installed on devices and provides offline capabilities.

## Features Added

### 1. **App Manifest** (`public/manifest.json`)
- Defines app name, icons, theme colors, and display mode
- Enables "Add to Home Screen" functionality
- Standalone display mode for native app-like experience

### 2. **Service Worker** (`public/service-worker.js`)
- Caches static assets for offline access
- Implements cache-first strategy for faster loading
- Automatic cache updates on new versions
- Fallback to cached content when offline

### 3. **App Icons**
- 192x192px icon for standard displays
- 512x512px icon for high-resolution displays
- Maskable icons for adaptive icon support on Android

### 4. **Offline Support**
- Offline fallback page for network errors
- Cached pages accessible without internet
- Graceful degradation for API requests

### 5. **Enhanced HTML**
- Meta tags for PWA optimization
- Apple-specific mobile web app tags
- Theme color for browser chrome customization
- Service worker registration script

## Installation Instructions

### For Users (Desktop)
1. Open the app in Chrome, Edge, or supported browser
2. Look for the "Install" icon in the address bar
3. Click "Install" to add the app to your desktop
4. Launch from desktop like a native app

### For Users (Mobile)
1. Open the app in Chrome (Android) or Safari (iOS)
2. Tap the browser menu (three dots or share icon)
3. Select "Add to Home Screen" or "Install App"
4. The app icon will appear on your home screen
5. Tap to launch the standalone app

### For Developers
1. Build the production version:
   ```bash
   cd Client
   npm run build
   ```

2. Test PWA locally:
   ```bash
   npm run preview
   ```

3. Use Chrome DevTools > Application > Service Workers to debug

## PWA Requirements Checklist

✅ **HTTPS Required**: Deploy on HTTPS for service workers to function  
✅ **Manifest File**: Configured with all required properties  
✅ **Service Worker**: Registered and caching strategies implemented  
✅ **Icons**: Multiple sizes for different device resolutions  
✅ **Responsive Design**: Mobile-first responsive layout  
✅ **Offline Fallback**: Graceful handling of network failures  
✅ **Theme Color**: Matches app branding (#8b5cf6 - purple)  
✅ **Viewport Meta Tag**: Properly configured for mobile  

## Configuration

### Manifest Configuration
Located at: `Client/public/manifest.json`

Key properties:
- `name`: Full application name
- `short_name`: Name displayed on home screen
- `theme_color`: Browser UI color (#8b5cf6)
- `background_color`: Splash screen background
- `display`: "standalone" for app-like experience
- `start_url`: Entry point of the app

### Service Worker Configuration
Located at: `Client/public/service-worker.js`

Cache strategy:
- **Cache-first**: Static assets (HTML, CSS, JS)
- **Network-first**: API requests (attendance, courses)
- **Offline fallback**: Shows offline page when network unavailable

### Caching Strategy
```javascript
CACHE_NAME: 'qr-attendance-v1'
```
Update the version number when releasing new features to force cache refresh.

## Testing PWA Functionality

### Chrome DevTools (Desktop)
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" - should show registered worker
4. Check "Manifest" - should display app details
5. Use "Lighthouse" tab to audit PWA score

### Testing Offline Mode
1. Open DevTools > Network tab
2. Select "Offline" from throttling dropdown
3. Reload page - cached content should load
4. API requests will show offline message

### Testing Installation
1. Visit the app in a supported browser
2. Look for install prompt or icon
3. Install and verify app opens in standalone window
4. Check that app icon appears in applications menu

## Browser Support

| Browser | PWA Support | Install Support | Service Worker |
|---------|-------------|-----------------|----------------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Partial | ❌ | ✅ |
| Opera | ✅ | ✅ | ✅ |

## Deployment Considerations

### Production Deployment
1. **HTTPS Required**: Service workers only work on HTTPS
2. **Cache Version**: Update `CACHE_NAME` on each deployment
3. **Icon Assets**: Ensure icons are optimized and accessible
4. **Service Worker Scope**: Served from root for full coverage

### Recommended Hosting Platforms
- **Vercel**: Automatic HTTPS, PWA-friendly
- **Netlify**: Built-in PWA support
- **Firebase Hosting**: Optimized for PWAs
- **GitHub Pages**: Supports custom domains with HTTPS

### Environment Variables
Ensure backend API URL is properly configured:
```javascript
// In production, update to your API domain
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';
```

## Maintenance

### Updating the Service Worker
1. Modify `service-worker.js` as needed
2. Increment `CACHE_NAME` version (e.g., v1 → v2)
3. Deploy changes
4. Old cache will be automatically cleared
5. Users will receive updated version on next visit

### Adding New Cached Routes
Edit `urlsToCache` array in `service-worker.js`:
```javascript
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  // Add new routes here
];
```

### Troubleshooting

**Issue**: Service worker not registering
- **Solution**: Check browser console for errors, ensure HTTPS

**Issue**: Old content showing after update
- **Solution**: Increment cache version and clear browser cache

**Issue**: Install prompt not showing
- **Solution**: Verify manifest.json is accessible, check PWA criteria

**Issue**: Icons not displaying
- **Solution**: Check icon paths in manifest, ensure files exist

## Performance Optimization

### Lighthouse PWA Audit
Run Lighthouse audit in Chrome DevTools:
1. Open DevTools
2. Go to "Lighthouse" tab
3. Select "Progressive Web App" category
4. Click "Generate report"
5. Aim for score > 90

### Best Practices
- ✅ Minimize cached assets to reduce storage
- ✅ Use versioned cache names for updates
- ✅ Implement background sync for offline form submissions
- ✅ Lazy load non-critical resources
- ✅ Optimize images and icons

## Security Considerations

1. **Service Worker Scope**: Limited to origin, cannot access other sites
2. **HTTPS Only**: Prevents man-in-the-middle attacks
3. **Cache Security**: Does not cache sensitive user data (tokens, passwords)
4. **Content Security Policy**: Configure CSP headers for production

## Future Enhancements

### Potential PWA Features
- 🔔 **Push Notifications**: Notify lecturers of new manual requests
- 📱 **Background Sync**: Queue attendance submissions when offline
- 🔄 **Periodic Background Sync**: Auto-update attendance data
- 📊 **Install Analytics**: Track PWA installation rates
- 🎨 **Adaptive Icons**: Better Android theme integration
- 📥 **Share Target API**: Share session links directly to app

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

**Note**: This PWA implementation provides offline support for static content only. API-dependent features (course management, attendance submission) require internet connectivity. Consider implementing IndexedDB for offline data persistence in future versions.
