queue().defer(d3.csv, "projects/occupations/data/occupations by age.csv").defer(d3.csv, "projects/occupations/data/ID of parent levels.csv").defer(d3.json, "projects/occupations/data/occupation.json").await(drawAll);

function drawAll(error, ageCSV, idCSV, occupations) {
    window.mobileAndTabletcheck = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })
        (navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    var mobileSize = window.mobileAndTabletcheck();
    var padding = 20,
        width = Math.max($("#chart").innerWidth(), 350) - padding,
        height = (window.innerWidth < 768 ? width : window.innerHeight - 230);
    console.log(window.innerHeight);
    if (mobileSize) height = width;
    var centerX = width / 2,
        centerY = height / 2;
    var canvas = d3.select("#chart").append("canvas").attr("id", "canvas").attr("width", width).attr("height", height);
    var context = canvas.node().getContext("2d");
    context.clearRect(0, 0, width, height);
    var hiddenCanvas = d3.select("#chart").append("canvas").attr("id", "hiddenCanvas").attr("width", width).attr("height", height).style("display", "none");
    var hiddenContext = hiddenCanvas.node().getContext("2d");
    hiddenContext.clearRect(0, 0, width, height);
    var mainTextColor = [74, 74, 74],
        titleFont = "Oswald",
        bodyFont = "Merriweather Sans";
    var colorCircle = d3.scale.ordinal().domain([0, 1, 2, 3]).range(['#bfbfbf', '#838383', '#4c4c4c', '#1c1c1c']);
    var colorBar = d3.scale.ordinal().domain(["16 to 19", "20 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65+"]).range(["#EFB605", "#E3690B", "#CF003E", "#991C71", "#4F54A8", "#07997E", "#7EB852"]);
    var diameter = Math.min(width * 0.9, height * 0.9),
        radius = diameter / 2;
    var commaFormat = d3.format(',');
    var zoomInfo = {
        centerX: centerX,
        centerY: centerY,
        scale: 1
    };
    var colToCircle = {};
    var pack = d3.layout.pack().padding(1).size([diameter, diameter]).value(function (d) {
        return d.size;
    }).sort(function (d) {
        return d.ID;
    });
    var nodes = pack.nodes(occupations),
        root = occupations,
        focus = root,
        nodeCount = nodes.length;
    var nodeByName = {};
    nodes.forEach(function (d, i) {
        nodeByName[d.name] = d;
    });
    ageCSV.forEach(function (d) {
        d.value = +d.value;
    });
    data = d3.nest().key(function (d) {
        return d.ID;
    }).entries(ageCSV);
    dataMax = d3.nest().key(function (d) {
        return d.ID;
    }).rollup(function (d) {
        return d3.max(d, function (g) {
            return g.value;
        });
    }).entries(ageCSV);
    var dataById = {};
    data.forEach(function (d, i) {
        dataById[d.key] = i;
    });
    var IDbyName = {};
    idCSV.forEach(function (d, i) {
        IDbyName[d.name] = d.ID;
    });
    var elementsPerBar = 7,
        barChartHeight = 0.7,
        barChartHeightOffset = 0.15;

    function drawCanvas(chosenContext, hidden) {
        chosenContext.fillStyle = "#fff";
        chosenContext.rect(0, 0, width, height);
        chosenContext.fill();
        var node = null;
        for (var i = 0; i < nodeCount; i++) {
            node = nodes[i];
            if (hidden) {
                if (node.color == null) {
                    node.color = genColor();
                    colToCircle[node.color] = node;
                }
                chosenContext.fillStyle = node.color;
            } else {
                chosenContext.fillStyle = node.children ? colorCircle(node.depth) : "white";
            }
            var nodeX = ((node.x - zoomInfo.centerX) * zoomInfo.scale) + centerX,
                nodeY = ((node.y - zoomInfo.centerY) * zoomInfo.scale) + centerY,
                nodeR = node.r * zoomInfo.scale;
            if (i === 4) scaleFactor = node.value / (nodeR * nodeR);
            chosenContext.beginPath();
            chosenContext.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
            chosenContext.fill();
            if (node.ID in dataById) {
                if (node.ID.lastIndexOf(currentID, 0) === 0 & !hidden) {
                    var drawTitle = true;
                    var fontSizeTitle = Math.round(nodeR / 10);
                    if (fontSizeTitle < 8) drawTitle = false;
                    if (drawTitle & showText) {
                        chosenContext.font = (fontSizeTitle * 0.5 <= 5 ? 0 : Math.round(fontSizeTitle * 0.5)) + "px " + bodyFont;
                        chosenContext.fillStyle = "rgba(191,191,191," + textAlpha + ")"
                        chosenContext.textAlign = "center";
                        chosenContext.textBaseline = "middle";
                        chosenContext.fillText("Total " + commaFormat(node.size) + " (in thousands)", nodeX, nodeY + -0.75 * nodeR);
                        var titleText = getLines(chosenContext, node.name, nodeR * 2 * 0.7, fontSizeTitle, titleFont);
                        titleText.forEach(function (txt, iterator) {
                            chosenContext.font = fontSizeTitle + "px " + titleFont;
                            chosenContext.fillStyle = "rgba(" + mainTextColor[0] + "," + mainTextColor[1] + "," + mainTextColor[2] + "," + textAlpha + ")";
                            chosenContext.textAlign = "center";
                            chosenContext.textBaseline = "middle";
                            chosenContext.fillText(txt, nodeX, nodeY + (-0.65 + iterator * 0.125) * nodeR);
                        })
                    }
                    var barScale = d3.scale.linear().domain([0, dataMax[dataById[node.ID]].values]).range([0, nodeR]);
                    var bars = data[dataById[node.ID]].values,
                        totalOffset = nodeX + -nodeR * 0.3,
                        eachBarHeight = ((1 - barChartHeightOffset) * 2 * nodeR * barChartHeight) / elementsPerBar,
                        barHeight = eachBarHeight * 0.8;
                    var drawLabelText = true;
                    var fontSizeLabels = Math.round(nodeR / 18);
                    if (fontSizeLabels < 6) drawLabelText = false;
                    var drawValueText = true;
                    var fontSizeValues = Math.round(nodeR / 22);
                    if (fontSizeValues < 6) drawValueText = false;
                    if (Math.round(barHeight) > 1) {
                        for (var j = 0; j < bars.length; j++) {
                            var bar = bars[j];
                            bar.width = (isNaN(bar.value) ? 0 : barScale(bar.value));
                            bar.barPiecePosition = nodeY + barChartHeightOffset * 2 * nodeR + j * eachBarHeight - barChartHeight * nodeR;
                            chosenContext.beginPath();
                            chosenContext.fillStyle = colorBar(bar.age);
                            chosenContext.fillRect(nodeX + -nodeR * 0.3, bar.barPiecePosition, bar.width, barHeight);
                            chosenContext.fill();
                            if (drawLabelText & showText) {
                                chosenContext.font = fontSizeLabels + "px " + bodyFont;
                                chosenContext.fillStyle = "rgba(" + mainTextColor[0] + "," + mainTextColor[1] + "," + mainTextColor[2] + "," + textAlpha + ")";
                                chosenContext.textAlign = "right";
                                chosenContext.textBaseline = "middle";
                                chosenContext.fillText(bar.age, nodeX + -nodeR * 0.35, bar.barPiecePosition + 0.5 * barHeight);
                            }
                            if (drawValueText & showText) {
                                chosenContext.font = fontSizeValues + "px " + bodyFont;
                                var txt = commaFormat(bar.value);
                                var textWidth = chosenContext.measureText(txt).width;
                                var valuePos = (textWidth * 1.1 > (bar.width - nodeR * 0.03) ? "left" : "right");
                                bar.valueLoc = nodeX + -nodeR * 0.3 + bar.width + (valuePos === "left" ? (nodeR * 0.03) : (-nodeR * 0.03));
                                chosenContext.fillStyle = (valuePos === "left" ? "rgba(51,51,51," + textAlpha + ")" : "rgba(255,255,255," + textAlpha + ")"); //#333333 or white
                                chosenContext.textAlign = valuePos;
                                chosenContext.textBaseline = "middle";
                                chosenContext.fillText(txt, bar.valueLoc, bar.barPiecePosition + 0.5 * barHeight);
                            }
                        }
                    }
                }
            }
        }
        var counter = 0;
        for (var i = 0; i < nodeCount; i++) {
            node = nodes[i];
            var nodeX = ((node.x - zoomInfo.centerX) * zoomInfo.scale) + centerX,
                nodeY = ((node.y - zoomInfo.centerY) * zoomInfo.scale) + centerY,
                nodeR = node.r * zoomInfo.scale;
            if (typeof node.parent !== "undefined" & typeof node.children !== "undefined") {
                if (node.name !== "occupation" & !hidden & showText & $.inArray(node.name, kids) >= 0) {
                    var fontSizeTitle = Math.round(nodeR / 10);
                    if (fontSizeTitle > 4) drawCircularText(chosenContext, node.name.replace(/,? and /g, ' & '), fontSizeTitle, titleFont, nodeX, nodeY, nodeR, rotationText[counter], 0);
                }
                counter = counter + 1;
            }
        }
    }
    var currentID = "",
        oldID = "",
        kids = ["occupation"];
    for (var i = 0; i < root.children.length; i++) {
        kids.push(root.children[i].name)
    };
    var clickFunction = function (e) {
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;
        var col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
        var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
        var node = colToCircle[colString];
        if (node) {
            if (focus === node) node = root;
            kids = [node.name];
            if (typeof node.children !== "undefined") {
                for (var i = 0; i < node.children.length; i++) {
                    kids.push(node.children[i].name)
                }
            }
            zoomToCanvas(node);
        }
    }
    $("#canvas").on("click", clickFunction);
    if (!mobileSize) {
        var nodeOld = root;
        var mousemoveFunction = function (e) {
            var mouseX = e.offsetX;
            var mouseY = e.offsetY;
            var col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
            var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
            var node = colToCircle[colString];
            if (node !== nodeOld) {
                $('.popoverWrapper').remove();
                $('.popover').each(function () {
                    $('.popover').remove();
                });
                if (node) {
                    if (typeof node.ID !== "undefined") {
                        var nodeX = ((node.x - zoomInfo.centerX) * zoomInfo.scale) + centerX,
                            nodeY = ((node.y - zoomInfo.centerY) * zoomInfo.scale) + centerY,
                            nodeR = node.r * zoomInfo.scale;
                        var div = document.createElement('div');
                        div.setAttribute('class', 'popoverWrapper');
                        document.getElementById('chart').appendChild(div);
                        $(".popoverWrapper").css({
                            'position': 'absolute',
                            'top': nodeY - nodeR,
                            'left': nodeX + padding * 5 / 4
                        });
                        $(".popoverWrapper").popover({
                            placement: 'auto top',
                            container: '#chart',
                            trigger: 'manual',
                            html: true,
                            animation: false,
                            content: function () {
                                return "<span class='nodeTooltip'>" + node.name + "</span>";
                            }
                        });
                        $(".popoverWrapper").popover('show');
                    }
                }
            }
            nodeOld = node;
        }
        $("#canvas").on("mousemove", mousemoveFunction);
    }
    var ease = d3.ease("cubic-in-out"),
        timeElapsed = 0,
        interpolator = null,
        duration = 1500,
        vOld = [focus.x, focus.y, focus.r * 2.05];

    function zoomToCanvas(focusNode) {
        $("#canvas").css("pointer-events", "none");
        $('.popoverWrapper').remove();
        $('.popover').each(function () {
            $('.popover').remove();
        });
        if (focusNode === focus) currentID = "";
        else currentID = (typeof focusNode.ID === "undefined" ? IDbyName[focusNode.name] : focusNode.ID.replace(/\.([^\.]*)$/, ""));
        focus = focusNode;
        var v = [focus.x, focus.y, focus.r * 2.05];
        interpolator = d3.interpolateZoom(vOld, v);
        duration = Math.max(1500, interpolator.duration);
        timeElapsed = 0;
        showText = false;
        vOld = v;
        if (typeof focusNode.children === "undefined") {
            d3.select("#legendRowWrapper").style("opacity", 0);
            d3.select(".legendWrapper").transition().duration(1000).style("opacity", 0);
        } else {
            d3.select("#legendRowWrapper").style("opacity", 1);
            d3.select(".legendWrapper").transition().duration(1000).delay(duration).style("opacity", 1);
        }
        stopTimer = false;
        animate();
    }

    function interpolateZoom(dt) {
        if (interpolator) {
            timeElapsed += dt;
            var t = ease(timeElapsed / duration);
            zoomInfo.centerX = interpolator(t)[0];
            zoomInfo.centerY = interpolator(t)[1];
            zoomInfo.scale = diameter / interpolator(t)[2];
            if (timeElapsed >= duration) {
                interpolator = null;
                showText = true;
                fadeText = true;
                timeElapsed = 0;
                drawCanvas(hiddenContext, true);
                d3.select(".legendWrapper").selectAll(".legendText").text(function (d) {
                    return commaFormat(Math.round(scaleFactor * d * d / 10) * 10);
                });
            }
        }
    }
    var showText = true,
        textAlpha = 1,
        fadeText = false,
        fadeTextDuration = 750;

    function interpolateFadeText(dt) {
        if (fadeText) {
            timeElapsed += dt;
            textAlpha = ease(timeElapsed / fadeTextDuration);
            if (timeElapsed >= fadeTextDuration) {
                $("#canvas").css("pointer-events", "auto");
                fadeText = false;
                stopTimer = true;
            }
        }
    }
    var rotationText = [-14, 4, 23, -18, -10.5, -20, 20, 20, 46, -30, -25, -20, 20, 15, -30, -15, -45, 12, -15, -16, 15, 15, 5, 18, 5, 15, 20, -20, -25];

    function drawCircularText(ctx, text, fontSize, titleFont, centerX, centerY, radius, startAngle, kerning) {
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'center';
        ctx.font = fontSize + "px " + titleFont;
        ctx.fillStyle = "rgba(255,255,255," + textAlpha + ")";
        startAngle = startAngle * (Math.PI / 180);
        text = text.split("").reverse().join("");
        for (var j = 0; j < text.length; j++) {
            var charWid = ctx.measureText(text[j]).width;
            startAngle += ((charWid + (j == text.length - 1 ? 0 : kerning)) / radius) / 2;
        }
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle);
        for (var j = 0; j < text.length; j++) {
            var charWid = ctx.measureText(text[j]).width / 2;
            ctx.rotate(-charWid / radius);
            ctx.fillText(text[j], 0, -radius);
            ctx.rotate(-(charWid + kerning) / radius);
        }
        ctx.restore();
    }
    var options = nodes.map(function (d) {
        return d.name;
    });
    var select = document.getElementById("searchBox");
    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
    $('.combobox').combobox();
    searchEvent = function (occupation) {
        if (occupation !== "" & typeof occupation !== "undefined") {
            zoomToCanvas(nodeByName[occupation]);
        }
    }
    zoomToCanvas(root);
    drawCanvas(hiddenContext, true);
    var scaleFactor = 1;
    createLegend(scaleFactor);
    d3.select(".legendWrapper").transition().duration(1000).delay(500).style("opacity", 1);
    var stopTimer = false;
    animate();

    function animate() {
        var dt = 0;
        d3.timer(function (elapsed) {
            interpolateZoom(elapsed - dt);
            interpolateFadeText(elapsed - dt);
            dt = elapsed;
            drawCanvas(context);
            return stopTimer;
        });
    }
}
var searchEvent = function (occupation) {};
var nextCol = 1;

function genColor() {
    var ret = [];
    if (nextCol < 16777215) {
        ret.push(nextCol & 0xff);
        ret.push((nextCol & 0xff00) >> 8);
        ret.push((nextCol & 0xff0000) >> 16);
        nextCol += 100;
    }
    var col = "rgb(" + ret.join(',') + ")";
    return col;
}

function getLines(ctx, text, maxWidth, fontSize, titleFont) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        ctx.font = fontSize + "px " + titleFont;
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function createLegend(scaleFactor) {
    var legendSizes = [10, 20, 30],
        commaFormat = d3.format(',');
    var width = $("#legendCircles").width(),
        height = legendSizes[2] * 2 * 1.2;
    var legendCenter = -10,
        legendBottom = height,
        legendLineLength = legendSizes[2] * 1.3,
        textPadding = 5
    var svg = d3.select("#legendCircles").append("svg").attr("width", width).attr("height", height).append("g").attr("class", "legendWrapper").attr("transform", "translate(" + width / 2 + "," + 0 + ")").style("opacity", 0);
    svg.selectAll(".legendCircle").data(legendSizes).enter().append("circle").attr('r', function (d) {
        return d;
    }).attr('class', "legendCircle").attr('cx', legendCenter).attr('cy', function (d) {
        return legendBottom - d;
    });
    svg.selectAll(".legendLine").data(legendSizes).enter().append("line").attr('class', "legendLine").attr('x1', legendCenter).attr('y1', function (d) {
        return legendBottom - 2 * d;
    }).attr('x2', legendCenter + legendLineLength).attr('y2', function (d) {
        return legendBottom - 2 * d;
    });
    svg.selectAll(".legendText").data(legendSizes).enter().append("text").attr('class', "legendText").attr('x', legendCenter + legendLineLength + textPadding).attr('y', function (d) {
        return legendBottom - 2 * d;
    }).attr('dy', '0.3em').text(function (d) {
        return commaFormat(Math.round(scaleFactor * d * d / 10) * 10);
    });
}