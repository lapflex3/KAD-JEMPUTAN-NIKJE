import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // ISO string or parsable date
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Minit", value: timeLeft.minutes },
    { label: "Saat", value: timeLeft.seconds },
  ];

  if (timeLeft.isExpired) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-emerald-deep/40 border border-gold-muted/30 rounded-2xl backdrop-blur-sm max-w-md mx-auto text-center">
        <span className="font-display text-xl text-gold-bright tracking-wide animate-pulse">
          MAJLIS SEDANG BERLANGSUNG / TELAH SELESAI
        </span>
        <p className="text-xs text-gold-light/75 mt-1 font-sans">
          Terima kasih atas doa dan kehadiran anda!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="text-center mb-4">
        <span className="text-xs md:text-sm font-sans tracking-[0.2em] text-gold-muted uppercase font-medium">
          Menghitung Hari Majlis
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4 justify-center">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center bg-emerald-deep/70 border border-gold-muted/30 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl backdrop-blur-sm"
          >
            {/* Hiasan Bucu Gold */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-gold-bright/50"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-gold-bright/50"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-gold-bright/50"></div>
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-gold-bright/50"></div>

            <span className="font-display text-2xl md:text-4xl font-bold text-gold-bright font-mono">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] md:text-xs font-sans text-gold-light/80 uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
