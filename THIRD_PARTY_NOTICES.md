# Third-Party Notices

This file contains the licenses and notices for third-party software used in @clarity-chat/react and
related packages. This software is provided under various open source licenses.

## License Summary

All runtime dependencies use licenses compatible with commercial distribution:

| License      | Count | Commercial Compatible |
| ------------ | ----- | --------------------- |
| MIT          | 25+   | ✅ Yes                |
| Apache-2.0   | 2     | ✅ Yes                |
| ISC          | 1     | ✅ Yes                |
| BSD-3-Clause | 1     | ✅ Yes                |

## Dual-Licensed Packages

The following packages offer dual licenses. We explicitly choose the MIT-compatible option:

### jszip (MIT OR GPL-3.0-or-later)

**Selected License: MIT**

JSZip is dual-licensed. For @clarity-chat distribution, we use the MIT license. See:
https://github.com/Stuk/jszip/blob/main/LICENSE.markdown

### dompurify (MPL-2.0 OR Apache-2.0)

**Selected License: Apache-2.0**

DOMPurify (via isomorphic-dompurify) is dual-licensed. We use Apache-2.0. See:
https://github.com/cure53/DOMPurify/blob/main/LICENSE

## Optional Peer Dependencies

The following are optional peer dependencies. They are NOT bundled with @clarity-chat and must be
installed separately by users who need them:

- **mermaid** (MIT) - Diagram rendering
- **flowtoken** - Streaming text animations
- **framer-motion** (MIT) - Animation library

Users are responsible for their own license compliance when installing optional peer dependencies.

## Runtime Dependencies

### MIT License

The following packages are licensed under the MIT License:

- @radix-ui/react-slot
- @tanstack/react-virtual
- clsx
- isomorphic-dompurify
- js-tiktoken
- jszip (MIT option selected)
- katex
- prismjs
- react-markdown
- react-resizable-panels
- react-virtualized-auto-sizer
- react-window
- rehype-highlight
- rehype-katex
- rehype-raw
- remark-gfm
- remark-math
- shiki
- sonner
- tailwind-merge
- zod

### Apache-2.0 License

- class-variance-authority
- dompurify (Apache-2.0 option selected via isomorphic-dompurify)

### ISC License

- lucide-react

### BSD-3-Clause License

- highlight.js

## Full License Texts

### MIT License

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Apache License 2.0

Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### ISC License

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

### BSD-3-Clause License

```
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
```

## Dev Dependencies

Development dependencies are NOT shipped with the final product and do not require attribution in
distributed software. However, for transparency:

- Build tools: tsup, typescript, vite
- Testing: vitest, @testing-library/\*
- Linting: eslint, prettier
- Storybook: @storybook/\*

Some dev dependencies use MPL-2.0 (e.g., lightningcss, axe-core) which has file-level copyleft.
Since these are build tools that do not inject code into the final bundle, they pose no commercial
licensing risk.

---

Last updated: 2024-12-29
