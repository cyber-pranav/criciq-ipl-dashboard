import { create } from 'zustand';

const FRANCHISE_THEMES = {
  default: {
    primary: '#00D4FF',
    secondary: '#F59E0B',
    bg: '#0B0F1A',
    surface: '#131929',
    border: '#1E2D4A',
    name: 'CricIQ Default',
  },
  csk: {
    primary: '#FFC107',
    secondary: '#FF6F00',
    bg: '#0B0F1A',
    surface: '#1A1800',
    border: '#332E00',
    name: 'Chennai Super Kings',
  },
  mi: {
    primary: '#004BA0',
    secondary: '#B3D4FC',
    bg: '#0B0F1A',
    surface: '#0A1628',
    border: '#1A2D4A',
    name: 'Mumbai Indians',
  },
  rcb: {
    primary: '#EC1C24',
    secondary: '#000000',
    bg: '#0B0F1A',
    surface: '#1A0A0A',
    border: '#3A1515',
    name: 'Royal Challengers Bengaluru',
  },
  kkr: {
    primary: '#3A225D',
    secondary: '#FFC107',
    bg: '#0B0F1A',
    surface: '#150E22',
    border: '#2A1A40',
    name: 'Kolkata Knight Riders',
  },
  dc: {
    primary: '#17479E',
    secondary: '#EF4444',
    bg: '#0B0F1A',
    surface: '#0A1428',
    border: '#1A2A4A',
    name: 'Delhi Capitals',
  },
  pbks: {
    primary: '#ED1B24',
    secondary: '#D4AF37',
    bg: '#0B0F1A',
    surface: '#1A0A0A',
    border: '#3A1515',
    name: 'Punjab Kings',
  },
  rr: {
    primary: '#E73895',
    secondary: '#254AA5',
    bg: '#0B0F1A',
    surface: '#1A0A18',
    border: '#3A1535',
    name: 'Rajasthan Royals',
  },
  srh: {
    primary: '#F26522',
    secondary: '#000000',
    bg: '#0B0F1A',
    surface: '#1A1008',
    border: '#3A2515',
    name: 'Sunrisers Hyderabad',
  },
  gt: {
    primary: '#1B2133',
    secondary: '#B4A76C',
    bg: '#0B0F1A',
    surface: '#111520',
    border: '#222838',
    name: 'Gujarat Titans',
  },
  lsg: {
    primary: '#A72056',
    secondary: '#00B7EB',
    bg: '#0B0F1A',
    surface: '#1A0A15',
    border: '#3A1530',
    name: 'Lucknow Super Giants',
  },
};

const SYNTHWAVE_OVERRIDES = {
  bg: '#0D001A',
  surface: '#1A0033',
  border: '#3D0066',
  primary: '#FF00FF',
  secondary: '#00FFFF',
};

const useThemeStore = create((set, get) => ({
  franchiseId: localStorage.getItem('criciq-franchise') || 'default',
  isSynthwave: localStorage.getItem('criciq-synthwave') === 'true',
  showPicker: !localStorage.getItem('criciq-franchise'),

  getTheme: () => {
    const { franchiseId, isSynthwave } = get();
    const base = FRANCHISE_THEMES[franchiseId] || FRANCHISE_THEMES.default;
    if (isSynthwave) {
      return { ...base, ...SYNTHWAVE_OVERRIDES, name: base.name + ' (Synthwave)' };
    }
    return base;
  },

  setFranchise: (id) => {
    localStorage.setItem('criciq-franchise', id);
    set({ franchiseId: id, showPicker: false });
    get().applyTheme();
  },

  toggleSynthwave: () => {
    const next = !get().isSynthwave;
    localStorage.setItem('criciq-synthwave', String(next));
    set({ isSynthwave: next });
    get().applyTheme();
  },

  setShowPicker: (show) => set({ showPicker: show }),

  applyTheme: () => {
    const theme = get().getTheme();
    const root = document.documentElement;
    root.style.setProperty('--color-cyan', theme.primary);
    root.style.setProperty('--color-amber', theme.secondary);
    root.style.setProperty('--color-navy', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-border', theme.border);
  },
}));

export { FRANCHISE_THEMES };
export default useThemeStore;
