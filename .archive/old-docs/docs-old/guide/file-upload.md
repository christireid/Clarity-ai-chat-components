# File Upload

Support rich user attachments including documents, images, and structured data.

## Composer Configuration

Enable uploads via the `Composer` component or the `useComposer` hook.

```tsx
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  allowFileUploads
  onUploadFiles={async files => {
    // Perform validation and upload
    return files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: await uploadToS3(file),
    }))
  }}
/>
```

## Validation

- Restrict MIME types and maximum sizes with `uploadConfig`.
- Provide descriptive error messages for rejected files.

## Displaying Attachments

Use `AttachmentGallery` or `AttachmentList` to render previews inside the transcript or composer.

Next, explore [Message Operations](/guide/message-operations) to manage edits, branches, and retries.
