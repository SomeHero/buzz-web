var config = {
    mongo_URI : process.env.MONGO_URI,
    api_url : process.env.API_URL,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    twitter: {
        client_id : process.env.TWITTER_API_KEY,
        client_secret : process.env.TWITTER_SECRET,
    }
};

module.exports = config;