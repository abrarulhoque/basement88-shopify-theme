(function () {
	const collapsibleContent = () => {
		$(".collapsible-content").each(function () {
			const $section = $(this);

			$section.find(".collapsible-content-summary").eq(0).addClass("active");

			$section.find(".collapsible-content-summary").off("click").on("click", function () {
				const $summary = $(this);
				const $content = $summary.siblings(".collapsible-content-item__content");

				if (!$summary.hasClass("active")) {
					$section.find(".collapsible-content-summary.active").removeClass("active");
					$section.find(".collapsible-content-item__content").stop().slideUp(300);

					$summary.addClass("active");
					$content.stop().slideDown(300);
				} else {
					$summary.removeClass("active");
					$content.stop().slideUp(300);
				}
			});
		});
	};

	collapsibleContent();

	document.addEventListener("shopify:section:load", function () {
		setTimeout(() => {
			collapsibleContent();
		}, 100);
	});
})();
