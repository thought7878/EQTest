$(function() {
	// 开始按钮
	$(".begin-test-btn").click(function () {
		var top = $(document).height();
		var self = this;
		// "开始"动画样式
		$(this).css({//旋转
			"box-shadow":"0px 0px 20px black",
			"transform":"rotate(360deg)"
		});
		setTimeout(function () {
			$(".begin-test-container").css({//偏移
				"transform":"translateY(-"+top+"px)"
			});
			setTimeout(function () {
				$(".begin-test-container").hide();
			},550);
		},800);

		return false;
	});


	//点击答案
	$("#question-list").delegate(".answer-item", "click", function() {
		var currentQst$ = $(this).parents(".question-item");
		var nextQst$ = currentQst$.next();
		var docHeight = $(document).height();
		currentQst$.css({// 动画隐藏当前的问题
			"opacity": "0",
			"transform": "translateY(-" + docHeight + "px)"
		}).data("done","true").attr("data-done","true");
		setTimeout(function() {
			currentQst$.css("display", "none");
			nextQst$.css({// 显示下一题目
				"opacity": "1",
				"transform": "translateY(0)"
			});
		}, 600);
		// 准备显示下一题目
		nextQst$.css({
			"opacity": "0",
			"display": "block",
			"transform": "translateY(" + docHeight + "px)"
		});
		// hideCurrentQst (currentQst$,nextQst$)


		/*currentQst.fadeOut(function () {
			nextQst.fadeIn();
			nextQst.addClass("test-show");
		});*/

		/*currentQst.removeClass("test-show");
		setInterval(function () {
			// currentQst.addClass("hide");
			currentQst.fadeOut(function () {
				nextQst.addClass("test-show");
				nextQst.removeClass("hide");
			});
		},1000);*/

		return false;
	});
});

// 隐藏当前的题目
function hideCurrentQst(currentQst$, nextQst$) {
	// 隐藏当前的题目
	var docHeight = $(document).height();
	currentQst$.css("opacity", "0").css("transform", "translateY(-" + docHeight + ")");
	// 准备下一题目

}