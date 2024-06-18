function searchArtist() {
    const query = document.getElementById('search-bar').value;
    fetch(`/search?artist=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';

            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            } else {
                data.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.innerHTML = `<strong>${item.artist}</strong> - ${item.stage} - ${item.time}`;
                    resultsContainer.appendChild(resultItem);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}
