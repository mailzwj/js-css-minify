var express = require('express');
var router = express.Router();
var Uglify = require("uglify-js");
var CleanCss = require("clean-css");

// for(var prop in Uglify) {
//     if (typeof Uglify[prop] == 'function') {
//         console.log(prop);
//     }
// }

router.get('/', function(req, res) {
    var code = req.query && req.query["code"],
        cb = req.query && req.query["callback"] ? req.query["callback"] : "jsonp",
        cn2unicode = req.query && req.query["cn"],
        type = req.query && req.query["type"],
        result = {},
        minCode = null,
        ast = null;

    if (type == "js") {
        minCode = Uglify.minify(code, {
            fromString: true,
            ascii_only: true
        });

        if (+cn2unicode) {
            ast = Uglify.parse(minCode.code);
            minCode.code = ast.print_to_string({ascii_only: true});
        }

        if (minCode) {
            result.status = "success";
            result.message = "压缩成功";
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