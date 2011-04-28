/**
* Inspired by Grant Skinner's GTweener
* Copyright (c) 2009 Grant Skinner
*
* Copyright (c) 2011 colorhook@gmail.com
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/
YUI.add('k2-tween', function(Y){
	
	var linearEase =  function(a){
		return a;	
	},
	
	Tween = function(target, duration, values, props, pluginData){
		props = props || {};
		Tween.superclass.constructor.apply(this, arguments);
		this.set('ease', props.ease || Tween.defaultEase);
		this.set('target', target);
		this.set('duration', duration || 1000);
		this.pluginData = this.copy(pluginData, {});
		if(props){
			var swap = props.swapValues;
			delete props.swapValues;
		}
		
		this.copy(props, this);
			
		this.resetValues(values);
		if(swap){
			this.swapValues();
		}
	
		if(this.get('duration')==0 && this.get('delay')==0 && this.get('autoPlay')){
			this.set('position', 0);
		}
		
	}
	
	Y.extend(Tween, Y.Base, {
		
		initializer: function(){
			this._delay = 0;
			this._paused = true;
			this._values = {};
			this._position = 0;
			this._inited = false;
			this._initValues = {};
			this._rangeValues = {};
		},
		
		_setPaused: function(value){
			if(value == this._paused){return;}
			this._paused = value;
			if(value){
				Tween.remove(this);
			}else{
				var p = this._position,
					r = this.get('repeatCount'),
					d = this.get('duration');
				if(isNaN(this._position) || (r !=0 && p >= r * d)){
					this._inited = false;
					this.caculatedPosition = this.calculatedPositionOld = this.ratio = this.ratioOld = this.positionOld = 0;
					this._position = - this._delay;	
				}
				Tween.add(this);
			}
		},
		
		_setPosition: function(value){
			this.positionOld = this._position;
			this.ratioOld = this.ratio;
			this.calculatedPositionOld = this.calculatedPosition;
			
			var repeatCount = this.get('repeatCount'),
				duration = this.get('duration'),
				reflect = this.get('reflect'),
				ease = this.get('ease'),
				target = this.get('target'),
				maxPosition = repeatCount * duration;
		
			var end = (value >= maxPosition && repeatCount > 0);
			if (end) {
				if (this.calculatedPositionOld == maxPosition) { return; }
				this._position = maxPosition;
				this.calculatedPosition = (reflect && !(repeatCount&1)) ? 0 : duration;
			} else {
				this._position = value;
				this.calculatedPosition = this._position<0 ? 0 : this._position % duration;
				if (reflect && (this._position/duration&1)) {
					this.calculatedPosition = duration- this.calculatedPosition;
				}
			}
			
			this.ratio = (duration == 0 && this._position >= 0) ? 1 : ease(this.calculatedPosition/duration,0,1,1);
			if (target && (this._position >= 0 || this.positionOld >= 0) && this.calculatedPosition != this.calculatedPositionOld) {
				if (!this._inited) { this._init(); }
				for (var n in this._values) {
					var initVal = this._initValues[n],
						rangeVal = this._rangeValues[n],
						val = initVal + rangeVal*this.ratio;
					
					var pluginArr = Tween.plugins[n];
					if (pluginArr) {
						var l = pluginArr.length;
						for (var i=0; i<l; i++) {
							val = pluginArr[i].tween(this,n,val,initVal,rangeVal,this.ratio, end);
						}
						if (!isNaN(val)) { target[n] = val; }
					} else {
						target[n] = val;
					}
				}
			}
			
			if (Tween.hasStarPlugins) {
				pluginArr = Tween.plugins["*"];
				l = pluginArr.length;
				for (i=0; i<l; i++) {
					pluginArr[i].tween(this,"*",NaN,NaN,NaN,this.ratio, end);
				}
			}
			
			this.fire("change", {});
			
			if (end) {
				this.set("paused", true);
				if (this.get("nextTween")) { this.get("nextTween").set("paused",false); }
				this.fire("complete", {});
			}
		},
		_setDelay: function(value){
			if(this._position <= 0){
				this._position = -value;
			}
			this._delay = value;
		},
		setValue: function(name, value){
			this._values[name] = value;
			this.invalidate();
		},
		getValue: function(name){
			return this._values[name];
		},
		deleteValue: function(name){
			delete this._values[name];
		},
		setValues: function(values){
			this.copy(values, this._values, true);
			this.invalidate();
		},
		resetValues: function(values){
			this._values = {};
			this.setValues(values);
		},
		getValues: function(){
			return this.copy(this._values, {});
		},
		getInitValue: function(name){
			return this._initValues[name];
		},
		swapValues: function(){
			if (!this._inited) { this._init(); }
			var o = this._values;
			this._values = this._initValues;
			this._initValues = o;
			for (var n in this._rangeValues) { this._rangeValues[n] *= -1; }
			if (this._position < 0) {
				// render it at position 0:
				var pos = this.positionOld;
				this.set("position", 0);
				this._position = this.positionOld;
				this.positionOld = pos;
			} else {
				this.set("position", this._position);
			}
		},
		_init: function(){
			this._inited = true;
			this._initValues = {};
			this._rangeValues = {};
			var target = this.get('target');
			for (var n in this._values) {
				if (Tween.plugins[n]) {
					var pluginArr = Tween.plugins[n],
						l = pluginArr.length,
						target = this.get("target"),
						value = (n in target) ? target[n] : NaN;
						
					for (var i = 0; i<l; i++) {
						value = pluginArr[i]._init(this, n, value);
					}
					if (!isNaN(value)) {
						this._rangeValues[n] = this._values[n]-(this._initValues[n] = value);
					}
				} else {
					this._rangeValues[n] = this._values[n]-(this._initValues[n] = target[n]);
				}
			}
			
			if (Tween.hasStarPlugins) {
				pluginArr = Tween.plugins["*"];
				l = pluginArr.length;
				for (i=0; i<l; i++) {
					pluginArr[i]._init(this,"*",NaN);
				}
			}
			this.fire("init", {}); 
		},
		
		beginning: function(){
			this.set("position", 0);
			this.set("paused", true);
		},
		end: function(){
			var r = this.get("repeatCount"),
				d = this.get("duration");
			this.set("position", r > 0 ? r * d: d);
		},
		invalidate: function(){
			this._inited = false;
			if(this._position>0){this._position = 0; }
			if(this.get('autoPlay')){
				this.set('paused', false); 
			}
		},
		copy: function(o1, o2, smart){
			for(var n in o1){
				if(smart && o1[n] == null){
					delete(o2[n]);
				}else{
					o2[n]=o1[n];
				}
			}
			return o2;
		}
		
	},
	{
		NAME: 'Tween',
		ATTRS: {
			delay: {
				value: 0
			},
			paused: {
				value: true,
				getter: function(){
					return this._paused;
				},
				setter: "_setPaused"
			},
			position: {
				value: 0,
				getter: function(){
					return this._position;
				},
				setter: "_setPosition"
			},
			autoPlay: {
				value: true
			},
			duration: {
				value: 1000
			},
			ease: {
				value: null 
			},
			nextTween:{
				value: null
			},
			reflect: {
				value: false
			},
			repeatCount: {
				value: 1
			},
			target: {
				value: null
			},
			timeScale: {
				value: 1
			}
		},
		linearEase:linearEase,
		defaultEase: linearEase,
		pauseAll: false,
		timeScaleAll: 10,
		hasStarPlugins: false,
		plugins: {
			
		},
		duration: 10,
		tickList: [],
		add: function(v){
			if(this.tickList.indexOf(v) == -1){
				this.tickList.push(v);
			}
		},
		remove: function(v){
			var i = this.tickList.indexOf(v);
			if(i>=0){
				this.tickList.splice(i, 1);
			}
		},
		installPlugin: function(plugin, propertyNames, highPriority){
			for (var i = 0, l = propertyNames.length; i<l ; i++) {
				var propertyName = propertyNames[i];
				if (propertyName == "*") { this.hasStarPlugins = true; }
				if (this.plugins[propertyName] == null) { this.plugins[propertyName] = [plugin]; continue; }
				if (highPriority) {
					this.plugins[propertyName].unshift(plugin);
				} else {
					this.plugins[propertyName].push(plugin);
				}
			}
		},
		staticTick: function(){
			if(this.pauseAll){return};
			
			for(var o in this.tickList){
				o = this.tickList[o];
				var p = this.timeScaleAll * o.get('timeScale');
				o.set('position', o.get('position') + p);
				
			}
		},
		staticInit: function(){
			var self = this,
			 	loop = function(){
					self.staticTick();
				   
				};
			loop();
			 setInterval(loop, 100);
		}
	});
	
	Tween.staticInit();
	Y.Tween = Tween;
	
}, '1.0.0', {requires:['base-base']});