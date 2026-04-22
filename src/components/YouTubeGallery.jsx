import React, { useState, useEffect } from 'react';

function YouTubeGallery() {
  const [shorts, setShorts] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        if (!API_KEY) {
          throw new Error("API 키 없음");
        }

        // channelId → uploads playlistId 변환 (UC → UU)
        const playlistId = "UUAGeAW20MJMXIXWPNLvr0cQ";

        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${playlistId}&key=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.items) {
          throw new Error("유튜브 데이터 없음");
        }

        const shortsArr = [];
        const vodsArr = [];

        data.items.forEach((item) => {
          const videoId = item.snippet.resourceId.videoId;
          const title = item.snippet.title;
          const thumbnail = item.snippet.thumbnails.medium.url;
          const date = new Date(item.snippet.publishedAt).toLocaleDateString();
          const link = `https://www.youtube.com/watch?v=${videoId}`;

          // 간단 Shorts 판별 (제목 기준)
          const isShort =
            title.toLowerCase().includes("short") ||
            title.includes("#쇼츠") ||
            title.includes("#shorts");

          const videoData = {
            id: videoId,
            title,
            thumbnail,
            date,
            link,
          };

          if (isShort) shortsArr.push(videoData);
          else vodsArr.push(videoData);
        });

        setShorts(shortsArr);
        setVods(vodsArr);
      } catch (err) {
        console.error(err);
        setError("영상 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        영상을 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        잠시 후 다시 시도해주세요.
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 숏츠 */}
      {shorts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최신 숏츠
          </h3>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
            {shorts.map((short) => (
              <a key={short.id} href={short.link} target="_blank" rel="noreferrer">
                <div style={{ width: '140px' }}>
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <p style={{ fontSize: '0.8rem' }}>{short.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* VOD */}
      {vods.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최근 방송
          </h3>

          {vods.map((vod) => (
            <a key={vod.id} href={vod.link} target="_blank" rel="noreferrer">
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={vod.thumbnail}
                  alt={vod.title}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <p>{vod.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{vod.date}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default YouTubeGallery;
