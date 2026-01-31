import { LifeBuoy } from "lucide-react"

export function SiteLogo() {
  return (
    <div className="flex items-center gap-2">
        <LifeBuoy className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">Ticket Demosu</span>
    </div>
  )
}
