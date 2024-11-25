import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    "primaryColor": "#C28C70FF",       
    "primaryColorHover": "#D39B81FF",
    "primaryColorSuppl": "#D39B81FF", 
    "primaryColorPressed": "#A3785DFF"
  },
  Menu: {
    itemHeight: '32px'
  },
  Layout: {
    color: '#FAF4F0FF'
  },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#FFFFFF' },
    },
  }
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    "primaryColor": "#C28C70FF",        
    "primaryColorHover": "#D39B81FF",  
    "primaryColorSuppl": "#D39B81FF",  
    "primaryColorPressed": "#A3785DFF" 
  },
  Notification: {
    color: '#3A3A3AFF',
  },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#1e1e1e' },
    },
  },
  Menu: {
    itemHeight: '32px',
  },
  Layout: {
    color: '#1C1C1CFF'
  }
};
