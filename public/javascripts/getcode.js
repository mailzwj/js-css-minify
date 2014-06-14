$(function(){
    var inCode = $("#J_InCode"),
        jsBtn = $("#J_JsCode"),
        cssBtn = $("#J_CssCode"),
        outCode = $("#J_OutCode"),
        cn2u = $("#J_Cn2U"),
        url = "/compressor",
        params;

    function getCode(data) {
        $.ajax({
            url: url,
            data: data,
            dataType: "jsonp",
            success: function(data) {
                if (data && data.status == "success") {
                    outCode.val(data.minify.code);
                } else {
                    outCode.val(data.minify);
                }
            }
        });
    }

    jsBtn.on("click", function(){
        if (inCode.val()) {
            params = {
                code: inCode.val(),
                cn: Number(cn2u.prop("checked")),
                type: "js"
            };
            getCode(params);
        } else {
            inCode.addClass("warning");
        }
    });

    cssBtn.on("click", function(){
        if (inCode.val()) {
            params = {
                code: inCode.val(),
                cn: Number(cn2u.prop("checked")),
                type: "css"
            };
            getCode(params);
        } else {
            inCode.addClass("warning");
        }
    });

    inCode.on("focus", function(){
        $(this).removeClass("warning");
    });
});