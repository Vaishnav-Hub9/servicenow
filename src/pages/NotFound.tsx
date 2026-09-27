import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Card, LinkButton } from "@/components/ui";

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1320px] items-center justify-center">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
          <Compass className="h-6 w-6 text-teal-600" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-[20px] font-bold tracking-[-0.01em] text-[#16283C]">Page not found</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#7A8AA0]">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <LinkButton to="/" variant="secondary">Back to Overview</LinkButton>
          <LinkButton to="/students">View Students</LinkButton>
        </div>
        <Link to="/" className="sr-only">WellAware home</Link>
      </Card>
    </div>
  );
}
