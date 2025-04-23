import { createContext, useContext, useState } from 'react';

const dict = {
  vi: {
    home: 'Trang chủ',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    profile: 'Thông tin',
    history: 'Lịch sử xem',
    favourites: 'Yêu thích',
    subscription: 'Gói',
  },
  en: {
    home: 'Home',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    history: 'History',
    favourites: 'Favourites',
    subscription: 'Subscription',
  }
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'vi');
  const t = (key) => dict[lang][key] || key;
  const changeLang = (l) => {
    localStorage.setItem('lang', l);
    setLang(l);
  };
  return (
    <I18nContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
