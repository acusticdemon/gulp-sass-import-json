#gulp-sass-import-json

Gulp plugin for sass

##Example
```js
var sassImportJson = require('gulp-sass-import-json');

gulp.src('/path/example.sass')
    .pipe(sassImportJson())
    .pipe(gulp.sass())
```

//example.sass
```sass
@import '_variables.json'

div.error
    color: map-get($colors, error)
    font-size: $medium
```

//_variables.json
//JSON has be Object ONLY!
```js
{
    "colors": {
        "error": "#f00",
        "success": "#0f0"
    },
    "medium": "12px"
}
```
