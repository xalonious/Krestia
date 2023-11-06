module.exports = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 11; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
        }
    return result;
}