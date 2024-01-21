const express = require('express');
const axios = require('axios');
var cors = require('cors')
require('dotenv').config({path: './.env'})
const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));

app.use(express.json());

app.use(cors())

app.get('/repos', async (req, res) => {
    try {

        var username = process.env.USERNAMEE;
        var token  = process.env.TOKEN;
        console.log(username)
        console.log(token);
        const userData = await fetchUserData(username, token);


        // Paginate the repositories
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 10; // Number of repositories per page
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const paginatedRepos = userData.slice(startIndex, endIndex);

        return res.send({
            paginatedRepos,
            totalRepos: userData.length,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/userInfo', async (req, res) => {
    try {
        let username = process.env.USERNAMEE;
        let token = process.env.TOKEN;
        const userPromise = await axios.get(`https://api.github.com/users/${username}`, { headers: { Authorization: `Bearer ${token}` } });
        return res.send({
            user: userPromise.data,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


async function fetchUserData(username, token) {
    try {
        const reposPromise = await axios.get(`https://api.github.com/users/${username}/repos`, { headers: { Authorization: `Bearer ${token}` } });
        const [reposData] = await Promise.all([reposPromise]);
        const repos = reposData.data;
        return repos;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Error fetching user data');
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
