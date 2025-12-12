// Example: Tailwind CSS Issues
// This file contains intentional Tailwind problems for training purposes

'use client'

export function UserProfile({ user }) {
  return (
    // ISSUE 1: Arbitrary values instead of design system
    <div className="w-[342px] p-[15px] mt-[23px] rounded-[7px]">
      {/* ISSUE 2: Hardcoded colors, no dark mode */}
      <div className="bg-[#f5f5f5] text-[#333333] border-[#e0e0e0]">
        {/* ISSUE 3: Desktop-first responsive (wrong direction) */}
        <div className="flex-row sm:flex-col md:flex-col">
          {/* ISSUE 4: Duplicate utilities */}
          <img
            src={user.avatar}
            className="w-16 h-16 rounded-full w-16 rounded-full"
          />

          {/* ISSUE 5: Conflicting utilities */}
          <div className="flex grid items-center justify-between">
            <h2 className="text-xl font-bold text-black">{user.name}</h2>

            {/* ISSUE 6: Inconsistent spacing */}
            <p className="mt-[13px] mb-2 px-[11px]">{user.bio}</p>
          </div>
        </div>

        {/* ISSUE 7: No hover/focus states */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Follow
        </button>

        {/* ISSUE 8: Inline styles mixed with Tailwind */}
        <div
          className="flex gap-4"
          style={{ marginTop: '20px', backgroundColor: '#fff' }}
        >
          <span className="text-gray-600">{user.followers} followers</span>
          <span className="text-gray-600">{user.following} following</span>
        </div>

        {/* ISSUE 9: Magic numbers in responsive design */}
        <div className="hidden sm:block md:hidden lg:block xl:hidden 2xl:block">
          Confusing visibility pattern
        </div>
      </div>
    </div>
  )
}

// ISSUE 10: Long class string without organization
export function Card({ children }) {
  return (
    <div className="relative z-10 overflow-hidden bg-white text-gray-900 flex flex-col p-4 m-2 gap-4 text-base font-medium leading-relaxed border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow items-center justify-between w-full max-w-md h-auto min-h-screen">
      {children}
    </div>
  )
}
