# CODEVERSE architecture notes

## Trust boundary

```text
       Learner edits approved subset code
                      |
                      v
                Source parser
       (no eval, import, OS, network)
                      |
            Error OR typed trace
                      |
                      v
              Immutable snapshots
                      |
               Timeline cursor
                      |
          2D graph / output / caption

 Guided advanced content ---> explicit illustrative events
 (not Python execution)     (no fabricated stdout)
```

## Data separation

1. `src/engine/execution/interpreter.ts` computes source-specific typed snapshots; syntax that is not implemented throws `UnsupportedSyntax`.
2. `src/engine/timeline/controller.ts` navigates the ordered snapshots without mutating execution state.
3. `src/components/simulation/ObjectGraph.tsx` renders the supplied snapshot as name→object references. The graph explicitly describes a conceptual model rather than physical memory addresses.
4. `src/lessons/pythonLessons.json` is the durable ordered 21-topic curriculum, in the original PDF's sequence.
5. `src/storage/progress.ts` stores validated progress records in IndexedDB and performs schema-checked import/export.
6. `src/app/App.tsx` implements the eight navigable screens and coordinates lesson interactions.
7. `src/components/navigation/Atlas3D.tsx` is loaded lazily only in optional 3D mode. The 2D world cards are always present.

## State machine

```text
NOT_STARTED --visit any step--> LEARNING
LEARNING --any assessment attempted/passed--> PRACTICING
PRACTICING --all nine visited, quiz, predict, repair, build,
             verified mini-project, and integrated-project evidence-->
             DEMONSTRATED
```

A quiz score alone is never counted as mastery. Advanced-topic mastery deliberately cannot pass absent a working executable check. 3D and 2D share identical navigation links.

## Technical limitations

The subset parser covers name assignment, literals, lists, indexing, arithmetic, len, list append and print. Parsing is hand-built for didactic input, **not production Python semantics**. `curatedTrace` illustrates advanced concepts using human-written text frames, never executing arbitrary Python.

**Future design checkpoint:** do not bolt speculative `eval` calls onto the existing tracer. Design a new adapter with a language grammar / secure interpreter boundary and tests for aliases, control flow, exceptions, callable frames and output. Reuse the existing `Trace` timeline contract after any schema migrations.
