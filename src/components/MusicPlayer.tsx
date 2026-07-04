import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Music, Music4, Volume2, VolumeX } from "lucide-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface MusicPlayerProps {
  playRequested: boolean;
}

export default function MusicPlayer({ playRequested }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60); // Default volume 60%
  const [isMuted, setIsMuted] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerId = "hidden-youtube-player";

  // Muat naik YouTube IFrame API secara dinamik
  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
      return;
    }

    // Cari jika tag script sedia ada
    const existingScript = document.getElementById("youtube-iframe-api-script");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    // Set callback global
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Inisialisasi Player selepas API sedia
  useEffect(() => {
    if (!apiReady) return;

    try {
      playerRef.current = new window.YT.Player(playerContainerId, {
        height: "1",
        width: "1",
        videoId: "CnF6B2UJ3YA",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          loop: 1,
          playlist: "CnF6B2UJ3YA", // Untuk pengulangan (loop)
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            // Sekiranya jemputan sudah dibuka sebelum player sedia, teruskan main
            if (playRequested) {
              attemptPlay();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
        },
      });
    } catch (error) {
      console.error("Gagal menginisialisasi YouTube Player:", error);
    }
  }, [apiReady]);

  // Pantau arahan main apabila pengguna membuka jemputan
  useEffect(() => {
    if (playRequested && playerRef.current) {
      attemptPlay();
    }
  }, [playRequested]);

  const attemptPlay = () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.playVideo();
      // Tambahan sekiranya audio diblokir, un-mute dan set volume
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } catch (e) {
      console.error("Autoplay disekat:", e);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Gagal menukar status mainan muzik:", e);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
      if (val > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {
      console.error("Gagal menukar status senyap audio:", e);
    }
  };

  return (
    <>
      {/* Bekas YouTube Player yang disembunyikan */}
      <div className="absolute top-0 left-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <div id={playerContainerId}></div>
      </div>

      {/* Widget Kawalan Muzik Terapung (Hanya dipaparkan selepas jemputan dibuka) */}
      {playRequested && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-deep/90 border border-gold-muted/40 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl shadow-black/50 transition-all duration-300 hover:border-gold-bright">
          {/* Ikon Muzik Berputar ketika lagu dimainkan */}
          <button
            onClick={togglePlay}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gold-deep text-emerald-deep transition-all duration-300 cursor-pointer ${
              isPlaying ? "animate-spin-slow hover:scale-105" : "hover:scale-105 opacity-80"
            }`}
            title={isPlaying ? "Jeda Muzik" : "Main Muzik"}
          >
            {isPlaying ? <Music4 size={20} className="stroke-[2.5]" /> : <Music size={20} className="stroke-[2]" />}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-bright opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-bright"></span>
              </span>
            )}
          </button>

          {/* Pengawal Laras Bunyi (Volume) */}
          <div className="flex items-center gap-2 pr-1">
            <button
              onClick={toggleMute}
              className="text-gold-light hover:text-gold-bright transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 md:w-20 h-1 bg-emerald-mid rounded-lg appearance-none cursor-pointer accent-gold-muted focus:outline-none"
              style={{
                background: `linear-gradient(to right, #D1B168 0%, #D1B168 ${isMuted ? 0 : volume}%, #144E43 ${isMuted ? 0 : volume}%, #144E43 100%)`,
              }}
            />
            <span className="text-[10px] text-gold-light/70 font-mono w-6 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
      )}
    </>
  );
}
