# Meet Our Founders Section - Visual Guide

## 🖼️ Section Layout

### Desktop View (1200px+)
```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                      Meet Our Founders                            │
│                    ──────────────────────                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │             Founders Team.jpg                               │ │
│  │        (Responsive Height: ~600px)                          │ │
│  │                                                              │ │
│  │  [Hover Effect: Scale 1.02x, Enhanced Shadow]              │ │
│  │  [Click: Navigate to /founders]                            │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│                 [ View Founder Details → ]                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Tablet View (768px-1199px)
```
┌────────────────────────────────────┐
│                                    │
│    Meet Our Founders               │
│   ──────────────────               │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │   Founders Team.jpg          │  │
│  │ (Height: ~50vw ≈ 400px)     │  │
│  │                              │  │
│  │ [Hover Effect Active]        │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│    [ View Founder Details → ]      │
│                                    │
└────────────────────────────────────┘
```

### Mobile View (320px-767px)
```
┌──────────────────────┐
│                      │
│  Meet Our Founders   │
│  ──────────────────  │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │   Founders     │  │
│  │   Team.jpg     │  │
│  │ (300px height) │  │
│  │                │  │
│  └────────────────┘  │
│                      │
│ [ View Details → ]   │
│                      │
└──────────────────────┘
```

---

## 🎨 Color Scheme

### Section Background
```
Color: #F8F9FA (Light Gray)
RGB: (248, 249, 250)
Purpose: Clean, professional background
```

### Section Title
```
Primary: #1a1a2e (Dark Gray/Black)
Accent: #0F5D2F (Green - Farm theme)
Font Size: clamp(1.8rem, 4vw, 2.5rem)
Font Weight: 700 (Bold)
```

### Divider
```
Line Color: #0F5D2F (Green)
Width: 60px
Height: 3px
Dot Color: #D4AF37 (Gold - Premium feel)
```

### Shadow
```
Normal: 0 20px 50px rgba(0,0,0,0.15)
Hover: 0 30px 70px rgba(0,0,0,0.25)
Transition: 0.3s ease
```

---

## 🎭 Interactive States

### Normal State
```
┌─────────────────────────────┐
│   Founders Team.jpg        │
│   (Normal Scale: 1)        │
│   (Shadow: 0 20px 50px)    │
│   (Cursor: default)        │
└─────────────────────────────┘

CSS Properties:
- transform: scale(1)
- box-shadow: 0 20px 50px rgba(0,0,0,0.15)
- cursor: default
- transition: 0.3s ease
```

### Hover State
```
┌─────────────────────────────┐
│   Founders Team.jpg        │
│   (Scaled: 1.02x)          │
│   (Shadow: 0 30px 70px)    │
│   (Cursor: pointer)        │
└─────────────────────────────┘

CSS Properties:
- transform: scale(1.02)
- box-shadow: 0 30px 70px rgba(0,0,0,0.25)
- cursor: pointer
- transition: 0.3s ease (smooth animation)
```

### Click/Active State
```
┌─────────────────────────────┐
│   Navigating to /founders   │
│                             │
│   (Page transitions)        │
│   (Scroll to top)           │
└─────────────────────────────┘

Behavior:
- onClick: handleNavigate('/founders')
- Effect: Navigate to founders page
- Scroll: window.scrollTo({ top: 0, behavior: 'smooth' })
```

---

## 📐 Responsive Dimensions

### Image Height Formula
```
height: clamp(300px, 50vw, 600px)

Breakdown:
- Minimum: 300px (mobile devices)
- Preferred: 50vw (50% of viewport width)
- Maximum: 600px (desktop screens)

Examples:
┌──────────────┬─────────────┬──────────┐
│ Viewport     │ 50vw calc   │ Result   │
├──────────────┼─────────────┼──────────┤
│ 320px        │ 160px       │ 300px ✓  │
│ 640px        │ 320px       │ 320px    │
│ 768px        │ 384px       │ 384px    │
│ 1024px       │ 512px       │ 512px    │
│ 1280px       │ 640px       │ 600px ✓  │
└──────────────┴─────────────┴──────────┘
```

### Image Width
```
width: 100%
- Always fills container width
- Responsive from 320px to 1400px+
- Container max-width: 1400px
```

### Container Padding
```
Padding: 5rem 1.5rem (vertical, horizontal)
- Desktop: 80px vertical, 24px horizontal
- Tablet: 80px vertical, 24px horizontal
- Mobile: 80px vertical, 24px horizontal
(Responsive units, scales with viewport)
```

### Margin Top
```
marginTop: 2rem (32px)
- Creates space between title and banner
- Responsive spacing
```

---

## 🎬 Animation Timeline

### Page Load
```
Timeline:
0ms    ├─ Section renders
       ├─ fade-up animation starts
200ms  ├─ Banner fades in and slides up
       ├─ Opacity: 0 → 1
       ├─ Transform: translateY(20px) → 0
       └─ Duration: 0.6s

className: fade-up
Effect: Smooth entrance with subtle upward motion
```

### Hover Interaction
```
Timeline:
0ms    ├─ Mouse enters banner
       ├─ transform transition: 0.3s
       ├─ box-shadow transition: 0.3s
100ms  ├─ Scale: 1 → 1.02
       ├─ Shadow: increases
200ms  ├─ Animation completes
       ├─ Pointer cursor visible
       └─ User sees enhanced visual feedback

Duration: 300ms (smooth, not jarring)
```

### Click Navigation
```
Timeline:
0ms    ├─ User clicks banner
       ├─ onClick handler fired
50ms   ├─ Navigate to /founders
       ├─ useNavigate('/founders') called
100ms  ├─ Scroll to top
       ├─ window.scrollTo({ behavior: 'smooth' })
150ms  ├─ Page transition
       ├─ Founder page loads data
       ├─ Components render
       └─ Display founder details

Total: ~300-500ms depending on network
```

---

## 🎯 User Interaction Flow

### Desktop User
```
1. Scroll to "Meet Our Founders" section
2. See professional banner image
3. Notice hover effect area (entire banner)
4. Move mouse over banner
   → Banner scales up (1.02x)
   → Shadow enhances
   → Cursor becomes pointer
5. Click anywhere on banner
   → Navigate to /founders
   → Page scrolls to top
   → Founder details load
```

### Mobile User
```
1. Scroll to "Meet Our Founders" section
2. See responsive banner (height: 300px)
3. See "View Founder Details" button
4. Tap banner or button
   → Navigate to /founders (instantly)
   → Page scrolls to top
   → Founder details load
   
Note: Hover effects don't apply on touch
```

### Tablet User
```
1. Scroll to "Meet Our Founders" section
2. See banner with responsive height (~50vw)
3. Can see subtle hover effect (if mouse)
4. Can tap/click banner
   → Navigate to /founders
   → Same experience as mobile/desktop
```

---

## 📊 Responsive Breakpoints

```
Mobile-First Approach:
┌─────────────┬────────────────┬──────────────────┐
│ Device      │ Viewport       │ Banner Height    │
├─────────────┼────────────────┼──────────────────┤
│ Mobile      │ 320px - 480px  │ 300px (minimum)  │
│ Tablet      │ 481px - 768px  │ 240px-384px      │
│ Desktop     │ 769px - 1024px │ 384px-512px      │
│ Large       │ 1025px+        │ 512px-600px (max)│
└─────────────┴────────────────┴──────────────────┘

All heights calculated using: clamp(300px, 50vw, 600px)
```

---

## 🔄 State Management

### No State Required
```typescript
// ✅ Component is stateless for this section
// Banner is just a presentation layer
// No loading states needed
// No error states needed
// No conditional rendering needed

// Just: Image + Click Handler + Hover Handler
```

---

## ♿ Accessibility Features

### Alt Text
```
<img 
  alt="Meet Our Founders"
  ...
/>
Purpose: Screen reader friendly
```

### Semantic Structure
```
<section>           <!-- Semantic section element -->
  <div>             <!-- Container -->
    <div>           <!-- Section header -->
      <h2>          <!-- Main heading -->
    </div>
    <div>           <!-- Banner container (clickable) -->
      <img />       <!-- Actual image -->
    </div>
    <button>        <!-- CTA button (fallback) -->
  </div>
</section>
```

### Keyboard Navigation
```
- Tab: Can reach banner (entire div is interactive)
- Enter: Clicks the div (navigates to /founders)
- Focus: Visible focus state on button
```

### Color Contrast
```
Text on background:
- Dark gray (#1a1a2e) on light (#F8F9FA) ✅ Good contrast
- Green (#0F5D2F) on light (#F8F9FA) ✅ Good contrast
- All meets WCAG AA standards
```

---

## 🎨 Design System Consistency

### Maintained Elements
```
✅ Background color: #F8F9FA (consistent)
✅ Padding: 5rem 1.5rem (consistent)
✅ Border radius: 24px (consistent)
✅ Shadow styling: Matches other sections
✅ Font sizing: Uses responsive clamp()
✅ Color scheme: Green (#0F5D2F) + Gold (#D4AF37)
✅ Spacing: Follows 8px grid system
✅ Animation: fade-up class used
✅ Typography: Poppins font family
✅ Button styling: Consistent with site
```

---

## 📱 CSS Media Queries (Implicit in clamp)

```css
/* No explicit media queries needed */
/* clamp() handles all responsiveness */

height: clamp(300px, 50vw, 600px)

/* Equivalent to: */
@media (max-width: 600px) {
  height: 300px;  /* Minimum */
}

@media (min-width: 1200px) {
  height: 600px;  /* Maximum */
}

/* Between 600px - 1200px: 50vw (responsive) */
```

---

## ✨ Visual Feedback

### Visual Cues
```
1. Section Title: Indicates "Founders" section
2. Banner Image: Shows founder team
3. Scale Effect: Indicates interactivity
4. Shadow Effect: Enhances depth
5. Pointer Cursor: "This is clickable"
6. Button Text: "View Founder Details →"
```

### Microinteractions
```
Hover Feedback:
- Duration: 300ms
- Scale: +2% increase
- Shadow: 50% increase
- Smooth easing: All 0.3s

Click Feedback:
- Instant navigation
- Smooth scroll to top
- Page transition
```

---

## 🎯 Perfect For

✅ Desktop users clicking for full details
✅ Mobile users wanting team overview
✅ Tablet users with responsive scaling
✅ Accessibility-conscious users with keyboard nav
✅ Performance-conscious users (no API calls)
✅ Design-conscious users with professional look
✅ Speed-focused users with instant loading

---

## 📊 Asset Requirements

### Image Asset
```
File: Founders Team.jpg
Location: /public/images/Founders Team.jpg
Status: ✅ Already exists
Size: ~200-300KB (typical for hero image)
Format: JPG (optimized)
Dimensions: Any (object-fit: cover handles scaling)
Quality: Professional/High quality needed
```

### No Additional Assets Needed
```
✅ No icon sprites
✅ No additional fonts
✅ No animation libraries
✅ Just plain CSS transitions
```

---

## 🚀 Performance Profile

### CSS Animations
```
- transform: scale() - GPU accelerated ✅
- box-shadow: Changes - Efficient ✅
- Duration: 0.3s - Smooth ✅
- Easing: ease - Natural motion ✅
- No jank or stuttering expected ✅
```

### File Size
```
- Banner container: ~100 bytes HTML
- Inline styles: ~500 bytes CSS
- Image: ~250KB (typical)
- Total: ~250KB (one request)
```

### Rendering
```
- Rendering: Single image, minimal layout
- Repaints: Only on hover (very efficient)
- Reflows: None
- FPS: 60fps smooth animation ✅
```

---

This visual guide ensures consistent, professional presentation across all devices while maintaining performance and accessibility standards.
