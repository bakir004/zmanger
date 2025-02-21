import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

type CpuInfo = {
  Architecture: string;
  "CPU op-mode(s)": string;
  "Byte Order": string;
  "Address sizes": string;
  "CPU(s)": string;
  "On-line CPU(s) list": string;
  "Thread(s) per core": string;
  "Core(s) per socket": string;
  "Socket(s)": string;
  "NUMA node(s)": string;
  "Vendor ID": string;
  "CPU family": string;
  Model: string;
  "Model name": string;
  Stepping: string;
  "CPU MHz": string;
  BogoMIPS: string;
  Virtualization: string;
  "Hypervisor vendor": string;
  "Virtualization type": string;
  "L1d cache": string;
  "L1i cache": string;
  "L2 cache": string;
  "L3 cache": string;
  "NUMA node0 CPU(s)": string;
  Flags: string;
  Mem: string;
  Swap: string;
};

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
  useEffect(() => {
    async function getServerInfo() {
      try {
        const response = await fetch("/api/getServerInfo");

        if (!response.ok) {
          throw new Error("Error fetching data from backend");
        }

        const data = await response.json();
        console.log(data);
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
        console.log(data);
      } catch (error) {
        console.error("Error fetching server info:", error);
        setOnline(false);
      }
    }

    void getServerInfo();
  }, []);
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <CardTitle className="mb-2 flex items-center gap-4">
          <p>Server</p>
          {online ? (
            <span className="flex rounded bg-green-500/30 px-1.5 text-sm text-green-500">
              • Online
            </span>
          ) : (
            <span className="flex rounded bg-red-500/20 px-1.5 text-sm text-red-500">
              • Offline
            </span>
          )}
        </CardTitle>
        {serverInfo && (
          <div className="flex flex-col items-center justify-center gap-1">
            {Object.keys(serverInfo).map((key, i) => (
              <div className="grid grid-cols-2 gap-2" key={i}>
                <span className="text-right text-slate-400">{key}</span>
                <span className="">{serverInfo[key as keyof ServerInfo]}</span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
