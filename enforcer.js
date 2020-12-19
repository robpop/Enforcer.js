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

	static #_persist () {}

	static #_onManip ( onManip, parent_ele, watch_list ) {

		let i = 0;
		let watch_list_l = watch_list.length;
		for ( i; i < watch_list_l; ++i ) {
			console.log( watch_list[ i ] );
		}

	}

	static #_watch ( watch ) {

		enforcer_assert ( typeof watch === "string", Enforcer.#ERR_WATCH_STR+" ("+watch+")" );
		
		let watch_list = watch.split( "." );
		let parent_ele = null;
		enforcer_assert ( typeof watch_list[ 0 ] === "string" && document.getElementById( watch_list[ 0 ] ) !== null, Enforcer.#ERR_WATCH_ID+" ("+watch_list[ 0 ]+")" );


		Enforcer.#_onManip( this.onManip, parent_ele, watch_list );

	}

	activate () {
		Enforcer.#_watch( this.watch );
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