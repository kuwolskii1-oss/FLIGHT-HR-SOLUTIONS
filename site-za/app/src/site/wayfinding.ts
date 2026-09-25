import type { PictogramName } from "@/components/site/Pictogram";

/**
 * Which wayfinding pictogram signs which thing. UI configuration, not content: the content files
 * stay free of presentation. Keys are the stable door slugs and section ids, and item titles where
 * the content has no id. Anything unmapped simply shows no pictogram.
 */
export const DOOR_PICTO: Record<string, PictogramName> = {
  engines: "settings",
  "engine-360": "settings",
  aircraft: "airplane-mode",
  parts: "tools",
  charter: "departure",
  advisory: "conference-room",
  about: "information-desk-symbol",
  contact: "chat",
};

export const SECTION_PICTO: Record<string, PictogramName> = {
  // engines
  status: "paper",
  llp: "time",
  "shop-visits": "tools",
  reserves: "money",
  "lease-return": "arrival",
  "sales-leasing": "currency-exchange",
  // aircraft
  buy: "shop",
  sell: "money",
  "dry-lease": "paper",
  acmi: "wear-headset",
  management: "settings",
  // parts
  categories: "luggage-conveyor-belt",
  aog: "alarm-bell",
  // charter
  corporate: "lounge",
  group: "meeting-point",
  government: "museum",
  cargo: "luggage-trolley",
  // advisory
  fleet: "calendar",
  "due-diligence": "search",
  recovery: "right-angle-arrow",
  tenders: "send",
};

export const ITEM_PICTO: Record<string, PictogramName> = {
  // home: what you can check
  Verification: "search",
  Process: "stairs",
  Group: "globe",
  "Company details": "passports",
  // parts: what we verify
  Traceability: "map",
  "Release documentation": "paper",
  "Certification status": "police",
  "Incident and accident history": "alert-triangle",
  "Remaining life": "time",
  // about: commitments
  "We arrange, coordinate and advise": "conference-room",
  "Careful wording": "chat",
  "Verification before claims": "search",
  "NDA before records": "lock",
  "Licensed operators": "police",
  "Personal information under POPIA": "fingerprint-scan",
  // about: who we serve
  "Airlines, operators and MROs": "airplane-mode",
  "Owners, lessors and investors": "bank",
  Government: "museum",
  "Charter clients": "departure",
  // engine 360: what it is meant to do
  "Engine intelligence": "settings",
  Status: "paper",
  Exposure: "money",
};
