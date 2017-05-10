/*global TowerDefense */

// ------------------------------------------------------------------
//
// Input handling support
//
// ------------------------------------------------------------------
TowerDefense.input = (function() {
	'use strict';

	function Mouse() {
		var that = {
			mouseDown : [],
			mouseUp : [],
			mouseMove : [],
			handlersDown : [],
			handlersUp : [],
			handlersMove : []
		};

		function mouseDown(e) {
			that.mouseDown.push(e);
		}

		function mouseUp(e) {
			that.mouseUp.push(e);
		}

		function mouseMove(e) {
			that.mouseMove.push(e);
		}

		that.update = function(elapsedTime) {
			var event,
				handler;
			//
			// Process the mouse events for each of the different kinds of handlers
			for (event = 0; event < that.mouseDown.length; event++) {
				for (handler = 0; handler < that.handlersDown.length; handler++) {
					that.handlersDown[handler](that.mouseDown[event], elapsedTime);
				}
			}

			for (event = 0; event < that.mouseUp.length; event++) {
				for (handler = 0; handler < that.handlersUp.length; handler++) {
					that.handlersUp[handler](that.mouseUp[event], elapsedTime);
				}
			}

			for (event = 0; event < that.mouseMove.length; event++) {
				for (handler = 0; handler < that.handlersMove.length; handler++) {
					that.handlersMove[handler](that.mouseMove[event], elapsedTime);
				}
			}

			//
			// Now that we have processed all the inputs, reset everything back to the empty state
			that.mouseDown.length = 0;
			that.mouseUp.length = 0;
			that.mouseMove.length = 0;
		};

		that.registerCommand = function(type, handler) {
			if (type === 'mousedown') {
				that.handlersDown.push(handler);
			} else if (type === 'mouseup') {
				that.handlersUp.push(handler);
			} else if (type === 'mousemove') {
				that.handlersMove.push(handler);
			}
		};

		that.unregisterCommand = function(type, handler) {
			if (type === 'mousedown') {
				that.handlersDown.splice(that.handlersDown.indexOf(handler), 1);
			} else if (type === 'mouseup') {
				that.handlersUp.splice(that.handlersUp.indexOf(handler), 1);
			} else if (type === 'mousemove') {
				that.handlersMove.splice(that.handlersMove.indexOf(handler), 1);
			}
		}

		that.clearCommands = function(type) {
			if (type === 'mousedown') {
				that.handlersDown.splice(0, that.handlersDown.length);
			} else if (type === 'mouseup') {
				that.handlersUp.splice(0, that.handlersUp.length);
			} else if (type === 'mousemove') {
				that.handlersMove.splice(0, that.handlersMove.length);
			}
		}

		var canvasElement = document.getElementById('canvas-main');

		canvasElement.addEventListener('mousedown', mouseDown.bind(that));
		canvasElement.addEventListener('mouseup', mouseUp.bind(that));
		canvasElement.addEventListener('mousemove', mouseMove.bind(that));

		return that;
	}

	function Keyboard() {
		var that = {
				keys : {},
				handlers : [],
			},
			key;

		function keyPress(e) {
			that.keys[e.keyCode] = e.timeStamp;
		}

		function keyRelease(e) {
			delete that.keys[e.keyCode];
		}
		
		that.getKey = function(keyCode) {
			switch(keyCode) {
				case 3:
					return 'CANCEL';
					break;
				case 6:
					return 'HELP';
					break;
				case 8:
					return 'BACK_SPACE';
					break;
				case 9:
					return 'TAB';
					break;
				case 12:
					return 'CLEAR';
					break;
				case 13:
					return 'RETURN';
					break;
				case 14:
					return 'ENTER';
					break;
				case 16:
					return 'SHIFT';
					break;
				case 17:
					return 'CONTROL';
					break;
				case 18:
					return 'ALT';
					break;
				case 19:
					return 'PAUSE';
					break;
				case 20:
					return 'CAPS_LOCK';
					break;
				case 27:
					return 'ESCAPE';
					break;
				case 32:
					return 'SPACE';
					break;
				case 33:
					return 'PAGE_UP';
					break;
				case 34:
					return 'PAGE_DOWN';
					break;
				case 35:
					return 'END';
					break;
				case 36:
					return 'HOME';
					break;
				case 37:
					return 'LEFT';
					break;
				case 38:
					return 'UP';
					break;
				case 39:
					return 'RIGHT';
					break;
				case 40:
					return 'DOWN';
					break;
				case 44:
					return 'PRINTSCREEN';
					break;
				case 45:
					return 'INSERT';
					break;
				case 46:
					return 'DELETE';
					break;
				case 48:
					return '0';
					break;
				case 49:
					return '1';
					break;
				case 50:
					return '2';
					break;
				case 51:
					return '3';
					break;
				case 52:
					return '4';
					break;
				case 53:
					return '5';
					break;
				case 54:
					return '6';
					break;
				case 55:
					return '7';
					break;
				case 56:
					return '8';
					break;
				case 57:
					return '9';
					break;
				case 59:
					return 'SEMICOLON';
					break;
				case 61:
					return 'EQUALS';
					break;
				case 65:
					return 'A';
					break;
				case 66:
					return 'B';
					break;
				case 67:
					return 'C';
					break;
				case 68:
					return 'D';
					break;
				case 69:
					return 'E';
					break;
				case 70:
					return 'F';
					break;
				case 71:
					return 'G';
					break;
				case 72:
					return 'H';
					break;
				case 73:
					return 'I';
					break;
				case 74:
					return 'J';
					break;
				case 75:
					return 'K';
					break;
				case 76:
					return 'L';
					break;
				case 77:
					return 'M';
					break;
				case 78:
					return 'N';
					break;
				case 79:
					return 'O';
					break;
				case 80:
					return 'P';
					break;
				case 81:
					return 'Q';
					break;
				case 82:
					return 'R';
					break;
				case 83:
					return 'S';
					break;
				case 84:
					return 'T';
					break;
				case 85:
					return 'U';
					break;
				case 86:
					return 'V';
					break;
				case 87:
					return 'W';
					break;
				case 88:
					return 'X';
					break;
				case 89:
					return 'Y';
					break;
				case 90:
					return 'Z';
					break;
				case 93:
					return 'CONTEXT_MENU';
					break;
				case 96:
					return 'NUMPAD0';
					break;
				case 97:
					return 'NUMPAD1';
					break;
				case 98:
					return 'NUMPAD2';
					break;
				case 99:
					return 'NUMPAD3';
					break;
				case 100:
					return 'NUMPAD4';
					break;
				case 101:
					return 'NUMPAD5';
					break;
				case 102:
					return 'NUMPAD6';
					break;
				case 103:
					return 'NUMPAD7';
					break;
				case 104:
					return 'NUMPAD8';
					break;
				case 105:
					return 'NUMPAD9';
					break;
				case 106:
					return 'MULTIPLY';
					break;
				case 107:
					return 'ADD';
					break;
				case 108:
					return 'SEPARATOR';
					break;
				case 109:
					return 'SUBTRACT';
					break;
				case 110:
					return 'DECIMAL';
					break;
				case 111:
					return 'DIVIDE';
					break;
				case 112:
					return 'F1';
					break;
				case 113:
					return 'F2';
					break;
				case 114:
					return 'F3';
					break;
				case 115:
					return 'F4';
					break;
				case 116:
					return 'F5';
					break;
				case 117:
					return 'F6';
					break;
				case 118:
					return 'F7';
					break;
				case 119:
					return 'F8';
					break;
				case 120:
					return 'F9';
					break;
				case 121:
					return 'F10';
					break;
				case 122:
					return 'F11';
					break;
				case 123:
					return 'F12';
					break;
				case 124:
					return 'F13';
					break;
				case 125:
					return 'F14';
					break;
				case 126:
					return 'F15';
					break;
				case 127:
					return 'F16';
					break;
				case 128:
					return 'F17';
					break;
				case 129:
					return 'F18';
					break;
				case 130:
					return 'F19';
					break;
				case 131:
					return 'F20';
					break;
				case 132:
					return 'F21';
					break;
				case 133:
					return 'F22';
					break;
				case 134:
					return 'F23';
					break;
				case 135:
					return 'F24';
					break;
				case 144:
					return 'NUM_LOCK';
					break;
				case 145:
					return 'SCROLL_LOCK';
					break;
				case 188:
					return 'COMMA';
					break;
				case 190:
					return 'PERIOD';
					break;
				case 191:
					return 'SLASH';
					break;
				case 192:
					return 'BACK_QUOTE';
					break;
				case 219:
					return 'OPEN_BRACKET';
					break;
				case 220:
					return 'BACK_SLASH';
					break;
				case 221:
					return 'CLOSE_BRACKET';
					break;
				case 222:
					return 'QUOTE';
					break;
				case 224:
					return 'META';
					break;
				default:
					return 'Unable to find key';
					break;
			}
		};

		// ------------------------------------------------------------------
		//
		// Allows the client code to register a keyboard handler
		//
		// ------------------------------------------------------------------
		that.registerCommand = function(key, handler) {
			that.handlers.push({ key : key, handler : handler});
		};

		// ------------------------------------------------------------------
		//
		// Allows the client to invoke all the handlers for the registered key/handlers.
		//
		// ------------------------------------------------------------------
		that.update = function(elapsedTime) {
			for (key = 0; key < that.handlers.length; key++) {
				if (typeof that.keys[that.handlers[key].key] !== 'undefined') {
					that.handlers[key].handler(elapsedTime);
				}
			}
		};

		//
		// These are used to keep track of which keys are currently pressed
		window.addEventListener('keydown', keyPress);
		window.addEventListener('keyup', keyRelease);

		return that;
	}

	return {
		Keyboard : Keyboard,
		Mouse : Mouse
	};
}());

//------------------------------------------------------------------
//
// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
//
//------------------------------------------------------------------
if (typeof KeyEvent === 'undefined') {
	var KeyEvent = {
		DOM_VK_CANCEL: 3,
		DOM_VK_HELP: 6,
		DOM_VK_BACK_SPACE: 8,
		DOM_VK_TAB: 9,
		DOM_VK_CLEAR: 12,
		DOM_VK_RETURN: 13,
		DOM_VK_ENTER: 14,
		DOM_VK_SHIFT: 16,
		DOM_VK_CONTROL: 17,
		DOM_VK_ALT: 18,
		DOM_VK_PAUSE: 19,
		DOM_VK_CAPS_LOCK: 20,
		DOM_VK_ESCAPE: 27,
		DOM_VK_SPACE: 32,
		DOM_VK_PAGE_UP: 33,
		DOM_VK_PAGE_DOWN: 34,
		DOM_VK_END: 35,
		DOM_VK_HOME: 36,
		DOM_VK_LEFT: 37,
		DOM_VK_UP: 38,
		DOM_VK_RIGHT: 39,
		DOM_VK_DOWN: 40,
		DOM_VK_PRINTSCREEN: 44,
		DOM_VK_INSERT: 45,
		DOM_VK_DELETE: 46,
		DOM_VK_0: 48,
		DOM_VK_1: 49,
		DOM_VK_2: 50,
		DOM_VK_3: 51,
		DOM_VK_4: 52,
		DOM_VK_5: 53,
		DOM_VK_6: 54,
		DOM_VK_7: 55,
		DOM_VK_8: 56,
		DOM_VK_9: 57,
		DOM_VK_SEMICOLON: 59,
		DOM_VK_EQUALS: 61,
		DOM_VK_A: 65,
		DOM_VK_B: 66,
		DOM_VK_C: 67,
		DOM_VK_D: 68,
		DOM_VK_E: 69,
		DOM_VK_F: 70,
		DOM_VK_G: 71,
		DOM_VK_H: 72,
		DOM_VK_I: 73,
		DOM_VK_J: 74,
		DOM_VK_K: 75,
		DOM_VK_L: 76,
		DOM_VK_M: 77,
		DOM_VK_N: 78,
		DOM_VK_O: 79,
		DOM_VK_P: 80,
		DOM_VK_Q: 81,
		DOM_VK_R: 82,
		DOM_VK_S: 83,
		DOM_VK_T: 84,
		DOM_VK_U: 85,
		DOM_VK_V: 86,
		DOM_VK_W: 87,
		DOM_VK_X: 88,
		DOM_VK_Y: 89,
		DOM_VK_Z: 90,
		DOM_VK_CONTEXT_MENU: 93,
		DOM_VK_NUMPAD0: 96,
		DOM_VK_NUMPAD1: 97,
		DOM_VK_NUMPAD2: 98,
		DOM_VK_NUMPAD3: 99,
		DOM_VK_NUMPAD4: 100,
		DOM_VK_NUMPAD5: 101,
		DOM_VK_NUMPAD6: 102,
		DOM_VK_NUMPAD7: 103,
		DOM_VK_NUMPAD8: 104,
		DOM_VK_NUMPAD9: 105,
		DOM_VK_MULTIPLY: 106,
		DOM_VK_ADD: 107,
		DOM_VK_SEPARATOR: 108,
		DOM_VK_SUBTRACT: 109,
		DOM_VK_DECIMAL: 110,
		DOM_VK_DIVIDE: 111,
		DOM_VK_F1: 112,
		DOM_VK_F2: 113,
		DOM_VK_F3: 114,
		DOM_VK_F4: 115,
		DOM_VK_F5: 116,
		DOM_VK_F6: 117,
		DOM_VK_F7: 118,
		DOM_VK_F8: 119,
		DOM_VK_F9: 120,
		DOM_VK_F10: 121,
		DOM_VK_F11: 122,
		DOM_VK_F12: 123,
		DOM_VK_F13: 124,
		DOM_VK_F14: 125,
		DOM_VK_F15: 126,
		DOM_VK_F16: 127,
		DOM_VK_F17: 128,
		DOM_VK_F18: 129,
		DOM_VK_F19: 130,
		DOM_VK_F20: 131,
		DOM_VK_F21: 132,
		DOM_VK_F22: 133,
		DOM_VK_F23: 134,
		DOM_VK_F24: 135,
		DOM_VK_NUM_LOCK: 144,
		DOM_VK_SCROLL_LOCK: 145,
		DOM_VK_COMMA: 188,
		DOM_VK_PERIOD: 190,
		DOM_VK_SLASH: 191,
		DOM_VK_BACK_QUOTE: 192,
		DOM_VK_OPEN_BRACKET: 219,
		DOM_VK_BACK_SLASH: 220,
		DOM_VK_CLOSE_BRACKET: 221,
		DOM_VK_QUOTE: 222,
		DOM_VK_META: 224
	};
}
