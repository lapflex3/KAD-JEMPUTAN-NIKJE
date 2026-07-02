export interface RSVP {
  id: string;
  name: string;
  status: "hadir" | "tidak_hadir" | "belum_pasti";
  pax: number;
  wishes: string;
  createdAt: string;
}

export interface AturCaraItem {
  time: string;
  title: string;
  description?: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
  relation: string;
}

export interface EventDetails {
  title: string;
  honoree: string;
  date: string; // E.g., "Sabtu, 15 Ogos 2026"
  time: string; // E.g., "11:30 Pagi - 4:00 Petang"
  venue: string; // E.g., "Dewan Besar Seri Kasih, Putrajaya"
  address: string; // Full address for copy/maps
  mapsUrl: string; // Google Maps Link
  wazeUrl: string; // Waze Link
  countdownTarget: string; // ISO date string or similar for countdown calculations
}
