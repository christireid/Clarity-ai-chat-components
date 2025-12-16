import os
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    has_logger_import = False
    
    # Filter out existing bad imports
    for line in lines:
        if '@clarity-chat/utils/logger' in line:
            has_logger_import = True
            continue # Skip this line
        new_lines.append(line)

    # If we didn't find any logger import to remove, maybe we don't need to touch it, 
    # but the previous grep said we should. 
    # However, if we are running this on ALL files, we should check usage.
    
    content = "".join(new_lines)
    
    # Check usage
    needs_logger = 'logger.' in content or 'SecureLogger.' in content or 'error(' in content
    
    if needs_logger:
        # Add import at the top
        # Check for shebang
        if new_lines and new_lines[0].startswith('#!'):
            new_lines.insert(1, "import { logger } from '@clarity-chat/utils/logger';\n")
        else:
            new_lines.insert(0, "import { logger } from '@clarity-chat/utils/logger';\n")
            
        # Replace function calls
        # content is stale, update it from new_lines? No, better to do replacements on content then rebuild lines.
        # Actually, let's just do simple replacements on the list of lines
        
        final_lines = []
        for line in new_lines:
            # Replace error(...) with logger.error(...)
            # Be careful not to replace 'throw new error(' or definition 'function error('
            # Simple regex is safer, but basic replacement might work for this codebase's style
            if 'error(' in line and 'logger.error(' not in line and 'console.error(' not in line and 'function' not in line and 'const error' not in line:
                 line = line.replace('error(', 'logger.error(')
            
            # Replace SecureLogger.* with logger.*
            if 'SecureLogger.' in line:
                line = line.replace('SecureLogger.', 'logger.')
                
            final_lines.append(line)
            
        with open(filepath, 'w') as f:
            f.writelines(final_lines)
    else:
        # Just write back the clean lines (imports removed)
        with open(filepath, 'w') as f:
            f.writelines(new_lines)

# Find all ts/tsx files in apps/docs
files = []
for root, dirs, files_in_dir in os.walk('apps/docs'):
    for file in files_in_dir:
        if file.endswith('.ts') or file.endswith('.tsx'):
            files.append(os.path.join(root, file))

# Also packages
for root, dirs, files_in_dir in os.walk('packages'):
    if 'node_modules' in root: continue
    for file in files_in_dir:
        if file.endswith('.ts') or file.endswith('.tsx'):
            files.append(os.path.join(root, file))

for file in files:
    try:
        process_file(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")
