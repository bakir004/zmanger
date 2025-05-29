/* eslint-disable */
"use client";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { authGuard } from "~/lib/authguard";
import { DAYS, SUBJECTS, TIMES } from "~/lib/groups";

type Offer = {
  id: number;
  phoneNumber: string;
 creatorId: string;
  creatorName: string;
  subjectGive: string;
  timeGive: string;
  dayGive: string;
  subjectWant: string;
  timeWant: string;
  dayWant: string;
  year: number;
  createdAt: string;
};

function GroupsPage() {
  const { user } = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedYear, setSelectedYear] = useState("2");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: "",
    subjectGive: "",
    timeGive: "",
    dayGive: "",
    subjectWant: "",
    timeWant: "",
    dayWant: "",
    year: selectedYear,
  });

  const isFormValid = () => {
    return (
      formData.phoneNumber.trim() !== "" &&
      formData.subjectGive !== "" &&
      formData.timeGive !== "" &&
      formData.dayGive !== "" &&
      formData.subjectWant !== "" &&
      formData.timeWant !== "" &&
      formData.dayWant !== "" &&
      formData.year !== ""
    );
  };


  const fetchOffers = async (year?: string) => {
    try {
      const response = await fetch(
        `/api/offer/get${year ? `?year=${year}` : ""}`,
      );
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(selectedYear);
  }, [selectedYear]);

  const handleCreateOffer = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    const createPromise = new Promise<string>((resolve, reject) => {
      fetch("/api/offer/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user?.id,
          creatorName: user?.firstName || "Unknown User",
          year: Number(formData.year),
        }),
      })
        .then(async (response) => {
          if (response.ok) {
            await fetchOffers(selectedYear);
            setFormData({
              phoneNumber: "",
              subjectGive: "",
              timeGive: "",
              dayGive: "",
              subjectWant: "",
              timeWant: "",
              dayWant: "",
              year: selectedYear,
            });
            setDialogOpen(false);
            resolve("Ponuda uspješno kreirana!");
          } else {
            reject("Greška pri kreiranju ponude.");
          }
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
          reject("Greška pri kreiranju ponude.");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    });

    toast.promise(createPromise, {
      loading: "Kreiranje ponude...",
      success: (message) => message as string,
      error: (message) => message as string,
    });
  };

  const handleDeleteOffer = async (offerId: number) => {
    const deletePromise = new Promise<string>((resolve, reject) => {
      fetch(`/api/offer/delete?id=${offerId}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.id || "",
        },
      })
        .then(async (response) => {
          if (response.ok) {
            await fetchOffers(selectedYear);
            resolve("Ponuda uspješno obrisana!");
          } else {
            reject("Greška pri brisanju ponude.");
          }
        })
        .catch((error) => {
          console.error("Error deleting offer:", error);
          reject("Greška pri brisanju ponude.");
        });
    });

    toast.promise(deletePromise, {
      loading: "Brisanje ponude...",
      success: (message) => message as string,
      error: (message) => message as string,
    });
  };

  const toRoman = (num: string) => {
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return romanNumerals[parseInt(num) - 1] || num;
  };

  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Grupomjenjač</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="my-4 text-3xl font-bold">Grupomjenjač</h1>
      <section className="mb-4 flex items-center gap-2">
        <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Odaberi godinu" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {toRoman(year.toString())} godina
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nova ponuda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova ponuda za razmjenu</DialogTitle>
              <DialogDescription>
                Unesite detalje o predmetima koje želite zamijeniti.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Broj telefona</Label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="06X XXX XXX"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Godina</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) =>
                    setFormData({ ...formData, year: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberi godinu" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {toRoman(year.toString())} godina
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subjectGive">Predmet (dajem)</Label>
                  <Select
                    value={formData.subjectGive}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subjectGive: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi predmet" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dayGive">Dan</Label>
                  <Select
                    value={formData.dayGive}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dayGive: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi dan" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeGive">Vrijeme</Label>
                  <Select
                    value={formData.timeGive}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeGive: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi vrijeme" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMES.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subjectWant">Predmet (tražim)</Label>
                  <Select
                    value={formData.subjectWant}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subjectWant: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi predmet" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dayWant">Dan</Label>
                  <Select
                    value={formData.dayWant}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dayWant: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi dan" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeWant">Vrijeme</Label>
                  <Select
                    value={formData.timeWant}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeWant: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Odaberi vrijeme" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMES.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateOffer}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? "Kreiranje..." : "Objavi ponudu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <Table>
        <TableCaption className="italic">
          Napomena: na vama je javiti se osobi i dogovoriti se za izmjenu
          1-za-1.
        </TableCaption>
        <TableHeader>
          <TableRow className="border-slate-600">
            <TableHead>Ime i godina</TableHead>
            <TableHead>
              Ponuda (
              <span className="font-bold text-green-500 dark:text-green-400">
                nudi
              </span>{" "}
              -{" "}
              <span className="font-bold text-red-500 dark:text-red-400">
                traži
              </span>
              )
            </TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Učitavanje...
              </TableCell>
            </TableRow>
          ) : offers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nema ponuda za odabranu godinu.
              </TableCell>
            </TableRow>
          ) : (
            offers.map((offer) => (
              <TableRow className="border-slate-600" key={offer.id}>
                <TableCell>
                  {offer.creatorName}, {toRoman(offer.year.toString())}
                </TableCell>
                <TableCell className="flex flex-wrap gap-4">
                  <div className="w-fit rounded bg-green-300 px-1.5 py-0.5 text-xs dark:bg-green-600">
                    {offer.subjectGive}
                  </div>
                  <p className="font-bold text-green-500 dark:text-green-400">
                    {offer.dayGive}, {offer.timeGive}
                  </p>
                  <ArrowLeftRight className="mt-0.5 h-4 w-4" />
                  <div className="w-fit rounded bg-red-300 px-1 py-0.5 text-xs dark:bg-red-600">
                    {offer.subjectWant}
                  </div>
                  <p className="font-bold text-red-500 dark:text-red-400">
                    {offer.dayWant}, {offer.timeWant}
                  </p>
                </TableCell>
                <TableCell>{offer.phoneNumber}</TableCell>
                <TableCell>
                  {user?.id === offer.creatorId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ova akcija će trajno izbrisati vašu ponudu za
                            razmjenu.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Odustani</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-600/90"
                          >
                            Izbriši
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </main>
  );
}

export default authGuard({
  Component: GroupsPage,
  props: {},
  needsETFemail: true,
});
