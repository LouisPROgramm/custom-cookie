class CookieSimulator {
    constructor() {
        // Default URLs
        this.defaultUrls = {
            cookie: {
                image: 'https://i.imgur.com/1ZvG0pM.png', // Default cookie image
                clickSound: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3'
            },
            sounds: {
                click: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3',
                purchase: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3',
                gambleWin: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3',
                gambleLose: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3',
                rebirth: 'https://freesound.org/data/previews/180/180904_2606065-lq.mp3'
            }
        };

        this.cookies = 0;
        this.totalCookies = 0;
        this.rebirths = 0;
        this.rebirthCost = 1000;
        this.shopItems = [
            { 
                name: 'Cursor', 
                cost: 15, 
                cps: 0.1,
                image: this.defaultUrls.shopItems.cursor.image,
                sound: this.defaultUrls.shopItems.cursor.sound
            },
            { 
                name: 'Grandma', 
                cost: 100, 
                cps: 1,
                image: this.defaultUrls.shopItems.grandma.image,
                sound: this.defaultUrls.shopItems.grandma.sound
            },
            { 
                name: 'Farm', 
                cost: 1100, 
                cps: 8,
                image: this.defaultUrls.shopItems.farm.image,
                sound: this.defaultUrls.shopItems.farm.sound
            },
            { 
                name: 'Factory', 
                cost: 12000, 
                cps: 50,
                image: this.defaultUrls.shopItems.factory.image,
                sound: this.defaultUrls.shopItems.factory.sound
            },
            { 
                name: 'Mine', 
                cost: 130000, 
                cps: 300,
                image: this.defaultUrls.shopItems.mine.image,
                sound: this.defaultUrls.shopItems.mine.sound
            }
        ];
        this.purchasedItems = {};
        this.cps = 0;
        this.sounds = {
            click: new Audio(this.defaultUrls.sounds.click),
            purchase: new Audio(this.defaultUrls.sounds.purchase),
            gambleWin: new Audio(this.defaultUrls.sounds.gambleWin),
            gambleLose: new Audio(this.defaultUrls.sounds.gambleLose),
            rebirth: new Audio(this.defaultUrls.sounds.rebirth)
        };

        // Set default cookie image
        const cookieImage = document.getElementById('customCookieImage');
        cookieImage.src = this.defaultUrls.cookie.image;

        // Set default shop item images
        this.shopItems.forEach(item => {
            const shopItem = document.querySelector(`.shop-item h3:contains('${item.name}')`).parentElement;
            const img = shopItem.querySelector('img');
            if (img) img.src = item.image;
        });

        // Listen for URL changes
        this.setupCustomizationListeners();
        this.initialize();
    };

    setupCustomizationListeners() {
        // Cookie customization
        document.getElementById('cookieImageUrl').addEventListener('change', (e) => {
            const img = document.getElementById('customCookieImage');
            const url = e.target.value.trim();
            if (url) {
                img.src = url;
            } else {
                img.src = this.defaultUrls.cookie.image;
            }
        });

        document.getElementById('clickSoundUrl').addEventListener('change', (e) => {
            const url = e.target.value.trim();
            if (url) {
                this.sounds.click.src = url;
            } else {
                this.sounds.click.src = this.defaultUrls.sounds.click;
            }
        });

        // Shop item customization
        this.shopItems.forEach(item => {
            const imageInput = document.getElementById(`${item.name.toLowerCase()}ImageUrl`);
            const soundInput = document.getElementById(`${item.name.toLowerCase()}SoundUrl`);

            imageInput.addEventListener('change', (e) => {
                const shopItem = document.querySelector(`.shop-item h3:contains('${item.name}')`).parentElement;
                const img = shopItem.querySelector('img');
                const url = e.target.value.trim();
                if (url && img) {
                    img.src = url;
                } else if (img) {
                    img.src = this.defaultUrls.shopItems[item.name.toLowerCase()].image;
                }
            });

            soundInput.addEventListener('change', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    item.sound = new Audio(url);
                } else {
                    item.sound = new Audio(this.defaultUrls.shopItems[item.name.toLowerCase()].sound);
                }
            });
        });
    };

    initialize() {
        this.setupEventListeners();
        this.updateDisplay();
    };

    setupEventListeners() {
        document.getElementById('cookie').addEventListener('click', () => {
            this.clickCookie();
            this.sounds.click.play();
        });
        document.getElementById('gambleButton').addEventListener('click', () => this.gamble());
        document.getElementById('rebirthButton').addEventListener('click', () => this.rebirth());

        // Initialize shop items
        const shopContainer = document.getElementById('shopItems');
        this.shopItems.forEach(item => {
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            shopItem.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                <p>Cost: ${item.cost} cookies</p>
                <p>CPS: ${item.cps}</p>
                <button onclick="cookieSimulator.purchase('${item.name}')">Buy</button>
            `;
            shopContainer.appendChild(shopItem);
        });
    };

    clickCookie() {
        this.cookies++;
        this.totalCookies++;
        this.updateDisplay();
    };

    purchase(itemName) {
        const item = this.shopItems.find(i => i.name === itemName);
        if (this.cookies >= item.cost) {
            this.sounds.purchase.play();
            this.cookies -= item.cost;
            this.purchasedItems[itemName] = (this.purchasedItems[itemName] || 0) + 1;
            this.cps += item.cps;
            this.updateDisplay();
            
            // Update item cost based on number purchased
            item.cost = Math.floor(item.cost * 1.15);
        }
    };

    gamble() {
        if (this.cookies < 100) return;

        const amount = Math.floor(this.cookies * 0.5);
        const result = Math.random() < 0.5;
        
        const resultDiv = document.getElementById('gambleResult');
        if (result) {
            this.sounds.gambleWin.play();
            this.cookies += amount;
            resultDiv.className = 'gamble-result success';
            resultDiv.textContent = `You won ${amount} cookies!`;
        } else {
            this.sounds.gambleLose.play();
            this.cookies -= amount;
            resultDiv.className = 'gamble-result failure';
            resultDiv.textContent = `You lost ${amount} cookies!`;
        }
        this.updateDisplay();
    };

    rebirth() {
        if (this.cookies >= this.rebirthCost) {
            this.sounds.rebirth.play();
            this.cookies = 0;
            this.rebirths++;
            this.rebirthCost = Math.floor(this.rebirthCost * 1.5);
            this.purchasedItems = {};
            this.cps = 0;
            this.updateDisplay();
        }
    };

    startCookieProduction() {
        setInterval(() => {
            this.cookies += this.cps;
            this.totalCookies += this.cps;
            this.updateDisplay();
        }, 1000);
    };

    updateDisplay() {
        document.getElementById('cookieCount').textContent = this.formatNumber(this.cookies);
        document.getElementById('totalCookies').textContent = this.formatNumber(this.totalCookies);
        document.getElementById('rebirthCount').textContent = this.rebirths;
        document.getElementById('rebirthCost').textContent = this.formatNumber(this.rebirthCost);

        // Update shop item counts
        this.shopItems.forEach(item => {
            const button = document.querySelector(`button[onclick*="'${item.name}'"]`);
            if (button) {
                button.disabled = this.cookies < item.cost;
            }
        });
    };

    formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    };
}

        // Listen for URL changes
        this.setupCustomizationListeners();
        this.initialize();
    }

    setupCustomizationListeners() {
        // Cookie customization
        document.getElementById('cookieImageUrl').addEventListener('change', (e) => {
            const img = document.getElementById('customCookieImage');
            const url = e.target.value.trim();
            if (url) {
                img.src = url;
            } else {
                img.src = this.defaultUrls.cookie.image;
            }
        });

        document.getElementById('clickSoundUrl').addEventListener('change', (e) => {
            const url = e.target.value.trim();
            if (url) {
                this.sounds.click.src = url;
            } else {
                this.sounds.click.src = this.defaultUrls.sounds.click;
            }
        });

        // Shop item customization
        this.shopItems.forEach(item => {
            const imageInput = document.getElementById(`${item.name.toLowerCase()}ImageUrl`);
            const soundInput = document.getElementById(`${item.name.toLowerCase()}SoundUrl`);

            imageInput.addEventListener('change', (e) => {
                const shopItem = document.querySelector(`.shop-item h3:contains('${item.name}')`).parentElement;
                const img = shopItem.querySelector('img');
                const url = e.target.value.trim();
                if (url && img) {
                    img.src = url;
                } else if (img) {
                    img.src = this.defaultUrls.shopItems[item.name.toLowerCase()].image;
                }
            });

            soundInput.addEventListener('change', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    item.sound = new Audio(url);
                } else {
                    item.sound = new Audio(this.defaultUrls.shopItems[item.name.toLowerCase()].sound);
                }
            });
        });
    }

    initialize() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startCookieProduction();
    }

    setupEventListeners() {
        document.getElementById('cookie').addEventListener('click', () => {
            this.clickCookie();
            this.sounds.click.play();
        });
        document.getElementById('gambleButton').addEventListener('click', () => this.gamble());
        document.getElementById('rebirthButton').addEventListener('click', () => this.rebirth());

        // Initialize shop items
        const shopContainer = document.getElementById('shopItems');
        this.shopItems.forEach(item => {
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            shopItem.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                <p>Cost: ${item.cost} cookies</p>
                <p>CPS: ${item.cps}</p>
                <button onclick="cookieSimulator.purchase('${item.name}')">Buy</button>
            `;
            shopContainer.appendChild(shopItem);
        });
    }

    clickCookie() {
        this.cookies++;
        this.totalCookies++;
        this.updateDisplay();
    }

    purchase(itemName) {
        const item = this.shopItems.find(i => i.name === itemName);
        if (this.cookies >= item.cost) {
            this.sounds.purchase.play();
            this.cookies -= item.cost;
            this.purchasedItems[itemName] = (this.purchasedItems[itemName] || 0) + 1;
            this.cps += item.cps;
            this.updateDisplay();
            
            // Update item cost based on number purchased
            item.cost = Math.floor(item.cost * 1.15);
        }
    }

    gamble() {
        if (this.cookies < 100) return;

        const amount = Math.floor(this.cookies * 0.5);
        const result = Math.random() < 0.5;
        
        const resultDiv = document.getElementById('gambleResult');
        if (result) {
            this.sounds.gambleWin.play();
            this.cookies += amount;
            resultDiv.className = 'gamble-result success';
            resultDiv.textContent = `You won ${amount} cookies!`;
        } else {
            this.sounds.gambleLose.play();
            this.cookies -= amount;
            resultDiv.className = 'gamble-result failure';
            resultDiv.textContent = `You lost ${amount} cookies!`;
        }
        this.updateDisplay();
    }

    rebirth() {
        if (this.cookies >= this.rebirthCost) {
            this.sounds.rebirth.play();
            this.cookies = 0;
            this.rebirths++;
            this.rebirthCost = Math.floor(this.rebirthCost * 1.5);
            this.purchasedItems = {};
            this.cps = 0;
            this.updateDisplay();
        }
    }

    startCookieProduction() {
        setInterval(() => {
            this.cookies += this.cps;
            this.totalCookies += this.cps;
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('cookieCount').textContent = this.formatNumber(this.cookies);
        document.getElementById('totalCookies').textContent = this.formatNumber(this.totalCookies);
        document.getElementById('rebirthCount').textContent = this.rebirths;
        document.getElementById('rebirthCost').textContent = this.formatNumber(this.rebirthCost);

        // Update shop item counts
        this.shopItems.forEach(item => {
            const button = document.querySelector(`button[onclick*="'${item.name}'"]`);
            if (button) {
                button.disabled = this.cookies < item.cost;
            }
        });
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }
}

// Initialize the game
const cookieSimulator = new CookieSimulator();
