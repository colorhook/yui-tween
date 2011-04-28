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
YUI.add('k2-tweener', function(Y){

	var Tween = Y.Tween,
	Tweener = function(){
		Tweener.superclass.constructor.apply(this, arguments);
	}
	
	Y.extend(Tweener, Y.Base, {
		_init: function(tween, name, value){
			return value;
		},
		
		tween: function(tween, name, value, initValue, rangeValue, raio, end){
			if(end && tween.pluginData.Tweener){
				Tweener.remove(tween);
			}
			return value;
		},
	},
	{
		NAME: 'Tweener',
		ATTRS:{
			
		},
		tweens: null,
		instance: null,
		staticInit: function(){
			this.tweens = [];
			this.instance = new Tweener();
			Tween.installPlugin(this.instance, ["*"]);
		},
		
		
		to: function(target, duration, values, props, pluginData){
			var tween = new Tween(target, duration, values, props, pluginData);
			this.add(tween);
			return tween;
		},
		
		from: function(target, duration, values, props, pluginData){
				var tween = new Tween(target, duration, values, props, pluginData);
				this.add(tween);
				tween.swapValues();
				return tween;
		},
		add: function(tween){
			var target = tween.get('target'),
				list = this.find(target);
				
			if(list){
				this.clearValues(target, tween.getValues());
			}else{
				list = [];
				this.tweens.push({target: target, list: list});
			}
			list.push(tween);
			tween.pluginData.Tweener = true;
		},
		find: function(target){
			var t = this.tweens;
			for(var i = 0, l = t.length; i < l; i++){
				var item = t[i];
				if(item.target == target){
					return item.list;
				}
			}
			return null;
		},
		getTween: function(target, name){
			var list = this.find(target);
			if(list == null){
				return null;
			}
			var l = list.length;
			for(var i = 0; i < l; i++){
				var tween = list[i];
				if(!isNaN(tween.getValue(name))){
					return tween;
				}
			}
			return null;
		},
		getTweens: function(target){
			return this.find(target) || [];
		},
		pauseTweens: function(target, paused){
			var list = this.find(target);
			if(list == null){
				return;
			}
			var l = list.length;
			for(var i = 0; i < l; i++){
				list[i].set('paused', paused);
			}
		},
		resumeTweens: function(target){
			this.pauseTweens(target, false);
		},
		remove: function(tween){
			delete tween.pluginData.Tweener;
			var list = this.find(tween.get('target'));
			if (list == null) { return; }
			var l = list.length;
			for (var i=0; i<l; i++) {
				if (list[i] == tween) {
					list.splice(i,1);
					return;
				}
			}
		},
		removeTween: function(target){
			this.pauseTweens(target);
			var list = this.find(target);
			if(list==null){
				return;
			}
			var l = list.length;
			for (var i=0; i<l; i++) {
				delete(list[i].pluginData.Tweener);
			}
			this.removeTweenFromTweens(target);
		},
		removeTweenFromTweens: function(target){
			var t = this.tweens;
			for(var i = 0, l = t.length; i < l; i++){
				var item = t[i];
				if(item.target == target){
					t.splice(i, 1);
					return;
				}
			}
		},
		clearValues: function(target, values){
			for (var n in values) {
				var tween = this.getTween(target, n);
				if (tween) { tween.deleteValue(n); }
			}
		}
	});
	
	Tweener.staticInit();
	Y.Tweener = Tweener;

}, '1.0.0', {requires:['base-base', 'k2-tween']});