(function () {
  function parseSeries(value) {
    return value
      .split(",")
      .map(function (item) { return Number(item.trim()); })
      .filter(function (item) { return Number.isFinite(item); });
  }

  function drawSparkline(canvas) {
    var series = parseSeries(canvas.dataset.series || "");
    if (series.length < 2) {
      return;
    }

    var color = canvas.dataset.color || "#2a7a78";
    var rect = canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var width = Math.max(260, Math.floor(rect.width));
    var height = Math.max(72, Math.floor(rect.height || 74));

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = height + "px";

    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var min = Math.min.apply(null, series);
    var max = Math.max.apply(null, series);
    var span = max - min || 1;
    var padX = 6;
    var padY = 12;
    var innerW = width - padX * 2;
    var innerH = height - padY * 2;

    ctx.strokeStyle = "#d7ddd7";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, height - padY);
    ctx.lineTo(width - padX, height - padY);
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    series.forEach(function (value, index) {
      var x = padX + (index / (series.length - 1)) * innerW;
      var y = padY + (1 - (value - min) / span) * innerH;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    var lastX = padX + innerW;
    var lastY = padY + (1 - (series[series.length - 1] - min) / span) * innerH;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawAllSparklines() {
    document.querySelectorAll(".sparkline").forEach(drawSparkline);
  }

  document.querySelectorAll("video").forEach(function (video) {
    video.addEventListener("play", function () {
      document.querySelectorAll("video").forEach(function (other) {
        if (other !== video) {
          other.pause();
        }
      });
    });
  });

  window.addEventListener("resize", drawAllSparklines);
  window.addEventListener("load", drawAllSparklines);
  drawAllSparklines();
})();
