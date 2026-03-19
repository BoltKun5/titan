export const isUnloggedPage = () => {
  const unloggedPages = ['/login', '/signup'];
  return unloggedPages.includes(window.location.pathname);
};

export const isUserConnected = (): boolean => {
  return !!localStorage.getItem('token');
};
