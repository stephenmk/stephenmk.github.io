'use strict';


const urls = {
	"google":   "https://www.edrdg.org/~jwb/cgi-bin/ngramlookup?sent=",
	"km":       "https://www.edrdg.org/~jwb/cgi-bin/ngramlookupwww?sent=",
	"kotobank": "https://kotobank.jp/gs/?q=",
	"eijiro":   "https://eow.alc.co.jp/search?q=",
	"wadoku":   "https://www.wadoku.de/search/?q="
}


// Toggle the display of the link menu on button clicks
function linkMenuButtonClick() {
	const linkMenuContent = this.nextElementSibling;
	const doShowMenu = !linkMenuContent.classList.contains("active");
	hideAllLinkMenus();
	if (doShowMenu) {
		linkMenuContent.classList.add("active")
	}
}


// Hide the menu after an outside click
function makeLinkMenuHideListener() {
	const listener = (event) => {
		let isLinkMenu = false;
		event.target.classList.forEach(className => {
			if (className.startsWith("link-menu")) {
				isLinkMenu = true;
			}
		})
		if (isLinkMenu) return;
		hideAllLinkMenus();
	}
	document.addEventListener("click", listener, false)
}


function hideAllLinkMenus() {
	document.querySelectorAll(".link-menu-content.active").forEach(element => {
		element.classList.remove('active')
	})
}


function makeLink(text, url, parameterList) {
	const linkElement = document.createElement("a");
	linkElement.textContent = text
	linkElement.href = url + parameterList.join('+');
	linkElement.classList.add("link-menu-item");
	return linkElement;
}


function makeLinkHeading(text) {
	const spanNode = document.createElement("span");
	spanNode.textContent = "【" + text + "】";
	spanNode.lang = "ja";
	spanNode.classList.add("link-menu-heading");
	return spanNode;
}


function makeLinkMenus() {
	document.querySelectorAll(".item").forEach(item => {
		const kanjiList = [];
		item.querySelectorAll(".kanj").forEach(kanji => {
			kanjiList.push(kanji.innerText)
		})

		const readingList = [];
		item.querySelectorAll(".rdng").forEach(reading => {
			readingList.push(reading.innerText)
		})
		if (readingList.length == 0) return;

		const allExpressions = kanjiList.concat(readingList);

		// Display links for all kanji expressions and the first reading.
		// If there are no kanji expressions, use all the readings.
		const linkExpressions = (kanjiList.length != 0) ?
			kanjiList.concat(readingList[0]) :
			readingList;

		const menuItems = [
			makeLink("N-gram counts (Google)", urls["google"], allExpressions),
			makeLink("N-gram counts (KM)", urls["km"], allExpressions)
		]
		linkExpressions.forEach(expression => {
			menuItems.push(makeLinkHeading(expression))
			menuItems.push(makeLink("Kotobank", urls["kotobank"], [expression]))
			menuItems.push(makeLink("Eijiro (ALC server)", urls["eijiro"], [expression]))
			menuItems.push(makeLink("Wadoku", urls["wadoku"], [expression]))
		})

		const linkMenuContent = document.createElement("div");
		linkMenuContent.classList.add("link-menu-content");
		menuItems.forEach(menuItem => {
			linkMenuContent.appendChild(menuItem);
		})

		const linkMenuButton = document.createElement("button");
		linkMenuButton.classList.add("link-menu-button");
		linkMenuButton.innerText = "External Links"
		linkMenuButton.addEventListener("click", linkMenuButtonClick, false)

		const linkMenuContainer = document.createElement("div");
		linkMenuContainer.classList.add("link-menu-container");
		linkMenuContainer.appendChild(linkMenuButton);
		linkMenuContainer.appendChild(linkMenuContent);

		const firstLineBreak = item.querySelector("br");
		firstLineBreak.before(linkMenuContainer);
	})
}


function main() {
	makeLinkMenus()
	makeLinkMenuHideListener();
}


main();
