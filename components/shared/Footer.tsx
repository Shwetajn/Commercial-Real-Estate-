export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CRE Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
