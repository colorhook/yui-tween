/**
* Adapted from Robert Penner's AS3 tweening equations.
*
* Adapted from Grant Skinner's GTweener
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
YUI.add('k2-easing', function(Y){
	
	var s = 1.70158,
		a = 1,
		p = 0.3,
		sp = p/4;
	
	Y.Easing = {
		Linear: {
			easeNone: function(ratio, unused1, unused2, unused3) {
				return ratio;
			}
		},
		Sine: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return 1-Math.cos(ratio * (Math.PI / 2));
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return Math.sin(ratio * (Math.PI / 2));
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return -0.5*(Math.cos(ratio*Math.PI)-1);
			}
		},
		Quadratic: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return ratio*ratio;
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return -ratio*(ratio-2);
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return (ratio < 0.5) ? 2*ratio*ratio : -2*ratio*(ratio-2)-1;
			}
		},
		Cubic: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return ratio*ratio*ratio;
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return (ratio-=1)*ratio*ratio+1;
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return (ratio < 0.5) ? 4*ratio*ratio*ratio : 4*(ratio-=1)*ratio*ratio+1;
			}
		},
		Quartic: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return ratio*ratio*ratio*ratio;
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return 1-(ratio-=1)*ratio*ratio*ratio;
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return (ratio < 0.5) ? 8*ratio*ratio*ratio*ratio : -8*(ratio-=1)*ratio*ratio*ratio+1;
			}
		},
		Quintic: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return ratio*ratio*ratio*ratio*ratio;
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return 1+(ratio-=1)*ratio*ratio*ratio*ratio;
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return (ratio < 0.5) ? 16*ratio*ratio*ratio*ratio*ratio : 16*(ratio-=1)*ratio*ratio*ratio*ratio+1;
			}
		},
		Circular: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return -(Math.sqrt(1-ratio*ratio)-1);
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return Math.sqrt(1-(ratio-1)*(ratio-1));
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return ((ratio *= 2) < 1) ? -0.5*(Math.sqrt(1-ratio*ratio)-1) : 0.5*(Math.sqrt(1-(ratio-=2)*ratio)+1);
			}
		},
		Exponential: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return (ratio == 0) ? 0 : Math.pow(2, 10 * (ratio - 1));
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return (ratio == 1) ? 1 : 1-Math.pow(2, -10 * ratio);
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				if (ratio == 0 || ratio == 1) { return ratio; }
				if (0 > (ratio = ratio*2-1)) { return 0.5*Math.pow(2, 10*ratio); }
				return 1-0.5*Math.pow(2, -10*ratio);
			}
		},
		Elastic: {
			easeIn: function(ratio, unused1, unused2, unused3){
				if (ratio == 0 || ratio == 1) { return ratio; }
				return -(a * Math.pow(2, 10 * (ratio -= 1)) * Math.sin((ratio - sp) * (2 * Math.PI) / p));
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				if (ratio == 0 || ratio == 1) { return ratio; }
				return a * Math.pow(2, -10 * ratio) *  Math.sin((ratio - sp) * (2 * Math.PI) / p) + 1;
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				if (ratio == 0 || ratio == 1) { return ratio; }
				ratio = ratio*2-1;

				if (ratio < 0) {
					return -0.5 * (a * Math.pow(2, 10 * ratio) * Math.sin((ratio - sp*1.5) * (2 * Math.PI) /(p*1.5)));
				}
				return 0.5 * a * Math.pow(2, -10 * ratio) * Math.sin((ratio - sp*1.5) * (2 * Math.PI) / (p*1.5)) + 1;
			}
		},
		Back: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return ratio * ratio * ((s+1) *ratio - s);
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				return (ratio -= 1) * ratio * ((s+1) * ratio + s) + 1;
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return ((ratio *= 2) < 1) ? 0.5*(ratio*ratio*((s*1.525+1)*ratio-s*1.525)) : 0.5*((ratio -= 2)*ratio*((s*1.525+1)*ratio+s*1.525)+2);
			}
		},
		Bounce: {
			easeIn: function(ratio, unused1, unused2, unused3){
				return 1 - this.easeOut(1-ratio,0,0,0);
			},
			easeOut: function(ratio, unused1, unused2, unused3){
				if (ratio < 1/2.75) {
					return 7.5625*ratio*ratio;
				} else if (ratio < 2/2.75) {
					return 7.5625*(ratio-=1.5/2.75)*ratio+0.75;
				} else if (ratio < 2.5/2.75) {
					return 7.5625*(ratio-=2.25/2.75)*ratio+0.9375;
				} else {
					return 7.5625*(ratio-=2.625/2.75)*ratio+0.984375;
				}
			},
			easeInOut: function(ratio, unused1, unused2, unused3){
				return ((ratio*=2) < 1) ? 0.5*this.easeIn(ratio,0,0,0) : 0.5*this.easeOut(ratio-1,0,0,0)+0.5;
			}
		}
	}
	

}, '1.0.0', {requires:['']});