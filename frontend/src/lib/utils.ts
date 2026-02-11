import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CheckCircle, ShieldCheck, XCircle, Loader2, HelpCircle } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BookingStatusConfig {
  text: string;
  color: string;
  bg: string;
  icon: any;
}

export function getBookingStatus(status: string = "PENDING"): BookingStatusConfig {
  const code = status?.toUpperCase();

  switch (code) {
    case "TO0":
      return {
        text: "Ticket Issued",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        icon: CheckCircle
      };
    case "BO0":
      return {
        text: "Booking Confirmed",
        color: "text-yellow-700",
        bg: "bg-yellow-100",
        icon: ShieldCheck
      };
    case "BO1":
    case "TO1":
      return {
        text: "Booking Failed",
        color: "text-red-600",
        bg: "bg-red-100",
        icon: XCircle
      };
    case "I8":
    case "IP":
    case "6033":
      return {
        text: "In Progress",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: Loader2
      };
    default:
      return {
        text: "Pending / Unknown",
        color: "text-slate-600",
        bg: "bg-slate-100",
        icon: HelpCircle
      };
  }
}
