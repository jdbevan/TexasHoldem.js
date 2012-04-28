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
        		for(var i=2; i<15; i++) {
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
		        			cards.push({"name": "Jack", "suit": "Hearts", "value": i});
		        			cards.push({"name": "Jack", "suit": "Spades", "value": i});
		        			cards.push({"name": "Jack", "suit": "Clubs", "value": i});
		        			cards.push({"name": "Jack", "suit": "Diamonds", "value": i});
		        			break;
		        		case 12:
		        			cards.push({"name": "Queen", "suit": "Hearts", "value": i});
		        			cards.push({"name": "Queen", "suit": "Spades", "value": i});
		        			cards.push({"name": "Queen", "suit": "Clubs", "value": i});
		        			cards.push({"name": "Queen", "suit": "Diamonds", "value": i});
		        			break;
		        		case 13:
		        			cards.push({"name": "King", "suit": "Hearts", "value": i});
		        			cards.push({"name": "King", "suit": "Spades", "value": i});
		        			cards.push({"name": "King", "suit": "Clubs", "value": i});
		        			cards.push({"name": "King", "suit": "Diamonds", "value": i});
		        			break;
		        		case 14:
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
				/*
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
        		); */
        		return cards;
        	},
        	checkHands: function(cards) {
        		// For each of the cards
        		for (var i=0; i<cards.length; i++) {
        			// For as many times as is required to
        			// cover the remaining cards
        			for (var skip = 0; skip <= cards.length - 5; skip++) {
		    			var hand = [];
		    			
		    			for (var j=i; j<cards.length + i; j++) {
		    				if (skip <= cards.length - 5 && j<=skip+i && j != i) { continue; }
		    				
		    				hand.push(cards[j % cards.length]);
		    				// Quit if 5 cards in this hand
		    				if (hand.length == 5) {
		    					break;
		    				}
		    			}
		    			
		    			/* Process this hand here */
		    			
        			}
        		}
        	},
        	init: function() {
        	
        		this.addHand("straight flush", function(cards) {
        			var suit,
        				numCards = cards.length;
        				
        			/* Same suit check */
        			for (card in cards) {
        				if (suit === undefined) {
        					suit = card.suit;
        				} else if (suit !== card.suit) {
        					return false;
        				}
        			}
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});

        			/* Consecutive */        			
        			if (cards[0].value - cards[numCards-1].value != numCards) {
						// Check for Ace
        				if (cards[0].value == 14) {
        					if (cards[1].value - 1 != numCards) {
        						return false;
        					} else {
        						return cards[1];
        					}
        				} else {
        					return false;
        				}
        			}
        			
        			/* Returns the high card */
        			return cards[0];
        			
        		}, 0);
        		this.addHand("four of a kind", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(card in cards) {
        				if (values[card.value] == undefined) {
        					values[card.value] = 1;
        				} else {
        					values[card.value]++;
        				}
        			}
        			// If more than 2 types of card, fail
        			if (values.length > 2) {
        				return false;
        			}
        			// If there isnt a card type with 1 or 4 cards, fail
        			if (values.indexOf(1) < 0 || values.indexOf(4) < 0) {
        				return false;
        			}
        			// Return high card
        			return cards[values.indexOf(4)];
        		});
        		this.addHand("full house", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(card in cards) {
        				if (values[card.value] == undefined) {
        					values[card.value] = 1;
        				} else {
        					values[card.value]++;
        				}
        			}
        			// If more than 2 types of card, fail
        			if (values.length > 2) {
        				return false;
        			}
        			// If there isnt a card type with 2 or 3 cards, fail
        			if (values.indexOf(2) < 0 || values.indexOf(3) < 0) {
        				return false;
        			}
        			// Return high card
        			return cards[values.indexOf(3)];
        		});
        		this.addHand("flush", function(cards){
        			var suit,
        				numCards = cards.length;
        				
        			/* Same suit check */
        			for (card in cards) {
        				if (suit === undefined) {
        					suit = card.suit;
        				} else if (suit !== card.suit) {
        					return false;
        				}
        			}
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			return cards;
        		});
        		this.addHand("straight", function(cards){
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			/* Check sequential */
        			if (cards[cards.length-1].value - cards[0].value != cards.length) {
        				return false;
        			}
        			
        			/* Check multiple suits */
        			var oneSuit = true,
        				suit;
        			for (card in cards) {
        				if (suit === undefined) { suit = card.suit; }
        				else if (suit != card.suit) { oneSuit = false; break; }
        			}
        			if (oneSuit) {
        				return false;
        			}
        			
        			return cards[0];
        		});
        		this.addHand("three of a kind", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(card in cards) {
        				if (values[card.value] == undefined) {
        					values[card.value] = 1;
        				} else {
        					values[card.value]++;
        				}
        			}
        			// If not 3 types of card, fail
        			if (values.length != 3) {
        				return false;
        			}
        			// If no type has 3 cards, fail
        			if (values.indexOf(3) < 0) {
        				return false;
        			}
        			
        			return cards[values.indexOf(3)];
        		});
        		this.addHand("two pair", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(card in cards) {
        				if (values[card.value] == undefined) {
        					values[card.value] = 1;
        				} else {
        					values[card.value]++;
        				}
        			}
        			// If not 3 types of card, fail
        			if (values.length != 3) {
        				return false;
        			}
        			// If no type has 1 card, fail
        			if (values.indexOf(1) < 0 && values.indexOf(2) < 0) {
        				return false;
        			}
        			
        			return cards;
        		});
        		this.addHand("one pair", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(card in cards) {
        				if (values[card.value] == undefined) {
        					values[card.value] = 1;
        				} else {
        					values[card.value]++;
        				}
        			}
        			// If not 3 types of card, fail
        			if (values.length != 4) {
        				return false;
        			}
        			// If no type has 2 cards, fail
        			if (values.indexOf(2) < 0) {
        				return false;
        			}
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			// Needs returning in order of pair, then high-to-low
        			return cards;
        		});
        		
        		
        		
        		
        		/*
        		 * GAME DEAL/PLAY
        		 */
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
