var globalVar = {
	totalCount: 10,
	correctCount: 0,
	errorCount: 0,
	score: 0,
	isLast: function() {
		return this.totalCount === this.correctCount + this.errorCount;
	},
	getScore: function() {
		return this.score;
		// return Math.round(this.correctCount / this.totalCount * 100);
	}
}
var scoreObj = {
	"1":{
		"a":-20,
		"b":-10,
		"d":-10
	},
	"2":{
		"a":-10,
		"c":-10,
		"d":-20
	},
	"3":{
		"b":-10,
		"c":-10,
		"d":-20
	},
	"4":{
		"b":-10,
		"c":-10,
		"d":-20
	},
	"5":{
		"a":-10,
		"b":-10,
		"c":-20
	},
	"6":{
		"a":-20,
		"c":-10,
		"d":-20
	},
	"7":{
		"a":-20,
		"b":-20,
		"c":-10
	},
	"8":{
		"a":-20,
		"b":-10,
		"d":-10
	},
	"9":{
		"a":-20,
		"c":-20,
		"d":-20
	},
	"10":{
		"a":-20,
		"b":-20,
		"c":-10
	}
}

$(function() {
	// 开始按钮
	$(".begin-test-btn").click(function() {
		var top = $(document).height();
		var self = this;
		// "开始"动画样式
		$(this).css({ //旋转
			"box-shadow": "0px 0px 20px black",
			"transform": "rotate(360deg)"
		});
		setTimeout(function() {
			$(".begin-test-container").css({ //偏移
				"transform": "translateY(-" + top + "px)"
			});
			setTimeout(function() {
				$(".begin-test-container").hide();
			}, 550);
		}, 800);

		return false;
	});


	//点击答案
	$("#question-list").delegate(".answer-item", "click", function() {
		var questionItem$ = $(this).parents(".question-item");
		var answer = questionItem$.data("answer"); //答案
		var value = $(this).attr("value"); //回答
		if (answer == value) { //答对了
			$(this).css("background", "#d8eecf");
			globalVar.correctCount++;
			globalVar.score += 10;//计算分数
		} else {
			$(this).css("background", "#edd5d6");
			globalVar.errorCount++;
			var index = questionItem$.data("index");
			globalVar.score += scoreObj[index][value];//计算分数
		}
		// 关闭当前语音
		var audioObj = questionItem$.find("audio")[0];
		if (!audioObj.ended) {//没结束
			audioObj.pause();
		}
		// 进度
		var correctProcess = Math.ceil(globalVar.correctCount / globalVar.totalCount * 100);
		var wrongProcess = Math.floor(globalVar.errorCount / globalVar.totalCount * 100);
		var undoCount = globalVar.totalCount - globalVar.correctCount - globalVar.errorCount;
		if (!undoCount) { //剩余为0时，置为空
			undoCount = "";
		}
		var undoProcess = 100 - correctProcess - wrongProcess;
		$(".bar-success").css("width", correctProcess + "%").html(globalVar.correctCount);
		$(".bar-danger").css("width", wrongProcess + "%").html(globalVar.errorCount);
		$(".bar-undo").css("width", undoProcess + "%").html(undoCount);


		var currentQst$ = $(this).parents(".question-item");
		var nextQst$ = currentQst$.next();
		if (globalVar.isLast()) { //是最后一题
			hideCurrentQst(currentQst$, nextQst$);
			setTimeout(function() { //动画做完，显示分数
				currentQst$.css("display", "none");
				$(".score-container .score-value").text("" + globalVar.getScore());
				$(".score-container").fadeIn();
				$(".two-code").fadeIn();
			}, 500);
		} else {
			hideCurrentQst(currentQst$, nextQst$);
			showNextQst(currentQst$, nextQst$);
		}



		return false;
	});
});

// 隐藏当前的题目
function hideCurrentQst(currentQst$, nextQst$) {
	var docHeight = $(document).height();
	currentQst$.css({ // 动画隐藏当前的问题
		"transition-duration": "0.4s",
		"transition-timing-function": "ease-in",
		"transition-delay": "0.1s",
		"opacity": "0",
		"transform": "translateY(-" + docHeight + "px)"
	}).data("done", "true").attr("data-done", "true");
	nextQst$.css({ // 准备显示下一题目
		"transition-duration": "0.2s",
		"transition-timing-function": "ease-out",
		"transition-delay": "0s",
		"opacity": "0",
		"display": "block",
		"transform": "translateY(" + docHeight + "px)"
	});
}
// 显示下一题目
function showNextQst(currentQst$, nextQst$) {
	setTimeout(function() {
		currentQst$.css("display", "none");
		nextQst$.css({ // 显示下一题目
			"opacity": "1",
			"transform": "translateY(0)"
		});
	}, 500);
}