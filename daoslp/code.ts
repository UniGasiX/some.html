/* Copyright 2020 UniGasiX
 * UniGasiX 版权所有
 * 使用 GPL v3.0 即后续版本许可
 */

enum BgColor {
    TRANSPARENT = "transparent",
    WHITE = "white",
}

interface IConfig {
    color: string;
    bgColor: BgColor;
    radius: number;
    // --------------------
    outerCircleLineWidth: number;
    // --------------------
    showTopText: boolean,

    topText: string;
    topTextFontCss: string,
    topTextPercentage: number;
    topTextTopMargin: number;
    topCharWidthPercentage: number;
    // ----------------------
    showStar: boolean,

    starRadius: number;
    // ------------------------
    showSubText: boolean,

    subText: string;
    subTextFontCss: string;
    subTextY: number;
    subTextWidthPercentage: number;
    // -------------------------
    showBottomText: boolean,

    bottomText: string;
    bottomTextFontCss: string;
    bottomTextPercentage: number;
    bottomTextBottomMargin: number;
    bottomCharWidthPercentage: number;
}

function drawSeal(canvas: HTMLCanvasElement, config: IConfig) {
    console.log("绘制", new Date());

    resetSth();

    // 一个用来计算计算排布文字位置的函数
    function calChars(context: CanvasRenderingContext2D, text: string, percentage: number, maxRadius: number, charWidthPercentage: number) {
        let chars = text.split("");
        let matrixes = chars.map(char => context.measureText(char));
        let sizes = matrixes.map(m => {
            return {
                height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
                width: m.width * charWidthPercentage,
                centralAngle: 0,
            };
        });
        let charPosRadius = Number.POSITIVE_INFINITY;
        sizes.forEach(size => {
            let cpr = Math.sqrt(maxRadius ** 2 - (size.width / 2) ** 2) - 0.5 * size.height;
            if (cpr < charPosRadius) charPosRadius = cpr;
        });
        let charAngleSum = 0;
        sizes.forEach(size => {
            size.centralAngle = Math.atan(size.width / 2 / (charPosRadius - size.height / 2))
            charAngleSum += size.centralAngle;
        });
        let angleAvailable = percentage * 2 * Math.PI;
        let gapAngle = (angleAvailable - charAngleSum) / (sizes.length - 1);
        let startAngle = - percentage * Math.PI;
        let charPosAngles = sizes.map(size => {
            let pa = startAngle + size.centralAngle / 2;
            startAngle += size.centralAngle + gapAngle;
            return pa;
        });
        return {
            charPosRadius,
            charPosAngles,
            chars,
            charWidths: sizes.map(size => size.width),
        };
    }

    // 设置图像大小
    let radius = config.radius;
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    // 获取上下文
    let context = canvas.getContext("2d");
    // 绘制底色
    {
        context.save();
        if (config.bgColor == BgColor.TRANSPARENT) {
            context.fillStyle = "transparent";
        } else if (config.bgColor == BgColor.WHITE) {
            context.fillStyle = "white";
        } else {
            throw `bgColor 背景色设置值 ${config.bgColor} 无效。`;
        }
        context.fillRect(0, 0, config.radius * 2, config.radius * 2);
        context.restore();
    }
    // 将坐标设置到图中心
    context.translate(radius, radius);
    // 设置绘制基本参数
    context.strokeStyle = config.color;
    context.fillStyle = config.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.save(); // 保存初始状态
    // 画大圆
    {
        context.lineWidth = config.outerCircleLineWidth;
        context.beginPath();
        context.arc(0, 0, radius - config.outerCircleLineWidth * 0.5, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
        context.save();
    }
    // 画顶圈文字
    if (config.showTopText) {
        context.font = config.topTextFontCss;
        context.save();
        let args = calChars(context, config.topText, config.topTextPercentage,
            config.radius - config.outerCircleLineWidth - config.topTextTopMargin,
            config.topCharWidthPercentage);
        args.charPosAngles.forEach((angle, index) => {
            context.rotate(angle);
            context.translate(0, -args.charPosRadius);
            context.fillText(args.chars[index], 0, 0, args.charWidths[index]);
            context.restore();
            context.save();
        });
        context.restore();
        context.save();
    }
    // 画底圈文字
    if (config.showBottomText) {
        context.font = config.bottomTextFontCss;
        context.save();
        let args = calChars(context, config.bottomText, config.bottomTextPercentage,
            config.radius - config.outerCircleLineWidth - config.bottomTextBottomMargin,
            config.bottomCharWidthPercentage);
        args.charPosAngles.forEach((angle, index) => {
            context.rotate(-angle);
            context.translate(0, args.charPosRadius);
            context.fillText(args.chars[index], 0, 0, args.charWidths[index]);
            context.restore();
            context.save();
        });
        context.restore();
        context.save();
    }
    // 画五角星
    if (config.showStar) {
        context.beginPath();
        context.moveTo(0, -config.starRadius);
        let angle = (2 / 5 - 1 / 4) * 2 * Math.PI;
        let bottomX = config.starRadius * Math.cos(angle);
        let bottomY = config.starRadius * Math.sin(angle);
        context.lineTo(bottomX, bottomY);
        angle = 1 / 5 * 2 * Math.PI;
        let middleX = config.starRadius * Math.sin(angle);
        let middleY = config.starRadius * Math.cos(angle);
        context.lineTo(-middleX, -middleY);
        context.lineTo(middleX, -middleY);
        context.lineTo(-bottomX, bottomY);
        context.lineTo(0, -config.starRadius)
        context.fill();
        context.restore();
        context.save();
    }
    // 画那个横着的文字
    if (config.showSubText) {
        context.font = config.subTextFontCss;
        context.translate(0, config.subTextY);
        let width = context.measureText(config.subText).width;
        context.fillText(config.subText, 0, 0, width * config.subTextWidthPercentage);
        context.restore();
        context.save();
    }
}

function drawIt() {
    let settings: IConfig = {
        color: (document.getElementById("color") as HTMLInputElement).value,
        bgColor: (document.getElementById("bgColor") as HTMLSelectElement).value as BgColor,
        radius: parseFloat((document.getElementById("radius") as HTMLInputElement).value),

        outerCircleLineWidth: parseFloat((document.getElementById("outerCircleLineWidth") as HTMLInputElement).value),

        showTopText: (document.getElementById("showTopText") as HTMLInputElement).checked,
        topText: (document.getElementById("topText") as HTMLInputElement).value,
        topTextFontCss: (document.getElementById("topTextFontCss") as HTMLInputElement).value,
        topTextPercentage: parseFloat((document.getElementById("topTextPercentage") as HTMLInputElement).value),
        topTextTopMargin: parseFloat((document.getElementById("topTextTopMargin") as HTMLInputElement).value),
        topCharWidthPercentage: parseFloat((document.getElementById("topCharWidthPercentage") as HTMLInputElement).value),

        showStar: (document.getElementById("showStar") as HTMLInputElement).checked,
        starRadius: parseFloat((document.getElementById("starRadius") as HTMLInputElement).value),

        showSubText: (document.getElementById("showSubText") as HTMLInputElement).checked,
        subText: (document.getElementById("subText") as HTMLInputElement).value,
        subTextFontCss: (document.getElementById("subTextFontCss") as HTMLInputElement).value,
        subTextY: parseFloat((document.getElementById("subTextY") as HTMLInputElement).value),
        subTextWidthPercentage: parseFloat((document.getElementById("subTextWidthPercentage") as HTMLInputElement).value),

        showBottomText: (document.getElementById("showBottomText") as HTMLInputElement).checked,
        bottomText: (document.getElementById("bottomText") as HTMLInputElement).value,
        bottomTextFontCss: (document.getElementById("bottomTextFontCss") as HTMLInputElement).value,
        bottomTextPercentage: parseFloat((document.getElementById("bottomTextPercentage") as HTMLInputElement).value),
        bottomTextBottomMargin: parseFloat((document.getElementById("bottomTextBottomMargin") as HTMLInputElement).value),
        bottomCharWidthPercentage: parseFloat((document.getElementById("bottomCharWidthPercentage") as HTMLInputElement).value),
    };
    (document.getElementById("settingsJson") as HTMLTextAreaElement).value = JSON.stringify(settings);
    drawSeal(document.getElementById("thecanvas") as HTMLCanvasElement, settings);


    return false;
}

function drawJson() {
    try {
        let settings: IConfig = JSON.parse((document.getElementById("settingsJson") as HTMLTextAreaElement).value);
        {
            let bgColorElement = document.getElementById("bgColor") as HTMLSelectElement;

            (document.getElementById("color") as HTMLInputElement).value = settings.color;
            (document.getElementById("bgColor") as HTMLSelectElement).value = settings.bgColor;
            (document.getElementById("radius") as HTMLInputElement).value = (settings.radius as number).toString();

            (document.getElementById("outerCircleLineWidth") as HTMLInputElement).value = (settings.outerCircleLineWidth as number).toString();

            (document.getElementById("showTopText") as HTMLInputElement).checked = settings.showTopText;
            (document.getElementById("topText") as HTMLInputElement).value = settings.topText;
            (document.getElementById("topTextFontCss") as HTMLInputElement).value = settings.topTextFontCss;
            (document.getElementById("topTextPercentage") as HTMLInputElement).value = settings.topTextPercentage.toString();
            (document.getElementById("topTextTopMargin") as HTMLInputElement).value = settings.topTextTopMargin.toString();
            (document.getElementById("topCharWidthPercentage") as HTMLInputElement).value = settings.topCharWidthPercentage.toString();

            (document.getElementById("showStar") as HTMLInputElement).checked = settings.showStar;
            (document.getElementById("starRadius") as HTMLInputElement).value = settings.starRadius.toString();

            (document.getElementById("showSubText") as HTMLInputElement).checked = settings.showSubText;
            (document.getElementById("subText") as HTMLInputElement).value = settings.subText;
            (document.getElementById("subTextFontCss") as HTMLInputElement).value = settings.subTextFontCss;
            (document.getElementById("subTextY") as HTMLInputElement).value = settings.subTextY.toString();
            (document.getElementById("subTextWidthPercentage") as HTMLInputElement).value = settings.subTextWidthPercentage.toString();

            (document.getElementById("showBottomText") as HTMLInputElement).checked = settings.showBottomText;
            (document.getElementById("bottomText") as HTMLInputElement).value = settings.bottomText;
            (document.getElementById("bottomTextFontCss") as HTMLInputElement).value = settings.bottomTextFontCss;
            (document.getElementById("bottomTextPercentage") as HTMLInputElement).value = settings.bottomTextPercentage.toString();
            (document.getElementById("bottomTextBottomMargin") as HTMLInputElement).value = settings.bottomTextBottomMargin.toString();
            (document.getElementById("bottomCharWidthPercentage") as HTMLInputElement).value = settings.bottomCharWidthPercentage.toString();
        }

        drawSeal(document.getElementById("thecanvas") as HTMLCanvasElement, settings);
    } catch (e) {
        document.getElementById("jsonRelatedError").innerText = `发生错误：${e}`;
    }
    return false;
}

function getThePngOfCanvas()
{
    let canvas = document.getElementById("thecanvas") as HTMLCanvasElement;
    let linkElem = document.getElementById("downloadLink") as HTMLAnchorElement;
    linkElem.href = canvas.toDataURL("img/png");
    linkElem.hidden = false;
}

function resetSth() {
    document.getElementById("jsonRelatedError").innerText = "";
    (document.getElementById("downloadLink") as HTMLAnchorElement).hidden = true;
}

window.addEventListener("load", function () {
    drawIt();
});

