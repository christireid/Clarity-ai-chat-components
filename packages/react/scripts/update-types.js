const fs = require('fs')
const path = require('path')

const srcTypesPath = path.resolve(__dirname, '../src/index.d.ts')
const distTypesPath = path.resolve(__dirname, '../dist/index.d.ts')

const srcTypes = fs.readFileSync(srcTypesPath, 'utf8')
const content = `${srcTypes}\nexport * from "@clarity-chat/types";\n`

fs.writeFileSync(distTypesPath, content)
