'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Separator } from '@clarity-chat/primitives'
import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageCircle,
  Eye,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Link2,
  ChevronRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  coverImage?: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
  publishedAt: Date
  readingTime: number
  tags: string[]
  likes?: number
  comments?: number
  views?: number
  featured?: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  count: number
}

// Blog Post Card
interface BlogPostCardProps {
  post: BlogPost
  variant?: 'default' | 'horizontal' | 'featured'
  onRead?: (post: BlogPost) => void
  onBookmark?: (post: BlogPost) => void
  isBookmarked?: boolean
  className?: string
}

export function BlogPostCard({
  post,
  variant = 'default',
  onRead,
  onBookmark,
  isBookmarked,
  className,
}: BlogPostCardProps) {
  if (variant === 'horizontal') {
    return (
      <Card
        className={cn(
          'flex cursor-pointer overflow-hidden transition-colors hover:bg-muted/50',
          className
        )}
        onClick={() => onRead?.(post)}
      >
        {post.coverImage && (
          <div className="relative h-32 w-48 flex-shrink-0">
            <img
              src={post.coverImage || '/placeholder.svg'}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardContent className="flex flex-1 flex-col justify-center p-4">
          <div className="mb-2 flex items-center gap-2">
            {post.featured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="line-clamp-1 font-semibold">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min read
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card
        className={cn('group cursor-pointer overflow-hidden', className)}
        onClick={() => onRead?.(post)}
      >
        <div className="relative aspect-video">
          <img
            src={post.coverImage || '/placeholder.svg'}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="default">Featured</Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/20 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white">{post.title}</h2>
            <p className="mt-2 line-clamp-2 text-white/80">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar || '/placeholder.svg'} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">{post.author.name}</span>
              </div>
              <span className="text-sm text-white/60">
                {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden transition-colors hover:bg-muted/50',
        className
      )}
      onClick={() => onRead?.(post)}
    >
      {post.coverImage && (
        <div className="relative aspect-video">
          <img
            src={post.coverImage || '/placeholder.svg'}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatar || '/placeholder.svg'} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {post.author.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}m
          </span>
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onBookmark(post)
              }}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-accent" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Blog Post List
interface BlogPostListProps {
  posts: BlogPost[]
  variant?: 'grid' | 'list'
  columns?: 1 | 2 | 3 | 4
  onRead?: (post: BlogPost) => void
  onBookmark?: (post: BlogPost) => void
  bookmarkedIds?: string[]
  className?: string
}

export function BlogPostList({
  posts,
  variant = 'grid',
  columns = 3,
  onRead,
  onBookmark,
  bookmarkedIds = [],
  className,
}: BlogPostListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {posts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            variant="horizontal"
            onRead={onRead}
            onBookmark={onBookmark}
            isBookmarked={bookmarkedIds.includes(post.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          onRead={onRead}
          onBookmark={onBookmark}
          isBookmarked={bookmarkedIds.includes(post.id)}
        />
      ))}
    </div>
  )
}

// Blog Article Header
interface BlogArticleHeaderProps {
  post: BlogPost
  onShare?: () => void
  onBookmark?: () => void
  isBookmarked?: boolean
  className?: string
}

export function BlogArticleHeader({
  post,
  onShare,
  onBookmark,
  isBookmarked,
  className,
}: BlogArticleHeaderProps) {
  return (
    <header className={cn('space-y-6', className)}>
      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="text-xl text-muted-foreground">{post.excerpt}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar || '/placeholder.svg'} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onBookmark && (
            <Button variant="outline" size="sm" onClick={onBookmark}>
              {isBookmarked ? (
                <BookmarkCheck className="mr-2 h-4 w-4" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          )}
          {onShare && <ShareButton onShare={onShare} />}
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={post.coverImage || '/placeholder.svg'}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </header>
  )
}

// Share Button
interface ShareButtonProps {
  onShare?: () => void
  url?: string
  title?: string
}

function ShareButton({ onShare, url, title }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url || window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Link2 className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Blog Categories
interface BlogCategoriesProps {
  categories: BlogCategory[]
  selectedId?: string
  onSelect?: (category: BlogCategory) => void
  className?: string
}

export function BlogCategories({
  categories,
  selectedId,
  onSelect,
  className,
}: BlogCategoriesProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="font-semibold">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedId === category.id ? 'secondary' : 'ghost'}
            className="w-full justify-between"
            onClick={() => onSelect?.(category)}
          >
            <span>{category.name}</span>
            <Badge variant="outline">{category.count}</Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}

// Blog Navigation
interface BlogNavigationProps {
  previousPost?: BlogPost
  nextPost?: BlogPost
  onNavigate?: (post: BlogPost) => void
  className?: string
}

export function BlogNavigation({
  previousPost,
  nextPost,
  onNavigate,
  className,
}: BlogNavigationProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:justify-between',
        className
      )}
    >
      {previousPost ? (
        <Button
          variant="outline"
          className="justify-start gap-2 bg-transparent"
          onClick={() => onNavigate?.(previousPost)}
        >
          <ArrowLeft className="h-4 w-4" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="line-clamp-1 text-sm font-medium">
              {previousPost.title}
            </p>
          </div>
        </Button>
      ) : (
        <div />
      )}
      {nextPost && (
        <Button
          variant="outline"
          className="justify-end gap-2 bg-transparent"
          onClick={() => onNavigate?.(nextPost)}
        >
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="line-clamp-1 text-sm font-medium">{nextPost.title}</p>
          </div>
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Author Card
interface AuthorCardProps {
  author: BlogPost['author']
  bio?: string
  className?: string
}

export function AuthorCard({ author, bio, className }: AuthorCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex gap-4 p-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={author.avatar || '/placeholder.svg'} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{author.name}</h3>
          {author.role && (
            <p className="text-sm text-muted-foreground">{author.role}</p>
          )}
          {bio && <p className="mt-2 text-sm">{bio}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
