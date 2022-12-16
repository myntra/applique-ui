# $1 package/component
# $2 componentName eg.- button, accoutrement

node scripts/release.js $2 packageOnly $1

cd $1s/$2 && pnpm i && cd ../../ && CI=true npm run build $2 && cd $1s/$2 && npm publish --access public && cd ../../

node scripts/release.js $2 allFiles $1
