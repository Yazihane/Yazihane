const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

exports.handler = async function (event, context) {
  // İŞTE HATA BURADAYDI! BURAYI YAZIHANE'NİN KANAL ID'Sİ İLE DEĞİŞTİRDİK.
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
      thumbnailUrl: bestThumb(sn.thumbnails) || (item.id ? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` : ''),
    };
  };

  try {
    if (videoId) {
      const videosResp = await youtube.videos.list({ part: 'snippet', id: videoId });
      const item = (videosResp.data.items || [])[0];
      if (!item) return { statusCode: 404, body: JSON.stringify({ message: 'Video bulunamadı.' }) };
      return { statusCode: 200, headers: { 'Cache-Control': 'public, max-age=600' }, body: JSON.stringify(mapVideoItem({ ...item, id: videoId })) };
    }

    const channelResponse = await youtube.channels.list({ part: 'contentDetails', id: CHANNEL_ID });
    
    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error(`Google API, bu Kanal ID'si için bir sonuç döndürmedi.`);
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    const playlistResponse = await youtube.playlistItems.list({ playlistId: uploadsPlaylistId, part: 'snippet', maxResults: 50 });

    const rawItems = (playlistResponse.data.items || []).filter(it => it?.snippet?.title !== 'Private video' && it?.snippet?.resourceId?.videoId);
    const ids = rawItems.map(it => it.snippet.resourceId.videoId);
    
    let detailed = [];
    if (ids.length) {
        const detailsResp = await youtube.videos.list({ part: 'snippet', id: ids.join(',') });
        detailed = (detailsResp.data.items || []).map(mapVideoItem);
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

    return { statusCode: 200, headers: { 'Cache-Control': 'public, max-age=1800' }, body: JSON.stringify(detailed) };
  } catch (error) {
    console.error('Fonksiyon Hatası:', error);
    return { statusCode: 500, body: JSON.stringify({ message: "YouTube hatası", errorDetails: error.toString() }) };
  }
};