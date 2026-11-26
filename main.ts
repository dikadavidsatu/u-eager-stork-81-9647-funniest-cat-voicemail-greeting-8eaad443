// SPDX-License-Identifier: MIT
//
// Funniest Cat Voicemail Greeting
// -------------------------------
// Competition: u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443
//
// What this program does
// ----------------------
// It prints exactly one line to stdout: a voicemail greeting recorded by a
// cat. One line, nothing before it and nothing after it, because the line
// itself is the whole entry.
//
// Why a program at all, for one fixed line?
// ------------------------------------------
// The competition is a program/v1 harness: the grader runs this file in a
// fresh sandbox and judges what it produces. So the greeting cannot just
// sit in a text file in the repo; the program has to produce it, and it has
// to prove to itself -- before printing anything -- that the line it is
// about to emit satisfies the published gate:
//
//   * it is a single line (no embedded newline or carriage return),
//   * it holds between 1 and 200 characters,
//   * it is not only whitespace.
//
// If any of those checks fails the program exits non-zero and prints
// nothing, because an invalid entry is never judged and takes no prize. A
// loud failure here is far better than a silent invalid entry.
//
// How the greeting itself is built
// --------------------------------
// A voicemail greeting has a shape every caller recognises -- "you've
// reached X", an excuse for not picking up, and "leave a message after the
// beep" -- so the greeting is assembled from four named parts that follow
// that shape, each one twisted by the fact that the phone's owner is a cat:
//
//   * OPENING     -- the standard "you've reached ..." line, except the
//                    mailbox belongs to Sir Reginald, a cat with a title
//                    and no intention of ever returning a call.
//   * EXCUSE      -- the reason he cannot come to the phone: he is sitting
//                    on it. The most believable excuse a cat has ever given,
//                    because it is also a confession.
//   * INSTRUCTION -- "leave a message after the purr": the beep, translated
//                    into cat.
//   * PUNCHLINE   -- the escalation clause. Urgent callers do not get a
//                    callback; they get a summoning ritual. Open a tuna can
//                    and the cat materialises behind you -- which is funnier
//                    than "I'll call you back" and also, empirically, true.
//
// The parts are joined by single spaces and the result is checked against
// the gate before it is printed, so the line a judge reads is the line this
// file assembles, character for character, every run.
//
// The line is also written, byte for byte, to `entry.txt` inside the
// directory named by the MAKEFUN_OUTPUT_DIR environment variable when the
// harness provides one: some scorers read stdout and some read the output
// directory, and the entry is the same line either way. When no output
// directory is provided the program simply prints, which keeps a bare
// `node main.ts` run working anywhere.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Gate constants -- the published gate, written out as named values so the
// checks below read as the rules themselves rather than magic numbers.
// ---------------------------------------------------------------------------

/** Maximum characters the gate allows in the entry line (inclusive). */
const MAX_CHARS = 200;

/** Minimum characters the gate allows in the entry line (inclusive). */
const MIN_CHARS = 1;

/** Name of the file the greeting is written to in the output directory. */
const OUTPUT_FILENAME = "entry.txt";

/** Name of the environment variable that names the output directory. */
const OUTPUT_DIR_ENV = "MAKEFUN_OUTPUT_DIR";

// ---------------------------------------------------------------------------
// The greeting, in four parts: opening, excuse, instruction, punchline.
// ---------------------------------------------------------------------------

/**
 * The opening. Every voicemail greeting starts by naming the mailbox, and
 * this mailbox belongs to a cat who has been given a knightly name he did
 * nothing to earn. "Sir Reginald" does quiet work here: it sets up a formal,
 * butler-ish register that the rest of the line keeps puncturing.
 */
const OPENING = "You've reached Sir Reginald's voicemail.";

/**
 * The excuse. A human says "I can't come to the phone right now"; a cat
 * gives the real reason. Sitting on the phone is simultaneously why he
 * cannot answer it, where he is, and what he thinks of your call -- three
 * beats of character in one short clause, with no word wasted.
 */
const EXCUSE = "I can't come to the phone — I'm sitting on it.";

/**
 * The instruction. Callers are told to leave a message after the beep; a
 * cat's phone has no beep, it has a purr. Swapping one word keeps the
 * sentence instantly recognisable as a voicemail greeting while making it
 * unmistakably feline.
 */
const INSTRUCTION = "Leave a message after the purr;";

/**
 * The punchline. Urgent messages get an escalation path, and for a cat the
 * only reliable summoning spell ever discovered is the sound of a tuna can
 * opening. "Materialize behind you" is the payoff image: no callback, no
 * ringing phone -- the cat is simply suddenly there, the way cats are.
 * The line ends on that image and stops; nothing after a punchline is
 * anything but a apology for it.
 */
const PUNCHLINE =
  "if it's urgent, open a tuna can and I'll materialize behind you.";

// ---------------------------------------------------------------------------
// Greeting assembly
// ---------------------------------------------------------------------------

/**
 * Join the four parts into the finished one-line greeting.
 *
 * The parts are stored separately so the structure of the joke (greeting,
 * excuse, instruction, escalation) stays visible in the source, and so a
 * future edit can swap any one beat without touching the others. The join
 * is a single space between parts: the opening and the excuse each carry
 * their own full stop, the instruction ends on a semicolon that hands the
 * sentence to the punchline, and the punchline's full stop is the last
 * character of the line -- the joke lands and the line stops.
 */
function buildGreeting(): string {
  return [OPENING, EXCUSE, INSTRUCTION, PUNCHLINE].join(" ");
}

// ---------------------------------------------------------------------------
// Gate validation
// ---------------------------------------------------------------------------

/**
 * Count characters the way the gate does: by Unicode code point, not by
 * UTF-16 code unit and not by byte. Spreading the string into an array
 * splits it on code points, so an em dash or any other non-ASCII character
 * counts as one character, exactly as a human counting the line would
 * count it.
 */
function countChars(text: string): number {
  return [...text].length;
}

/**
 * True when the text is a single line: it contains no line feed and no
 * carriage return anywhere. A greeting that wraps onto a second line is a
 * different entry, and the gate's "one line" reading would fail it.
 */
function isSingleLine(text: string): boolean {
  return !text.includes("\n") && !text.includes("\r");
}

/**
 * True when the text is more than whitespace. A line of spaces would pass
 * a bare length check, so the gate explicitly refuses it; check for it
 * here rather than trusting the length range alone.
 */
function hasNonWhitespace(text: string): boolean {
  return text.trim().length > 0;
}

/**
 * Check the finished greeting against every clause of the published gate
 * and return the list of violations found. An empty list means the
 * greeting is valid and may be printed. Returning the violations (instead
 * of throwing on the first one) makes a failure self-describing: the error
 * message names every rule the line broke, which is what you want when
 * debugging a rejected entry instead of a bare "invalid".
 */
function validateGreeting(greeting: string): string[] {
  const violations: string[] = [];
  const length = countChars(greeting);

  if (length < MIN_CHARS) {
    violations.push(
      `too short: ${length} characters, gate requires at least ${MIN_CHARS}`,
    );
  }
  if (length > MAX_CHARS) {
    violations.push(
      `too long: ${length} characters, gate allows at most ${MAX_CHARS}`,
    );
  }
  if (!hasNonWhitespace(greeting)) {
    violations.push("only whitespace: gate requires non-whitespace content");
  }
  if (!isSingleLine(greeting)) {
    violations.push("more than one line: the entry must be a single line");
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/**
 * Resolve the output directory from the environment.
 *
 * The harness hands the program its output directory through
 * MAKEFUN_OUTPUT_DIR. Reading the directory from the environment -- never
 * a hardcoded path -- is what makes the same program work in the grading
 * sandbox, in a local test run, and anywhere else the harness points it.
 * When the variable is missing or empty this returns null, which the
 * caller treats as "stdout only": a plain local run has no output
 * directory and should not fail for lacking one.
 */
function resolveOutputDir(): string | null {
  const dir = process.env[OUTPUT_DIR_ENV];
  if (dir === undefined || dir.trim().length === 0) {
    return null;
  }
  return dir;
}

/**
 * Write the greeting to `entry.txt` inside the given output directory.
 *
 * The file holds exactly the greeting plus one trailing newline: the same
 * bytes the program prints to stdout, so the two channels can never
 * disagree about what the entry says. The directory is created if it does
 * not exist yet, so the program does not depend on the harness having
 * made it. A write failure throws, and the caller turns that into a
 * non-zero exit: a run that could not deliver its entry must not report
 * success.
 */
function writeEntryFile(outputDir: string, greeting: string): string {
  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, OUTPUT_FILENAME);
  writeFileSync(filePath, `${greeting}\n`, "utf8");
  return filePath;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Build the greeting, hold it against the gate, and only then deliver it.
 *
 * Delivery is two channels carrying one line: the greeting is printed to
 * stdout, and -- when the harness named an output directory -- written to
 * `entry.txt` there as well. The greeting itself contains no newline, so
 * the run's output is exactly one line either way. Any gate violation is
 * reported on stderr and ends the process non-zero with nothing printed
 * and nothing written, so a broken edit can never slip a non-compliant
 * line past the grader.
 */
function main(): void {
  const greeting = buildGreeting();
  const violations = validateGreeting(greeting);

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(`gate violation: ${violation}`);
    }
    process.exit(1);
  }

  console.log(greeting);

  const outputDir = resolveOutputDir();
  if (outputDir !== null) {
    writeEntryFile(outputDir, greeting);
  }
}

main();
