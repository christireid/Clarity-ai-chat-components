'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Card } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { User, Briefcase, Code } from 'lucide-react'

// --- Components ---

const DynamicChart = ({
  data,
  type = 'bar',
}: {
  data: any[]
  type?: string
}) => {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          />
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const DynamicForm = ({ fields }: { fields: any[] }) => {
  return (
    <Card className="p-4 mt-4 space-y-3 bg-muted/30">
      {fields.map((field: any) => (
        <div key={field.name} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            {field.label}
          </label>
          <Input
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      ))}
      <Button size="sm" className="w-full">
        Submit
      </Button>
    </Card>
  )
}

const WeatherWidget = ({ location, temp, condition }: any) => {
  return (
    <Card className="p-4 mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
      <div>
        <div className="text-lg font-bold">{location}</div>
        <div className="text-sm text-muted-foreground">{condition}</div>
      </div>
      <div className="text-3xl font-light">{temp}°</div>
    </Card>
  )
}

const ProfileCard = ({ name, role, skills, avatar }: any) => {
  return (
    <Card className="mt-4 p-4 flex flex-col gap-4 bg-secondary/20 border-primary/10">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg leading-none">{name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Briefcase className="w-3.5 h-3.5" />
            {role}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5" /> Skills
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills?.map((skill: string) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-background hover:bg-background"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button size="sm" className="w-full" variant="default">
          Contact
        </Button>
        <Button size="sm" className="w-full" variant="outline">
          View Portfolio
        </Button>
      </div>
    </Card>
  )
}

// --- Registry ---

export const componentRegistry: Record<string, React.ComponentType<any>> = {
  Chart: DynamicChart,
  Form: DynamicForm,
  Weather: WeatherWidget,
  Profile: ProfileCard,
}

export function renderGenerativeComponent(componentName: string, props: any) {
  const Component = componentRegistry[componentName]
  if (!Component) return null
  return <Component {...props} />
}
