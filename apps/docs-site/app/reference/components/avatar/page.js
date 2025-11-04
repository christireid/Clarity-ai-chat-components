import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Avatar - Clarity Chat Components',
    description: 'Display user profile pictures with fallbacks, status indicators, and group avatars.',
};
export default function AvatarPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Avatar" }), _jsx("p", { className: "docs-lead", children: "Display user profile pictures with automatic fallbacks, status indicators, sizes, and group avatars." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "Avatar" }), " component displays user profile pictures with smart fallbacks when images fail to load. It supports various sizes, shapes, status indicators, and can be grouped to show multiple users."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { title: "Basic Avatar", code: `import { Avatar } from '@clarity-chat/react'

function BasicAvatar() {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        alt="John Doe"
      />
      
      <Avatar
        src="https://i.pravatar.cc/150?img=2"
        alt="Jane Smith"
      />
      
      <Avatar
        name="Alice Johnson"
        alt="Alice Johnson"
      />
      
      <Avatar
        name="Bob Wilson"
        alt="Bob Wilson"
      />
    </div>
  )
}

export default BasicAvatar`, height: "200px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Avatar Props", data: avatarProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sizes" }), _jsx("p", { children: "Avatars come in multiple predefined sizes from extra small to extra large." }), _jsx(LiveDemo, { title: "Avatar Sizes", code: `import { Avatar } from '@clarity-chat/react'

function AvatarSizes() {
  return (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="xs"
        />
        <p className="text-xs mt-2">xs (24px)</p>
      </div>
      
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="sm"
        />
        <p className="text-xs mt-2">sm (32px)</p>
      </div>
      
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="md"
        />
        <p className="text-xs mt-2">md (40px)</p>
      </div>
      
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="lg"
        />
        <p className="text-xs mt-2">lg (48px)</p>
      </div>
      
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="xl"
        />
        <p className="text-xs mt-2">xl (64px)</p>
      </div>
      
      <div className="text-center">
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User"
          size="2xl"
        />
        <p className="text-xs mt-2">2xl (80px)</p>
      </div>
    </div>
  )
}

export default AvatarSizes`, height: "250px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Fallback Behavior" }), _jsx("p", { children: "When an image fails to load, the Avatar displays initials derived from the user's name with a generated background color." }), _jsx(LiveDemo, { title: "Fallback Avatars", code: `import { Avatar } from '@clarity-chat/react'

function FallbackAvatars() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">With Images</h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://i.pravatar.cc/150?img=5"
            alt="Alice Cooper"
            name="Alice Cooper"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=6"
            alt="Bob Dylan"
            name="Bob Dylan"
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=7"
            alt="Charlie Parker"
            name="Charlie Parker"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Without Images (Initials)</h3>
        <div className="flex items-center gap-4">
          <Avatar
            name="Alice Cooper"
            alt="Alice Cooper"
          />
          <Avatar
            name="Bob Dylan"
            alt="Bob Dylan"
          />
          <Avatar
            name="Charlie Parker"
            alt="Charlie Parker"
          />
          <Avatar
            name="Diana Ross"
            alt="Diana Ross"
          />
          <Avatar
            name="Elvis Presley"
            alt="Elvis Presley"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Broken Images (Auto-fallback)</h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://broken-image-url.com/1.jpg"
            name="Fallback User 1"
            alt="Fallback User 1"
          />
          <Avatar
            src="https://broken-image-url.com/2.jpg"
            name="Fallback User 2"
            alt="Fallback User 2"
          />
          <Avatar
            src="https://broken-image-url.com/3.jpg"
            name="Fallback User 3"
            alt="Fallback User 3"
          />
        </div>
      </div>
    </div>
  )
}

export default FallbackAvatars`, height: "450px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Status Indicator" }), _jsx("p", { children: "Show user presence status with a colored indicator." }), _jsx(LiveDemo, { title: "Status Indicators", code: `import { Avatar } from '@clarity-chat/react'

function StatusAvatars() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Status Types</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <Avatar
              src="https://i.pravatar.cc/150?img=8"
              alt="Online User"
              status="online"
              size="lg"
            />
            <p className="text-xs mt-2">Online</p>
          </div>
          
          <div className="text-center">
            <Avatar
              src="https://i.pravatar.cc/150?img=9"
              alt="Away User"
              status="away"
              size="lg"
            />
            <p className="text-xs mt-2">Away</p>
          </div>
          
          <div className="text-center">
            <Avatar
              src="https://i.pravatar.cc/150?img=10"
              alt="Busy User"
              status="busy"
              size="lg"
            />
            <p className="text-xs mt-2">Busy</p>
          </div>
          
          <div className="text-center">
            <Avatar
              src="https://i.pravatar.cc/150?img=11"
              alt="Offline User"
              status="offline"
              size="lg"
            />
            <p className="text-xs mt-2">Offline</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Different Sizes with Status</h3>
        <div className="flex items-end gap-4">
          <Avatar
            name="User"
            status="online"
            size="xs"
          />
          <Avatar
            name="User"
            status="online"
            size="sm"
          />
          <Avatar
            name="User"
            status="online"
            size="md"
          />
          <Avatar
            name="User"
            status="online"
            size="lg"
          />
          <Avatar
            name="User"
            status="online"
            size="xl"
          />
        </div>
      </div>
    </div>
  )
}

export default StatusAvatars`, height: "400px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Shapes" }), _jsx("p", { children: "Avatars can be circular (default), rounded square, or square." }), _jsx(LiveDemo, { title: "Avatar Shapes", code: `import { Avatar } from '@clarity-chat/react'

function AvatarShapes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="User"
            shape="circle"
            size="lg"
          />
          <p className="text-xs mt-2">Circle (default)</p>
        </div>
        
        <div className="text-center">
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="User"
            shape="rounded"
            size="lg"
          />
          <p className="text-xs mt-2">Rounded</p>
        </div>
        
        <div className="text-center">
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="User"
            shape="square"
            size="lg"
          />
          <p className="text-xs mt-2">Square</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <Avatar
            name="John Doe"
            shape="circle"
            size="lg"
          />
          <p className="text-xs mt-2">Circle</p>
        </div>
        
        <div className="text-center">
          <Avatar
            name="John Doe"
            shape="rounded"
            size="lg"
          />
          <p className="text-xs mt-2">Rounded</p>
        </div>
        
        <div className="text-center">
          <Avatar
            name="John Doe"
            shape="square"
            size="lg"
          />
          <p className="text-xs mt-2">Square</p>
        </div>
      </div>
    </div>
  )
}

export default AvatarShapes`, height: "350px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Avatar Group" }), _jsx("p", { children: "Display multiple avatars in a compact, overlapping group." }), _jsx(LiveDemo, { title: "Avatar Groups", code: `import { Avatar, AvatarGroup } from '@clarity-chat/react'

function AvatarGroups() {
  const users = [
    { id: '1', name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Diana', src: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Basic Group</h3>
        <AvatarGroup>
          {users.slice(0, 3).map(user => (
            <Avatar
              key={user.id}
              src={user.src}
              alt={user.name}
              name={user.name}
            />
          ))}
        </AvatarGroup>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">With Max Count</h3>
        <AvatarGroup max={3}>
          {users.map(user => (
            <Avatar
              key={user.id}
              src={user.src}
              alt={user.name}
              name={user.name}
            />
          ))}
        </AvatarGroup>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Different Sizes</h3>
        <div className="space-y-3">
          <AvatarGroup size="sm" max={4}>
            {users.map(user => (
              <Avatar
                key={user.id}
                src={user.src}
                alt={user.name}
                name={user.name}
              />
            ))}
          </AvatarGroup>
          
          <AvatarGroup size="md" max={4}>
            {users.map(user => (
              <Avatar
                key={user.id}
                src={user.src}
                alt={user.name}
                name={user.name}
              />
            ))}
          </AvatarGroup>
          
          <AvatarGroup size="lg" max={4}>
            {users.map(user => (
              <Avatar
                key={user.id}
                src={user.src}
                alt={user.name}
                name={user.name}
              />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </div>
  )
}

export default AvatarGroups`, height: "500px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Badge" }), _jsx("p", { children: "Add notification badges or counts to avatars." }), _jsx(LiveDemo, { title: "Avatar with Badge", code: `import { Avatar } from '@clarity-chat/react'

function AvatarWithBadge() {
  return (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar
            src="https://i.pravatar.cc/150?img=13"
            alt="User"
            size="lg"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
        </div>
        <p className="text-xs mt-2">Unread Count</p>
      </div>

      <div className="text-center">
        <div className="relative inline-block">
          <Avatar
            src="https://i.pravatar.cc/150?img=14"
            alt="User"
            size="lg"
            status="online"
          />
          <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
            ✓
          </div>
        </div>
        <p className="text-xs mt-2">Verified</p>
      </div>

      <div className="text-center">
        <div className="relative inline-block">
          <Avatar
            src="https://i.pravatar.cc/150?img=15"
            alt="User"
            size="lg"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">
            ⭐
          </div>
        </div>
        <p className="text-xs mt-2">Premium</p>
      </div>
    </div>
  )
}

export default AvatarWithBadge`, height: "250px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Avatars" }), _jsx("p", { children: "Make avatars clickable for profile views or actions." }), _jsx(LiveDemo, { title: "Interactive Avatars", code: `import { Avatar } from '@clarity-chat/react'

function InteractiveAvatars() {
  const [clicked, setClicked] = React.useState(null)

  const users = [
    { id: '1', name: 'Alice', src: 'https://i.pravatar.cc/150?img=16', status: 'online' },
    { id: '2', name: 'Bob', src: 'https://i.pravatar.cc/150?img=17', status: 'away' },
    { id: '3', name: 'Charlie', src: 'https://i.pravatar.cc/150?img=18', status: 'busy' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => setClicked(user.name)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-110"
          >
            <Avatar
              src={user.src}
              alt={user.name}
              name={user.name}
              status={user.status}
              size="lg"
            />
          </button>
        ))}
      </div>

      {clicked && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">
            You clicked on <strong>{clicked}</strong>
          </p>
        </div>
      )}

      <div className="text-xs text-gray-600 dark:text-gray-400">
        Click on an avatar to see interaction
      </div>
    </div>
  )
}

export default InteractiveAvatars`, height: "300px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Colors" }), _jsx("p", { children: "Override the default color scheme for fallback avatars." }), _jsx(LiveDemo, { title: "Custom Avatar Colors", code: `import { Avatar } from '@clarity-chat/react'

function CustomColorAvatars() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Custom Background</h3>
        <div className="flex items-center gap-4">
          <Avatar
            name="Red User"
            backgroundColor="#ef4444"
            textColor="#ffffff"
            size="lg"
          />
          <Avatar
            name="Blue User"
            backgroundColor="#3b82f6"
            textColor="#ffffff"
            size="lg"
          />
          <Avatar
            name="Green User"
            backgroundColor="#10b981"
            textColor="#ffffff"
            size="lg"
          />
          <Avatar
            name="Purple User"
            backgroundColor="#8b5cf6"
            textColor="#ffffff"
            size="lg"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Gradient Backgrounds</h3>
        <div className="flex items-center gap-4">
          <Avatar
            name="User 1"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
            textColor="#ffffff"
            size="lg"
          />
          <Avatar
            name="User 2"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            }}
            textColor="#ffffff"
            size="lg"
          />
          <Avatar
            name="User 3"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }}
            textColor="#ffffff"
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}

export default CustomColorAvatars`, height: "400px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Loading State" }), _jsx("p", { children: "Show a skeleton loader while the avatar image is loading." }), _jsx(LiveDemo, { title: "Loading Avatars", code: `import { Avatar } from '@clarity-chat/react'

function LoadingAvatars() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar
          src="https://i.pravatar.cc/150?img=19"
          alt="User"
          isLoading={isLoading}
          size="lg"
        />
        <Avatar
          src="https://i.pravatar.cc/150?img=20"
          alt="User"
          isLoading={isLoading}
          size="lg"
        />
        <Avatar
          src="https://i.pravatar.cc/150?img=21"
          alt="User"
          isLoading={isLoading}
          size="lg"
        />
      </div>

      <button
        onClick={() => setIsLoading(!isLoading)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isLoading ? 'Stop Loading' : 'Start Loading'}
      </button>
    </div>
  )
}

export default LoadingAvatars`, height: "250px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Dynamic Color Generation" }), _jsx("pre", { children: _jsx("code", { children: `// Generate consistent colors based on user ID or name
function generateColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return \`hsl(\${hue}, 65%, 55%)\`
}

<Avatar
  name="John Doe"
  backgroundColor={generateColor('john-doe-id')}
/>` }) }), _jsx("h3", { children: "With Tooltip" }), _jsx("pre", { children: _jsx("code", { children: `import { Avatar, Tooltip } from '@clarity-chat/react'

<Tooltip content="John Doe - Senior Developer">
  <Avatar
    src="/avatars/john.jpg"
    name="John Doe"
    status="online"
  />
</Tooltip>` }) }), _jsx("h3", { children: "Avatar with Dropdown" }), _jsx("pre", { children: _jsx("code", { children: `import { Avatar, Dropdown } from '@clarity-chat/react'

function AvatarMenu() {
  const menuItems = [
    { id: 'profile', label: 'View Profile' },
    { id: 'settings', label: 'Settings' },
    { type: 'separator' },
    { id: 'logout', label: 'Logout', variant: 'danger' }
  ]

  return (
    <Dropdown items={menuItems}>
      <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
        <Avatar
          src="/avatar.jpg"
          name="Current User"
          status="online"
        />
      </button>
    </Dropdown>
  )
}` }) }), _jsx("h3", { children: "Lazy Loading Images" }), _jsx("pre", { children: _jsx("code", { children: `<Avatar
  src="/large-avatar.jpg"
  name="User Name"
  loading="lazy"
  onLoad={() => console.log('Avatar loaded')}
  onError={() => console.log('Avatar failed to load')}
/>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsxs(Callout, { type: "info", title: "Screen Reader Support", children: ["The Avatar component includes proper alt text and ARIA labels for screen readers. Always provide meaningful ", _jsx("code", { children: "alt" }), " or ", _jsx("code", { children: "name" }), " props."] }), _jsx("h3", { children: "Best Practices" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Always provide ", _jsx("code", { children: "alt" }), " text for images"] }), _jsxs("li", { children: ["Include ", _jsx("code", { children: "name" }), " for fallback initials"] }), _jsx("li", { children: "Use semantic HTML for interactive avatars" }), _jsx("li", { children: "Ensure sufficient color contrast for text" }), _jsx("li", { children: "Make interactive avatars keyboard accessible" })] }), _jsx("h3", { children: "ARIA Attributes" }), _jsx("pre", { children: _jsx("code", { children: `<Avatar
  src="/avatar.jpg"
  alt="John Doe"
  role="img"
  aria-label="John Doe's profile picture"
/>

// For interactive avatars
<button
  aria-label="View John Doe's profile"
  onClick={handleClick}
>
  <Avatar src="/avatar.jpg" alt="John Doe" />
</button>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx(Callout, { type: "tip", title: "Optimize Images", children: "Use appropriately sized images for avatars. For a 64px avatar, don't load a 1024px image. Consider using CDN image resizing services." }), _jsx(Callout, { type: "warning", title: "Handle Loading States", children: "Always handle image loading failures gracefully with fallbacks. The Avatar component does this automatically with initials." }), _jsx("h3", { children: "Image Optimization" }), _jsxs("ul", { children: [_jsx("li", { children: "Use WebP format for better compression" }), _jsx("li", { children: "Serve appropriate sizes for different avatar dimensions" }), _jsx("li", { children: "Use lazy loading for avatars below the fold" }), _jsx("li", { children: "Consider using a CDN for avatar hosting" }), _jsx("li", { children: "Cache avatar images aggressively" })] }), _jsx("h3", { children: "UX Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Use consistent avatar sizes within the same context" }), _jsx("li", { children: "Show status indicators for real-time presence" }), _jsx("li", { children: "Make avatars clickable to view full profiles" }), _jsx("li", { children: "Group avatars for multiple user contexts" }), _jsx("li", { children: "Use clear, high-quality profile pictures" })] }), _jsx("h3", { children: "Performance" }), _jsxs("ul", { children: [_jsx("li", { children: "Generate fallback colors deterministically" }), _jsx("li", { children: "Memoize avatar components in lists" }), _jsx("li", { children: "Use CSS for status indicators (not images)" }), _jsx("li", { children: "Avoid re-rendering on hover states" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { Avatar, AvatarProps, AvatarGroup } from '@clarity-chat/react'

interface AvatarProps {
  src?: string
  alt: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'rounded' | 'square'
  status?: 'online' | 'away' | 'busy' | 'offline'
  isLoading?: boolean
  backgroundColor?: string
  textColor?: string
  className?: string
  style?: React.CSSProperties
  loading?: 'eager' | 'lazy'
  onClick?: () => void
  onLoad?: () => void
  onError?: () => void
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  spacing?: number
  className?: string
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/badge", className: "docs-card", children: [_jsx("h3", { children: "Badge" }), _jsx("p", { children: "Notification badges and indicators" })] }), _jsxs("a", { href: "/reference/components/tooltip", className: "docs-card", children: [_jsx("h3", { children: "Tooltip" }), _jsx("p", { children: "Hover information tooltips" })] }), _jsxs("a", { href: "/reference/components/dropdown", className: "docs-card", children: [_jsx("h3", { children: "Dropdown" }), _jsx("p", { children: "Dropdown menus and actions" })] }), _jsxs("a", { href: "/examples/multi-user", className: "docs-card", children: [_jsx("h3", { children: "Multi-user Example" }), _jsx("p", { children: "Avatars in chat context" })] })] })] })] }));
}
const avatarProps = [
    {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Image URL for the avatar'
    },
    {
        name: 'alt',
        type: 'string',
        required: true,
        description: 'Alt text for the avatar image (accessibility)'
    },
    {
        name: 'name',
        type: 'string',
        required: false,
        description: 'User name for generating initials when image is unavailable'
    },
    {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
        required: false,
        default: "'md'",
        description: 'Size of the avatar. xs=24px, sm=32px, md=40px, lg=48px, xl=64px, 2xl=80px'
    },
    {
        name: 'shape',
        type: "'circle' | 'rounded' | 'square'",
        required: false,
        default: "'circle'",
        description: 'Shape of the avatar'
    },
    {
        name: 'status',
        type: "'online' | 'away' | 'busy' | 'offline'",
        required: false,
        description: 'User presence status indicator'
    },
    {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show loading skeleton'
    },
    {
        name: 'backgroundColor',
        type: 'string',
        required: false,
        description: 'Custom background color for fallback initials'
    },
    {
        name: 'textColor',
        type: 'string',
        required: false,
        default: "'#ffffff'",
        description: 'Text color for fallback initials'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    },
    {
        name: 'loading',
        type: "'eager' | 'lazy'",
        required: false,
        default: "'eager'",
        description: 'Image loading strategy'
    },
    {
        name: 'onClick',
        type: '() => void',
        required: false,
        description: 'Click handler for interactive avatars'
    },
    {
        name: 'onLoad',
        type: '() => void',
        required: false,
        description: 'Callback when image loads successfully'
    },
    {
        name: 'onError',
        type: '() => void',
        required: false,
        description: 'Callback when image fails to load'
    }
];
//# sourceMappingURL=page.js.map