var through = require('through2')
var gutil = require('gulp-util')
var superagent = require('superagent')
var extend = require('extend')

var PluginError = gutil.PluginError

var defaultConfig = {
    port: 23956
}

function gulpVSDTE(config) {
    
    var options = extend({}, defaultConfig, config || {});
    var files = []
    
    var endpoint = 'http://localhost:' + options.port + '/project/files'
    
    return through.obj(function (file, enc, cb) {
                        
        // Record the path for sending to EnvDTE
        files.push(file.path)

        // Spit the file back into the pipeline without modification
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