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
        		for (var i=0; i<l*l; i++) {
        			deck.push(deck[k].clone());
        			deck.splice(k, 1);
        			k = this.randCard(l); //Math.round(Math.random() * (l-1));
        		}
        	},
        	deal: function(deck, num_players, num_cards) {
        		if (deck.length < 1) return false;
        		if (num_cards < 0 || num_cards > deck.length) return false;
        		if (num_players < 0 || num_players*num_cards > deck.length) return false;

       			for (var c=0; c<num_cards; c++) {
	        		for (var p=0; p<num_players; p++) {
		    			if (this.player[p] == undefined) {
		    				this.player[p] = {};
		   					this.player[p].hand = [];
		   				}
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
    			// Sort low to high priority
    			this.hands.sort(function(a,b){
    				return a.priority - b.priority;
    			});
    			
    			var matched_hands = [];
    			
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
		    			for (var possible_hand=0; possible_hand < this.hands.length; possible_hand++) {
		    				debugger;
		    				var check_hand = this.hands[possible_hand].check(hand);
		    				if (check_hand !== false) {
		    					matched_hands.push({"score": possible_hand, "hand_value": check_hand});
		    					break;
		    				}
		    			}
        			}
        		}
        		
        		//Sort low to high
        		matched_hands.sort(function(a,b) {
        			return a.score - b.score;
        		});
        		
        		return matched_hands[0];
        	},
        	init: function() {
        	
        		this.addHand(0, "straight flush", function(cards) {
        			var suit,
        				numCards = cards.length;
        				
        			/* Same suit check */
        			for (var card=0; card<cards.length; card++) {
        				if (suit === undefined) {
        					suit = cards[card].suit;
        				} else if (suit !== cards[card].suit) {
        					return false;
        				}
        			}
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});

        			/* Consecutive */        			
        			if (cards[0].value - cards[numCards-1].value != numCards-1) {
						// Check for Ace
        				if (cards[0].value == 14) {
        					if (cards[1].value - 1 != numCards-1) {
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
        		this.addHand(1, "four of a kind", function(cards) {
        			var values = [],
        				distinct_values = 0;
        			/* Count how many of each value card there are */
        			for(var card=0; card<cards.length; card++) {
        				if (values[cards[card].value] == undefined) {
        					values[cards[card].value] = 1;
        					distinct_values++;
        				} else {
        					values[cards[card].value]++;
        				}
        			}
        			// If more than 2 types of card, fail
        			if (distinct_values > 2) {
        				return false;
        			}
        			// If there isnt a card type with 1 or 4 cards, fail
        			if (values.indexOf(1) < 0 || values.indexOf(4) < 0) {
        				return false;
        			}
        			// Return high card
        			/* Doesn't work */
        			return cards[values.indexOf(4)];
        		});
        		this.addHand(2, "full house", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(var card=0; card<cards.length; card++) {
        				if (values[cards[card].value] == undefined) {
        					values[cards[card].value] = 1;
        				} else {
        					values[cards[card].value]++;
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
        		this.addHand(3, "flush", function(cards){
        			var suit,
        				numCards = cards.length;
        				
        			/* Same suit check */
        			for (var card=0; card<cards.length; card++) {
        				if (suit === undefined) {
        					suit = cards[card].suit;
        				} else if (suit !== cards[card].suit) {
        					return false;
        				}
        			}
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			return cards;
        		});
        		this.addHand(4, "straight", function(cards){
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
        			for (var card=0; card<cards.length; card++) {
        				if (suit === undefined) { suit = cards[card].suit; }
        				else if (suit != cards[card].suit) { oneSuit = false; break; }
        			}
        			if (oneSuit) {
        				return false;
        			}
        			
        			return cards[0];
        		});
        		this.addHand(5, "three of a kind", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(var card=0; card<cards.length; card++) {
        				if (values[cards[card].value] == undefined) {
        					values[cards[card].value] = 1;
        				} else {
        					values[cards[card].value]++;
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
        		this.addHand(6, "two pair", function(cards) {
        			var values = [];
        			/* Count how many of each value card there are */
        			for(var card=0; card<cards.length; card++) {
        				if (values[cards[card].value] == undefined) {
        					values[cards[card].value] = 1;
        				} else {
        					values[cards[card].value]++;
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
        		this.addHand(7, "one pair", function(cards) {
        			var values = [],
        				ordered_cards = [],
        				pair_card_id;
        			/* Count how many of each value card there are */
        			for(var card=0; card<cards.length; card++) {
        				if (values[cards[card].value] == undefined) {
        					values[cards[card].value] = 1;
        				} else {
        					values[cards[card].value]++;
        				}
        			}
        			// If not 3 types of card, fail
        			if (values.length != 4) {
        				return false;
        			}
        			pair_card_id = values.indexOf(2);
        			// If no type has 2 cards, fail
        			if (pair_card_id < 0) {
        				return false;
        			}
        			
        			// Store 1 of the pair of catds first
        			ordered_cards.push(cards[pair_card_id]);
        			
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			// Then everything else in desc order
        			for(var card=0;card<cards.length; card++) {
        				if (cards[card].suit != ordered_cards[0].suit && cards[card].value != ordered_cards[0].value) {
        					ordered_cards.push(cards[card]);
        				}
        			}
        			
        			// Needs returning in order of pair, then high-to-low
        			return ordered_cards;
        		});
        		this.addHand(8, "high card", function(cards) {
        			/* Sort them high-to-low */
        			cards.sort(function(a,b){
        				return b.value - a.value;
        			});
        			
        			return cards;
        		});
        		
        		/*
        		 * GAME DEAL/PLAY
        		 */
        		this.ready = true;
        		
        		var css = document.createElement('style');
        		css.innerHTML = "p.player { display: inline; margin-right: 20px; }\n";
        		/* Shrink images from 123px x 79px => 82px x 53px */
        		css.innerHTML += "p img { width: 53px; height: 82px; }";
        		document.head.appendChild(css);
        		
        		//Create deck
        		this.cards = this.newDeck();
        		//Shuffle cards
        		this.shuffle(this.cards);
        		//Deal cards
        		this.deal(this.cards, 4, 2);
        		for (var p=0; p<this.player.length; p++){
        			this.draw(this.player[p].hand);
        		}
        		
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
        		
        		// Calculate best hand for each player
        		for(var p=0; p<this.player.length; p++) {
        			var all_cards = this.combine_cards(this.player[p].hand, this.board);
        			this.player[p].hand_score = this.checkHands(all_cards);
        		}
        		// Sort by hand score (low-to-high)
        		this.player.sort(function(a,b) {
        			debugger;
        			return a.hand_score.score - b.hand_score.score;
        		});
        		
        		if (this.player[0].hand_score.score == this.player[1].hand_score.score) {
        			console.log("Two players have same hand: " + this.hands[this.player[0].hand_score.score].name);
        			console.log(this.player[0]);
        			console.log(this.player[1]);
        		} else {
        			console.log("The winning player:");
        			console.log(this.player[0]);
        			//this.draw(this.player[0].hand);
        		}
        	},
        	draw: function(hand) {
        		var p = document.createElement('p');
        		if (hand.length == 2) {
        			p.setAttribute("class", "player");
        		}
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
        	addHand: function(priority, label, func) {
        		this.hands[priority] = {"name": label, "check": func};
        	}
		};
        
        return poker;
    })();
    window.poker = outerPoker;
})(window);
