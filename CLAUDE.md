# CLAUDE.md

- Whenever its possible, run subagents in parallel to do the work
- Ever make sure tests and lints are passing after finishing your job
- Make sure that isnt usage of deprecated methods, except if user explicity agree
- Every unit test must not mock any component, only the edges like repositories, data-sources, timers etc.
- Focus on testing behavior and not code it self, it creates smarter tests.
- Avoid making comments at code, do it only if its really necessary, but if it is, rethink about the solution because most of the time good functions doesnt need comments to be understand.
- Follow react-native best practices when creating components, pages and hooks. Avoid unecessary re-renders and commit with single responsibility principle.
- Always prefer using tailwind for styles, use styles prop only when tailwind can't be used for a valid reason
- Use context and lift up state when needed.
- Whenever changing code, doesnt change its behavior unless it is really wrong, ask me if its the case.
