const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function restore() {
  const logPath = 'C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\c29ec51f-ada9-4ba9-92c6-4d5f0a6132a5\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const filesToRestore = {};

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls && entry.tool_calls.length > 0) {
        for (const call of entry.tool_calls) {
          if (call.function && call.function.name === 'default_api:write_to_file') {
            const args = JSON.parse(call.function.arguments);
            if (args.TargetFile && args.CodeContent) {
              // We only care about files in Mantor/frontend
              if (args.TargetFile.includes('Mantor\\frontend') || args.TargetFile.includes('Mantor/frontend')) {
                filesToRestore[args.TargetFile] = args.CodeContent;
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignore parse errors on truncated lines
    }
  }

  for (const [targetPath, content] of Object.entries(filesToRestore)) {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Restored: ${targetPath}`);
  }
  console.log('Restoration complete!');
}

restore();
