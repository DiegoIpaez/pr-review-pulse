/**
 * Sign Payload Script
 *
 * Generates a valid HMAC-SHA256 signature for GitHub webhook payloads.
 *
 * Usage:
 *   bun run .docs/events/scripts/sign-payload.ts <path-to-http-file>
 *
 * Example:
 *   bun run .docs/events/scripts/sign-payload.ts .docs/events/pull_request/opened.http
 *
 * The script will:
 * 1. Extract the JSON body from the .http file
 * 2. Generate the signature using GITHUB_WEBHOOK_SECRET from .env
 * 3. Print the signature to use in your request
 */

import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

function getWebhookSecret(): string {
  const envPath = `${process.cwd()}/.env`;
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(
      /GITHUB_WEBHOOK_SECRET=["']?([^"'\n]+)["']?/
    );
    if (match) {
      return match[1];
    }
  } catch {
    // .env not found
  }

  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.error('Error: GITHUB_WEBHOOK_SECRET not found in .env file');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.error(
    'Make sure you have GITHUB_WEBHOOK_SECRET defined in your .env'
  );
  process.exit(1);
}

function extractJsonBody(httpContent: string): string {
  // Find the empty line that separates headers from body
  const parts = httpContent.split(/\r?\n\r?\n/);
  if (parts.length < 2) {
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.error('Error: Could not find JSON body in HTTP file');
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.error(
      'Make sure the file has headers followed by an empty line and JSON body'
    );
    process.exit(1);
  }

  // The body is everything after the first empty line
  return parts.slice(1).join('\n\n').trim();
}

function generateSignature(payload: string, secret: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload, 'utf-8');
  return `sha256=${hmac.digest('hex')}`;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.log('Usage: bun run sign-payload.ts <path-to-http-file>');
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.log('');
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.log('Examples:');
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.log(
      '  bun run .docs/events/scripts/sign-payload.ts .docs/events/pull_request/opened.http'
    );
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.log(
      '  bun run .docs/events/scripts/sign-payload.ts .docs/events/review/submitted_comment.http'
    );
    process.exit(0);
  }

  const filePath = args[0];

  let httpContent: string;
  try {
    httpContent = readFileSync(filePath, 'utf-8');
  } catch {
    // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
    console.error(`Error: Could not read file: ${filePath}`);
    process.exit(1);
  }

  const secret = getWebhookSecret();
  const jsonBody = extractJsonBody(httpContent);
  const signature = generateSignature(jsonBody, secret);

  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('Generated signature for X-Hub-Signature-256 header:');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`  ${signature}`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(
    'Copy this value and replace the X-Hub-Signature-256 header in your .http file,'
  );
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('or use it directly with curl:');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('');
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`  curl -X POST http://localhost:3000/api/webhooks/github \\`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`    -H "Content-Type: application/json" \\`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`    -H "X-GitHub-Event: pull_request" \\`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`    -H "X-Hub-Signature-256: ${signature}" \\`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log(`    -d @- < <(cat ${filePath} | sed '1,/^$/d')`);
  // biome-ignore lint/suspicious/noConsole: CLI tool requires console output
  console.log('');
}

main();
