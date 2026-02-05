#!/bin/bash
# Add Network Status button to navigation

sed -i '' '/Token Optimization<\/button>/a\
          <button\
            className={currentView === '"'"'network-status'"'"' ? '"'"'active'"'"' : '"'"''"'"'}\
            onClick={() => setCurrentView('"'"'network-status'"'"')}\
          >\
            Network Status\
          </button>
' src/App.tsx
