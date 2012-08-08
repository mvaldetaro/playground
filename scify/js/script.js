
window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    var c = paper.image("img/bg.png", 10, 10, 274, 70);
    var t = paper.text(150, 150, "Raphaël\nkicks\nbutt!");
    var tetronimo = paper.path("M 5,270 L 257 270, 290 290, 305 290, 305 380, 30 380, 20 370, 5 370, 5 270").attr('fill', 'url(img/bg.png)');
}
        
