/* eslint-disable */
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

type ServerInfo = {
  "CPU op-mode(s)": string;
  Architecture: string;
  "CPU(s)": string;
  "Thread(s) per core": string;
  "Model name": string;
  "CPU MHz": string;
  Memory: string;
};

export default function ServerInfoCard() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getServerInfo() {
      try {
        const response = await fetch("/api/getServerInfo");

        if (!response.ok) {
          throw new Error("Error fetching data from backend");
        }

        const data = await response.json();
        const cpuInfo: ServerInfo = {
          Architecture: data.Architecture,
          "CPU(s)": data["CPU(s)"],
          "Thread(s) per core": data["Thread(s) per core"],
          "CPU op-mode(s)": data["CPU op-mode(s)"],
          "Model name": data["Model name"],
          "CPU MHz": data["CPU MHz"],
          Memory: data.Mem,
        };

        setServerInfo(cpuInfo);
      } catch (error) {
        console.error("Error fetching server info:", error);
        setOnline(false);
      } finally {
        setLoading(false);
      }
    }
    console.log(serverInfo);
    void getServerInfo();
  }, []);
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <CardTitle className="mb-2 flex items-center gap-4">
          <p>Server</p>
          {loading ? (
            <span className="flex rounded bg-orange-500/30 px-1.5 text-sm text-orange-500">
              • Loading
            </span>
          ) : online ? (
            <span className="flex rounded bg-green-500/30 px-1.5 text-sm text-green-500">
              • Online
            </span>
          ) : (
            <span className="flex rounded bg-red-500/20 px-1.5 text-sm text-red-500">
              • Offline
            </span>
          )}
        </CardTitle>
        <div className="flex flex-col items-center justify-center gap-1">
          {serverInfo ? Object.keys(serverInfo).map((key, i) => (
            <div className="grid grid-cols-2 gap-2" key={i}>
              <span className="text-right text-slate-400">{key}</span>
              <span className="">{serverInfo[key as keyof ServerInfo]}</span>
            </div>
          )) : <div>Server nije dostupan ili se učitava...</div>}
        </div>
      </CardHeader>
    </Card>
  );
}
