import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function StyleGuidePage() {
  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Style Guide</h1>
        <p className="text-muted-foreground text-lg">A showcase of the design tokens and base components.</p>
      </div>

      <Separator />

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Display / text-4xl font-bold</span>
              <h1 className="text-4xl font-bold tracking-tight">The quick brown fox jumps over the lazy dog</h1>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Heading 2 / text-2xl font-semibold</span>
              <h2 className="text-2xl font-semibold tracking-tight">The quick brown fox jumps over the lazy dog</h2>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Heading 3 / text-xl font-semibold</span>
              <h3 className="text-xl font-semibold tracking-tight">The quick brown fox jumps over the lazy dog</h3>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Body Large / text-lg</span>
              <p className="text-lg text-foreground">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Body / text-base</span>
              <p className="text-base text-muted-foreground">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Label / text-sm font-medium</span>
              <label className="text-sm font-medium leading-none">Email Address</label>
            </div>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-primary shadow-sm" />
              <div>
                <p className="font-medium text-sm">Primary</p>
                <p className="text-xs text-muted-foreground">bg-primary</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-muted border shadow-sm" />
              <div>
                <p className="font-medium text-sm">Muted</p>
                <p className="text-xs text-muted-foreground">bg-muted</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-card border shadow-card" />
              <div>
                <p className="font-medium text-sm">Card</p>
                <p className="text-xs text-muted-foreground">bg-card</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-xl bg-background border shadow-sm" />
              <div>
                <p className="font-medium text-sm">Background</p>
                <p className="text-xs text-muted-foreground">bg-background</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6 shadow-sm">
            <Button>Default Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small (sm)</Button>
            <Button size="lg">Large (lg)</Button>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Badges (Semantic)</h2>
          <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6 shadow-sm">
            <Badge>Primary Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      </section>

      {/* Cards & Inputs */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cards & Inputs</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Example Card</CardTitle>
                <CardDescription>A descriptive subtitle for the card.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Field</label>
                  <Input placeholder="Enter some text..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disabled Input</label>
                  <Input placeholder="You cannot edit this" disabled />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground border-none">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Primary Card</CardTitle>
                  <CardDescription className="text-primary-foreground/80">Used for highlighted information or call to actions.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
