let selectedMood = null;
const moodButtons = document.querySelectorAll('.mood-btn');

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.style.opacity = '0.5');
        button.style.opacity = '1';
        selectedMood = button.dataset.mood;
    });
});
const saveBtn = document.getElementById('save-btn');
const journalInput = document.getElementById('journal-input');

saveBtn.addEventListener('click', async () => { 
    const text = journalInput.value.trim();

    if (!selectedMood) {
        alert('pick a mood first 🌸');
        return;
    }

    if (!text) {
        alert('write something first 🌸');
        return;
    }

    const entry = {
        mood: selectedMood,
        text: text,
        date: new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };

    saveEntry(entry);
    journalInput.value = '';
    selectedMood = null;
    moodButtons.forEach(btn => btn.style.opacity = '1');
});

async function saveEntry(entry) {
    await fetch('http://localhost:3000/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    displayEntries();
}
async function displayEntries() {
    const response = await fetch('http://localhost:3000/entries');
    const entries = await response.json();
    const feed = document.getElementById('entries-feed');
    feed.innerHTML = '<h2>your past dumps</h2>';

    entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `
            <div class="entry-mood">${entry.mood}</div>
            <div class="entry-date">${entry.date}</div>
            <div class="entry-text">${entry.text}</div>
        `;
        feed.appendChild(card);
    });
}

displayEntries();