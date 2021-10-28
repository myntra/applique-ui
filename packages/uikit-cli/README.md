# @myntra/uikit-cli

## Installation


```
npm install -g @myntra/uikit-cli
yarn add -g @myntra/uikit-cli
```

## Usage

```
uikit [options] [command]


uikit --help

UIKit for All. Build fast. Break things.

Options:
  -v, --version              output the version number
  -h, --help                 output usage information

Commands:
  codemods [option]          List all available migration transforms
  lint [options] [paths...]  Opinionated code style and formatter
  migrate [options] <path>   Opinionated code style and formatter
```

UIKit cli can be used to perform below mentioned tasks

1. List all available codemods to perform migration 
2. Migrate from unity-uikit to @myntra/uikit
3. Lint the application

### Codemods
Codemods are basically scripts written using [jscodeshift](https://github.com/facebook/jscodeshift) which will be used to migrate to @mytra/uikit from unity-uikit
All the codemods resides in @myntra/codemod-utils module. Command for installation:


```
npm install @myntra/codemod-utils
yarn add @myntra/codemod-utils
```

UIKit cli can fetch all the codemods from this module and will list them down using command:

```
uikit codemods
```

### Migrate

This command is reposible to perform the actual migration using the codemods listed above.
 

```
uikit migrate [options] <path>


uikit migrate --help

Run codemods for migrating to UIKit

Options:
  --no-commit                   do not commit changes
  -a, --apply                   apply changes to code
  -o, --only                    run only specified codemods (run `uikit codemods` to get list of options)
  -r, --recursive               run recursively
  -t, --theme-name              UIKit theme used for app
  -p, --package-name            Mention the package you are using currently(It should any one of @myntra/uikit, @myntra/uikit-theme-unity, @myntra/uikit-theme-nuclei)
  -l, --nolint                  Disable linting
  -h, --help                    output usage information
```

The command comes with multiple options to like
* --no-commit: A dry run to check which files are migrated and exactly what code changes are done
* --apply: All the changes will be commited and will be ready to be pushed.
* --only: To be used in case only specific codemod is to be used. Eg: button, input-text.
* --recursive: Will recursively run on all the jsx and js file in case a folder path is mentioned.
* --theme-name: This is an important option. Mention the uikit theme you want to use(nuclei or unity)

Sample command
```
uikit migrate apps/Contracts/ --no-commit --recursive --theme-name='nuclei'
```

This will migrate unity-uikit component to @myntra/uikit in all the files under apps/Contracts/ directory

These npm packages will be required for migrate to successfully run:

* eslint-plugin-standard
* eslint-plugin-babel
* eslint@4.19.1
* @myntra/codemod-utils

Please install these packages before running the migrate command

### Lint

This command will perform linting.

```
uikit lint [options] [path]


uikit lint --help

Opinionated code style and formatter

Options:
  --no-commit  do not commit changes
  -h, --help   output usage information
```

The --no-commit option will perform in the similar way as was for migrate

```
uikit lint apps/Contracts/ --no-commit
```

This command will lint all the files under apps/Contracts/ directory