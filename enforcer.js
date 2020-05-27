/*
  Author: Robert F. Popeleski <therfp97@gmail.com>
  License: MIT
*/
function Enforcer(ele) {
	if(ele.tagName !== "INPUT" && ele.tagName !== "TEXTAREA") {
		if(typeof Error !== "undefined") throw new Error("requires input or textarea element");
		throw "requires input or textarea element";
	}
	let m = ele.getAttribute("maxlength");
	if(m) {
		ele.addEventListener('focusout', (e) => {
			ele.setAttribute("maxlength", m);
			ele.value = ele.value.substring(0,m);
		});
	}
}