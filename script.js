let allLinks = [];

async function search() {
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
    resultsDiv.innerHTML = '<p>提取中...</p>';
    allLinks = [];

    for (const site of sites) {
        const query = `"${input}" site:${site}`;
        const apiUrl = `https://s.jina.ai/${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } }); // 优化为 JSON 如果支持
            const data = await response.text(); // Markdown 或 text

            // 提取 URL：匹配 http(s) 链接
            const urls = data.match(/https?:\/\/[^\s\)]+/g) || [];
            const filteredUrls = urls.filter(url => url.includes(site)); // 只取相关站点链接
            const uniqueUrls = [...new Set(filteredUrls.slice(0, 3))]; // 前3个唯一

            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `<strong>${site}</strong>`;
            if (uniqueUrls.length === 0) {
                item.innerHTML += '<p>未找到账号链接</p>';
            } else {
                uniqueUrls.forEach(url => {
                    item.innerHTML += `<a href="${url}" target="_blank">${url}</a>`;
                    allLinks.push({ site, url });
                });
            }
            resultsDiv.appendChild(item);
        } catch (error) {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `<strong>${site}</strong><p>提取失败</p>`;
            resultsDiv.appendChild(item);
        }
    }

    document.getElementById('download').style.display = 'block';
}

function downloadCSV() {
    if (allLinks.length === 0) {
        alert('无链接可下载！');
        return;
    }

    let csvContent = 'Site,URL\n';
    allLinks.forEach(link => {
        csvContent += `${link.site},"${link.url}"\n`; // 加引号处理特殊字符
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social_accounts.csv';
    a.click();
    URL.revokeObjectURL(url);
}
