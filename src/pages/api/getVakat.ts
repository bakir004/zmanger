function getNextVakat(vakatTimes: string[]) {
  const vakatNames = [
    "Zora je u",
    "Izlazak sunca je u",
    "Podne je u",
    "Ikindija je u",
    "Akšam je u",
    "Jacija je u",
  ];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let count = 0;
  for (const time of vakatTimes) {
    const parts = time.split(":");
    if (parts.length !== 2) continue;

    const hours = parts[0] ? parseInt(parts[0], 10) : 0;
    const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

    const vakatMinutes = hours * 60 + minutes;

    if (vakatMinutes > currentMinutes)
      return { time: time, name: vakatNames[count] };
    count++;
  }

  return { time: vakatTimes[5], name: "Jacija je bila u" };
}

export default async function getVakat(req: any, res: any) {
  try {
    const response = await fetch("https://api.vaktija.ba/vaktija/v1/77", {
      method: "GET",
    });

    if (!response.ok) {
      return res.status(500).json({ message: "Error fetching users" });
    }

    const data: {
      id: string;
      lokacija: string;
      datum: string[];
      vakat: string[];
    } = await response.json();

    const { time, name } = getNextVakat(data.vakat);
    const result = {
      lokacija: data.lokacija,
      datum: data.datum[0],
      vakat: time,
      naziv: name,
    };

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}
