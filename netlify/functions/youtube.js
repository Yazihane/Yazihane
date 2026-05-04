const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

exports.handler = async function (event, context) {
  const CHANNEL_ID = 'UCWIVVrwLawJX7AGQo0qJeow'; 
  const qs = event.queryStringParameters || {};
  const videoId = (qs.id || '').trim();

  const bestThumb = (thumbs = {}) =>
    thumbs.maxres?.url || thumbs.standard?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || '';

  const mapVideoItem = (item) => {
    const sn = item.snippet || {};
    return {
      videoId: item.id?.videoId || item.id,
      title: sn.title || '',
      description: sn.description || '',
      channelTitle: sn.channelTitle || '',
      publishedAt: sn.publishedAt || '',
      thumbnailUrl: bestThumb(sn.thumbnails) || (item.id ? `https://i.ytimg.com/vi/${item.id?.videoId || item.id}/hqdefault.jpg` : ''),
    };
  };

  try {
    if (videoId) {
      const videosResp = await youtube.videos.list({ part: 'snippet', id: videoId });
      const item = (videosResp.data.items || [])[0];
      if (!item) return { statusCode: 404, body: JSON.stringify({ message: 'Video bulunamadı.' }) };
      return { statusCode: 200, headers: { 'Cache-Control': 'public, max-age=600', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(mapVideoItem({ ...item, id: videoId })) };
    }

    const channelResponse = await youtube.channels.list({ part: 'contentDetails', id: CHANNEL_ID });
    
    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error(`Google API, bu Kanal ID'si için bir sonuç döndürmedi.`);
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    
    let allPlaylistItems = [];
    let nextPageToken = undefined;

    // YENİ EKLENEN KISIM: Tüm sayfaları sonuna kadar dolaşan döngü
    do {
        const playlistResponse = await youtube.playlistItems.list({ 
            playlistId: uploadsPlaylistId, 
            part: 'snippet', 
            maxResults: 50,
            pageToken: nextPageToken
        });
        allPlaylistItems.push(...(playlistResponse.data.items || []));
        nextPageToken = playlistResponse.data.nextPageToken;
    } while (nextPageToken);

    const rawItems = allPlaylistItems.filter(it => it?.snippet?.title !== 'Private video' && it?.snippet?.resourceId?.videoId);
    const ids = rawItems.map(it => it.snippet.resourceId.videoId);
    
    let detailed = [];
    if (ids.length) {
        // YENİ EKLENEN KISIM: 50'den fazla ID'yi gruplar (chunk) halinde API'ye sormak
        for (let i = 0; i < ids.length; i += 50) {
            const chunk = ids.slice(i, i + 50);
            const detailsResp = await youtube.videos.list({ part: 'snippet', id: chunk.join(',') });
            const chunkMapped = (detailsResp.data.items || []).map(mapVideoItem);
            detailed.push(...chunkMapped);
        }
    }

    if (!detailed.length) {
        detailed = rawItems.map(it => {
            const sn = it.snippet || {};
            return {
                videoId: sn.resourceId.videoId,
                title: sn.title || '',
                description: sn.description || '', 
                channelTitle: sn.channelTitle || '',
                publishedAt: sn.publishedAt || '',
                thumbnailUrl: bestThumb(sn.thumbnails) || `https://i.ytimg.com/vi/${sn.resourceId.videoId}/hqdefault.jpg`,
            };
        });
    }

    const order = new Map(ids.map((id, i) => [id, i]));
    detailed.sort((a, b) => (order.get(a.videoId) ?? 0) - (order.get(b.videoId) ?? 0));

    return { 
        statusCode: 200, 
        headers: { 
            'Cache-Control': 'public, max-age=1800',
            'Access-Control-Allow-Origin': '*' // CORS problemleri ihtimaline karşı zırh
        }, 
        body: JSON.stringify(detailed) 
    };
  } catch (error) {
    console.error('Fonksiyon Hatası:', error);
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ message: "YouTube hatası", errorDetails: error.toString() }) };
  }
};
