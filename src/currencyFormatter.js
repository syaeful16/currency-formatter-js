/*!
 * CurrencyFormatter.js (Source ESM)
 * Author: ChatGPT
 * License: MIT
 */

const SYMBOL_MAP = {
    'id': 'Rp', 'en': '$', 'us': '$', 'ja': '¥', 'zh': '¥', 'kr': '₩', 'in': '₹', 'eu': '€', 'gb': '£'
};
  
function formatNumber(value, pattern, negativeStyle = '-') {
    if (value === null || value === undefined || value === '') value = 0;
    let num = parseFloat(String(value).replace(/[^\d.\-]/g, '')) || 0;
  
    const isNegative = num < 0;
    num = Math.abs(num);
  
    let prefix = '';
    let suffix = '';
    let numberPattern = pattern || '#,###.##';
  
    if (pattern.includes('|')) {
        const parts = pattern.split('|');

        if (pattern.indexOf('|') === 0) {
            numberPattern = parts[1];
            suffix = parts[0].replace('|', '');
        } else if (pattern.endsWith('|')) {
            prefix = parts[0];
        } else {
            if (parts[0].match(/[#0.,]/)) {
                numberPattern = parts[0];
                suffix = parts[1];
            } else {
                prefix = parts[0];
                numberPattern = parts[1];
            }
        }
    }
  
    const useEuropean = numberPattern.indexOf('.') < numberPattern.indexOf(',') && numberPattern.indexOf(',') !== -1;
    const thousandSep = useEuropean ? '.' : ',';
    const decimalSep = useEuropean ? ',' : '.';
  
    const decimalIndex = Math.max(numberPattern.lastIndexOf('.'), numberPattern.lastIndexOf(','));
    let decimalPlaces = 0;
    if (decimalIndex !== -1 && decimalIndex < numberPattern.length - 1) {
        const decimalPart = numberPattern.substring(decimalIndex + 1);
        decimalPlaces = decimalPart.replace(/[^#0]/g, '').length;
    }
  
    const fixed = num.toFixed(decimalPlaces);
    const parts = fixed.split('.');
    let intPart = parts[0];
    const decPart = parts[1] || '';
  
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(intPart)) {
      intPart = intPart.replace(rgx, '$1' + thousandSep + '$2');
    }
  
    let formatted = intPart;
    if (decimalPlaces > 0 && decPart !== '') {
      formatted += decimalSep + decPart;
    }
  
    let result = (prefix ? prefix + ' ' : '') + formatted + (suffix ? ' ' + suffix : '');
    if (isNegative) {
        if (negativeStyle === '()') result = '(' + result + ')';
        else result = '-' + result;
    }
  
    return result;
}
  
export default function CurrencyFormatter(defaultPattern = 'Rp|#.###,##', negativeStyle = '-') {
    function callable(value, patternOverride) {
        return callable.format(value, patternOverride);
    }
  
    callable.pattern = defaultPattern;
    callable.negativeStyle = negativeStyle;
  
    callable.setFormat = newPattern => {
        if (typeof newPattern === 'string' && newPattern.trim() !== '') callable.pattern = newPattern;
    };
  
    callable.setNegativeStyle = style => {
        if (style === '-' || style === '()') callable.negativeStyle = style;
    };
  
    callable.format = (value, patternOverride) => {
        const pattern = patternOverride || callable.pattern;
        return formatNumber(value, pattern, callable.negativeStyle);
    };
  
    callable.auto = (value, locale = 'id-ID') => {
        const lang = locale.toLowerCase().split('-')[0];
        const symbol = SYMBOL_MAP[lang] || '$';
        const useEuropean = ['id', 'de', 'fr', 'es', 'it'].includes(lang);
        const pattern = useEuropean ? `${symbol}|#.###,##` : `#,###.##|${symbol}`;

        return formatNumber(value, pattern, callable.negativeStyle);
    };
  
    callable.parse = text => parseFloat(String(text).replace(/[^\d.\-]/g, '')) || 0;
  
    return callable;
}
  