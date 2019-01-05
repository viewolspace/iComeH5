(function (win, doc) {
    function change() {
        var html = doc.documentElement;
        var hWidth = html.getBoundingClientRect().width;
        html.style.fontSize = hWidth / 15 + "px";
    }

    change();
    win.addEventListener('resize', change, false);
})(window, document);