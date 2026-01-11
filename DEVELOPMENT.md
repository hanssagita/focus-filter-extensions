# Development Guide

## Overview

This extension is built using the WXT framework with React, TypeScript, and TailwindCSS. The architecture follows a clean separation of concerns with reusable components and testable business logic.

## Architecture

### Entry Points

#### 1. Popup (`entrypoints/popup/`)
- **Purpose**: User interface for managing blocked sites
- **Key Files**:
  - `App.tsx`: Main React component with state management
  - `main.tsx`: Entry point that mounts the React app
- **Features**:
  - Global blocking toggle
  - Add/remove blocked keywords
  - Tooltip for user guidance

#### 2. Content Script (`entrypoints/content.ts`)
- **Purpose**: Runs on every webpage to check and block sites
- **Execution**: `document_start` (before page loads)
- **Logic**:
  1. Fetch blocking state from storage
  2. Check if current URL matches any keyword
  3. If blocked, stop page load and show warning
  
#### 3. Background Script (`entrypoints/background.ts`)
- **Purpose**: Extension lifecycle management
- Currently minimal, can be extended for features like:
  - Analytics
  - Sync across devices
  - Scheduled blocking (time-based)

### Core Libraries

#### `lib/blocking.ts`
Pure function for URL matching logic:
```typescript
isUrlBlocked(url: string, blockedSites: string[], enabled: boolean): boolean
```
- **Why pure?** Easy to test without mocking browser APIs
- **Algorithm**: Case-insensitive substring matching
- **Coverage**: 12 unit tests covering edge cases

#### `lib/storage.ts`
Chrome storage abstraction:
```typescript
getIsBlockingEnabled(): Promise<boolean>
setIsBlockingEnabled(enabled: boolean): Promise<void>
getBlockedSites(): Promise<string[]>
addBlockedSite(site: string): Promise<void>
removeBlockedSite(site: string): Promise<void>
```
- Uses `chrome.storage.local` for persistence
- Type-safe wrappers
- Avoids duplication

#### `lib/utils.ts`
Utility for class name merging (Tailwind):
```typescript
cn(...inputs: ClassValue[]): string
```

### UI Components

All components follow Shadcn UI patterns:

#### `components/ui/button.tsx`
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: sm, default, lg, icon
- Uses `class-variance-authority` for type-safe variants

#### `components/ui/input.tsx`
- Styled for dark mode
- Focus states with ring

#### `components/ui/switch.tsx`
- Custom toggle switch (no external dependency)
- Smooth animation with Tailwind transitions

#### `components/ui/card.tsx`
- Container components: Card, CardHeader, CardTitle, CardContent
- Composable layout structure

#### `components/ui/tooltip.tsx`
- Hover-based tooltip
- Pure CSS animation
- Positioned above target element

## Development Workflow

### 1. Local Development

```bash
# Start dev server with hot reload
npm run dev

# The extension will be in .output/chrome-mv3/
# Load it in Chrome as an unpacked extension
```

**Hot Reload**: WXT automatically rebuilds on file changes. You may need to manually reload the extension in `chrome://extensions/` for manifest changes.

### 2. Testing

```bash
# Run all tests once
npm test -- --run

# Watch mode
npm test

# UI mode (recommended for debugging)
npm test:ui
```

**Test Strategy**:
- Unit tests for pure functions (`lib/blocking.ts`)
- Focus on business logic, not UI
- Mock-free where possible

### 3. Building

```bash
# Production build for Chrome
npm run build

# Build for Firefox
npm run build:firefox

# Create distribution ZIP
npm run zip
```

### 4. Type Checking

```bash
# Check types without building
npm run compile
```

## Adding New Features

### Example: Add "Schedule Blocking" Feature

1. **Update Storage** (`lib/storage.ts`):
```typescript
export interface Schedule {
  enabled: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
}

export async function getSchedule(): Promise<Schedule> {
  const result = await chrome.storage.local.get('schedule');
  return result.schedule ?? { enabled: false, startTime: '09:00', endTime: '17:00' };
}
```

2. **Update Blocking Logic** (`lib/blocking.ts`):
```typescript
export function isUrlBlocked(
  url: string,
  blockedSites: string[],
  enabled: boolean,
  schedule?: Schedule
): boolean {
  if (!enabled) return false;
  
  // Check schedule if enabled
  if (schedule?.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    if (currentTime < schedule.startTime || currentTime > schedule.endTime) {
      return false; // Outside blocking hours
    }
  }
  
  // Existing keyword matching logic
  return blockedSites.some(site => url.toLowerCase().includes(site.toLowerCase()));
}
```

3. **Add UI** (`entrypoints/popup/App.tsx`):
```typescript
const [schedule, setSchedule] = useState<Schedule>({ enabled: false, startTime: '09:00', endTime: '17:00' });

// Load schedule on mount
useEffect(() => {
  const loadSchedule = async () => {
    const sched = await getSchedule();
    setSchedule(sched);
  };
  loadSchedule();
}, []);

// Add UI controls for schedule configuration
```

4. **Write Tests** (`tests/blocking.test.ts`):
```typescript
describe('scheduled blocking', () => {
  it('should not block outside scheduled hours', () => {
    const url = 'https://instagram.com';
    const blockedSites = ['instagram'];
    const enabled = true;
    const schedule = { enabled: true, startTime: '09:00', endTime: '17:00' };
    
    // Mock time to 08:00 (before start)
    // ... test logic
  });
});
```

## Styling Guidelines

### Tailwind Classes
- Use semantic color names from `tailwind.config.js`:
  - `bg-background`, `text-foreground`
  - `bg-card`, `text-card-foreground`
  - `bg-primary`, `text-primary-foreground`
  
### Dark Mode
- All colors are dark by default
- The `dark` class is applied at the root (`<html class="dark">`)

### Component Styling
- Keep styles consistent with Material 3:
  - Rounded corners: `rounded-lg` (12px), `rounded-md` (8px)
  - Shadows: `shadow-sm` for cards
  - Transitions: `transition-colors` for smooth interactions

## Best Practices

1. **Keep Logic Pure**: Extract testable logic into pure functions
2. **Type Everything**: Use TypeScript strictly, avoid `any`
3. **Small Components**: One responsibility per component
4. **Test Business Logic**: Focus tests on `lib/` modules
5. **Async/Await**: Use modern async patterns, avoid callbacks
6. **Error Handling**: Catch errors in content scripts (can't show alerts)

## Debugging

### Content Script
```typescript
// Add console logs (visible in page's DevTools)
console.log('[Focus] Current URL:', window.location.href);
console.log('[Focus] Blocked sites:', blockedSites);
```

### Popup
- Right-click extension icon → "Inspect popup"
- React DevTools work normally

### Background Script
- Go to `chrome://extensions/`
- Click "Inspect views: background page"

## Common Issues

### Issue: Changes not reflecting
**Solution**: 
1. Go to `chrome://extensions/`
2. Click the refresh icon for Focus extension
3. Reload any affected pages

### Issue: Storage not persisting
**Solution**: Check that `permissions: ['storage']` is in `wxt.config.ts` manifest

### Issue: TypeScript errors for Chrome APIs
**Solution**: Ensure `@types/chrome` is installed

## Performance

- **Content Script**: Runs on every page, keep it lightweight
- **Popup**: Lazy loads, only active when opened
- **Storage**: Local storage is fast, but avoid excessive reads/writes

## Future Enhancements

Ideas for contributors:
- [ ] Scheduled blocking (time-based)
- [ ] Allowlist for specific pages
- [ ] Import/export blocked list
- [ ] Statistics dashboard
- [ ] Pomodoro timer integration
- [ ] Browser sync support

---

Happy coding! 🚀
