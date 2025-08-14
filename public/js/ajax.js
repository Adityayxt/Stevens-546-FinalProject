document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const skillId = this.dataset.skillId;
            const content = document.getElementById('commentInput').value;
            const errorDiv = document.getElementById('commentErrors');
            
            // Clear previous errors
            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '';
            
            try {
                const response = await fetch(`/skills/${skillId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    location.reload(); // Refresh to show new comment
                } else {
                    // Display validation errors
                    if (data.errors && data.errors.length > 0) {
                        errorDiv.innerHTML = data.errors.map(error => `<p>${error}</p>`).join('');
                        errorDiv.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error posting comment:', error);
                errorDiv.innerHTML = '<p>An error occurred while posting the comment. Please try again.</p>';
                errorDiv.style.display = 'block';
            }
        });
    }
});
