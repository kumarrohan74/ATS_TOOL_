export function getInitials(fullName) {
    const words = fullName.split(' ');
    const initials = words.map(word => word[0].toUpperCase()).join('');
    return initials;
}