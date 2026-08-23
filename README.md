# Upkeep — Commercial Building Maintenance Tracker

A lightweight scheduler and log for recurring and one-off maintenance tasks
in a commercial office building. Tracks work by building system (HVAC,
Electrical, Plumbing, Fire Prevention, Elevators, Landscaping, Atrium
Landscape, Structural & Exterior, General), and by who performs it
(building engineer vs. outside vendor).

## Features

- **Dashboard** — a desk-calendar strip for the coming 7 days, plus
  overdue/due-this-week counts and recent completions
- **Tasks** — organized into sections per building system, with built-in
  suggested tasks for each system (e.g. Fire Prevention → backup battery
  voltage check, semi-annual system test)
- **Log** — history of completed work: who did it, when, and notes
- Recurring tasks (weekly through annual) auto-reschedule on completion;
  one-off tasks drop off the list once completed
- Shared, team-wide data when hosted via `server.js` (see below) — not
  just saved to one person's browser

## Project structure

```
maintenance-tracker.html   the app itself (single-file frontend)
server.js                  tiny Node.js backend — serves the app and
                            stores shared team data in data.json
package.json                project metadata / npm start script
Dockerfile                  optional container build
.gitignore                  keeps data.json and node_modules out of git
```

No npm dependencies are required — `server.js` only uses Node's built-in
`http` and `fs` modules.

## Running it locally

```
node server.js
```

Then open `http://localhost:8080`. Data is stored in `data.json` next to
`server.js`, created automatically on first save.

## Deploying on a Synology NAS

**Option A — Node.js package**
1. Install the **Node.js** package from Package Center.
2. Copy this whole folder onto the NAS.
3. Run `node server.js` over SSH, or set it up in **Task Scheduler** as a
   "Triggered Task → User-defined script" that runs `node server.js` on
   boot, so it survives restarts.
4. The app listens on port `8080` by default (`http://<nas-ip>:8080`).
   Set the `PORT` environment variable to change it.

**Option B — Docker / Container Manager**
1. Build the image from the included `Dockerfile`.
2. Run the container with port `8080` exposed (map it to whatever host
   port you prefer).
3. Container Manager handles restarts automatically, which is more
   robust for a "leave it running" service than a plain SSH session.

Either way, you can point Synology's reverse proxy (plus DDNS and a
certificate, if you want it reachable outside your LAN) at that port for
a clean URL.

## Known limitations

- No login or per-user accounts — anyone with the URL sees and edits the
  same shared task list.
- No conflict resolution — if two people save at the same moment, the
  second save wins (last-write-wins on the full list). Fine for a small
  facilities team, worth knowing before relying on it for anything
  contentious.
- `data.json` is a flat file, not a database — solid for a single
  building's worth of tasks, not built for heavy concurrent load.
