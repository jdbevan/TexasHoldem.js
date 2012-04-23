(function(window, undefined) {

Object.prototype.clone = function() {
	var newObj = (this instanceof Array) ? [] : {};
	for (i in this) {
		if (i == 'clone') continue;
		if (this[i] && typeof this[i] == "object") {
			newObj[i] = this[i].clone();
		} else newObj[i] = this[i];
	} return newObj;
};

var outerPoker = (function() {

        var poker = {
	        ready: false,
        	cards: [],
        	board: [],
        	player: [],
        	hands: [],
        	newDeck: function () {
        		var cards = [];
        		for(var i=1; i<14; i++) {
        			switch (i) {
        				case 2: case 3:
        				case 4: case 5:
        				case 6: case 7:
        				case 8: case 9: 
        				case 10:
		        			cards.push({"name": i, "suit": "Hearts", "value": i});
		        			cards.push({"name": i, "suit": "Spades", "value": i});
		        			cards.push({"name": i, "suit": "Clubs", "value": i});
		        			cards.push({"name": i, "suit": "Diamonds", "value": i});
		        			break;
		        		case 11:
		        			cards.push({"name": "Jack", "suit": "Hearts", "value": 10});
		        			cards.push({"name": "Jack", "suit": "Spades", "value": 10});
		        			cards.push({"name": "Jack", "suit": "Clubs", "value": 10});
		        			cards.push({"name": "Jack", "suit": "Diamonds", "value": 10});
		        			break;
		        		case 12:
		        			cards.push({"name": "Queen", "suit": "Hearts", "value": 10});
		        			cards.push({"name": "Queen", "suit": "Spades", "value": 10});
		        			cards.push({"name": "Queen", "suit": "Clubs", "value": 10});
		        			cards.push({"name": "Queen", "suit": "Diamonds", "value": 10});
		        			break;
		        		case 13:
		        			cards.push({"name": "King", "suit": "Hearts", "value": 10});
		        			cards.push({"name": "King", "suit": "Spades", "value": 10});
		        			cards.push({"name": "King", "suit": "Clubs", "value": 10});
		        			cards.push({"name": "King", "suit": "Diamonds", "value": 10});
		        			break;
		        		case 1:
		        			cards.push({"name": "Ace", "suit": "Hearts", "value": i});
		        			cards.push({"name": "Ace", "suit": "Spades", "value": i});
		        			cards.push({"name": "Ace", "suit": "Clubs", "value": i});
		        			cards.push({"name": "Ace", "suit": "Diamonds", "value": i});
		        			break;		        			
        			}
	    		}
        		return cards;
        	},
        	randCard: function(max) {
        		return Math.round(Math.random() * (max-1));
        	},
        	shuffle: function(deck) {
        		var l = deck.length,
        			k = this.randCard(l); //Math.round(Math.random() * (l-1));
        		for (var i=0; i<l*l*l; i++) {
        			deck.push(deck[k].clone());
        			deck.splice(k, 1);
        			k = this.randCard(l); //Math.round(Math.random() * (l-1));
        		}
        	},
        	deal: function(deck, num_players, num_cards) {
        		if (deck.length < 1) return false;
        		if (num_cards < 0 || num_cards > deck.length) return false;
        		if (num_players < 0 || num_players*num_cards > deck.length) return false;

        		for(var p=0; p<num_players; p++) {
        			this.player[p] = {};
       				this.player[p].hand = [];
        			for (var c=0; c<num_cards; c++) {
        				var card_position = this.randCard(deck.length); //Math.round(Math.random() * (deck.length - 1));
        				this.player[p].hand.push(deck[card_position].clone());
        				deck.splice(card_position, 1);
        			}
        		}
        	},
        	community_deal: function(deck, num_cards){
        		if (deck.length < 1) return false;

        		for(var p=0; p<num_cards; p++) {
    				var card_position = this.randCard(deck.length);
    				this.board.push(deck[card_position].clone());
    				deck.splice(card_position, 1);
        		}
        	},
        	burn: function(deck) {
        		if (deck.length < 1) return false;
        		
        		deck.splice(this.randCard(deck.length), 1);
        	},
        	flop: function(deck) {
        		return this.community_deal(deck, 3);
        	},
        	turn:function(deck) {
        		return this.community_deal(deck, 1);
        	}, 
        	river: function(deck) {
        		return this.turn(deck);
        	},
        	combine_cards: function(hand, board) {
				var cards = [];
				for(var j=0; j<hand.length; j++) {
					cards.push(hand[j].clone());
				}
				for(var j=0; j<board.length; j++) {
					cards.push(board[j].clone());
				}
        		cards.sort(
        			function(a,b) {
						if (a.suit == b.suit) {
							return (a.value - b.value);
						} else {
							if (a.suit > b.suit) {
								return 1;
							} else if (a.suit < b.suit) {
								return -1;
							} else {
								return 0;
							}
						}
        			}
        		);
        		return cards;
        	},
        	init: function() {
        	
        		this.addHand("straight flush", function(cards) {
        			var fourSameSuit = false,
        				incremental = false,
        				suits = {};
        				
					for (var i=0; i<cards.length; i++) {
						if (suits[cards[i].suit] === undefined) {
							suits[cards[i].suit] = 1;
						} else {
							suits[cards[i].suit]++;
							if (suits[cards[i].suit]>3){
								fourSameSuit = true;
								break;
							}
						}
					}
					
					if (fourSameSuit) {
						//
					}
        		}, 0);
        	
        	
        	
        		this.ready = true;
        		
        		//Create deck
        		this.cards = this.newDeck();
        		//Shuffle cards
        		this.shuffle(this.cards);
        		//Deal cards
        		this.deal(this.cards, 4, 2);
        		this.draw(this.player[0].hand);
        		this.draw(this.player[1].hand);
        		this.draw(this.player[2].hand);
        		this.draw(this.player[3].hand);
        		//Burn
        		this.burn(this.cards);
        		//Community
        		this.flop(this.cards);
        		this.draw(this.board);
        		//Burn
        		this.burn(this.cards);
        		//Community
        		this.turn(this.cards);
        		this.draw(this.board);
        		//Burn
        		this.burn(this.cards);
        		//Community
        		this.river(this.cards);
        		this.draw(this.board);
        	},
        	draw: function(hand) {
        		var p = document.createElement('p');
				hand.sort(
        			function(a,b) {
						if (a.suit == b.suit) {
							return (a.value - b.value);
						} else {
							if (a.suit > b.suit) {
								return 1;
							} else if (a.suit < b.suit) {
								return -1;
							} else {
								return 0;
							}
						}
        			}
        		);
        		for(var j=0;j<hand.length; j++) {
        			var img = document.createElement('img');
        			img.src = 'images/' + hand[j].name + hand[j].suit.toLowerCase() + '.jpg';
        			p.appendChild(img);
        		}
        		document.body.appendChild(p);
        	},
        	addHand: function(name, func, priority) {
        		this.hands[priority] = {"name": name, "function": func};
        	}
	};
        
        return poker;
    })();
    window.poker = outerPoker;
})(window);
