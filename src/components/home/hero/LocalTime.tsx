import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

export default function LocalTime() {
  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const timer = setInterval(
      () => setTime(formatter.format(new Date())),
      15000
    );
    return () => clearInterval(timer);
  }, []);

  return <span className="tabular-nums">{time} IST</span>;
}
