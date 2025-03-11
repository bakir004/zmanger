/* eslint-disable */
"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import { authGuard } from "~/lib/authguard";
import AboutPageWrapper from "~/components/AboutPageWrapper";

type Commit = {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
};

function CommitsPage() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/bakir004/zmanger/commits?per_page=30');
        const data = await response.json();
        setCommits(data);
      } catch (error) {
        console.error('Error fetching commits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommits();
  }, []);

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
            <BreadcrumbPage>Commitovi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="my-4 text-3xl font-bold">Posljednje promjene</h1>
      <p className="mb-8 text-muted-foreground">
        Pregled posljednjih 30 commitova na Githubu Zmangera.
      </p>

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[350px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          commits.map((commit) => (
            <a
              key={commit.sha}
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:bg-accent rounded-lg"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {commit.commit.message}
                  </CardTitle>
                  <CardDescription>
                    by {commit.commit.author.name} on{" "}
                    {format(new Date(commit.commit.author.date), "dd MMM yyyy 'at' HH:mm")}
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <p className="text-sm text-muted-foreground font-mono">
                    {commit.sha.substring(0, 7)}
                  </p>
                </CardContent> */}
              </Card>
            </a>
          ))
        )}
      </div>
    </AboutPageWrapper>
  );
}

export default authGuard({
  Component: CommitsPage,
  props: {},
  needsETFemail: true,
}); 