# Clash of Clans – Hero Equipment Ore Planner

A web app to help Clash of Clans players calculate their weekly/monthly ore income and estimate the time needed to upgrade hero equipment.

## 🚀 Features
- **Ore Calculator:** Estimate weekly/monthly Shiny, Glowy, and Starry ore income based on your league, war activity, trader, raid medals, and gems.
- **Equipment Manager:** Manage your hero equipment, set current/target levels, see upgrade costs, and estimate upgrade time.
- **User-Friendly UI:** Responsive, clear interface with dark/light mode, interactive sliders, and grouped equipment tables.
- **Data Visualization:** Progress bars, icons, and grouped tables for easy planning.
- **Realistic Estimates:** Calculates bottleneck ore and shows the minimum number of weeks needed for upgrades.

## 🛠️ Tech Stack
- **React** (TypeScript)
- **Tailwind CSS**
- **Vite**

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Install dependencies
```
pnpm install
```

### Run in development
```
pnpm dev
```

### Build for production
```
pnpm build
```

### Preview production build
```
pnpm preview
```

## 📝 Usage
1. **Player Form:**
   - Select your league, attack Town Hall, war activity, and ore purchases (raid medals/gems).
   - Toggle free trader ore if available.
2. **Ore Calculator:**
   - View your estimated weekly/monthly ore income by source and type.
3. **Equipment Manager:**
   - See all hero equipment, set current/target levels, select/hide items, and view upgrade costs.
   - Estimate the number of weeks needed to upgrade all selected equipment (bottleneck calculation).
   - Group by hero, collapse/expand sections, and use dark/light mode for comfort.

## 📁 Data Files
- `public/data/equipment-data.json`: Equipment definitions.
- `public/data/upgrade-cost.json`: Upgrade cost tables.

## 👤 Credits
- Created by Cong Cuong
- Clash of Clans™ is a trademark of Supercell. This project is fan-made and not affiliated with Supercell.

---
Feel free to contribute or suggest improvements!
