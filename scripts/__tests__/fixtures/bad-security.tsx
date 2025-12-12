// Test fixture: Security issues
export function UnsafeComponent({ userContent, userUrl }: { userContent: string; userUrl: string }) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: userContent }} />
      <a href={userUrl}>Link</a>
      <img src={userUrl} alt="User image" />
    </div>
  )
}
