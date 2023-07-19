# web
The `kjvonly` web app.

# hosting
Clone data repo somewhere on your host

```git clone https://github.com/kjvonly/data.git
```

```
docker run --name kjvonly-web -d -v <path-to-json.gz-dir>:/usr/src/kjvdata/json.gz -p 5000:5000 ghcr.io/kjvonly/web:v0.1.0

e.g. docker run --name kjvonly-web -d -v /home/username/kjvonly/data/json.gz:/usr/src/kjvdata/json.gz -p 5000:5000 ghcr.io/kjvonly/web:v0.1.0
```
## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
