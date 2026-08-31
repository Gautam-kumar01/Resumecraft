export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => (
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    )),
  );

  window.gtag('event', name, safeParams);
};
