$(document).ready( function () {
  BakonSavr.init();
});

var BaconSaver = function () {
  this.canvas = undefined;
  this.user = undefined;
  this.units = 32;
  this.blockers = ".table";
  this.shrink  = { table : {left : 0, top : 16, right: 0, bottom: 0} } ;
  this.baconCounter = 0;
  this.baconPlated = 0;
  this.depositSlot = { L : 0, T : 0, R : 0, B : 0};
};
var keyHandler = function (e) {
  return BakonSavr.keyHandler(e);
}

var newGame = function (e) {
  BakonSavr.newGame();
  return false;
}

BaconSaver.prototype = {
  init : function () {
           this.allMoves = "left up right down A B";
           this.canvas = $('#canvas');
           this.initBackground();
           this.initChar();
           this.initForeground();
           $('#viewport').attr('tabindex',-1).focus().keydown(keyHandler);
           $('#newGame').click(newGame);
         },
  newGame : function () {
              $('#canvas').children().remove();
              this.initBackground();
              this.initChar();
              this.initForeground();
              $('#viewport').attr('tabindex',-1).focus();
              this.baconCounter = 0;
              this.baconPlated = 0;
           },
  initBackground: function () {
                    var tileW = this.canvas.width()/this.units;
                    var tileH = this.canvas.height()/this.units;

                    for (x=0;x<tileW;++x) { for (y=0;y<tileH;y++) {
                      var flr = $('<div class="flr grass"></div>');
                      flr.css('left',(x*this.units));
                      flr.css('top',(y*this.units));
                      this.canvas.append(flr);
                    }}
                    var table = $('<div class="flr table"></div>');
                    table.css('left',this.units*5);
                    table.css('top',this.units*5);
                    this.canvas.append(table);
                    var plate = $('<div class="plate"></div>');
                    plate.css('left',this.units*5.5);
                    plate.css('top',this.units*5.5);
                    this.canvas.append(plate);
                    this.depositSlot.L = this.units * 5.5;
                    this.depositSlot.T = this.units * 4;
                    this.depositSlot.R = this.units * 6.5;
                    this.depositSlot.B = this.units * 5;

                    this.makinBakin();
                  },
  initChar: function () {
              this.user = $('<div id="user" class="hero boy down"></div>');
              this.canvas.append(this.user);
              console.log(this.user);
              console.log(this.canvas);
             },
  initForeground: function () {
                  },
  makinBakin: function () {
                    var yM = (this.canvas.height()/this.units);
                    var xM = (this.canvas.width()/this.units) - 1;
                    var y = 1
                    for (; y < yM; ++y) {
                      var bacon = $('<div class="bacon"></div>');
                      var x;
                      do {
                        x = ((Math.random() * 100) % xM);
                      } while ( x < 5 && y < 5 || this.onTable(x,y));
                      bacon.css('left',this.units * x);
                      bacon.css('top',this.units * y);
                      bacon.css('transform', 'rotate(' + 45 * ((Math.random() * 100) % 8) + 'deg)');
                      this.canvas.append(bacon);
                    }
                    $('#baconLeft').text(yM-1);
                    $('#baconCollected').text(0);
                    $('#baconPlated').text(0);
              },
  keyHandler: function (event) {
                switch (event.which) {
                  case 37:
                  case 38:
                  case 39:
                  case 40:
                  case 65:
                  case 68:
                  case 83:
                  case 87:
                    event.preventDefault(); 
                    this.doMove(event.which);
                    break;
                  case 13:
                    event.preventDefault();
                    this.plateBacon();
                    break;
                  default: return;
                }

              },
  doMove: function (dir) {
            this.calcMove(dir);
            this.drawMove(dir);
            this.collect();
          },
  plateBacon: function () {
                var plate = $('.plate');
                var userPos = new Object();
                userPos.L = parseInt(this.user.css('left'));
                userPos.T = parseInt(this.user.css('top'));
                userPos.R = userPos.L + this.user.width();
                userPos.B = userPos.T + this.user.height();
                
                console.log(userPos);    
                console.log(this.depositSlot);

                if (this.collides(userPos,this.depositSlot)) {
                  for (; this.baconPlated < this.baconCounter; ++this.baconPlated) {
                    var bacon = $('<div class="platedBacon"></div>');
                    bacon.css('left',parseInt(plate.css('left')) + 8);
                    bacon.css('top',parseInt(plate.css('top')) - (this.baconPlated*2));
                    this.canvas.append(bacon);
                  }
                  $('#baconPlated').text(this.baconPlated);
                  $('#baconCollected').text(this.baconCounter - this.baconPlated);
                }
              },
  calcMove: function (dir) {
              var dist = 16;
              var left = false;
              switch (dir) {
                case 37:
                case 65: left=true;
                case 38:
                case 87: dist = -dist; break;
                case 39: 
                case 68: left=true;
                case 40: 
                case 83: break;
              }
              var cL = parseInt(this.user.css('left'));
              var cT = parseInt(this.user.css('top'));
              var nL = cL;
              var nT = cT;
              if (left) {
                nL = Math.max(Math.min(nL+dist, this.canvas.width() - this.user.width()), 0);
              } else {
                nT = Math.max(Math.min(nT+dist, this.canvas.height() - this.user.height()),0);
              }
              nL = Math.floor(nL);
              nT = Math.floor(nT);
              if (!this.bump({left: nL, top: nT},this.user.width(),this.user.height())) {
                this.user.css('left',nL + "px");
                this.user.css('top',nT + "px");
                console.log(nL);
                console.log(nT);
              }
            },
  faces: function (dir) {
           d = 'left';
           switch (dir) {
             case 37:
             case 65: break;
             case 38:
             case 87: d='up';break;
             case 39:
             case 68: d='right';break;
             case 40:
             case 83: d='down';break;
           }
           if (this.user.hasClass(d)) {
             return true;
           }
           return false;
         },
  onTable: function (x, y) {
             var pos1 = new Object();
             pos1.L = this.units * x;
             pos1.T = this.units * y;
             pos1.R = pos1.L + 16;
             pos1.B = pos1.T + 16;
             var table = $('.table');
             l = this.shrink.table.left;
             t = this.shrink.table.top;
             r = this.shrink.table.right;
             b = this.shrink.table.bottom;
             var pos2 = new Object();
             pos2.L = parseInt(table.css('left')) + l;
             pos2.T = parseInt(table.css('top')) + t;
             pos2.R = parseInt(table.css('left')) + table.width() - r;
             pos2.B = parseInt(table.css('top')) + table.height() - b;
             return this.collides(pos1,pos2);
           },
  collides: function (pos1, pos2) {
              //if ((pL < bR && pR > bL) && (pT < bB && pB > bT)) then collides = true;
              if ((pos1.L < pos2.R && pos1.R > pos2.L) && (pos1.T < pos2.B && pos1.B > pos2.T)) {
                return true;
              }
              return false;
            },
  bump: function (newPos,width,height) {
              var pos1 = new Object();
              pos1.L = newPos.left;
              pos1.T = newPos.top + (32);
              pos1.R = newPos.left + width;
              pos1.B = newPos.top + height;

              var blocks = $(this.blockers);
              for (i=0;i<blocks.length;++i) {
                var block = $(blocks[i]);
                var l = 0;
                var t = 0;
                var r = 0;
                var b = 0;
                if (block.hasClass('table')) {
                  l = this.shrink.table.left;
                  t = this.shrink.table.top;
                  r = this.shrink.table.right;
                  b = this.shrink.table.bottom;
                }
                var pos2 = new Object();
                pos2.L = parseInt(block.css('left')) + l;
                pos2.T = parseInt(block.css('top')) + t;
                pos2.R = parseInt(block.css('left')) + block.width() - r;
                pos2.B = parseInt(block.css('top')) + block.height() - b;
                if (this.collides(pos1, pos2)) {
                  return true;
                }
              }
              return false;
            },
  collect: function() {
             var pos1 = new Object();
             pos1.L = parseInt(this.user.css('left'));
             pos1.T = parseInt(this.user.css('top')) + 32;
             pos1.R = pos1.L + this.user.width();
             pos1.B = parseInt(this.user.css('top')) + this.user.height();
             var bacons = $('.bacon');
             for (i=0;i<bacons.length;++i) {
               var bacon = $(bacons[i]);
               var pos2 = new Object();
               pos2.L = bacon.position().left;
               pos2.T = bacon.position().top;
               pos2.R = pos2.L + bacon.width();
               pos2.B = pos2.T + bacon.height();
               if (this.collides(pos1,pos2)) {
                 this.baconCounter++;
                 bacon.addClass('delete');
               }
             }
             $('.delete').remove();
             $('#baconLeft').text($('.bacon').length);
             $('#baconCollected').text(this.baconCounter-this.baconPlated);
           },
  drawMove: function (dir) {
              var d='left';
              var t='A';
              switch (dir) {
                case 37:
                case 65:  break;
                case 38:
                case 87: d='up';break;
                case 39:
                case 68: d='right';break;
                case 40:
                case 83: d='down';break;
              }
              if (this.user.hasClass('A')) {
                t='B';
              } else {
                t='A';
              }

              this.user.removeClass(this.allMoves);
              this.user.addClass(d).addClass(t);
            }
};

var BakonSavr = new BaconSaver();
