export const SHOP_PHONE_DISPLAY = "+92 300 1234567";
export const SHOP_PHONE_TEL = "+923001234567";
export const SHOP_EMAIL = "info@superideal.com";

export const branches = [
  {
    id: "saddar-road",
    name: "Saddar Road Branch",
    short: "Saddar Road",
    address: "Saddar Road, Faisalabad",
    hours: "9:00 AM – 10:00 PM",
    image: "/assets/home/si-branch-saddar.png",
    summary:
      "The address on our contact line. Sweets, bakery, biscuits, and gift boxes at the counter.",
  },
  {
    id: "d-ground",
    name: "D Ground Branch",
    short: "D Ground",
    address: "D Ground, Faisalabad",
    hours: "9:00 AM – 11:00 PM",
    image: "/assets/home/si-branch-dground.png",
    summary:
      "Open later in the evening. The same counter of sweets, bakery, and celebration cakes.",
  },
  {
    id: "clock-tower",
    name: "Clock Tower Branch",
    short: "Clock Tower",
    address: "Clock Tower, Faisalabad",
    hours: "8:00 AM – 10:00 PM",
    image: "/assets/home/si-branch-clock.png",
    summary:
      "Opens earlier in the morning. Fresh bakery and sweets from the first trays of the day.",
  },
];

export function directionsUrl(branch) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.address}`)}`;
}
