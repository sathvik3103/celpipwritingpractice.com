import Link from "next/link";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <IconBadge icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Page not found
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          >
            Go home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
