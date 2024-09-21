import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Welcome to Restaurant
          </CardTitle>
          <CardDescription className="text-center">
            Manage your restaurant orders efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/restaurant">Go to Restaurants</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Restaurant Management. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
