export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading security examples...</p>
      </div>
    </div>
  )
}
