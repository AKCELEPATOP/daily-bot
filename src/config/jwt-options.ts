export default {
    secret: process.env.APP_KEY,
    signOptions: {
        expiresIn: '7d',
    },
};
