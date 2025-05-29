/* eslint-disable */
"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { CheckCircle, Plus, Star, StarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import AboutPageWrapper from "~/components/AboutPageWrapper";
import { Skeleton } from "~/components/ui/skeleton";

type Review = {
  id: number;
  createdAt: string;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  title: string;
  rating: number;
  description: string;
};

function ReviewsPage() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    rating: 5,
    description: "",
  });

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews/get");
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Greška pri dohvatanju recenzija");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Molimo popunite sva polja");
      return;
    }

    setIsSubmitting(true);
    const createPromise = new Promise<string>((resolve, reject) => {
      fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          imageUrl: user?.imageUrl,
        }),
      })
        .then(async (response) => {
          if (response.ok) {
            await fetchReviews();
            setFormData({
              title: "",
              rating: 5,
              description: "",
            });
            setDialogOpen(false);
            resolve("Recenzija uspješno kreirana!");
          } else {
            reject("Greška pri kreiranju recenzije.");
          }
        })
        .catch((error) => {
          console.error("Error creating review:", error);
          reject("Greška pri kreiranju recenzije.");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    });

    toast.promise(createPromise, {
      loading: "Kreiranje recenzije...",
      success: (message) => message as string,
      error: (message) => message as string,
    });
  };

  const handleDeleteReview = async (reviewId: number) => {
    const deletePromise = new Promise<string>((resolve, reject) => {
      fetch(`/api/reviews/delete?id=${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.id || "",
        },
      })
        .then(async (response) => {
          if (response.ok) {
            await fetchReviews();
            resolve("Recenzija uspješno obrisana!");
          } else {
            reject("Greška pri brisanju recenzije.");
          }
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
          reject("Greška pri brisanju recenzije.");
        });
    });

    toast.promise(deletePromise, {
      loading: "Brisanje recenzije...",
      success: (message) => message as string,
      error: (message) => message as string,
    });
  };

  return (
    <AboutPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">O Zmangeru</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recenzije</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4">
        <h1 className="my-4 text-3xl font-bold">Recenzije ({reviews.length})</h1>

        {user ? (
          <>
            {reviews.some(review => review.userId === user?.id) && (
              <p className="text-muted-foreground flex gap-2 items-center">
                <CheckCircle className="w-4 h-4" /> Već ste napisali recenziju.
              </p>
            )}

            {!reviews.some(review => review.userId === user?.id) && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4" /> Nova recenzija</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova recenzija</DialogTitle>
                    <DialogDescription>
                      Podijelite vaše iskustvo sa Zmangerom.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Naslov</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Npr. Odlična aplikacija!"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Ocjena</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            className="hover:scale-110 transition-transform"
                          >
                            {rating <= formData.rating ? (
                              <StarIcon className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="w-6 h-6" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Opis</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Opišite vaše iskustvo..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCreateReview}
                      disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                    >
                      {isSubmitting ? "Kreiranje..." : "Objavi recenziju"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        ) : (
          <p className="text-muted-foreground flex gap-2 items-center">
            Prijavite se da biste napisali recenziju.
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <img
                      src={review.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + review.firstName}
                      alt={`${review.firstName}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-md -mt-0.5">{review.firstName} {review.lastName}</CardTitle>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground">
                        <span>{format(new Date(review.createdAt), "dd MMM yyyy")}</span>
                        <span className="mx-1">•</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {user?.id === review.userId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ova akcija će trajno izbrisati vašu recenziju.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Odustani</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-600/90 dark:text-white"
                          >
                            Izbriši
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h3 className="font-semibold mb-2 -mt-3">{review.title}</h3>
                <p className="text-sm text-muted-foreground">{review.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Nema recenzija.
        </p>
      )}
    </AboutPageWrapper>
  );
}

export default ReviewsPage;
