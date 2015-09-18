var through = require('through2')
var gutil = require('gulp-util')
var superagent = require('superagent')

var PluginError = gutil.PluginError

function gulpVSDTE() {

    var files = []
    var endpoint = 'http://localhost:23956/project/files'
    
    return through.obj(function (file, enc, cb) {
                        
        files.push(file.path)

        this.push(file)

        cb()

    }, function (cb) {
        
        superagent.put(endpoint)
            .send(JSON.stringify(files))
            .set('Content-Type', 'application/json')
            .end(function (err, res) {                
                if (err)
                    gutil.log(err)
                else
                    gutil.log(res.text)

                cb()
            })        
    })
}

module.exports = gulpVSDTE;