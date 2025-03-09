export const SUBJECTS = [
  //   "ASP",
  //   "NA",
  //   "LD",
  //   "SP",
  //   "RPR",
  //   "OBP",
  "RA",
  "OOAD",
  "CCI",
  "RMA",
  "ORM",
  "AFJ",
  "DPS",
  "US",
] as const;

export const DAYS = ["Pon", "Uto", "Sri", "Cet", "Pet"] as const;

export const TIMES = (() => {
  const times: string[] = [];
  for (let i = 0; i < 22; i++) {
    const hour = Math.floor(i / 2) + 8;
    const minutes = i % 2 === 0 ? "30" : "00";
    const nextHour = i % 2 === 1 ? hour + 1 : hour;
    if (nextHour <= 19) {
      times.push(`${nextHour.toString().padStart(2, "0")}:${minutes}`);
    }
  }
  return times;
})();
