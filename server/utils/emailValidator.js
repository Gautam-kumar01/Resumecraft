
const bannedDomains = [
    'temp-mail.org',
    'tempmail.plus',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'dispostable.com',
    'getairmail.com',
    'maildrop.cc',
    'mintemail.com',
    'trbvm.com',
    'sharklasers.com',
    'yopmail.com'
];

const isTempMail = (email) => {
    const domain = email.split('@')[1];
    return bannedDomains.some(banned => domain.includes(banned));
};

module.exports = { isTempMail };
