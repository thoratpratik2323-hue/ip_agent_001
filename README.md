# IP Codemaker Agent

<p align="center">
  <a href="https://github.com/ultraworkers/claw-code">IP Verse / IP Codemaker Agent</a>
  ·
  <a href="./USAGE.md">Usage</a>
  ·
  <a href="./rust/README.md">Rust workspace</a>
  ·
  <a href="./PARITY.md">Parity</a>
  ·
  <a href="./ROADMAP.md">Roadmap</a>
</p>

<p align="center">
  <img src="assets/claw-hero.jpeg" alt="IP Codemaker Agent" width="300" />
</p>

IP Codemaker Agent is a specialized AI development assistant and a part of the **IP Verse** ecosystem. It is designed to work for the owners of IP Verse, specifically **Agent Red** (Pratik) and **Agent Purple** (Ishika).

## Core Identity

- **Name**: IP Codemaker Agent
- **Owner**: Pratik
- **Ecosystem**: IP Verse
- **Principal Users**: Agent Red (Pratik) & Agent Purple (Ishika)

> [!IMPORTANT]
> Start with [`USAGE.md`](./USAGE.md) for build, auth, CLI, session, and parity-harness workflows. Make `claw doctor` your first health check after building, use [`rust/README.md`](./rust/README.md) for crate-level details, read [`PARITY.md`](./PARITY.md) for the current Rust-port checkpoint, and see [`docs/container.md`](./docs/container.md) for the container-first workflow.

## Current repository shape

- **`rust/`** — canonical Rust workspace and the `claw` CLI binary
- **`USAGE.md`** — task-oriented usage guide for the current product surface
- **`PARITY.md`** — Rust-port parity status and migration notes
- **`ROADMAP.md`** — active roadmap and cleanup backlog
- **`PHILOSOPHY.md`** — project intent and system-design framing
- **`src/` + `tests/`** — companion Python/reference workspace and audit helpers; not the primary runtime surface

## Quick start

```bash
cd rust
cargo build --workspace
./target/debug/claw --help
./target/debug/claw prompt "summarize this repository"
```

## Ownership / affiliation disclaimer

- This repository is owned by **Pratik**.
- This is an official component of the **IP Verse** ecosystem.
- This project is a specialized implementation of the `claw` CLI agent harness.
