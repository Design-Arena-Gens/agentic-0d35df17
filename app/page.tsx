"use client";
import { useCallback, useRef, useState } from 'react';

export default function Page() {
  const [playKey, setPlayKey] = useState(0);
  const reelRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const replay = useCallback(() => {
    setPlayKey((k) => k + 1);
    setDownloadUrl(null);
  }, []);

  const recordFiveSeconds = useCallback(async () => {
    if (!reelRef.current) return;
    // Restart animations for a fresh take
    setPlayKey((k) => k + 1);
    setDownloadUrl(null);

    const stream = (reelRef.current as any).captureStream?.(30) as MediaStream | undefined;
    if (!stream) {
      alert('Recording not supported in this browser.');
      return;
    }

    const recordedChunks: Blob[] = [];
    const mime = 'video/webm;codecs=vp9,opus';
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
    } catch {
      try {
        recorder = new MediaRecorder(stream);
      } catch (e) {
        alert('MediaRecorder not available.');
        return;
      }
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setRecording(false);
    };

    setRecording(true);
    recorder.start();
    // Stop exactly at 5s
    setTimeout(() => recorder.stop(), 5000);
  }, []);

  return (
    <main className="page">
      <h1 className="sr-only">Web Design Studio Reel</h1>

      <div className="controls">
        <button className="btn" onClick={replay} disabled={recording}>Replay</button>
        <button className="btn primary" onClick={recordFiveSeconds} disabled={recording}>
          {recording ? 'Recording?' : 'Record 5s (WebM)'}
        </button>
        {downloadUrl && (
          <a className="btn" href={downloadUrl} download="studio-reel.webm">Download</a>
        )}
      </div>

      <div key={playKey} className="reel-wrapper">
        <div ref={reelRef} className="reel" aria-label="Animated 9:16 reel">
          {/* SCENE 1 (0-1s) */}
          <section className="scene scene1">
            <div className="label">Client:</div>
            <div className="bubble happy">I want a simple website!</div>
            <div className="char client" aria-hidden>??</div>
          </section>

          {/* SCENE 2 (1-3s) chaotic montage */}
          <section className="scene scene2" aria-hidden>
            <div className="overlay-text">Also client: Add animations, 3D, booking, payment, app? everything.</div>
            {/* Stacking UI cards */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`card c${i+1}`}>UI</div>
            ))}
            {/* Flying code lines */}
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className={`code l${i+1}`}>{'<'}/>{'{?}'}</div>
            ))}
            {/* Many tabs */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`tab t${i+1}`}>tab{i+1}</div>
            ))}
            <div className="zoom-punch" />
          </section>

          {/* SCENE 3 (3-5s) */}
          <section className="scene scene3">
            <div className="char designer" aria-hidden>???</div>
            <div className="bubble calm">Sure? simple.</div>
          </section>

          {/* END CARD (~4.4-5s) */}
          <div className="endcard">Web design studio life ?? | @six.solutions</div>
        </div>
      </div>

      <footer className="meta">Best viewed in Chrome for recording. Exports WebM.</footer>
    </main>
  );
}
