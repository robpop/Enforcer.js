/*
  Author: Robert F. Popeleski <therfp97@gmail.com>
  License: MIT

  This JavaScript library uses event monitoring to make form field 
  elements immutable and defend against constraint manipulations.
*/

"use strict";

function enforcer_assert(condition, message) {
    if ( !condition ) {
        throw message || "Assertion failed";
    }
}

/*

	watch: element id to enforce with desired attributes separated by periods
	
	onManip: callback function to be called after change to detected
	
	persist: reinsert element if deleted from the DOM

	activate(): start Enforcer on new object

	[PRIVATE] #_watch(): parser and validator for watch property

	[PRIVATE] #_onManip(): on change event listener instantiator

	[PRIVATE] #_persist(): on delete event listener instantiator


	if an element id is passed to watch with no accompanying attributes, then all watchable attributes are enforced
	i.e. ElementID => all attributes supported
	i.e. ElementID.maxlength => enforce maxlength attribute
	i.e. ElementID.maxlength.type => enforce maxlength and type attributes
	
*/

class Enforcer {
	static #ERR_WATCH_STR = "Watched object must be passed as a string";
	static #ERR_WATCH_ID = "Element with passed id does not exist";

	constructor (watch, onManip, persist) {
		this.watch = watch;
		this.onManip = onManip;
		this.persist = persist;
	}


	static #_onManip ( onManip, parent_ele, watch_list ) {

		let i = 0;
		let watch_list_l = watch_list.length;
		for ( i; i < watch_list_l; i++ ) {
			switch (watch_list[ i ]) {
				case "maxlength":
					let m = parent_ele.getAttribute("maxlength");
					if(m) {
						parent_ele.addEventListener('focusout', (e) => {
							if(parent_ele.value.length > m) {
								parent_ele.setAttribute("maxlength", m);
								parent_ele.value = parent_ele.value.substring(0,m);
								onManip();
							}
						});
					}
				break;
			}
		}

	}


	static #_persist ( onManip, parent_ele, watch_list ) {

		let backup = parent_ele.cloneNode(true);

		const observer = new MutationObserver(function(mutations_list) {
			mutations_list.forEach(function(mutation) {
				mutation.removedNodes.forEach(function(removed_node) {
					if(removed_node.id == parent_ele.id) {
						console.log(backup);
						
						document.body.appendChild(backup);
						Enforcer.#_onManip( onManip, backup, watch_list );
					}
				});
			});
		});
		
		observer.observe(document.getElementsByTagName('body')[0], { subtree: false, childList: true });

	}


	static #_watch ( watch, onManip, persist ) {

		enforcer_assert ( typeof watch === "string", Enforcer.#ERR_WATCH_STR+" ("+watch+")" );
		
		let watch_list = watch.split( "." );
		let parent_ele = null;
		enforcer_assert ( typeof watch_list[ 0 ] === "string" && document.getElementById( watch_list[ 0 ] ) !== null, Enforcer.#ERR_WATCH_ID+" ("+watch_list[ 0 ]+")" );

		parent_ele = document.getElementById(watch_list[0]);
		watch_list.shift();

		Enforcer.#_onManip( onManip, parent_ele, watch_list );

		persist ? Enforcer.#_persist( onManip, parent_ele, watch_list ) : null;

	}

	activate () {
		Enforcer.#_watch( this.watch, this.onManip, this.persist );
		//Enforcer.#_persist( this.persist );
	}

}

/*

OLD CODE TO INTEGRATE INTO NEW ENFORCER CLASS

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
*/