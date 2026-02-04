'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@clarity-chat/primitives'
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Verified,
  ExternalLink,
  Play,
  Quote,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Twitter/X style post
interface TwitterPostProps {
  author: {
    name: string
    handle: string
    avatar?: string
    verified?: boolean
  }
  content: string
  timestamp: Date
  media?: { type: 'image' | 'video'; url: string }[]
  stats?: {
    replies?: number
    retweets?: number
    likes?: number
    views?: number
  }
  quoted?: TwitterPostProps
  isRetweet?: boolean
  retweetedBy?: string
  onLike?: () => void
  onRetweet?: () => void
  onReply?: () => void
  onShare?: () => void
  className?: string
}

export function TwitterPost({
  author,
  content,
  timestamp,
  media,
  stats,
  quoted,
  isRetweet,
  retweetedBy,
  onLike,
  onRetweet,
  onReply,
  onShare,
  className,
}: TwitterPostProps) {
  const [liked, setLiked] = React.useState(false)
  const [retweeted, setRetweeted] = React.useState(false)

  const formatCount = (n?: number) => {
    if (!n) return '0'
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m`
    if (hours < 24) return `${hours}h`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={cn('border-b border-border p-4', className)}>
      {retweetedBy && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 ml-8">
          <Repeat2 className="h-3 w-3" />
          {retweetedBy} reposted
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={author.avatar || '/placeholder.svg'}
            alt={author.name}
          />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm truncate">
              {author.name}
            </span>
            {author.verified && (
              <Verified className="h-4 w-4 text-blue-500 fill-blue-500" />
            )}
            <span className="text-muted-foreground text-sm">
              @{author.handle}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">
              {formatTime(timestamp)}
            </span>
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem>Embed post</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm mt-1 whitespace-pre-wrap">{content}</p>

          {media && media.length > 0 && (
            <div
              className={cn(
                'mt-3 rounded-xl overflow-hidden border border-border',
                media.length === 1 && 'grid-cols-1',
                media.length === 2 && 'grid grid-cols-2 gap-0.5',
                media.length >= 3 && 'grid grid-cols-2 gap-0.5'
              )}
            >
              {media.slice(0, 4).map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative aspect-video bg-muted',
                    media.length === 3 && i === 0 && 'row-span-2 aspect-square'
                  )}
                >
                  {m.type === 'image' ? (
                    <img
                      src={m.url || '/placeholder.svg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {quoted && (
            <div className="mt-3 border border-border rounded-xl p-3">
              <div className="flex items-center gap-1 text-sm">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={quoted.author.avatar || '/placeholder.svg'}
                  />
                  <AvatarFallback>{quoted.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{quoted.author.name}</span>
                <span className="text-muted-foreground">
                  @{quoted.author.handle}
                </span>
              </div>
              <p className="text-sm mt-1 line-clamp-3">{quoted.content}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 max-w-md">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-blue-500"
              onClick={onReply}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{formatCount(stats?.replies)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1',
                retweeted
                  ? 'text-green-500'
                  : 'text-muted-foreground hover:text-green-500'
              )}
              onClick={() => {
                setRetweeted(!retweeted)
                onRetweet?.()
              }}
            >
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{formatCount(stats?.retweets)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1',
                liked
                  ? 'text-pink-500'
                  : 'text-muted-foreground hover:text-pink-500'
              )}
              onClick={() => {
                setLiked(!liked)
                onLike?.()
              }}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
              <span className="text-xs">{formatCount(stats?.likes)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-blue-500"
              onClick={onShare}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// LinkedIn style post
interface LinkedInPostProps {
  author: {
    name: string
    title: string
    avatar?: string
    connection?: string
  }
  content: string
  timestamp: Date
  media?: { type: 'image' | 'video' | 'article'; url: string; title?: string }[]
  stats?: {
    reactions?: number
    comments?: number
    reposts?: number
  }
  reactions?: { type: string; count: number }[]
  className?: string
}

export function LinkedInPost({
  author,
  content,
  timestamp,
  media,
  stats,
  reactions,
  className,
}: LinkedInPostProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [liked, setLiked] = React.useState(false)

  const shouldTruncate = content.length > 300
  const displayContent =
    shouldTruncate && !expanded ? content.slice(0, 300) + '...' : content

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={author.avatar || '/placeholder.svg'}
              alt={author.name}
            />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{author.name}</span>
              {author.connection && (
                <span className="text-xs text-muted-foreground">
                  • {author.connection}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {author.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTime(timestamp)}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        {shouldTruncate && !expanded && (
          <button
            className="text-sm text-muted-foreground hover:text-foreground mt-1"
            onClick={() => setExpanded(true)}
          >
            ...see more
          </button>
        )}

        {media && media.length > 0 && (
          <div className="mt-3 -mx-4">
            {media[0].type === 'article' ? (
              <div className="border-t border-b border-border">
                <img
                  src={media[0].url || '/placeholder.svg'}
                  alt=""
                  className="w-full aspect-[2/1] object-cover"
                />
                <div className="p-3 bg-muted">
                  <p className="font-medium text-sm">{media[0].title}</p>
                </div>
              </div>
            ) : (
              <img
                src={media[0].url || '/placeholder.svg'}
                alt=""
                className="w-full"
              />
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch pt-0">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-1">
            {reactions?.slice(0, 3).map((r, i) => (
              <span key={i} className="text-sm">
                {r.type}
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {stats?.reactions}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats?.comments} comments • {stats?.reposts} reposts
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn('flex-1', liked && 'text-blue-600')}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={cn('h-4 w-4 mr-1', liked && 'fill-current')} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-1" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Repeat2 className="h-4 w-4 mr-1" />
            Repost
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Reddit style post
interface RedditPostProps {
  subreddit: string
  author: string
  title: string
  content?: string
  media?: {
    type: 'image' | 'video' | 'link'
    url: string
    thumbnail?: string
  }[]
  timestamp: Date
  stats?: {
    upvotes: number
    comments: number
    awards?: string[]
  }
  flair?: string
  className?: string
}

export function RedditPost({
  subreddit,
  author,
  title,
  content,
  media,
  timestamp,
  stats,
  flair,
  className,
}: RedditPostProps) {
  const [vote, setVote] = React.useState<'up' | 'down' | null>(null)

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return n.toString()
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const currentVotes =
    (stats?.upvotes ?? 0) + (vote === 'up' ? 1 : vote === 'down' ? -1 : 0)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 p-2 bg-muted/50">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-6 w-6', vote === 'up' && 'text-orange-500')}
            onClick={() => setVote(vote === 'up' ? null : 'up')}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
          </Button>
          <span
            className={cn(
              'text-xs font-medium',
              vote === 'up' && 'text-orange-500',
              vote === 'down' && 'text-blue-500'
            )}
          >
            {formatCount(currentVotes)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-6 w-6', vote === 'down' && 'text-blue-500')}
            onClick={() => setVote(vote === 'down' ? null : 'down')}
          >
            <svg
              className="h-4 w-4 rotate-180"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">r/{subreddit}</span>
            <span>•</span>
            <span>Posted by u/{author}</span>
            <span>{formatTime(timestamp)}</span>
            {stats?.awards?.map((award, i) => (
              <span key={i}>{award}</span>
            ))}
          </div>

          <h3 className="font-medium mt-1 flex items-center gap-2">
            {title}
            {flair && (
              <Badge variant="secondary" className="text-xs">
                {flair}
              </Badge>
            )}
          </h3>

          {content && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {content}
            </p>
          )}

          {media && media.length > 0 && (
            <div className="mt-2">
              {media[0].type === 'link' ? (
                <a
                  href={media[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {media[0].url}
                </a>
              ) : (
                <div className="rounded-md overflow-hidden bg-muted max-h-96">
                  <img
                    src={media[0].url || '/placeholder.svg'}
                    alt=""
                    className="w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {formatCount(stats?.comments ?? 0)} Comments
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
