import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "node-edge-tts";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Configure Edge TTS for Korean
    const tts = new EdgeTTS({
      voice: "ko-KR-SunHiNeural", // High-quality Korean female voice
      lang: "ko-KR",
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
    });

    // Create a temporary file path
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

    // Generate the audio file
    await tts.ttsPromise(text, tempFilePath);

    // Read the generated file into a buffer
    const audioBuffer = await fs.readFile(tempFilePath);

    // Clean up the temporary file
    await fs.unlink(tempFilePath).catch(console.error);

    // Return the audio buffer as a streamable MP3
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="dictation.mp3"`,
        "Cache-Control": "no-store", // Prevents nasty caching issues during live reads
      },
    });
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate TTS audio" }, { status: 500 });
  }
}
