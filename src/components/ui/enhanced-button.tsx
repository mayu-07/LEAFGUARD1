import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-accent text-accent-foreground hover:bg-accent-hover shadow-medium hover:shadow-strong transform hover:scale-105",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-soft hover:shadow-medium",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft hover:shadow-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  trackingAction?: string
  confirmAction?: boolean
  confirmMessage?: string
  debounceMs?: number
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    trackingAction,
    confirmAction = false,
    confirmMessage = "Are you sure?",
    debounceMs = 300,
    children,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const [isDebouncing, setIsDebouncing] = React.useState(false)
    const debounceTimeoutRef = React.useRef<NodeJS.Timeout>()
    
    const Comp = asChild ? Slot : "button"
    
    // Analytics tracking
    const trackButtonClick = React.useCallback((action: string) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'click', {
          event_category: 'Button',
          event_label: action,
        })
      }
    }, [])

    // Debounced click handler
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDebouncing || loading || disabled) return

      // Confirmation dialog for destructive actions
      if (confirmAction && !window.confirm(confirmMessage)) {
        return
      }

      // Track analytics
      if (trackingAction) {
        trackButtonClick(trackingAction)
      }

      // Debounce logic
      setIsDebouncing(true)
      debounceTimeoutRef.current = setTimeout(() => {
        setIsDebouncing(false)
      }, debounceMs)

      // Call original onClick
      onClick?.(event)
    }, [isDebouncing, loading, disabled, confirmAction, confirmMessage, trackingAction, trackButtonClick, debounceMs, onClick])

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    }, [])

    const isDisabled = disabled || loading || isDebouncing

    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {loading && loadingText ? loadingText : children}
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }