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
        	cards: [],
        	player: [],
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
        	shuffle: function(deck) {
        		var l = deck.length,
        			k = Math.round(Math.random() * (l-1));
        		for (var i=0; i<l*l*l; i++) {
        			deck.push(deck[k].clone());
        			deck.splice(k, 1);
        			k = Math.round(Math.random() * (l-1));
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
        				var card_position = Math.round(Math.random() * (deck.length - 1));
        				this.player[p].hand.push(deck[card_position].clone());
        				deck.splice(card_position, 1);
        			}
        		}
        	},
        	init: function() {
        		//Create deck
        		this.cards = this.newDeck();
        		//Shuffle cards
        		this.shuffle(this.cards);
        		//Deal cards
        		this.deal(this.cards, 4, 2);
        	}
	};
        
        return poker;
    })();
    window.poker = outerPoker;
})(window);
