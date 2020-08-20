const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

// inclusive
const randomIntInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);
const randomSelection = options => options[Math.floor(Math.random() * options.length)];

const data = [];
for (let i = 1; i <= 1000; i++) {
  data.push({
    'Thumbnail': '',
    'Filename': `Video ${i}.mp4`,
    'Description': '',
    'Stream Type': randomSelection(['SPTS', 'MPTS']),
    'File Format': randomSelection(['Transport Stream', 'MP4', 'MXF']),
    'Resolution': randomSelection(['1920x1080', '1280x720']),
    'Codec': randomSelection(['H.264', 'MPEG-4', 'MPEG-2', 'HEVC']),
    'Aspect Ratio': randomSelection(['4:3', '16:9']),
    'Video Bitrate': randomIntInRange(500, 2000), // kbps
    'Video Type': randomSelection(['interlaced', 'progressive', 'switches']),
    'Pixel Format': randomSelection(['420', '422', '8-bit', '10-bit']),
    'Frame Rate': randomIntInRange(10, 60), // fps
    "Filepath": `/path/to/file/`,
    'IP Address': '127.0.0.1',
    '# of B-frames': 10,
    '# of Pyramidal B-frames': 10,
    '# of Audio Streams': 2,
    'Audio Codec(s)': '',
    'Audio Bitrate': randomIntInRange(500, 2000), // kbps
    'Audio Channels': '5.1',
    'Audio Language': '',
    'SCTE35': '',
    'SCTE27': '',
    'Subtitles': '',
  });
}

const numFieldsToLock = 14;
const fields = Object.entries(data[0]).map(([key, value], index) => ({
  key,
  type: key === 'Thumbnail' ? 'image' : typeof value,
  locked: index < numFieldsToLock
}));

async function main() {
  await client.connect();
  const db = client.db('content-database');
  await db.collection('videos').insertMany(data);
  await db.collection('fields').deleteMany({})
  await db.collection('fields').insertOne({ fields });
  await client.close();
}

main();
