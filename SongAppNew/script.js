const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiURL = "https://api.lyrics.ovh";

// form.addEventListener("submit", e => {
//     e.preventDefault();
//     const searchValue = search.value.trim();

//     if (!searchValue) {
//         alert("Please type something");
//     } else {
//         displayUserMessage(searchValue);
//         beginSearch(searchValue);
//         search.value = '';
//     }
// });
form.addEventListener("submit", e => {
    e.preventDefault();
    const searchValue = search.value.trim();

    if (!searchValue) {
        alert("Please type something");
        return;
    }

    displayUserMessage(searchValue);

    if (searchValue.toLowerCase() === "name") {
        displayBotMessage("This app was created by Izhaan & Rishab 🎉");
    } else {
        beginSearch(searchValue);
    }

    search.value = '';
});


function displayUserMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('user-message');
    msg.innerText = text;
    result.appendChild(msg);
    scrollToBottom();
}

function displayBotMessage(text) {
    const msg = document.createElement('div');
    msg.classList.add('bot-message');
    msg.innerHTML = text;
    result.appendChild(msg);
    scrollToBottom();
}

function scrollToBottom() {
    result.scrollTop = result.scrollHeight;
}

async function beginSearch(searchValue) {
    try {
        const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
        const data = await searchResult.json();

        if (data.data.length === 0) {
            displayBotMessage("No results found.");
            return;
        }

        const songsList = data.data.slice(0, 5).map(song =>
            `<div>
                <strong>${song.artist.name}</strong> - ${song.title}
                <br><button class="get-lyrics-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
            </div>`
        ).join('<br>');

        displayBotMessage(songsList);
    } catch (error) {
        displayBotMessage("Oops! Something went wrong. Try again.");
    }
}

result.addEventListener('click', e => {
    if (e.target.classList.contains('get-lyrics-btn')) {
        const artist = e.target.getAttribute('data-artist');
        const songTitle = e.target.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});

async function getLyrics(artist, songTitle) {
    try {
        const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
        const data = await res.json();

        if (!data.lyrics) {
            displayBotMessage("Lyrics not found 😞");
            return;
        }

        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        displayBotMessage(`<strong>${artist} - ${songTitle}</strong><br>${lyrics}`);
    } catch {
        displayBotMessage("Couldn't fetch lyrics.");
    }
}
