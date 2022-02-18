# gulp-sass-import-json

Gulp plugin for sass

## Install

```bash
npm i gulp-sass-import-json
```

## Configuration

### sassImportJson([options])

#### options.isSсss

Type: `Boolean`

Set it to `true` if you want to have SCSS syntax. Otherwise it will be Sass syntax.

Default value is `false`.

#### options.cache

Type: `Boolean`

Cache the imported JSON files. Caching makes builds faster. If you have watch tasks and want to reload changes to the JSOn files, you have to use `false`.

Default value is `true`.

## Example

//gulp-build.js

```js
var sassImportJson = require('gulp-sass-import-json');

gulp.src('/path/example.sass')
    .pipe(sassImportJson()) //add plugin before sass render
    .pipe(gulp.sass());
```

//example.sass

```sass
@import '_variables.json'

div.error
    color: map-get($colors, error)
    font-size: $medium
```

//\_variables.json (JSON: root element must be Object ONLY!)

```json
{
    "colors": {
        "error": "#f00",
        "success": "#0f0"
    },
    "medium": "12px"
}
```

## Note

Using a JSON file in which the value of an entry is set to a percentage character (`%`) throws a warning. These percentage characters cannot be mapped to SCSS and will be replaced with `null`.

Using a JSON file in which the key of an entry is set to dollar character (`$`) throws a warning. These entries cannot be mapped to SCSS and will be ignored.
