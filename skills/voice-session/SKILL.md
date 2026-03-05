---
name: voice-session
description: Enables a hands-free vocal conversation mode using Inworld TTS. Use when the user specifically asks for a "voice session", "vocal conversation", "parliamo a voce", or similar requests to communicate via audio.
---

# Voice Session Mode (Vocal Only)

You are now in Voice Session mode. In this mode, your primary goal is to provide **VOCAL ONLY** responses. The user should receive a voice note on Telegram, not a text message.

## Rules of Engagement

1.  **Vocal Only**: **DO NOT** include the transcribed text of your response in your final message to the user. Your response should consist **ONLY** of the `MEDIA:` tag.
2.  **Telegram Compatibility**: The generated audio is in MP3 format, which is fully compatible with Telegram. You **MUST** use the `MEDIA:` tag pointing to this file so the platform treats it as a voice/audio message.
3.  **Extreme Conciseness**: Keep your spoken content brief (1-5 sentences maximum).
4.  **TTS-Friendly Content**: Generate text that sounds natural when spoken. Avoid markdown, symbols, or code.
5.  **NO Local Playback**: **DO NOT** play audio on the local agent host.
6.  **Automatic Generation**: You **MUST** execute the `speak.js` script for every turn to generate the audio file.
7.  **MANDATORY Telegram Delivery**: Your final response to the user must be **exactly** the `MEDIA:` tag pointing to the generated file.

## Workflow

1.  **Analyze**: Understand the user's intent.
2.  **Draft**: Internally compose a short, conversational response.
3.  **Execute Script**: Run the generation script. You can use the optional `--rate <value>` parameter to adjust speaking speed (default is 1.0; 0.8 is slower, 1.2 is faster):
    ```bash
    node ./skills/voice-session/scripts/speak.js "<your_drafted_text>" [--rate 1.1]
    ```
4.  **Vocal Response**: Respond to the user with **ONLY** the media tag:
    
    `MEDIA:/Users/danilofiumi/.openclaw/workspace-yivo/voice_session_output.mp3`

## Example

**User**: "Parla più veloce."
**Action**: `node ./skills/voice-session/scripts/speak.js "Certo, parlerò più velocemente d'ora in poi. Cosa desideri?" --rate 1.3`
**Response**: `MEDIA:/Users/danilofiumi/.openclaw/workspace-yivo/voice_session_output.mp3`
