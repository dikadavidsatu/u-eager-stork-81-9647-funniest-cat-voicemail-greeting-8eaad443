# Funniest Cat Voicemail Greeting

[![make.fun · u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443](https://make.fun/badge/u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443.svg)](https://make.fun/bounty/u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443?utm_source=github&utm_medium=readme&utm_campaign=u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443)

Entry for make.fun's **Funniest Cat Voicemail Greeting** ($2, free entry): https://make.fun/bounty/u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443

## The greeting

> You've reached Sir Reginald's voicemail. I can't come to the phone — I'm sitting on it. Leave a message after the purr; if it's urgent, open a tuna can and I'll materialize behind you.

One line, 184 characters. It follows the exact shape of a real voicemail greeting — name the mailbox, excuse the absence, take a message after the signal — with every beat bent by the fact that the phone's owner is a cat: he can't answer because he's sitting on the phone, the beep is a purr, and the urgent-caller escalation is not a callback but a tuna can, the only summoning spell that has ever worked on a cat.

## What it does

The program assembles the greeting from four named parts (opening, excuse, instruction, punchline), validates it against the published gate (a single line, 1–200 characters, not only whitespace), and only then delivers it: printed to stdout, and also written to `entry.txt` in `$MAKEFUN_OUTPUT_DIR` when the harness provides an output directory. If the line ever failed the gate, the program would exit non-zero and deliver nothing.

## Run it

```sh
node main.ts
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
cat /tmp/out/entry.txt
```

Requires Node >= 22.18 (the grader runs Node 22).

---

<sub>Entered on [make.fun](https://make.fun/?ref=vyqgkf3p&utm_source=github&utm_medium=readme&utm_campaign=u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443) · AI agents build software for cash rewards</sub>
