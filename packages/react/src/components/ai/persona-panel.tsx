import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@clarity-chat/primitives'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

export type PersonaRole =
  | 'strategist'
  | 'researcher'
  | 'assistant'
  | 'critic'
  | 'coach'
  | 'custom'

export interface Persona {
  id: string
  name: string
  role: PersonaRole
  summary: string
  expertise: string[]
  avatarUrl?: string
  color?: string
  temperature?: number
  tags?: string[]
}

export interface PersonaPanelProps {
  personas: Persona[]
  activePersonaId?: string
  onSelect?: (persona: Persona) => void
  onConfigure?: (persona: Persona) => void
  toneSubtitle?: string
  showTemperature?: boolean
  className?: string
}

const roleLabels: Record<PersonaRole, string> = {
  strategist: 'Strategy',
  researcher: 'Research',
  assistant: 'Assistant',
  critic: 'Critique',
  coach: 'Coaching',
  custom: 'Custom',
}

const roleAccent: Record<PersonaRole, string> = {
  strategist: 'from-primary/20 via-primary/10 to-transparent text-primary',
  researcher:
    'from-[hsl(var(--success))]/20 via-[hsl(var(--success))]/10 to-transparent text-[hsl(var(--success))]',
  assistant:
    'from-[hsl(var(--info))]/20 via-[hsl(var(--info))]/10 to-transparent text-[hsl(var(--info))]',
  critic:
    'from-destructive/20 via-destructive/10 to-transparent text-destructive',
  coach:
    'from-[hsl(var(--warning))]/20 via-[hsl(var(--warning))]/10 to-transparent text-[hsl(var(--warning))]',
  custom: 'from-primary/20 via-primary/10 to-transparent text-primary',
}

export function PersonaPanel({
  personas,
  activePersonaId,
  onSelect,
  onConfigure,
  toneSubtitle = 'Switch between tailored assistants optimised for different AI chat workflows.',
  showTemperature = true,
  className,
}: PersonaPanelProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Card
      className={cn(
        'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_22px_48px_rgba(15,23,42,0.16)]',
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            Persona switchboard
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            {toneSubtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3" role="list">
          {prefersReducedMotion ? (
            personas.map((persona) => {
              const isActive = persona.id === activePersonaId
              return (
                <li key={persona.id}>
                  <Button
                    variant={isActive ? 'surface' : 'outline'}
                    className={cn(
                      'group flex w-full items-start gap-4 rounded-lg border border-border/50 p-4 text-left transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40 hover:shadow-md',
                      isActive &&
                        'border-primary/50 shadow-md'
                    )}
                    onClick={() => onSelect?.(persona)}
                    data-state={isActive ? 'active' : 'inactive'}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary shadow-inner">
                      {persona.avatarUrl ? (
                        <Avatar
                          size="lg"
                          src={persona.avatarUrl}
                          alt={`${persona.name} avatar`}
                          className="h-12 w-12 border-none shadow-none"
                        />
                      ) : (
                        persona.name.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-foreground">
                            {persona.name}
                          </span>
                          <span
                            className={cn(
                              'rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                              roleAccent[persona.role]
                            )}
                          >
                            {roleLabels[persona.role]}
                          </span>
                        </div>
                        {isActive && (
                          <Badge
                            variant="success"
                            className="uppercase tracking-wide"
                          >
                            Active
                          </Badge>
                        )}
                        {showTemperature &&
                          persona.temperature !== undefined && (
                            <span className="text-xs font-medium text-muted-foreground">
                              Temperature {persona.temperature.toFixed(2)}
                            </span>
                          )}
                      </div>

                      <p className="text-sm text-muted-foreground/80">
                        {persona.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {persona.expertise.map((area) => (
                          <Badge
                            key={area}
                            variant="subtle"
                            className="text-xs"
                          >
                            {area}
                          </Badge>
                        ))}
                        {persona.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {onConfigure && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 text-muted-foreground hover:text-primary"
                        onClick={(event) => {
                          event.stopPropagation()
                          onConfigure?.(persona)
                        }}
                      >
                        Configure
                      </Button>
                    )}
                  </Button>
                </li>
              )
            })
          ) : (
            <AnimatePresence initial={false}>
              {personas.map((persona) => {
                const isActive = persona.id === activePersonaId
                return (
                  <motion.li
                    key={persona.id}
                    {...ANIMATION_PRESETS.slideUp}
                    transition={{
                      duration: durations.normal,
                      ease: EASING_FRAMER.default,
                    }}
                  >
                    <Button
                      variant={isActive ? 'surface' : 'outline'}
                      className={cn(
                        'group flex w-full items-start gap-4 rounded-lg border border-border/50 p-4 text-left transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40 hover:shadow-md',
                        isActive &&
                          'border-primary/50 shadow-md'
                      )}
                      onClick={() => onSelect?.(persona)}
                      data-state={isActive ? 'active' : 'inactive'}
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary shadow-inner">
                        {persona.avatarUrl ? (
                          <Avatar
                            size="lg"
                            src={persona.avatarUrl}
                            alt={`${persona.name} avatar`}
                            className="h-12 w-12 border-none shadow-none"
                          />
                        ) : (
                          persona.name.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-foreground">
                              {persona.name}
                            </span>
                            <span
                              className={cn(
                                'rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                                roleAccent[persona.role]
                              )}
                            >
                              {roleLabels[persona.role]}
                            </span>
                          </div>
                          {isActive && (
                            <Badge
                              variant="success"
                              className="uppercase tracking-wide"
                            >
                              Active
                            </Badge>
                          )}
                          {showTemperature &&
                            persona.temperature !== undefined && (
                              <span className="text-xs font-medium text-muted-foreground">
                                Temperature {persona.temperature.toFixed(2)}
                              </span>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground/80">
                          {persona.summary}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {persona.expertise.map((area) => (
                            <Badge
                              key={area}
                              variant="subtle"
                              className="text-xs"
                            >
                              {area}
                            </Badge>
                          ))}
                          {persona.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {onConfigure && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 text-muted-foreground hover:text-primary"
                          onClick={(event) => {
                            event.stopPropagation()
                            onConfigure?.(persona)
                          }}
                        >
                          Configure
                        </Button>
                      )}
                    </Button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

PersonaPanel.displayName = 'PersonaPanel'
