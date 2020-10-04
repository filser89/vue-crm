import store from '../store';

export default function currencyFilter(value, currency = 'CNY') {
  const locale = store.getters.info.locale || 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value
  );
}
