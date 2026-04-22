import React, { useState, useEffect } from 'react';

function YouTubeGallery() {
  const [shorts, setShorts] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const channelId = 'UCAGeAW20MJMXIXWPNLvr0cQ';
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${rssUrl}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('피드를 불러오는데 실패했습니다.');
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const entries = Array.from(xml.querySelectorAll('entry'));
        
        const items = entries.map(entry => ({
          link: entry.querySelector('link')?.getAttribute('href') || '',
          title: entry.querySelector('title')?.textContent || '',
          pubDate: entry.querySelector('published')?.textContent || '',
        }));
        
        const checkThumbnail = (videoId) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              // 숏츠 썸네일은 120x90이지만 실제로는 검은 여백 포함 320x180
              // YouTube 숏츠는 hqdefault가 가로형이지만 mqdefault가 세로형
              // 숏츠 판별: 썸네일 비율이 세로형(높이 > 너비)이면 숏츠
              const isShort = img.naturalHeight > img.naturalWidth;
              resolve(isShort);
            };
            img.onerror = () => resolve(false);
            // mqdefault로 확인 (숏츠는 세로형으로 나옴)
            img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          });
        };

        const fetchedShorts = [];
        const fetchedVods = [];

        await Promise.all(
          items.map(async (item) => {
            const videoId = item.link.split('v=')[1];
            const isShort = await checkThumbnail(videoId);

            const videoData = {
              id: videoId,
              title: item.title,
              thumbnail: isShort
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              date: new Date(item.pubDate).toLocaleDateString(),
              link: item.link
            };

            if (isShort) {
              fetchedShorts.push(videoData);
            } else {
              fetchedVods.push(videoData);
            }
          })
        );

        // 날짜순 정렬
        fetchedShorts.sort((a, b) => new Date(b.date) - new Date(a.date));
        fetchedVods.sort((a, b) => new Date(b.date) - new Date(a.date));

        setShorts(fetchedShorts);
        setVods(fetchedVods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>영상을 불러오는 중...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>잠시 후 다시 시도해주세요.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {shorts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최신 숏츠
          </h3>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '1.25rem', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            {shorts.map(short => (
              <a key={short.id} href={short.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ flex: '0 0 auto', width: '140px', padding: '0', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                    <img src={short.thumbnail} alt={short.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: '0.8rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{short.title}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {vods.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최근 방송 (VOD)
          </h3>
          <div className="flex-col-gap">
            {vods.map(vod => (
              <a key={vod.id} href={vod.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
                  <div className="youtube-thumb-container" style={{ marginBottom: 0 }}>
                    <img src={vod.thumbnail} alt={vod.title} className="youtube-thumb-img" />
                  </div>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vod.title}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{vod.date}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {shorts.length === 0 && vods.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>최근 영상이 없습니다.</div>
      )}
    </div>
  );
}

export default YouTubeGallery;
