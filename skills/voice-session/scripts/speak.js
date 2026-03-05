import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// If you want to use dotenv with Node, uncomment the following:
// import dotenv from 'dotenv';
// dotenv.config({ path: path.join(path.dirname(new URL(import.meta.url).pathname), '../.env') });

const KEY = process.env.INWORLD_KEY;
const SECRET = process.env.INWORLD_SECRET;

if (!KEY || !SECRET) {
    console.error('Error: INWORLD_KEY and INWORLD_SECRET are required.');
    process.exit(1);
}

function cleanText(text) {
    return text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`.*?`/g, '')         // Remove inline code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Simplify links
        .replace(/[#*_]/g, '')         // Remove basic markdown
        .trim();
}

async function speak(text, options = {}) {
    const { useBase64 = false, rate = 1 } = options;
    const cleaned = cleanText(text);
    if (!cleaned) {
        if (useBase64) process.exit(1);
        return;
    }

    const url = 'https://api.inworld.ai/tts/v1/voice';
    const auth = Buffer.from(`${KEY}:${SECRET}`).toString('base64');

    const payload = {
        text: cleaned,
        voiceId: 'Orietta',
        modelId: 'inworld-tts-1.5-max',
        speakingRate: rate,
        audioConfig: { audioEncoding: 'MP3' }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`TTS Error: ${response.status}`);
            if (useBase64) process.exit(1);
            return;
        }

        const json = await response.json();
        if (useBase64) {
            console.log(json.audioContent);
        } else {
            const buffer = Buffer.from(json.audioContent, 'base64');
            const filePath = path.join(process.cwd(), 'voice_session_output.mp3');
            fs.writeFileSync(filePath, buffer);

            console.log(`Audio generated: MEDIA:${filePath}`);
        }
    } catch (err) {
        console.error('Error in speak script:', err);
        if (useBase64) process.exit(1);
    }
}

const args = process.argv.slice(2);
const useBase64 = args.includes('--base64');

let rate = 1.0;
const rateIndex = args.indexOf('--rate');
if (rateIndex !== -1 && args[rateIndex + 1]) {
    rate = parseFloat(args[rateIndex + 1]);
}

const input = args
    .filter((arg, i) => {
        if (arg === '--base64') return false;
        if (arg === '--rate') return false;
        if (i > 0 && args[i - 1] === '--rate') return false;
        return true;
    })
    .join(' ');

speak(input, { useBase64, rate });
