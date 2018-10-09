var express = require('express');
var router = express.Router();
var babel = require('@babel/core');
var Uglify = require("uglify-js");
var CleanCss = require("clean-css");

// for(var prop in Uglify) {
//     if (typeof Uglify[prop] == 'function') {
//         console.log(prop);
//     }
// }

router.post('/', function(req, res) {
    // console.log(req.params);
    var code = req.body && req.body["code"],
        cb = req.query && req.query["callback"] ? req.query["callback"] : "jsonp",
        cn2unicode = req.body && req.body["cn"],
        type = req.body && req.body["type"],
        result = {},
        minCode = null,
        ast = null;
    // console.log(type);
    code = decodeURIComponent(code);
    if (type == "js") {
        const babelCode = babel.transformSync(code, {
            presets: ['env']
        });
        code = babelCode.code;
        minCode = Uglify.minify(code, {
            output: {
                ascii_only: +cn2unicode ? true : false
            }
        });

        // if (+cn2unicode) {
        //     ast = Uglify.parse(minCode.code);
        //     minCode.code = ast.print_to_string({ascii_only: true});
        // }

        if (minCode) {
            result.status = "success";
            result.minify = minCode;
        } else {
            result.status = "failure";
            result.minify = "Something error, please check your code.";
        }
    } else if (type == "css") {
        var minCss = new CleanCss().minify(code);
        if (minCss) {
            result.status = "success";
            result.minify = {
                code: minCss
            };
        } else {
            result.status = "failure";
            result.minify = "Something error, please check your code.";
        }
    } else {
        result.status = "failure";
        result.minify = "暂不支持该类型代码压缩，敬请期待！";
    }

    res.send(cb + "(" + JSON.stringify(result) + ")");
});

module.exports = router;