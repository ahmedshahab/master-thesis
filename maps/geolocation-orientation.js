(window.webpackJsonp = window.webpackJsonp || []).push([
    [124], {
        360: function(e, t, n) {
            "use strict";
            n.r(t);
            var o = n(174),
                a = n(3),
                i = n(96),
                r = n(2),
                c = n(243),
                s = n(31),
                d = n(5),
                u = n(4),
                g = n(6),
                l = new r.a({
                    center: Object(u.f)([5.8713, 45.6452]),
                    zoom: 19
                }),
                p = new a.a({
                    layers: [new d.a({
                        source: new g.b
                    })],
                    target: "map",
                    controls: Object(c.a)({
                        attributionOptions: {
                            collapsible: !1
                        }
                    }),
                    view: l
                }),
                m = document.getElementById("geolocation_marker"),
                h = new i.a({
                    positioning: "center-center",
                    element: m,
                    stopEvent: !1
                });
            p.addOverlay(h);
            var v = new s.a([], "XYZM"),
                f = new o.a({
                    projection: l.getProjection(),
                    trackingOptions: {
                        maximumAge: 1e4,
                        enableHighAccuracy: !0,
                        timeout: 6e5
                    }
                }),
                w = 500;
            f.on("change", function() {
                var e = f.getPosition(),
                    t = f.getAccuracy(),
                    n = f.getHeading() || 0,
                    o = f.getSpeed() || 0;
                ! function(e, t, n, o) {
                    var a = e[0],
                        i = e[1],
                        r = v.getCoordinates(),
                        c = r[r.length - 1],
                        s = c && c[2];
                    if (s) {
                        var d = t - function(e) {
                            return (e % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
                        }(s);
                        if (Math.abs(d) > Math.PI) {
                            var u = d >= 0 ? 1 : -1;
                            d = -u * (2 * Math.PI - Math.abs(d))
                        }
                        t = s + d
                    }
                    v.appendCoordinate([a, i, t, n]), v.setCoordinates(v.getCoordinates().slice(-20)), m.src = t && o ? "data/geolocation_marker_heading.png" : "data/geolocation_marker.png"
                }(e, n, Date.now(), o);
                var a = v.getCoordinates(),
                    i = a.length;
                i >= 2 && (w = (a[i - 1][3] - a[0][3]) / (i - 1));
                var r = ["Position: " + e[0].toFixed(2) + ", " + e[1].toFixed(2), "Accuracy: " + t, "Heading: " + Math.round(function(e) {
                    return 360 * e / (2 * Math.PI)
                }(n)) + "&deg;", "Speed: " + (3.6 * o).toFixed(1) + " km/h", "Delta: " + Math.round(w) + "ms"].join("<br />");
                document.getElementById("info").innerHTML = r
            }), f.on("error", function() {
                alert("geolocation error")
            });
            var M = 0;

            function b() {
                var e = Date.now() - 1.5 * w;
                e = Math.max(e, M), M = e;

                var t = v.getCoordinateAtM(e, !0);
				//console.log(M,e,t);
                t && (l.setCenter(function(e, t, n) {
                    var o = p.getSize()[1];
                    return [e[0] - Math.sin(t) * o * n * 1 / 4, e[1] + Math.cos(t) * o * n * 1 / 4]
                }(t, -t[2], l.getResolution())), l.setRotation(-t[2]), h.setPosition(t))
            }
            var y, I = document.getElementById("geolocate");
            I.addEventListener("click", function() {
                f.setTracking(!0), p.on("postcompose", b), p.render(), j()
            }, !1);
			
			
			let simulationData;
            var P = new XMLHttpRequest;
            P.open("GET", "https://raw.githubusercontent.com/openlayers/openlayers/master/examples/data/geolocation-orientation.json");
			P.onload = function() {
               y = JSON.parse(P.responseText).data;
				//console.log(simulationData);
            };
			P.send();
            var k = document.getElementById("start-animation");
			
			
			
			
            function E(e) {
                var t = e.coords;
                f.set("accuracy", t.accuracy), f.set("heading", function(e) {
                    return e * Math.PI * 2 / 360
                }(t.heading));
                var n = Object(u.f)([t.longitude, t.latitude]);
                f.set("position", n), f.set("speed", t.speed), f.changed()
            }

            function j() {
                I.disabled = "disabled", k.disabled = "disabled"
            }
            k.addEventListener("click", function() {
                var e = y,
                    t = e.shift();
                E(t);
                var n = t.timestamp;
                ! function t() {
                    var o = e.shift();
                    if (o) {
                        var a = o.timestamp;
                        E(o), window.setTimeout(function() {
                            n = a, t()
                        }, (a - n) / .5)
                    }
                }(), p.on("postcompose", b), p.render(), j()
            }, !1)
        }
    },
    [
        [360, 0]
    ]
]);
//# sourceMappingURL=geolocation-orientation.js.map