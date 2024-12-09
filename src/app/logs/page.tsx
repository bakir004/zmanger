import { HydrateClient } from "~/trpc/server";
import SuspenseWrapper from "../_components/LoadingSuspenseWrapper";
import { api } from "~/trpc/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { PersonIcon } from "@radix-ui/react-icons";
import { Badge } from "~/components/ui/badge";

const mergeConsecutiveLogs = (logs: any) => {
  const mergedLogs: any[] = [];
  let currentGroup: any[] = [];
  logs.forEach((log: any) => {
    delete log.code;
    if (
      currentGroup.length === 0 ||
      log.senderEmail === currentGroup[0]?.senderEmail ||
      log.senderName === currentGroup[0]?.senderName
    ) {
      currentGroup.push(log);
    } else {
      mergedLogs.push(currentGroup);
      currentGroup = [];
      currentGroup.push(log);
    }
  });
  return mergedLogs;
};

export default async function Logs() {
  const logs = await api.coderunner.getRequests();
  const uniqueEmails = new Set(logs.map((log) => log.senderEmail));
  const uniqueEmailCount = uniqueEmails.size;

  logs.sort((a: any, b: any) => b.createdAt - a.createdAt);
  const mergedLogs = mergeConsecutiveLogs(logs);
  return (
    <SuspenseWrapper>
      <main className="mx-auto max-w-[1280px] p-4 sm:mt-12">
        <div className="mb-4 flex items-center gap-2 text-2xl font-bold">
          Logs ({logs.length}) - <PersonIcon className="h-6 w-6"></PersonIcon>{" "}
          {uniqueEmailCount}
        </div>
        <Accordion type="single" collapsible className="w-full">
          {mergedLogs.map((logGroup: any, i: number) => (
            <AccordionItem value={`item-${i}`} key={i}>
              <AccordionTrigger>
                <span>
                  <Badge
                    className={`mr-4 rounded-full px-1.5 font-bold text-white ${logGroup.length > 20 ? "bg-red-600" : logGroup.length > 10 ? "bg-orange-600" : logGroup.length === 1 ? "bg-blue-600" : "bg-green-700"}`}
                  >
                    {logGroup.length}
                  </Badge>{" "}
                  <span className="text-slate-400">
                    {new Date(
                      logGroup[logGroup.length - 1].createdAt.getTime() +
                        logGroup[
                          logGroup.length - 1
                        ].createdAt.getTimezoneOffset() *
                          60000 +
                        3600000,
                    ).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(
                      logGroup[0].createdAt.getTime() +
                        logGroup[0].createdAt.getTimezoneOffset() * 60000 +
                        3600000, // add 1 hour
                    ).toLocaleDateString("en-GB") ===
                    new Date(
                      logGroup[logGroup.length - 1].createdAt.getTime() +
                        logGroup[
                          logGroup.length - 1
                        ].createdAt.getTimezoneOffset() *
                          60000 +
                        3600000, // add 1 hour
                    ).toLocaleDateString("en-GB")
                      ? new Date(
                          logGroup[0].createdAt.getTime() +
                            logGroup[0].createdAt.getTimezoneOffset() * 60000 +
                            3600000, // add 1 hour
                        ).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : new Date(
                          logGroup[0].createdAt.getTime() +
                            logGroup[0].createdAt.getTimezoneOffset() * 60000 +
                            3600000, // add 1 hour
                        ).toLocaleDateString("en-GB") +
                        " " +
                        new Date(
                          logGroup[0].createdAt.getTime() +
                            logGroup[0].createdAt.getTimezoneOffset() * 60000 +
                            3600000, // add 1 hour
                        ).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                  </span>
                  <span className="ml-8">{logGroup[0].senderName}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Id</TableHead>
                      <TableHead>Vakat</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logGroup.map((log: any, j: number) => (
                      <TableRow key={j}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.createdAt.toLocaleString()}</TableCell>
                        <TableCell>{log.senderEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </SuspenseWrapper>
  );
}
