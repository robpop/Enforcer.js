# Enforcer.js
Prevent tampering of maxlength attribute on text input and textarea elements

![GitHub release (latest by date)](https://img.shields.io/github/v/release/robpop/Enforcer.js)
![GitHub file size in bytes](https://img.shields.io/github/size/robpop/Enforcer.js/enforcer.min.js)
![GitHub](https://img.shields.io/github/license/robpop/Enforcer.js)

## Why use this
The idea behind this script is to reduce the amount of work your backend infrastructure needs to perform on bad user input. Enforcer.js watches ```input``` and ```textarea``` elements for changes to ```maxlength``` and attempts to keep those constraints intact.

## Usage
### Enforcer( ele )
Where *ele* is the input or textarea element to be watched


Include the Enforcer.js script at the bottom of your document
```
<input type="text" id="foo" maxlength=10>
<script src="enforcer.min.js"></script>
```
Make a call to ```Enforcer(ele)```
```
Enforcer(document.getElementById("foo"));
```
Enforcer.js will now monitor the element for changes to the maxlength attribute. The constraint will be restored when focus is removed from the element, and the value text will be truncated appropriately.
