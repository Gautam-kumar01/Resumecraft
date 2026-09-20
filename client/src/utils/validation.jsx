
/* eslint-disable react-refresh/only-export-components */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX_INDIA = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const PHONE_REGEX_GENERIC = /^(\+?\d{1,3}[\s-]?)?(\d{7,15})$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z-]+)\.([a-z.]{2,10})([/\w .-]*)*\/?$/i;
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]{3,}/i;
const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]{2,}/i;
const YEAR_REGEX = /^(19|20)\d{2}$/;
const YEAR_MONTH_REGEX = /^(19|20)\d{2}[-/](0[1-9]|1[0-2])$/;

const isEmpty = (value) => value === undefined || value === null || String(value).trim() === '';

export const validateEmail = (value) => {
    if (isEmpty(value)) return { valid: true, level: 'info', message: '' };
    if (EMAIL_REGEX.test(String(value).trim())) return { valid: true, level: 'success', message: '' };
    return { valid: false, level: 'warn', message: 'This email format looks unusual. Double-check before exporting.' };
};

export const validatePhone = (value) => {
    if (isEmpty(value)) return { valid: true, level: 'info', message: '' };
    const v = String(value).trim();
    const digits = v.replace(/\D/g, '');
    if (digits.length < 7) return { valid: false, level: 'warn', message: 'Phone number looks too short.' };
    if (digits.length > 15) return { valid: false, level: 'warn', message: 'Phone number looks too long.' };
    if (PHONE_REGEX_INDIA.test(v) || PHONE_REGEX_GENERIC.test(v)) return { valid: true, level: 'success', message: '' };
    return { valid: 'soft', level: 'info', message: 'Format not recognized. Review it before applying.' };
};

export const validateUrl = (value) => {
    if (isEmpty(value)) return { valid: true, level: 'info', message: '' };
    const v = String(value).trim();
    if (URL_REGEX.test(v)) return { valid: true, level: 'success', message: '' };
    return { valid: false, level: 'warn', message: 'URL format looks unusual. Check for typos.' };
};

export const validateLinkedIn = (value) => {
    if (isEmpty(value)) return { valid: true, level: 'info', message: '' };
    const v = String(value).trim();
    if (LINKEDIN_REGEX.test(v) || URL_REGEX.test(v)) return { valid: true, level: 'success', message: '' };
    return { valid: 'soft', level: 'info', message: 'Expected a linkedin.com/in/… link.' };
};

export const validateGithub = (value) => {
    if (isEmpty(value)) return { valid: true, level: 'info', message: '' };
    const v = String(value).trim();
    if (GITHUB_REGEX.test(v) || URL_REGEX.test(v)) return { valid: true, level: 'success', message: '' };
    return { valid: 'soft', level: 'info', message: 'Expected a github.com/… link.' };
};

const parseDatePoint = (value) => {
    if (isEmpty(value)) return null;
    const v = String(value).trim();
    if (YEAR_REGEX.test(v)) return new Date(Number(v), 11, 31).getTime();
    if (YEAR_MONTH_REGEX.test(v)) {
        const [year, month] = v.split(/[-/]/).map(Number);
        return new Date(year, month - 1, 28).getTime();
    }
    const parsed = Date.parse(v);
    return Number.isFinite(parsed) ? parsed : null;
};

export const validateDateOrder = (startValue, endValue, currentlyWorking = false) => {
    if (currentlyWorking) return { valid: true, level: 'info', message: '' };
    if (isEmpty(startValue) || isEmpty(endValue)) return { valid: true, level: 'info', message: '' };
    const s = parseDatePoint(startValue);
    const e = parseDatePoint(endValue);
    if (s === null || e === null) return { valid: true, level: 'info', message: '' };
    if (s > e) return { valid: false, level: 'warn', message: 'End date is before start date.' };
    return { valid: true, level: 'success', message: '' };
};

export const validateRequired = (value, label) => {
    if (!isEmpty(value)) return { valid: true, level: 'success', message: '' };
    return { valid: false, level: 'info', message: `${label} helps the resume feel complete.` };
};

export const ValidationHint = ({ result }) => {
    if (!result || result.level === 'success' || !result.message) return null;
    const styles = {
        warn: 'text-amber-700 bg-amber-50 border-amber-200',
        info: 'text-slate-600 bg-slate-50 border-slate-200',
        error: 'text-red-700 bg-red-50 border-red-200',
    };
    const iconClass = {
        warn: 'text-amber-500',
        info: 'text-slate-400',
        error: 'text-red-500',
    };
    const dot = {
        warn: 'bg-amber-400',
        info: 'bg-slate-300',
        error: 'bg-red-500',
    };
    return (
        <div className={`mt-1.5 flex items-start gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold leading-5 ${styles[result.level] || styles.info}`}>
            <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${dot[result.level] || dot.info}`} />
            <span className={iconClass[result.level] || iconClass.info}>{result.message}</span>
        </div>
    );
};

export const inputBorderClass = (result) => {
    if (!result || result.level === 'success' || result.level === 'info') {
        return 'border-slate-200 focus:border-orange-500';
    }
    if (result.level === 'warn') return 'border-amber-300 focus:border-orange-500 bg-amber-50/40';
    if (result.level === 'error') return 'border-red-300 focus:border-orange-500 bg-red-50/40';
    return 'border-slate-200 focus:border-orange-500';
};

export const getValidationProfile = (resume) => {
    const info = resume?.personalInfo || {};
    const checks = [
        validateEmail(info.email),
        validatePhone(info.phone),
        validateLinkedIn(info.linkedin),
        validateGithub(info.github),
        validateUrl(info.website),
    ];
    const warnings = checks.filter((c) => c.level === 'warn').length;
    const filled = [info.fullName, info.email, info.phone].filter((v) => !isEmpty(v)).length;
    return { warnings, filled, totalContact: 3 };
};
