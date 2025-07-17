document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.querySelector('input[name="url"]');
    const resultContainer = document.getElementById('result-container');

    setTimeout(() => {
        if (resultContainer) resultContainer.innerHTML = '';
        urlInput.value = '';
        console.log('Cleared after 1 minute');
    }, 30000);
    // Form submission
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `url=${encodeURIComponent(url)}`
            });
            if (res.ok) {
                const html = await res.text();
                document.open();
                document.write(html);
                document.close();
                // Clear after 35 seconds (middle of 30-40s range)
                setTimeout(() => {
                    if (resultContainer) resultContainer.innerHTML = '';
                    urlInput.value = '';
                }, 350000);
            } else {
                alert('Failed to shorten URL');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Error submitting URL');
        }
    });

    // Delete functionality
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-btn')) {
            const historyItem = e.target.closest('.history-entry');
            const id = historyItem.getAttribute('data-id');
            console.log('Deleting ID:', id);
            try {
                const res = await fetch(`/delete/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (res.ok) {
                    historyItem.remove();
                    console.log('Delete success:', data.message);
                } else {
                    console.error('Delete failed:', data);
                    alert(`Delete failed: ${data.error}${data.details ? ' - ' + data.details : ''}`);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('Delete failed: Network error');
            }
        }
    });
});