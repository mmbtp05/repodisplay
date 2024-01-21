const usernameElement = document.getElementById('username');
const bioElement = document.getElementById('bio');
const followersElement = document.getElementById('followers');
const followingElement = document.getElementById('following');
const reposElement = document.getElementById('repos');
const paginationElement = document.getElementById('pagination');
const loadingElement = document.getElementById('loading');
const avatarElement = document.getElementById('avatar');
const perPageForm = document.getElementById('perPageForm');
const perPageSelect = document.getElementById('perPage');

let currentPage = 1;
let itemsPerPage = 10;

async function fetchRepos(page,itemsPerPage) {
    try {
        const response = await fetch(`https://server-pxer.onrender.com/repos?page=${page}&perPage=${itemsPerPage}`);
        const { paginatedRepos, totalRepos } = await response.json();
        showLoading();
        displayRepos(paginatedRepos);
        createPagination(totalRepos,itemsPerPage);
    } catch (error) {
        console.error('Error fetching user information:', error);
    }
}

async function displayUser(username){
    const response = await fetch(`https://server-pxer.onrender.com/userInfo`);
    const { user } = await response.json();
    
    avatarElement.innerHTML = `<img src=${user.avatar_url} width="400" height="400"/>`;
    usernameElement.textContent = user.name || user.login;
    bioElement.textContent = user.bio || 'No bio available';
    followersElement.textContent = user.followers;
    followingElement.textContent = user.following;
}

function displayRepos(repos) {
    reposElement.innerHTML = '';
    showLoading('block');
    repos.forEach((repo) => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repo-info';
        repoDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <p><strong>Language: </strong> ${repo.language || 'Not specified'}</p>
            <p><strong>Stars: </strong> ${repo.stargazers_count}</p>
            <p><strong>Topics: </strong>${repo.topics.join(', ')}</p>
        `;
        reposElement.appendChild(repoDiv)
    });
    showLoading()
}

function pageChange(i,itemsPerPage) {
    fetchRepos(i,itemsPerPage)
    reposElement.innerHTML = '';
    showLoading('block');
}

function createPagination(totalRepos,itemsPerPage) {
    const totalPages = Math.ceil(totalRepos / itemsPerPage);

    paginationElement.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => pageChange(i,itemsPerPage));
        paginationElement.appendChild(button);
    }
}

function showLoading(isLoading) {
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

perPageForm.addEventListener('submit', (event) => {
    reposElement.innerHTML='';
    event.preventDefault();
    itemsPerPage = parseInt(perPageSelect.value,10);
    showLoading('block');
    fetchRepos(currentPage, itemsPerPage);
});

// Initial fetch and display
displayUser();
fetchRepos(currentPage,itemsPerPage);
