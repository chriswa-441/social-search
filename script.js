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
    const allExtracted = []; // 收集所有链接

    for (const site of sites) {
        const query = `"${input}" site:${site}`;
        const apiUrl = `https://s.jina.ai/${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiUrl, {
                headers: { 'Accept': 'text/event-stream' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();

            // 提取链接
            const urls = data.match(/https?:\/\/(www\.)?[^/\s\)]+\/[^\s\)]+/g) || [];
            const filteredUrls = urls.filter(url => url.includes(site) && !url.includes('jina.ai'));
            const uniqueUrls = [...new Set(filteredUrls.slice(0, 3))];

            uniqueUrls.forEach(url => {
                allExtracted.push({ site, url }); // 收集
            });
        } catch (error) {
            console.error(`Error for ${site}:`, error);
            // 不添加失败项，只收集成功
        }
    }

    // 清空加载提示，罗列所有链接
    resultsDiv.innerHTML = '';
    if (allExtracted.length === 0) {
        resultsDiv.innerHTML = '<p>未找到任何链接，请检查网络或 API。</p>';
    } else {
        allExtracted.forEach(link => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `<strong>${link.site}</strong><a href="${link.url}" target="_blank">${link.url}</a>`;
            resultsDiv.appendChild(item);
        });
    }
}
