import Player from '../characters/player.js';
import NPC from '../characters/npc.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create(data) {
        console.log('🔹 Game scene starting...');
        const worldData = data.worldData || {};
        const layerOrder = worldData.layers || [];
        this.layers = [];

        // Create layers
        layerOrder.forEach((layerName, index) => {
            const layer = this.add.image(0, 0, layerName)
                .setOrigin(0, 0)
                .setDepth(index);
            this.layers.push(layer);
            console.log(`✅ Layer loaded: ${layerName} (Depth ${index})`);
        });

        // Collision map/layer setup
        if (worldData['collision-map'] && worldData['collision-tiles']) {
            const map = this.make.tilemap({ key: 'collisionMap' });
            const tileset = map.addTilesetImage('collisionTile', 'collisionTile');
            this.collisionLayer = map.createLayer('Collision', tileset, 0, 0);
            if (this.collisionLayer) {
                this.collisionLayer.setCollision([1]);
                this.collisionLayer.setVisible(false);
                console.log('✅ Collision enabled.');
            } else {
                console.warn('⚠️ No collision layer found.');
            }
        }

        // In your create() method:
        this.backgroundMusic = this.sound.add('sunrise', { loop: true });
        // this.backgroundMusic.play();

        this.characters = [];
        // 'daniel', 'kyle', 'chan', 'hana', 'john', 'priya', 'tiffany'

        this.player = new Player(this, 'daniel', 800, 800);
        this.characters.push(this.player);

        this.kyle = new NPC(this, 'kyle', 850, 800);
        this.characters.push(this.kyle);

        this.chan = new NPC(this, 'chan', 1120, 2240);
        this.characters.push(this.chan);

        this.hana = new NPC(this, 'hana', 400, 640);
        this.characters.push(this.hana);

        this.john = new NPC(this, 'john', 2800, 800);
        this.characters.push(this.john);

        this.priya = new NPC(this, 'priya', 3000, 1500);
        this.characters.push(this.priya);

        this.tiffany = new NPC(this, 'tiffany', 1910, 460);
        this.characters.push(this.tiffany);

        this.alexandra = new NPC(this, 'alexandra', 1120, 1300);
        this.characters.push(this.alexandra)

        // Make the camera follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // collisions for all characters
        this.characters.forEach((charA, indexA) => {
            if (this.collisionLayer) {
                this.physics.add.collider(charA, this.collisionLayer);
            }

            // Each character collides with every other character
            this.characters.forEach((charB, indexB) => {
                if (indexA !== indexB) {
                    this.physics.add.collider(charA, charB);
                }
            });
        });
    }

    update() {
        // Update each character (player, NPCs, etc.)
        this.characters.forEach(character => character.update());
    }
}
