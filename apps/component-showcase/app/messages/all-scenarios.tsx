'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  cn,
  Avatar,
  AvatarFallback,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@clarity-chat/primitives'
import {
  User,
  Bot,
  ThumbsUp,
  Copy,
  RefreshCw,
  Check,
  Clock,
  CheckCheck,
  Reply,
  Smile,
  MessagesSquare,
  Loader2,
  Users,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Code,
  File,
  Heart,
  History,
  AlertTriangle,
  FileCode,
  Download,
  X,
  Edit,
  CornerDownRight,
  Eye,
} from 'lucide-react'

// ============================================================================
// 1. BASIC CONVERSATION - Back and forth between 2 users
// ============================================================================
function BasicConversationDemo() {
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set())

  const toggleLike = (id: number) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Basic Conversation</CardTitle>
        <CardDescription>
          Natural back-and-forth dialogue between user and assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            {/* User Message 1 */}
            <div className="flex gap-3 flex-row-reverse">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[70%]">
                <div className="gradient-accent text-white rounded-2xl rounded-tr-none p-3.5 glow-sm">
                  <p className="text-sm">
                    Hi! I&apos;m working on a React project and need help understanding how to properly use useEffect for data fetching.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">10:24 AM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Assistant Message 1 */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[75%]">
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3.5">
                  <p className="text-sm">
                    Great question! I&apos;d be happy to help you with useEffect for data fetching. The key principle is to understand that useEffect runs after your component renders.
                  </p>
                  <p className="text-sm mt-2">
                    Here&apos;s what you need to know:
                  </p>
                  <ul className="text-sm mt-2 space-y-1 ml-4 list-disc">
                    <li>Always clean up side effects to prevent memory leaks</li>
                    <li>Handle loading and error states</li>
                    <li>Use the dependency array correctly</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">10:24 AM</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleLike(1)}
                    >
                      <ThumbsUp className={cn(
                        "h-3.5 w-3.5",
                        likedMessages.has(1) && "fill-blue-500 text-blue-500"
                      )} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Message 2 */}
            <div className="flex gap-3 flex-row-reverse">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[70%]">
                <div className="gradient-accent text-white rounded-2xl rounded-tr-none p-3.5 glow-sm">
                  <p className="text-sm">
                    That makes sense! Can you show me a code example?
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">10:25 AM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Assistant Message 2 with Code */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="glass-card rounded-2xl rounded-tl-none p-3.5">
                  <p className="text-sm mb-2">
                    Absolutely! Here&apos;s a complete example:
                  </p>
                  <pre className="p-3 bg-background rounded-lg text-xs font-mono overflow-x-auto border">
{`function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
}`}
                  </pre>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">10:25 AM</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleLike(2)}
                    >
                      <ThumbsUp className={cn(
                        "h-3.5 w-3.5",
                        likedMessages.has(2) && "fill-blue-500 text-blue-500"
                      )} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Message 3 */}
            <div className="flex gap-3 flex-row-reverse">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  SM
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[70%]">
                <div className="gradient-accent text-white rounded-2xl rounded-tr-none p-3.5 glow-sm">
                  <p className="text-sm">
                    Perfect! The cleanup function with isMounted makes total sense now. Thanks! 🙏
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">10:26 AM</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Assistant Message 3 */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[75%]">
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3.5">
                  <p className="text-sm">
                    You&apos;re welcome! Feel free to ask if you have any other questions. Happy coding! 🚀
                  </p>
                </div>
                <span className="text-xs text-muted-foreground mt-2 block">10:26 AM</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// 2. GROUP CHAT - 3+ users with avatars
// ============================================================================
function GroupChatDemo() {
  const [reactions, setReactions] = useState<Record<string, string[]>>({
    msg1: ['👍', '❤️'],
    msg3: ['😂', '🎉', '👍'],
  })

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Discussion
            </CardTitle>
            <CardDescription>
              Group chat with multiple participants
            </CardDescription>
          </div>
          <Badge variant="secondary">4 members</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            {/* Sarah - Project Lead */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs">
                  SK
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Sarah Kim</span>
                  <Badge variant="outline" className="text-xs h-5">Project Lead</Badge>
                  <span className="text-xs text-muted-foreground">9:15 AM</span>
                </div>
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm">
                    Morning team! 👋 Quick update on the new feature release. We&apos;re targeting Friday for deployment.
                    @Alex can you confirm the API is ready?
                  </p>
                </div>
                {reactions.msg1 && reactions.msg1.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-muted rounded-full text-xs">
                      {reactions.msg1.map((emoji, i) => (
                        <span key={i}>{emoji}</span>
                      ))}
                      <span className="ml-1 text-muted-foreground">{reactions.msg1.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alex - Backend Dev */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                  AC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Alex Chen</span>
                  <Badge variant="outline" className="text-xs h-5">Backend</Badge>
                  <span className="text-xs text-muted-foreground">9:17 AM</span>
                </div>
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm">
                    @Sarah Yes! The API endpoints are complete and tested. We&apos;re at 98% code coverage.
                    Just need final review from @Marcus.
                  </p>
                </div>
              </div>
            </div>

            {/* Marcus - Senior Dev */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xs">
                  MR
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Marcus Rodriguez</span>
                  <Badge variant="outline" className="text-xs h-5">Senior Dev</Badge>
                  <span className="text-xs text-muted-foreground">9:18 AM</span>
                </div>
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm">
                    On it! I&apos;ll review this afternoon. BTW, found a potential performance issue in the data aggregation.
                    Might want to add caching there. 🤔
                  </p>
                </div>
                {reactions.msg3 && reactions.msg3.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-muted rounded-full text-xs">
                      {reactions.msg3.map((emoji, i) => (
                        <span key={i}>{emoji}</span>
                      ))}
                      <span className="ml-1 text-muted-foreground">{reactions.msg3.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emma - Frontend Dev */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs">
                  EW
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Emma Wilson</span>
                  <Badge variant="outline" className="text-xs h-5">Frontend</Badge>
                  <span className="text-xs text-muted-foreground">9:20 AM</span>
                </div>
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm">
                    Good catch @Marcus! I can implement Redis caching on the frontend queries too.
                    Should reduce API calls significantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Sarah responding */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs">
                  SK
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Sarah Kim</span>
                  <Badge variant="outline" className="text-xs h-5">Project Lead</Badge>
                  <span className="text-xs text-muted-foreground">9:22 AM</span>
                </div>
                <div className="glass-subtle rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm">
                    Perfect! Let&apos;s sync up at 2pm to finalize the caching strategy.
                    I&apos;ll send a calendar invite. Great teamwork everyone! 🎉
                  </p>
                </div>
              </div>
            </div>

            {/* Typing indicators for multiple users */}
            <div className="flex gap-3">
              <div className="flex -space-x-2">
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-[10px]">
                    AC
                  </AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-[10px]">
                    EW
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none p-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Export all 10 scenarios
export { BasicConversationDemo, GroupChatDemo }
