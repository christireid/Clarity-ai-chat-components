'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  ExternalLink,
  Play,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  GitFork,
  Eye,
  FileText,
  ImageIcon,
  Music,
  Video,
  Link2,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from 'lucide-react'

// URL Preview Embed
export interface URLPreviewProps {
  url: string
  title: string
  description?: string
  image?: string
  favicon?: string
  siteName?: string
  className?: string
}

export function URLPreview({
  url,
  title,
  description,
  image,
  favicon,
  siteName,
  className,
}: URLPreviewProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border bg-card overflow-hidden hover:border-accent/50 transition-colors',
        className
      )}
    >
      {image && (
        <div className="aspect-[2/1] bg-muted overflow-hidden">
          <img
            src={image || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {favicon && (
            <img
              src={favicon || '/placeholder.svg'}
              alt=""
              className="w-4 h-4"
            />
          )}
          <span className="text-xs text-muted-foreground">
            {siteName || new URL(url).hostname}
          </span>
        </div>
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

// Twitter/X Embed
export interface TweetEmbedProps {
  author: {
    name: string
    handle: string
    avatar: string
    verified?: boolean
  }
  content: string
  timestamp: Date
  likes?: number
  retweets?: number
  replies?: number
  media?: Array<{ type: 'image' | 'video'; url: string }>
  className?: string
}

export function TweetEmbed({
  author,
  content,
  timestamp,
  likes = 0,
  retweets = 0,
  replies = 0,
  media,
  className,
}: TweetEmbedProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={author.avatar || '/placeholder.svg'}
            alt={author.name}
          />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{author.name}</span>
            {author.verified && (
              <svg
                className="h-4 w-4 text-blue-500"
                viewBox="0 0 22 22"
                fill="currentColor"
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            )}
            <span className="text-muted-foreground text-sm">
              @{author.handle}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">
              {new Date(timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-sm whitespace-pre-wrap">{content}</p>

          {media && media.length > 0 && (
            <div
              className={cn(
                'mt-3 grid gap-2 rounded-lg overflow-hidden',
                media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              )}
            >
              {media.map((item, index) => (
                <div key={index} className="aspect-video bg-muted relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.url || '/placeholder.svg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-white/80" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 mt-3 text-muted-foreground">
            <button className="flex items-center gap-1 text-xs hover:text-blue-500">
              <MessageCircle className="h-4 w-4" />
              {replies > 0 && replies.toLocaleString()}
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-green-500">
              <Share2 className="h-4 w-4" />
              {retweets > 0 && retweets.toLocaleString()}
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-red-500">
              <Heart className="h-4 w-4" />
              {likes > 0 && likes.toLocaleString()}
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-blue-500">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Twitter className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  )
}

// GitHub Repository Embed
export interface GitHubRepoEmbedProps {
  owner: string
  repo: string
  description?: string
  language?: string
  languageColor?: string
  stars?: number
  forks?: number
  watchers?: number
  topics?: string[]
  className?: string
}

export function GitHubRepoEmbed({
  owner,
  repo,
  description,
  language,
  languageColor = '#3178c6',
  stars = 0,
  forks = 0,
  watchers = 0,
  topics = [],
  className,
}: GitHubRepoEmbedProps) {
  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border bg-card p-4 hover:border-accent/50 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">
              {owner}/{repo}
            </span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {description}
            </p>
          )}

          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {topics.slice(0, 5).map((topic) => (
                <Badge key={topic} variant="secondary" className="text-[10px]">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {language && (
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColor }}
                />
                {language}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {stars.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {forks.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {watchers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

// YouTube Video Embed
export interface YouTubeEmbedProps {
  videoId: string
  title: string
  channel?: string
  thumbnail?: string
  duration?: string
  views?: number
  publishedAt?: Date
  autoplay?: boolean
  className?: string
}

export function YouTubeEmbed({
  videoId,
  title,
  channel,
  thumbnail,
  duration,
  views,
  publishedAt,
  autoplay = false,
  className,
}: YouTubeEmbedProps) {
  const [showVideo, setShowVideo] = React.useState(autoplay)
  const thumbnailUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="aspect-video relative bg-black">
        {showVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <img
              src={thumbnailUrl || '/placeholder.svg'}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-white fill-current" />
              </div>
            </button>
            {duration && (
              <span className="absolute bottom-2 right-2 px-1 py-0.5 bg-black/80 text-white text-xs rounded">
                {duration}
              </span>
            )}
          </>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {channel && <span>{channel}</span>}
          {views !== undefined && (
            <>
              <span>·</span>
              <span>{views.toLocaleString()} views</span>
            </>
          )}
          {publishedAt && (
            <>
              <span>·</span>
              <span>{new Date(publishedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Spotify Embed
export interface SpotifyEmbedProps {
  type: 'track' | 'album' | 'playlist' | 'artist'
  id: string
  theme?: 'light' | 'dark'
  compact?: boolean
  className?: string
}

export function SpotifyEmbed({
  type,
  id,
  theme = 'dark',
  compact = false,
  className,
}: SpotifyEmbedProps) {
  const height = compact ? 80 : type === 'track' ? 152 : 352

  return (
    <div className={cn('rounded-lg overflow-hidden', className)}>
      <iframe
        src={`https://open.spotify.com/embed/${type}/${id}?theme=${theme === 'dark' ? '0' : '1'}`}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}

// Event Embed
export interface EventEmbedProps {
  title: string
  description?: string
  date: Date
  endDate?: Date
  location?: string
  isOnline?: boolean
  attendees?: number
  image?: string
  url?: string
  className?: string
}

export function EventEmbed({
  title,
  description,
  date,
  endDate,
  location,
  isOnline,
  attendees,
  image,
  url,
  className,
}: EventEmbedProps) {
  const content = (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {image && (
        <div className="aspect-[3/1] bg-muted overflow-hidden">
          <img
            src={image || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
            <span className="text-xs font-medium uppercase">
              {date.toLocaleDateString('en', { month: 'short' })}
            </span>
            <span className="text-lg font-bold">{date.getDate()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {date.toLocaleTimeString('en', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                {endDate &&
                  ` - ${endDate.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}`}
              </span>
            </div>
            {location && (
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {isOnline ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
                <span>{location}</span>
              </div>
            )}
            {attendees !== undefined && (
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{attendees.toLocaleString()} attending</span>
              </div>
            )}
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
      >
        {content}
      </a>
    )
  }

  return content
}

// File Preview Embed
export interface FilePreviewProps {
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other'
  size?: string
  preview?: string
  url?: string
  className?: string
}

export function FilePreview({
  name,
  type,
  size,
  preview,
  url,
  className,
}: FilePreviewProps) {
  const icons = {
    document: FileText,
    image: ImageIcon,
    video: Video,
    audio: Music,
    archive: FileText,
    code: FileText,
    other: FileText,
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {preview && type === 'image' && (
        <div className="aspect-video bg-muted">
          <img
            src={preview || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{name}</p>
          {size && <p className="text-xs text-muted-foreground">{size}</p>}
        </div>
        {url && (
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

// Location Embed
export interface LocationEmbedProps {
  name: string
  address?: string
  coordinates?: { lat: number; lng: number }
  image?: string
  rating?: number
  reviewCount?: number
  className?: string
}

export function LocationEmbed({
  name,
  address,
  coordinates,
  image,
  rating,
  reviewCount,
  className,
}: LocationEmbedProps) {
  const mapsUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(name + (address ? `, ${address}` : ''))}`

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border bg-card overflow-hidden hover:border-accent/50 transition-colors',
        className
      )}
    >
      {image && (
        <div className="aspect-[2/1] bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{name}</h3>
            {address && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {address}
              </p>
            )}
            {rating !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{rating}</span>
                {reviewCount !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
