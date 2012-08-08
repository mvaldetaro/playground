/**
 * Kibo jQuery Keyboard handler
 * https://github.com/marquete/kibo
**/
var Kibo=function(element){this.element=element||window.document;this.initialize();};Kibo.KEY_NAMES_BY_CODE={8:'backspace',9:'tab',13:'enter',16:'shift',17:'ctrl',18:'alt',20:'caps_lock',27:'esc',32:'space',33:'page_up',34:'page_down',35:'end',36:'home',37:'left',38:'up',39:'right',40:'down',45:'insert',46:'delete',48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',144:'num_lock'};Kibo.KEY_CODES_BY_NAME={};for(var key in Kibo.KEY_NAMES_BY_CODE)if(Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE,key))Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[key]]=+key;Kibo.MODIFIERS=['shift','ctrl','alt'];Kibo.WILDCARD_TYPES=['arrow','number','letter','f'];Kibo.WILDCARDS={arrow:[37,38,39,40],number:[48,49,50,51,52,53,54,55,56,57],letter:[65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],f:[112,113,114,115,116,117,118,119,120,121,122,123]};Kibo.assert=function(expression,exception){exception=exception||{};exception.name=exception.name||'Exception raised';exception.message=exception.message||'an error has occurred.';try{if(!expression)throw(exception);}catch(error){if((typeof console!=='undefined')&&console.log)console.log(error.name+': '+error.message);else
window.alert(error.name+': '+error.message);}};Kibo.registerEvent=(function(){if(document.addEventListener){return function(element,eventName,func){element.addEventListener(eventName,func,false);};}else if(document.attachEvent){return function(element,eventName,func){element.attachEvent('on'+eventName,func);};}})();Kibo.unregisterEvent=(function(){if(document.removeEventListener){return function(element,eventName,func){element.removeEventListener(eventName,func,false);};}else if(document.detachEvent){return function(element,eventName,func){element.detachEvent('on'+eventName,func);};}})();Kibo.isArray=function(what){return!!(what&&what.splice);};Kibo.isString=function(what){return typeof what==='string';};Kibo.arrayIncludes=(function(){if(Array.prototype.indexOf){return function(haystack,needle){return haystack.indexOf(needle)!==-1;};}else{return function(haystack,needle){for(var i=0;i<haystack.length;i++)if(haystack[i]===needle)return true;return false;};}})();Kibo.trimString=function(string){return string.replace(/^\s+|\s+$/g,'');};Kibo.neatString=function(string){return Kibo.trimString(string).replace(/\s+/g,' ');};Kibo.capitalize=function(string){return string.toLowerCase().replace(/^./,function(match){return match.toUpperCase();});};Kibo.isModifier=function(key){return Kibo.arrayIncludes(Kibo.MODIFIERS,key);};Kibo.prototype.initialize=function(){var i,that=this;this.lastKeyCode=-1;this.lastModifiers={};for(i=0;i<Kibo.MODIFIERS.length;i++)this.lastModifiers[Kibo.MODIFIERS[i]]=false;this.keysDown={any:[]};this.keysUp={any:[]};for(i=0;i<Kibo.WILDCARD_TYPES.length;i++){this.keysDown['any '+Kibo.WILDCARD_TYPES[i]]=[];this.keysUp['any '+Kibo.WILDCARD_TYPES[i]]=[];}this.downHandler=this.handler('down');this.upHandler=this.handler('up');Kibo.registerEvent(this.element,'keydown',this.downHandler);Kibo.registerEvent(this.element,'keyup',this.upHandler);Kibo.registerEvent(window,'unload',function unloader(){Kibo.unregisterEvent(that.element,'keydown',that.downHandler);Kibo.unregisterEvent(that.element,'keyup',that.upHandler);Kibo.unregisterEvent(window,'unload',unloader);});};Kibo.prototype.matchingKeys=function(registeredKeys){var i,j,keyCombination,match,result=[];for(registeredKey in registeredKeys){if(Object.prototype.hasOwnProperty.call(registeredKeys,registeredKey)){keyCombination=Kibo.trimString(registeredKey).split(' ');if(keyCombination.length&&keyCombination[0]!=='any'){match=true;for(j=0;j<keyCombination.length;j++)match=match&&(Kibo.isModifier(keyCombination[j])?this.lastKey(keyCombination[j]):(this.lastKey()===keyCombination[j]));if(match)result.push(registeredKey);}}}return result;};Kibo.prototype.handler=function(upOrDown){var that=this;return function(e){var i,j,matchingKeys,registeredKeys;e=e||window.event;that.lastKeyCode=e.keyCode;for(i=0;i<Kibo.MODIFIERS.length;i++)that.lastModifiers[Kibo.MODIFIERS[i]]=e[Kibo.MODIFIERS[i]+'Key'];if(Kibo.arrayIncludes(Kibo.MODIFIERS,Kibo.keyName(that.lastKeyCode)))that.lastModifiers[Kibo.keyName(that.lastKeyCode)]=true;registeredKeys=that['keys'+Kibo.capitalize(upOrDown)];matchingKeys=that.matchingKeys(registeredKeys);for(i=0;i<registeredKeys.any.length;i++)if((registeredKeys.any[i](e)===false)&&e.preventDefault)e.preventDefault();for(i=0;i<Kibo.WILDCARD_TYPES.length;i++)if(Kibo.arrayIncludes(Kibo.WILDCARDS[Kibo.WILDCARD_TYPES[i]],that.lastKeyCode))for(j=0;j<registeredKeys['any '+Kibo.WILDCARD_TYPES[i]].length;j++)if((registeredKeys['any '+Kibo.WILDCARD_TYPES[i]][j](e)===false)&&e.preventDefault)e.preventDefault();for(i=0;i<matchingKeys.length;i++)for(j=0;j<registeredKeys[matchingKeys[i]].length;j++)if((registeredKeys[matchingKeys[i]][j](e)===false)&&e.preventDefault)e.preventDefault();};};Kibo.prototype.registerKeys=function(upOrDown,newKeys,func){var i,registeredKeys=this['keys'+Kibo.capitalize(upOrDown)];if(!Kibo.isArray(newKeys))newKeys=[newKeys];for(i=0;i<newKeys.length;i++){Kibo.assert(Kibo.isString(newKeys[i]),{name:'Type error',message:'expected string or array of strings.'});newKeys[i]=Kibo.neatString(newKeys[i]);if(Kibo.isArray(registeredKeys[newKeys[i]]))registeredKeys[newKeys[i]].push(func);else
registeredKeys[newKeys[i]]=[func];}return this;};Kibo.prototype.unregisterKeys=function(upOrDown,newKeys,func){var i,j,registeredKeys=this['keys'+Kibo.capitalize(upOrDown)];if(!Kibo.isArray(newKeys))newKeys=[newKeys];for(i=0;i<newKeys.length;i++){Kibo.assert(Kibo.isString(newKeys[i]),{name:'Type error',message:'expected string or array of strings.'});newKeys[i]=Kibo.neatString(newKeys[i]);if(func===null)delete registeredKeys[newKeys[i]];else{if(Kibo.isArray(registeredKeys[newKeys[i]])){for(j=0;j<registeredKeys[newKeys[i]].length;j++){if(String(registeredKeys[newKeys[i]][j])===String(func)){registeredKeys[newKeys[i]].splice(j,1);break;}}}}}return this;};Kibo.prototype.delegate=function(action,keys,func){return func!==null?this.registerKeys(action,keys,func):this.unregisterKeys(action,keys,func);};Kibo.prototype.down=function(keys,func){return this.delegate('down',keys,func);};Kibo.prototype.up=function(keys,func){return this.delegate('up',keys,func);};Kibo.keyName=function(keyCode){return Kibo.KEY_NAMES_BY_CODE[keyCode+''];};Kibo.keyCode=function(keyName){return+Kibo.KEY_CODES_BY_NAME[keyName];};Kibo.prototype.lastKey=function(modifier){if(!modifier)return Kibo.keyName(this.lastKeyCode);Kibo.assert(Kibo.arrayIncludes(Kibo.MODIFIERS,modifier),{name:'Modifier error',message:'invalid modifier '+modifier+' (valid modifiers are: '+Kibo.MODIFIERS.join(', ')+').'});return this.lastModifiers[modifier];};


(function () {
    var a = new Kibo,
        b = $("body").attr("class"),
        c = $("#walking_sheep"),
        d = $("#falling_cat"),
        e = $("#the_cat"),
        f = e.offset().top,
        g = 580,
        h = $(".review.first").offset().top - 123,
        i = $(".cat_ground_container"),
        j = $(document),
        k = $(window),
        l = $(".main_menu ul a"),
        m = 1,
        n = $(window).height(),
        o = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        t = 0,
        u = 0,
        v = 0,
        w = 0,
        x = "",
        y = "",
        z = "",
        A = false,
        B = false,
        C = false,
        D = new Array("0 0", "-472px 0", "-944px 0", "-1416px 0", "-1888px 0", "-2360px 0", "-2832px 0", "0 -482px", "-472px -482px", "-944px -482px", "-1416px -482px", "-1888px -482px", "-2360px -482px", "-2832px -482px", "0 -964px", "-472px -964px", "-944px -964px", "-1416px -964px", "-1888px -964px", "-2360px -964px", "-2832px -964px", "0 -1446px", "-472px -1446px", "-944px -1446px", "-1416px -1446px", "-1888px -1446px", "-2360px -1446px", "-2832px -1446px", "0 -1928px", "-472px -1928px", "-944px -1928px"),
        E = new Array("0 0", "-217px 0", "-434px 0", "-651px 0", "-868px 0", "-1085px 0", "-1302px 0", "-1519px 0", "0 -416px", "-217px -416px", "-434px -416px", "-651px -416px", "-868px -416px", "-1085px -416px", "-1302px -416px", "-1519px -416px", "0 -832px", "-217px -832px", "-434px -832px", "-651px -832px", "-868px -832px"),
        F = new Array("1000", "1500", "2500", "4000", "6000"),
        G = new Array("0 -319px", "-110px -319px", "-220px -319px", "-330px -319px", "-440px -319px"),
        H = new Array("2, 4, 6, 8, 10"),
        I = "1000",
        J = "",
        K = "";
    var L = {
        Version: function () {
            var a = 999;
            if (navigator.appVersion.indexOf("MSIE") != -1) a = parseFloat(navigator.appVersion.split("MSIE")[1]);
            return a
        }
    };
    var M = function () {
        $(document).mousemove(function (a) {
            var b = -(a.pageX / 70 + 50) + "px";
            var c = -(a.pageX / 20 + 20) + "px";
            var d = -(a.pageX / 30 - 105) + "px";
            var e = -(a.pageX / 11 - 105) + "px";
            var f = -(a.pageX / 6 - 300) + "px";
            if (a.pageY < 1100) {
                mouseYa = a.pageY / 200 - 5 + "px";
                mouseYb = a.pageY / 60 - 20 + "px";
                mouseYc = a.pageY / 120 - 20 + "px";
                mouseYd = a.pageY / 20 + 216 + "px";
                mouseYe = -(a.pageY / 5 - 80) + "px";
                $(".cloud_back").css({
                    left: b,
                    bottom: mouseYa
                });
                $(".cloud_front").css({
                    left: c,
                    bottom: mouseYb
                });
                $(".island").css({
                    left: d,
                    bottom: mouseYc
                });
                $(".leaves").css({
                    left: e,
                    bottom: mouseYd
                });
                $(".cloud_free").css({
                    left: f,
                    top: mouseYe
                })
            } else {
                $(".cloud_back").css({
                    left: b
                });
                $(".cloud_front").css({
                    left: c
                });
                $(".island").css({
                    left: d
                });
                $(".leaves").css({
                    left: e
                });
                $(".cloud_free").css({
                    left: f
                })
            }
        })
    };
    var N = function () {
        $(c).data("params", {
            top0: 0,
            x0: 2e3,
            top1: c.css("top"),
            x1: c.css("left")
        });
        k.scroll(function (a) {
            function d(a, c, d) {
                return -Math.min((-a + c) / b * d + a, c)
            }
            if (k.scrollTop() > $("#testimony").offset().top - 500) {
                O()
            }
            var b = $("#testimony").offset().top - 500;
            var e = parseInt(k.scrollTop(), 10);
            var f = d(c.data("params").x0, parseInt(c.data("params").x1, 10), e),
                g = d(c.data("params").top0, parseInt(c.data("params").top1, 10), e);
            if (f >= 985) {
                g = 110
            } else {
                g += 110
            }
            $("#walking_sheep").stop().css({
                left: f + "px",
                top: g + "px"
            })
        })
    };
    var O = function () {
        v = parseInt(c.css("background-position").split(" ")[1]);
        u = parseInt(c.css("background-position").split(" ")[0]);
        if (u > "-1428" && c.position().left >= 0 && c.position().left < 885) {
            u = u - 119;
            w = u + "px " + v + "px";
            TweenMax.to(c, 0, {
                css: {
                    backgroundPosition: w
                }
            })
        } else {
            w = "0px " + v + "px";
            TweenMax.to(c, 0, {
                css: {
                    backgroundPosition: w
                }
            })
        }
    };
    var P = function () {
        i.hide();
        k.scroll(function (a) {
            var b = $(this).scrollTop();
            clearTimeout(z);
            if (A === true && b < 20) {
                d.show();
                i.hide();
                A = false;
                B = false;
                C = false
            }
            if (A !== true) {
                if (b > q) {
                    if (C === false) {
                        save_scroll_top = b
                    }
                    if (b > f && b + 1 > save_scroll_top && b < $(".landscape").offset().top + 140 && d.offset().top < $(".landscape").offset().top + 140 && A === false) {
                        C = false;
                        B = true;
                        e.removeClass("umbrella");
                        clearTimeout(y);
                        R();
                        Q(b);
                        z = setTimeout(function () {
                            e.addClass("umbrella");
                            clearTimeout(x);
                            S()
                        }, 150)
                    } else if (d.offset().top >= $(".landscape").offset().top + 140) {
                        d.hide();
                        i.show();
                        T();
                        clearTimeout(x);
                        clearTimeout(y)
                    }
                } else {
                    if (B === true) {
                        if (C === false) {
                            save_scroll_top = k.scrollTop()
                        }
                        C = true;
                        if (b > f && d.offset().top < $(".landscape").offset().top + 140 && b < $(".landscape").offset().top + 140) {
                            e.addClass("umbrella");
                            clearTimeout(x);
                            S()
                        }
                    }
                }
                q = b
            }
        })
    };
    var Q = function (a) {
        TweenMax.to(d, 0, {
            css: {
                top: a - 50
            }
        })
    };
    var R = function () {
        clearTimeout(x);
        if (o < 31) {
            TweenMax.to(e, 0, {
                css: {
                    backgroundPosition: D[o]
                }
            });
            o++
        } else {
            o = 0;
            TweenMax.to(e, 0, {
                css: {
                    backgroundPosition: D[o]
                }
            })
        }
        x = setTimeout(function () {
            R()
        }, 16)
    };
    var S = function () {
        clearTimeout(y);
        if (p < 21) {
            TweenMax.to(e, 0, {
                css: {
                    backgroundPosition: E[p]
                }
            });
            p++
        } else {
            p = 0;
            TweenMax.to(e, 0, {
                css: {
                    backgroundPosition: E[p]
                }
            })
        }
        y = setTimeout(function () {
            S()
        }, 48)
    };
    var T = function () {
        d.hide().css({
            top: "580px"
        }).find("div").css({
            "background-position": "0 0"
        });
        A = true
    };
    var U = function (a) {
        if (a === true) {
            $(".video_intro").fadeIn("fast")
        } else {
            $(".video_intro").fadeOut("fast");
            the_src_video = $("#vimeo_video").attr("src");
            $("#vimeo_video").attr("src", "");
            $("#vimeo_video").attr("src", the_src_video)
        }
    };
    $(".video_launcher a").bind("click", function (a) {
        a.preventDefault();
        U(true)
    });
    var V = function (a) {
        a.remove()
    };
    var W = function () {
        clearTimeout(J);
        J = setTimeout(function () {
            I = Math.floor(Math.random() * 4);
            pos_anim_counter = Math.floor(Math.random() * 4);
            rotation_loop = Math.floor(180 + Math.random() * 540);
            left_anim_counter = Math.floor(30 + Math.random() * 50) + "%";
            top_anim_counter = Math.floor(200 + Math.random() * 300);
            speed_anim_counter = Math.floor(Math.random() * 4);
            $("body").append('<div class="leaves_wind" id="new_leaf" style="background-position:' + G[pos_anim_counter] + ';">Â </div>');
            K = $("#new_leaf");
            TweenMax.to(K, 6, {
                css: {
                    left: left_anim_counter
                },
                ease: Quad.easeIn,
                onComplete: V,
                onCompleteParams: [K]
            });
            if (L.Version() >= 10) {
                TweenMax.to(K, 3, {
                    css: {
                        rotation: rotation_loop
                    },
                    ease: Sine.easeInOut,
                    delay: 3
                });
                TweenMax.to(K, 1, {
                    css: {
                        opacity: "0"
                    },
                    ease: Quad.easeIn,
                    delay: 5
                })
            }
            TweenMax.to(K, 6, {
                css: {
                    top: top_anim_counter
                },
                ease: Sine.easeOut
            });
            $(".leaves_wind").attr("id", "");
            W()
        }, F[I])
    };
    $(document).ready(function () {
        $(".main_menu ul a").bind("click", function (a) {
            a.preventDefault();
            var b = $(this).attr("href");
            var c = jQuery(b).offset().top - 90;
            TweenMax.to(jQuery("html, body"), 1, {
                scrollTop: c,
                ease: Quart.easeOut
            })
        });
        var c = [jQuery("#overview").offset().top, jQuery("#testimony").offset().top - 90, jQuery("#author").offset().top - 90, jQuery("#story").offset().top - 90, 0];
        k.scroll(function (a) {
            var b = j.scrollTop();
            var d = 0;
            while (d < c.length && b < c[d]) {
                d++
            }
            if (d != m) {
                m = d;
                l.removeClass("active");
                if (d < c.length) {
                    l.eq(-(d - 4)).addClass("active")
                }
            }
        });
        a.down(["esc"], function () {
            U(false)
        });
        $(".skip, .video_bg").bind("click", function (a) {
            a.preventDefault();
            U(false)
        });
        var d = $("#vimeo_video")[0],
            e = $f(d);
        var f = function (a) {
            U(false)
        };
        e.addEvent("ready", function () {
            e.addEvent("finish", f)
        });
        if (b == "fre" && $.cookie("video_seen_FRE") == "true" || b == "eng" && $.cookie("video_seen_ENG") == "true") {
            U(false)
        } else {
            if (jQuery.browser.mobile === true) {
                U(false)
            } else {
                U(true)
            }
            if (b == "fre") {
                $.cookie("video_seen_FRE", "true")
            } else {
                $.cookie("video_seen_ENG", "true")
            }
        }
        M();
        N();
        P();
        W()
    })
})(jQuery)