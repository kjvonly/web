# web

The `kjvonly` web app.

# hosting

Clone data repo somewhere on your host

```
git clone https://github.com/kjvonly/data.git
```

```
make all
```

```
# assuming data repo is at ../data

docker run -d -p 5000:80 -v $PWD/zarf/containers/nginx/nginx.conf:/etc/nginx/nginx.conf:Z -v $PWD/zarf/containers/nginx/conf.d:/etc/nginx/conf.d:Z -v $PWD/../data:/data:z -v $HOME/bible/verses:/media/verses:Z --name nginx nginx:latest
```


# Get Started

```
# global keyboard shortcuts
shfit+X b # to open the bible buffer
shfit+X 3 # split screen vertically
shfit+X 2 # split screen horizontally
shfit+X o # move to next buffer

# Bible Buffer
k # next line
i # previous line
l # next chapter
j # previous chapter
n # page down
p # page up
g # to open goto popup (shortnames e.g mat 1 or rom 1)
s # search
```

## Developing

To serve the kjvonly data you need:

```
sudo echo localhost     kjvonly-dev-server >> /etc/hosts
pip install -r requirements
python server.py
```

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

## Dependencies

### update

```
npx npm-check-updates -u
```
