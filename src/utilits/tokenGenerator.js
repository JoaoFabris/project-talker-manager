const ALPHA_NUMBER = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const size = 16;

const randomNumber = () => Math.floor(Math.random() * ALPHA_NUMBER.length - 0);

const tokenGenerator = () => {
    let token = '';
    for (let i = 0; i < size; i += 1) {
        token += ALPHA_NUMBER[randomNumber()];
    }
    return token;
};

module.exports = tokenGenerator;