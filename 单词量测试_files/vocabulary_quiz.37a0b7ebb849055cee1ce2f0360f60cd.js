function hide_option_menu() {
	if (typeof WeixinJSBridge != "undefined") {
		WeixinJSBridge.call("hideOptionMenu");
	}
}

function show_option_menu() {
	if (typeof WeixinJSBridge != "undefined") {
		WeixinJSBridge.call("showOptionMenu");
	}
}

function is_app() {
	var agent = navigator.userAgent.toLowerCase();
	return (-2 != agent.search('com.shanbay.') + agent.search('com.beeblio.'));
}

function is_android() {
	var agent = navigator.userAgent.toLowerCase();
	return agent.search('android') != -1;
}

function is_ios() {
	var agent = navigator.userAgent.toLowerCase();
	return (-2 != agent.search('ios') + agent.search('iphone'));
}

function is_wp() {
	var agent = navigator.userAgent.toLowerCase();
	return agent.search('trident') != -1;
}
var Word = Backbone.Model.extend({});
var Words = Backbone.Collection.extend({
	model: Word,
	url: "/api/v1/vocabtest/wechat/",
	parse: function(res) {
		return res.data;
	}
});
var WordView = Backbone.View.extend({
	el: "#word-container",
	platform: "android",
	download_url: "http://a.app.qq.com/o/simple.jsp?pkgname=com.shanbay.words",
	platform_icon: "icon-android",
	DOWNLOAD_URLS: {
		"ios": "http://a.app.qq.com/o/simple.jsp?pkgname=com.shanbay.words",
		"android": "http://a.app.qq.com/o/simple.jsp?pkgname=com.shanbay.words",
		"wp": "http://m.weifengke.com/app/index/bd/abz/?id=311256&nav_type=nav_s"
	},
	PLATFORM_ICONS: {
		"ios": "icon-apple",
		"android": "icon-android",
		"wp": "icon-windows"
	},
	events: {
		"click .word": "check_selection",
	},
	initialize: function() {
		this.is_app = is_app()
		this.counter = 1;
		this.total = 0;
		this.correct_count = 0;
		this.wrong_count = 0;
		this.words_list = new Array();
		this.correct_words = new Array();
		this.render();
	},
	render: function() {
		this.$el.show();
		this.total = total_words;
		this.adjust_platform();
		$("[done=false]").eq(0).show();
		return this;
	},
	adjust_platform: function() {
		var useragent = navigator.userAgent.toLowerCase();
		if (useragent.indexOf("ios") != -1 || useragent.indexOf("iphone") != -1) {
			this.platform = "ios";
		} else if (useragent.indexOf("trident") != -1) {
			this.platform = "wp";
		}
		this.app_url = this.DOWNLOAD_URLS[this.platform];
		this.platform_icon = this.PLATFORM_ICONS[this.platform];
	},
	definition_preprocess: function() {
		var self = this;
		$.each(self.words.models, function(word_index, word) {
			var definitions = self.words.models[word_index].get("definition_choices");
			$.each(definitions, function(def_index, definition) {
				var new_definition = definition.definition;
				var matches = new_definition.match(/[a-z\.& ]+\./g)
				matches = _.without(matches, "...");
				if (matches && matches.length >= 2) {
					start = new_definition.indexOf(matches[0]);
					end = new_definition.indexOf(matches[1]);
					if (start != end) {
						var sliced_definition = new_definition.substr(start, end - start - 1);
						if (sliced_definition.trim().length > matches[0].trim().length) {
							new_definition = sliced_definition;
						}
					}
				}
				definitions[def_index].definition = new_definition;
			});
		});
	},
	check_selection: function(e) {
		var self = $(e.currentTarget);
		value = self.attr("value");
		answer = self.attr("answer");
		rank = self.attr("rank")
		this.words_list.push(rank);
		$("#word-" + this.counter).attr("done", true);
		if (value == 0) {
			self.prev().find("label").unbind();
		} else {
			self.parent().find("label").unbind();
			self.parent().next().unbind();
		}
		if (value == answer) {
			++this.correct_count;
			this.correct_words.push(rank);
			self.css("background", "#d8eecf");
		} else {
			++this.wrong_count;
			self.css("background", "#edd5d6");
		}
		// 进度
		var correct_process = Math.ceil(this.correct_count / this.total * 100);
		var wrong_process = Math.floor(this.wrong_count / this.total * 100);
		var undo_count = this.total - this.counter;
		if (!undo_count) {//剩余为0时，置为空
			undo_count = "";
		}
		var undo_process = 100 - correct_process - wrong_process;
		$(".bar-success").css("width", correct_process + "%").html(this.correct_count);
		$(".bar-danger").css("width", wrong_process + "%").html(this.wrong_count);
		$(".bar-undo").css("width", undo_process + "%").html(undo_count);
		// 当前题目隐藏，下一题目显示
		var parent = this;
		setTimeout(function() {
			parent.card_out(parent.counter);
			++parent.counter;
			setTimeout(function() {
				parent.card_in(parent.counter);
			}, 300);
		}, 200);
		// 
		if (this.counter == this.total) {
			this.show_result(this.words_list, this.correct_words);
			return;
		}
	},
	card_out: function(count) {
		move("#word-" + count).to(0, -$(document).height()).set('opacity', 0).duration(500).end(function() {
			$("#word-" + count).hide();
		});
		if ((count + 1) > this.total) {
			return;
		}
		// 还有下一个，准备好下一个题目
		var selector = "#word-" + (count + 1);
		move(selector).set('opacity', 0).set('display', 'block').to(0, window.screen.height).end();
	},
	card_in: function(count) {
		if (count > this.total) {
			return;
		}
		move("#word-" + count).set('opacity', 1).y(0).duration(500).end();
	},
	show_result: function(words, correct_words) {
		var self = this;
		var data = {
			"words": this.words_list.toString(),
			"correct_words": this.correct_words.toString(),
		}
		show_option_menu();
		var form = $('<form action="." method="post"> <input name="words" value=' + this.words_list.toString() + '> <input name="correct_words" value=' + this.correct_words.toString() + '></form>')
		form.submit();
	},
	get_random_domain: function() {
		var domains = $("#domains").text().split(",");
		var domain = _.shuffle(domains)[0].trim();
		return "http://vocab." + domain;
	}
});
var MainView = Backbone.View.extend({
	el: "#splash-container",
	share_data: {
		"imgUrl": "http://qstatic.shanbay.com/media/media_store/c80a60dfd828546c146364c8d347955b.png",
		"title": $("title").text(),
		"content": $("title").text()
	},
	events: {
		"click #start": "start",
		"touchmove #splash": "scroll_ban"
	},
	initialize: function() {
		this.render();
	},
	render: function() {
		$(this.el).html($("#splash-tmpl").tmpl({}));
		this.$('.splash').height(window.screen.height);
		$('.splash').css('position', 'fixed');
		$('.splash .game-name').css('position', 'fixed');
		$('.splash .start').css('position', 'fixed');
		return this;
	},
	start: function() {
		wordView = new WordView;
		move("#start").set("box-shadow", "0px 0px 20px black").rotate(360).duration(500).end();
		var count = 0;
		var self = this;
		var interval_id = setInterval(function() {
			if (count % 2 == 0) {
				move("#start").set("box-shadow", "0px 0px 20px black").duration(800).end();
			} else {
				move("#start").set("box-shadow", "0px 0px 0px black").duration(800).end();
			}
			if ($(".definition").length) {
				clearInterval(interval_id);
				self.splash();
			}
			++count;
		}, 800);
	},
	splash: function() {
		move("#splash").to(0, -$("#splash").height()).end(function() {
			$("#splash").hide();
		});
	},
	scroll_ban: function(e) {
		e.preventDefault();
	},
});
$('#test').click(function() {
	wordView.show_result();
});
if (!is_app()) {
	$('.download-section').removeClass('hide');
}
if (is_ios()) {
	$('i.platform-icon').addClass('icon-apple');
}
if (is_android()) {
	$('i.platform-icon').addClass('icon-android');
}
if (is_wp()) {
	$('i.platform-icon').addClass('icon-windows');
}