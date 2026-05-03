\# SignalWeaver Site Setup



This repository contains the SignalWeaver website and live demo.



The frontend connects to the SignalWeaver backend through API proxy routes that are already included in the codebase.



\## How the demo works



\- /api/evaluate → forwards to backend /gate/evaluate

\- /api/replay/\[traceId] → forwards to backend /gate/replay/{trace\_id}



\## Environment variables



Create a file called .env.local in the root of the project.



Add this inside it:



SIGNALWEAVER\_API\_BASE\_URL=http://localhost:8000

SIGNALWEAVER\_BEARER\_TOKEN=your\_backend\_token

SIGNALWEAVER\_API\_KEY=your\_optional\_api\_key



\## Run locally



npm install

npm run dev



Then open:

http://localhost:3000



\## Backend requirement



The backend must be running at:

http://localhost:8000



Required endpoints:

\- POST /gate/evaluate

\- GET /gate/replay/{trace\_id}



\## Deployment (Vercel)



Set the same environment variables in the Vercel dashboard:



\- SIGNALWEAVER\_API\_BASE\_URL

\- SIGNALWEAVER\_BEARER\_TOKEN

\- SIGNALWEAVER\_API\_KEY



Then redeploy.



\## Notes



The previous setup script (apply-site-fix.py) has been removed.



All required API routes and components are already committed.

