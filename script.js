function search() {
    const input = document.getElementById('input').value.trim();
    if (!input) {
        alert('请输入公司域名！');
        return;
    }

    const sites = [
        'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com', 'youtube.com',
        'tiktok.com', 'pinterest.com', 'reddit.com', 'medium.com', 'github.com',
        'crunchbase.com', 'glassdoor.com', 'behance.net', 'dribbble.com',
        'slideshare.net', 'quora.com'
    ];

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    sites.forEach(site => {
        const query = encodeURIComponent(`"${input}" site:${site}`);
        const googleUrl = `https://www.google.com/search?q=${query}`;

        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
            <strong>${site}</strong><br>
            <a href="${googleUrl}" target="_blank">查看 ${site} 上的账号链接（支持多个）</a>
        `;
        resultsDiv.appendChild(item);
    });
}
