# Component Architecture Diagrams

Visual representations of key components in the Clarity AI Chat Components library. These diagrams
document component structure, state flows, and interactions.

## Table of Contents

1. [CommandPalette Component Tree](#commandpalette-component-tree)
2. [AudioRecorder State Flow](#audiorecorder-state-flow)
3. [OKLCH Color Inheritance](#oklch-color-inheritance)
4. [Component Interaction Diagram](#component-interaction-diagram)

---

## CommandPalette Component Tree

The CommandPalette component is a modal dialog for executing commands with keyboard navigation,
search filtering, and AI context integration.

### Component Hierarchy

```mermaid
graph TD
    CP["<b>CommandPalette</b><br/>Root Portal Component<br/>open, onClose, items, aiContext"]
    CP --> BACKDROP["Backdrop<br/>Click to close<br/>Fade animation"]
    CP --> MODAL["Modal Dialog<br/>role: dialog<br/>Focus trap"]

    MODAL --> HEADER["Header Section<br/>p-4 border-b"]
    MODAL --> INPUT["Search Input<br/>Debounced<br/>Clear button"]
    MODAL --> LISTBOX["Results Listbox<br/>Scrollable<br/>max-h-60vh"]
    MODAL --> FOOTER["Footer Section<br/>Keyboard hints<br/>AI Context"]

    LISTBOX --> GROUPS["Grouped Categories<br/>useMemo"]
    GROUPS --> GROUP1["Category Group<br/>Filtered items"]
    GROUPS --> GROUP2["Category Group<br/>Filtered items"]

    GROUP1 --> ITEMS1["Command Items<br/>Button elements<br/>With icons"]
    GROUP1 --> ITEMS2["Command Items<br/>Keyboard shortcuts<br/>Description"]

    FOOTER --> HINTS["Keyboard Hints<br/>Up/Down/Enter/Esc"]
    FOOTER --> AICONTEXT["AI Context<br/>Model, tokens<br/>Conversation ID"]

    style CP fill:#3b82f6,color:#fff
    style MODAL fill:#1f2937,color:#fff
    style BACKDROP fill:#1f2937,color:#fff,opacity:0.7
    style HEADER fill:#374151,color:#fff
    style LISTBOX fill:#111827,color:#fff
    style FOOTER fill:#1f2937,color:#fff
```

### Props Flow

```mermaid
graph LR
    subgraph Props["CommandPalette Props"]
        P1["items: CommandItem[]"]
        P2["open: boolean"]
        P3["onClose: () => void"]
        P4["placeholder?: string"]
        P5["loading?: boolean"]
        P6["aiContext?: AIContext"]
    end

    subgraph State["Internal State"]
        S1["search: string"]
        S2["selectedIndex: number"]
        S3["portalContainer: HTMLElement"]
    end

    subgraph Computed["Computed Values"]
        C1["debouncedSearch"]
        C2["filteredItems"]
        C3["groupedItems"]
        C4["flatItems"]
    end

    Props --> State
    State --> Computed
    Computed --> Render["Render Output"]

    style Props fill:#fbbf24,color:#000
    style State fill:#10b981,color:#fff
    style Computed fill:#8b5cf6,color:#fff
    style Render fill:#3b82f6,color:#fff
```

### Keyboard Navigation Flow

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Open: Cmd+K or open=true
    Open --> Focus: Input focused
    Focus --> Typing: User types
    Typing --> Filtered: Debounce fires<br/>150ms
    Filtered --> Navigate: Arrow keys
    Navigate --> Filtered: More typing
    Navigate --> Select: Enter pressed
    Select --> Closed: Item selected<br/>onClose called
    Open --> Closed: Escape pressed
    Closed --> [*]

    note right of Typing
        Search triggers:
        - Filter items
        - Reset index to 0
        - Debounced (150ms)
    end note

    note right of Navigate
        Arrow keys:
        - Up: Previous item
        - Down: Next item
        - Home: First item
        - End: Last item
    end note
```

---

## AudioRecorder State Flow

The AudioRecorder component manages browser-based audio recording with waveform visualization and
advanced audio processing.

### Recording States

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Recording: startRecording()
    Recording --> Paused: pauseRecording()
    Recording --> Stopped: stopRecording()
    Paused --> Recording: resumeRecording()
    Paused --> Stopped: stopRecording()
    Stopped --> Complete: [Wait 0ms]
    Complete --> Idle: Cleanup & fire onStop
    Stopped --> Error: MediaRecorder error
    Error --> Idle: Clear state

    Recording --> MaxDuration: Duration >= maxDuration
    MaxDuration --> Stopped: Auto-stop

    Recording --> VAD: voiceActivityDetection<br/>enabled
    VAD --> Paused: Silence detected<br/>amplitude < threshold
    Paused --> VAD: Voice resumed<br/>amplitude >= threshold

    note right of Idle
        Initial state
        User can click Start
    end note

    note right of Recording
        Active recording:
        - Amplitude monitored
        - Duration incremented
        - Audio chunks collected
    end note

    note right of Paused
        Paused recording:
        - Duration timer paused
        - Amplitude monitoring paused
        - Can resume or stop
    end note

    note right of Complete
        Recording complete:
        - Blob created
        - Object URL created
        - onStop callback fired
        - Media stream closed
    end note
```

### Audio Processing Pipeline

```mermaid
graph TD
    START["getUserMedia()"]
    START --> PERM{Permission<br/>Granted?}
    PERM -->|No| ERROR["Permission Denied<br/>onError called"]
    PERM -->|Yes| STREAM["MediaStream<br/>Acquired"]

    STREAM --> RECORDER["Create MediaRecorder<br/>mimeType support check"]
    STREAM --> AUDIO["Create AudioContext<br/>if visualization enabled"]

    AUDIO --> ANALYSER["Create AnalyserNode<br/>fftSize: 2048"]
    AUDIO --> SOURCE["Create MediaStreamSource"]
    SOURCE --> ANALYSER

    RECORDER --> REC_START["mediaRecorder.start()"]
    REC_START --> TIMER["Start duration timer<br/>1s interval"]
    REC_START --> AMPLITUDE["Start amplitude monitor<br/>requestAnimationFrame"]

    AMPLITUDE --> GETDATA["analyser.getByteTimeDomainData()"]
    GETDATA --> RMS["Calculate RMS<br/>amplitude"]
    RMS --> VAD["Voice Activity<br/>Detection check"]
    VAD --> CALLBACK["onAmplitudeChange<br/>callback"]

    RECORDER --> COLLECT["ondataavailable<br/>Collect chunks"]
    COLLECT --> AUDIO_CHUNKS["audioChunksRef<br/>array"]

    RECORDER --> ONSTOP["onstop event"]
    ONSTOP --> BLOB["Create Blob<br/>from chunks"]
    BLOB --> URL["Create Object URL<br/>from Blob"]
    URL --> CALLBACK2["onStop callback<br/>audioBlob, audioUrl"]
    CALLBACK2 --> CLEANUP["Cleanup<br/>MediaRecorder<br/>AudioContext<br/>MediaStream"]

    CLEANUP --> FINAL["Return to Idle"]

    style START fill:#3b82f6,color:#fff
    style ERROR fill:#ef4444,color:#fff
    style STREAM fill:#10b981,color:#fff
    style RECORDER fill:#8b5cf6,color:#fff
    style AMPLITUDE fill:#f59e0b,color:#fff
    style FINAL fill:#3b82f6,color:#fff
```

### Component Structure

```mermaid
graph TD
    AR["AudioRecorder Component"]
    AR --> CONTAINER["Container Div<br/>rounded-xl border"]

    CONTAINER --> HEADER["Header<br/>Mic icon<br/>Recording indicator"]
    CONTAINER --> AREA["Recording Area<br/>p-6 space-y-6"]

    AREA --> VIS["Visualization Block<br/>Conditional render"]
    VIS -->|Recording| WAVEFORM["Waveform<br/>60 bars<br/>Animated"]
    VIS -->|Not Recording| PLACEHOLDER["Placeholder<br/>Icon + status"]

    AREA --> DURATION["Duration Display<br/>MM:SS format<br/>Conditional"]
    AREA --> METER["Amplitude Meter<br/>Level indicator<br/>Gradient bar"]
    AREA --> ERROR_MSG["Permission Error<br/>User message"]
    AREA --> CONTROLS["Control Buttons"]

    CONTROLS -->|Not Recording| START_BTN["Start Button<br/>Mic icon"]
    CONTROLS -->|Recording| PAUSE_BTN["Pause Button<br/>(if pausable)"]
    CONTROLS -->|Recording| RESUME_BTN["Resume Button<br/>(if paused)"]
    CONTROLS -->|Recording| STOP_BTN["Stop Button<br/>Disabled if too short"]

    AREA --> STATUS["Status Announcement<br/>sr-only<br/>aria-live"]

    style AR fill:#3b82f6,color:#fff
    style CONTAINER fill:#1f2937,color:#fff
    style WAVEFORM fill:#f59e0b,color:#000
    style CONTROLS fill:#10b981,color:#fff
```

### Props Configuration

```mermaid
graph LR
    subgraph Recording["Recording Settings"]
        R1["maxDuration: 300s"]
        R2["minDuration: 1s"]
        R3["autoStart: boolean"]
        R4["pausable: boolean"]
        R5["countdownDuration: 0s"]
    end

    subgraph Format["Format Options"]
        F1["outputFormat: webm|mp3|wav|ogg|flac"]
        F2["mimeType: string"]
        F3["bitrate: 128000 bps"]
        F4["sampleRate: device default"]
        F5["channels: 1|2"]
    end

    subgraph Processing["Audio Processing"]
        P1["enableNoiseCancellation: false"]
        P2["enableEchoCancellation: false"]
        P3["enableAutoGainControl: false"]
        P4["noiseSuppression: false"]
        P5["voiceActivityDetection: false"]
        P6["silenceThreshold: 0.01"]
    end

    subgraph Callbacks["Callbacks"]
        C1["onStart()"]
        C2["onStop(blob, url)"]
        C3["onPause()"]
        C4["onResume()"]
        C5["onDataAvailable(blob)"]
        C6["onError(error)"]
        C7["onDurationChange(duration)"]
        C8["onAmplitudeChange(amplitude)"]
    end

    subgraph UI["UI Configuration"]
        U1["showWaveform: true"]
        U2["showDuration: true"]
        U3["showControls: true"]
        U4["showAmplitudeMeter: true"]
        U5["theme: auto|light|dark"]
        U6["disabled: boolean"]
    end

    style Recording fill:#3b82f6,color:#fff
    style Format fill:#8b5cf6,color:#fff
    style Processing fill:#f59e0b,color:#000
    style Callbacks fill:#10b981,color:#fff
    style UI fill:#ec4899,color:#fff
```

---

## OKLCH Color Inheritance

The OKLCH color utilities provide a type-safe system for color manipulation and accessibility
checking.

### Color Space Definition

```mermaid
graph TD
    subgraph OKLCH["OKLCH Color Model<br/>Perceptually Uniform"]
        L["Lightness (L)<br/>0-100%<br/>Perceptual brightness"]
        C["Chroma (C)<br/>0-0.4<br/>Color intensity"]
        H["Hue (H)<br/>0-360 degrees<br/>Color angle"]
        A["Alpha (A)<br/>0-1<br/>Transparency"]
    end

    subgraph Benefits["Advantages"]
        B1["Uniform perception"]
        B2["Better color manipulation"]
        B3["Accessible contrast calculations"]
        B4["Intuitive adjustments"]
    end

    OKLCH --> Benefits

    style OKLCH fill:#8b5cf6,color:#fff
    style Benefits fill:#10b981,color:#fff
```

### Color Transformation Functions

```mermaid
graph TD
    BASE["OklchColor<br/>{ l, c, h, a }"]

    BASE --> PARSE["parseOklch(string)<br/>Parse CSS string"]
    PARSE --> PARSED["OklchColor object"]

    BASE --> TOSTRING["toOklchString(color)<br/>Convert to CSS"]
    TOSTRING --> CSS["oklch(L% C H / A)"]

    BASE --> LIGHTEN["lighten(color, amount)<br/>Increase lightness"]
    BASE --> DARKEN["darken(color, amount)<br/>Decrease lightness"]
    BASE --> SATURATE["saturate(color, amount)<br/>Increase chroma"]
    BASE --> DESATURATE["desaturate(color, amount)<br/>Decrease chroma"]
    BASE --> ROTATEHUE["rotateHue(color, degrees)<br/>Shift hue"]
    BASE --> SETALPHA["setAlpha(color, alpha)<br/>Set opacity"]
    BASE --> MIX["mix(color1, color2, ratio)<br/>Blend colors"]

    LIGHTEN --> LIGHTER["Output: { l: 0-100, ... }"]
    DARKEN --> DARKER["Output: { l: 0-100, ... }"]
    SATURATE --> SATURATED["Output: { c: 0-0.4, ... }"]
    DESATURATE --> DESATURATED["Output: { c: 0-0.4, ... }"]
    ROTATEHUE --> ROTATED["Output: { h: 0-360, ... }"]
    SETALPHA --> OPACITY["Output: { a: 0-1, ... }"]
    MIX --> BLENDED["Output: Interpolated color"]

    style BASE fill:#3b82f6,color:#fff
    style PARSE fill:#10b981,color:#fff
    style TOSTRING fill:#10b981,color:#fff
    style LIGHTEN fill:#f59e0b,color:#000
    style DARKEN fill:#f59e0b,color:#000
    style SATURATE fill:#f59e0b,color:#000
    style DESATURATE fill:#f59e0b,color:#000
    style ROTATEHUE fill:#f59e0b,color:#000
    style SETALPHA fill:#f59e0b,color:#000
    style MIX fill:#f59e0b,color:#000
```

### Accessibility Contrast System

```mermaid
graph TD
    FG["Foreground Color<br/>OklchColor"]
    BG["Background Color<br/>OklchColor"]

    FG --> CR["contrastRatio(fg, bg)<br/>Calculate ratio"]
    BG --> CR
    CR --> RATIO["Contrast Ratio<br/>1:1 to 21:1"]

    RATIO --> WCAG_AA["meetsWcagAA(fg, bg, large?)<br/>Normal: 4.5:1<br/>Large: 3:1"]
    RATIO --> WCAG_AAA["meetsWcagAAA(fg, bg, large?)<br/>Normal: 7:1<br/>Large: 4.5:1"]
    RATIO --> SUGGEST["suggestContrastAdjustment<br/>fg, bg, targetRatio<br/>Returns lightness delta"]

    WCAG_AA --> AA_CHECK{"Meets AA?"}
    AA_CHECK -->|Yes| AA_PASS["✓ Accessible<br/>Normal text OK"]
    AA_CHECK -->|No| AA_FAIL["✗ Not accessible<br/>Needs adjustment"]

    WCAG_AAA --> AAA_CHECK{"Meets AAA?"}
    AAA_CHECK -->|Yes| AAA_PASS["✓ Enhanced<br/>Excellent contrast"]
    AAA_CHECK -->|No| AAA_FAIL["✗ Enhanced not met<br/>AA still valid"]

    SUGGEST --> ADJUST["Lightness adjustment<br/>in percentage points"]
    ADJUST --> APPLY["Apply to foreground<br/>lighten() or darken()"]

    style CR fill:#3b82f6,color:#fff
    style WCAG_AA fill:#10b981,color:#fff
    style WCAG_AAA fill:#8b5cf6,color:#fff
    style SUGGEST fill:#f59e0b,color:#000
    style AA_PASS fill:#10b981,color:#fff
    style AAA_PASS fill:#8b5cf6,color:#fff
```

### Color Utility API

```mermaid
graph TB
    subgraph Interface["OklchColor Interface"]
        direction LR
        IL["l: number<br/>0-100"]
        IC["c: number<br/>0-0.4"]
        IH["h: number<br/>0-360"]
        IA["a?: number<br/>0-1"]
    end

    subgraph Parsing["Parsing Functions"]
        direction LR
        P1["parseOklch(string)"]
        P2["Input: 'oklch(75% 0.18 195)'<br/>or '75% 0.18 195'"]
    end

    subgraph Serialization["Serialization"]
        direction LR
        S1["toOklchString(color)"]
        S2["Output: 'oklch(75% 0.18 195)'"]
    end

    subgraph Manipulation["Manipulation"]
        direction LR
        M1["lighten()"]
        M2["darken()"]
        M3["saturate()"]
        M4["desaturate()"]
        M5["rotateHue()"]
        M6["setAlpha()"]
        M7["mix()"]
    end

    subgraph Accessibility["Accessibility"]
        direction LR
        A1["contrastRatio()"]
        A2["meetsWcagAA()"]
        A3["meetsWcagAAA()"]
        A4["suggestContrastAdjustment()"]
    end

    Interface --> Parsing
    Parsing --> Serialization
    Serialization --> Manipulation
    Manipulation --> Accessibility

    style Interface fill:#3b82f6,color:#fff
    style Parsing fill:#10b981,color:#fff
    style Serialization fill:#10b981,color:#fff
    style Manipulation fill:#f59e0b,color:#000
    style Accessibility fill:#8b5cf6,color:#fff
```

---

## Component Interaction Diagram

Full system view showing how components interact within the Clarity AI Chat ecosystem.

### High-Level Component Interactions

```mermaid
graph TB
    APP["Clarity AI Chat App"]

    APP --> CP["CommandPalette<br/>Command execution<br/>Keyboard shortcuts"]
    APP --> AR["AudioRecorder<br/>Voice input<br/>Real-time waveform"]
    APP --> CI["ChatInput<br/>Text input<br/>Token aware"]
    APP --> DM["Message Display<br/>Content rendering<br/>User/AI messages"]

    CP -->|Execute Command| APP
    CP -->|AI Context| APP

    AR -->|Audio Blob| APP
    AR -->|Duration/Amplitude| APP

    CI -->|Text Message| APP
    CI -->|Token Budget| APP

    DM -->|User Interaction| APP

    subgraph Utilities["Shared Utilities"]
        COLOR["Color System<br/>OKLCH utilities<br/>Contrast checking"]
        TOKENS["Token Management<br/>Budget tracking<br/>Optimization"]
        A11Y["Accessibility<br/>Focus management<br/>ARIA labels"]
    end

    APP --> Utilities
    CP --> COLOR
    CI --> TOKENS
    DM --> A11Y
    AR --> A11Y

    style APP fill:#3b82f6,color:#fff
    style CP fill:#8b5cf6,color:#fff
    style AR fill:#f59e0b,color:#000
    style CI fill:#10b981,color:#fff
    style DM fill:#ec4899,color:#fff
    style Utilities fill:#6b7280,color:#fff
```

### State Management Flow

```mermaid
graph LR
    UI["UI Layer<br/>Components"]
    HOOKS["Custom Hooks<br/>useClarityChat<br/>useTokenBudget"]
    CONTEXT["React Context<br/>ChatContext<br/>UIContext"]
    STORE["State Store<br/>Messages<br/>Configuration"]
    API["Backend API<br/>Chat endpoint<br/>Token service"]

    UI -->|User Actions| HOOKS
    HOOKS -->|Update State| CONTEXT
    CONTEXT -->|Distribute State| UI
    CONTEXT -->|Access State| STORE
    STORE -->|Fetch/Update| API
    API -->|Response| STORE
    STORE -->|Notify| CONTEXT

    style UI fill:#3b82f6,color:#fff
    style HOOKS fill:#10b981,color:#fff
    style CONTEXT fill:#8b5cf6,color:#fff
    style STORE fill:#f59e0b,color:#000
    style API fill:#ec4899,color:#fff
```

### Data Flow: Voice Input to Message

```mermaid
sequenceDiagram
    participant User
    participant AR as AudioRecorder
    participant APP as App State
    participant API as Backend
    participant UI as Message UI

    User->>AR: Click Start Recording
    AR->>AR: Acquire microphone
    AR->>AR: Start amplitude monitoring

    User->>AR: Speak
    AR->>AR: Update waveform visualization

    User->>AR: Click Stop
    AR->>AR: Create Blob from chunks
    AR->>AR: Create Object URL
    AR->>APP: onStop(audioBlob, audioUrl)

    APP->>API: POST /api/transcribe<br/>audioBlob
    API->>API: Speech-to-text conversion
    API->>APP: { text: "...", confidence: 0.95 }

    APP->>APP: Append to messages
    APP->>API: POST /api/chat<br/>{ role: "user", content: "..." }

    API->>API: AI processing
    API->>APP: Streaming response

    APP->>UI: Update message list
    UI->>User: Display response

    AR->>AR: Cleanup (close context, stop stream)
```

### CommandPalette Integration

```mermaid
sequenceDiagram
    participant User
    participant CP as CommandPalette
    participant App as Application State
    participant Service as Service Handler

    User->>CP: Press Cmd+K
    CP->>CP: open=true, focus input

    User->>CP: Type command name
    CP->>CP: Filter items (debounced 150ms)
    CP->>CP: Update groupedItems

    User->>CP: Press arrow keys
    CP->>CP: Update selectedIndex
    CP->>CP: Scroll item into view

    User->>CP: Press Enter
    CP->>CP: Get selected item
    CP->>CP: Call item.onSelect()

    note over Service
        onSelect is custom handler<br/>from parent component
    end note

    Service->>App: Execute command
    App->>App: Update state

    CP->>CP: Call onClose()
    CP->>CP: open=false, restore focus

    App->>User: Reflect changes in UI
```

### Component Dependencies

```mermaid
graph TD
    CP["CommandPalette"]
    AR["AudioRecorder"]
    CI["ChatInput"]

    CP -->|Uses| KBD["Kbd Component"]
    CP -->|Uses| MOTION["Framer Motion"]
    CP -->|Uses| PRIM["Primitives<br/>cn, useReducedMotion"]
    CP -->|Uses| A11Y["A11y Hooks<br/>useFocusTrap<br/>useFocusRestoration"]
    CP -->|Uses| UTILS["Utils<br/>useDebounce"]

    AR -->|Uses| MOTION
    AR -->|Uses| PRIM
    AR -->|Uses| A11Y
    AR -->|Uses| ICONS["Lucide Icons"]
    AR -->|Uses| WEB_AUDIO["Web Audio API<br/>MediaRecorder<br/>AudioContext"]

    CI -->|Uses| TOKENS["Token Budget<br/>useTokenBudget"]
    CI -->|Uses| MOTION
    CI -->|Uses| PRIM
    CI -->|Uses| A11Y

    UTILS -->|Dependency| MOTION
    A11Y -->|Dependency| PRIM

    style CP fill:#8b5cf6,color:#fff
    style AR fill:#f59e0b,color:#000
    style CI fill:#10b981,color:#fff
    style MOTION fill:#3b82f6,color:#fff
    style PRIM fill:#3b82f6,color:#fff
    style A11Y fill:#10b981,color:#fff
    style WEB_AUDIO fill:#ef4444,color:#fff
```

---

## Rendering Strategy

### Performance Optimization Patterns

```mermaid
graph TD
    subgraph Memo["Memoization"]
        M1["React.memo()<br/>Prevent unnecessary re-renders"]
        M2["useMemo()<br/>Expensive computations<br/>filteredItems, groupedItems"]
        M3["useCallback()<br/>Event handlers<br/>startRecording, stopRecording"]
    end

    subgraph Debounce["Debouncing"]
        D1["useDebounce<br/>Search input (150ms)<br/>Prevents excessive filtering"]
    end

    subgraph Portal["Portals"]
        P1["createPortal<br/>CommandPalette modal<br/>Avoids z-index conflicts"]
    end

    subgraph Virtual["Virtual Rendering"]
        V1["Future optimization<br/>Large command lists<br/>100+ items"]
    end

    style Memo fill:#10b981,color:#fff
    style Debounce fill:#f59e0b,color:#000
    style Portal fill:#8b5cf6,color:#fff
    style Virtual fill:#3b82f6,color:#fff
```

---

## Testing Architecture

### Component Test Coverage

```mermaid
graph TD
    subgraph Unit["Unit Tests"]
        U1["OKLCH utilities<br/>parseOklch()<br/>contrastRatio()<br/>manipulation functions"]
        U2["Hook tests<br/>AudioRecorder hooks<br/>Custom handlers"]
    end

    subgraph Integration["Integration Tests"]
        I1["CommandPalette<br/>Search + navigation<br/>Keyboard shortcuts<br/>Selection"]
        I2["AudioRecorder<br/>Recording flow<br/>State transitions<br/>Amplitude updates"]
    end

    subgraph A11y["Accessibility Tests"]
        A1["ARIA attributes<br/>Keyboard navigation<br/>Screen reader support"]
        A2["Color contrast<br/>WCAG compliance<br/>Light/dark modes"]
    end

    subgraph E2E["End-to-End Tests"]
        E1["User workflows<br/>Voice message creation<br/>Command execution"]
    end

    style Unit fill:#10b981,color:#fff
    style Integration fill:#3b82f6,color:#fff
    style A11y fill:#f59e0b,color:#000
    style E2E fill:#8b5cf6,color:#fff
```

---

## Key Features Summary

### CommandPalette Key Features

- Keyboard navigation (arrow keys, home/end)
- Real-time search filtering with debouncing
- Category grouping for organization
- AI context display (model, tokens, conversation ID)
- Keyboard shortcuts display
- Focus trap and restore on open/close
- Portal rendering for z-index isolation
- Reduced motion support
- Accessibility first (ARIA, keyboard, screen readers)

### AudioRecorder Key Features

- Multiple output formats (WebM, MP3, WAV, OGG, FLAC)
- Real-time waveform visualization
- Input level metering
- Voice activity detection for pause/resume
- Duration timer with minimum/maximum limits
- Configurable audio processing (noise cancellation, echo cancellation, auto-gain)
- Permission handling and error states
- Mobile-responsive UI
- Full accessibility support

### OKLCH Color System Key Features

- Type-safe color manipulation
- Perceptually uniform color space
- Contrast ratio calculation
- WCAG AA/AAA compliance checking
- Lightness, chroma, and hue adjustments
- Color mixing and interpolation
- Accessibility-first design
- CSS output formatting

---

## Related Documentation

- [Architecture](../architecture.md)
- [Component Guidelines](../../packages/react/CLAUDE.md)
- [Best Practices](../best-practices.md)
- [API Reference](../api-reference.md)
