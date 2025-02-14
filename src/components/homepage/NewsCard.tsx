import { Crown, Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function NewsCard({}) {
  return (
    <Card className="w-1/3">
      <CardHeader className="relative">
        <CardTitle className="mb-2">Najnovije obavijesti</CardTitle>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Zmanger se pomustafio</AlertTitle>
          <AlertDescription>Svašta čeka u novoj verziji.</AlertDescription>
        </Alert>
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertTitle>Preminula je kraljica Elizabeta</AlertTitle>
          <AlertDescription>Čemu je vakat tome je vrijeme.</AlertDescription>
        </Alert>
      </CardHeader>
    </Card>
  );
}
