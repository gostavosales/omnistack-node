const axios = require('axios');
const Dev = require ('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index (request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store (request, response) {
        const { github_username, techs, latitude, longitude } =  request.body;

        let dev = await Dev.findOne({ github_username });

        if (dev) {
            return response.json(dev);
        }

        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
        const { name = login, avatar_url, bio } = apiResponse.data;
    
        const techsArray = parseStringAsArray(techs);
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
    
        dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        });
    
        return response.json(dev);
    },

    async update(request, response) {
        const { github_username } =  request.params;
        const { name, avatar_url, bio, longitude, latitude, techs } =  request.body;

        let techsArray = [];
        if (techs) {
            techsArray = parseStringAsArray(techs);
        }

        const location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };

        const dev = await Dev.updateOne({
            github_username,
            $set: {
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            }
        });

        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } =  request.params;

        const resp = await Dev.deleteOne({
            github_username
        });

        return response.json(resp);
    }
}