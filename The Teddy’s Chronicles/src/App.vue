<template>
  <div id="pixi-container"></div>
  <div v-if="showWarning" class="warning">
    <p>Tamaño no soportado. Por favor, aumente el tamaño de la pantalla (1280 x 720)</p>
  </div>
</template>

<style>
.warning {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 9999;
}
</style>

<script>
export default {
  data() {
    return {
      showWarning: false,
      app: null,
      sprite: null,
      leftKeyDown: false,
      rightKeyDown: false,
      upKeyDown: false,
      initialY: 0,
      jumping: false,
      jumpHeight: 150,
      jumpSpeed: 14,
      canJump: true, // variable para permitir o prohibir saltar
    }
  },
  mounted() {
    const width = 1280;
    const height = 720;

    const config = {
      width: width,
      height: height,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: 0x1099bb
    };

    this.app = new this.PIXI.Application(config);
    const container = document.getElementById('pixi-container');
    container.appendChild(this.app.view);


    
    window.addEventListener('resize', () => {
      if (window.innerWidth < width || window.innerHeight < height) {
        this.showWarning = true;
      } else {
        this.showWarning = false;
      }
    });

    if (window.innerWidth < width || window.innerHeight < height) {
      this.showWarning = true;
    }

    // Load the sprite image
    this.app.loader.add('/ted.png').load(this.setup.bind(this));
  },
  methods: {
    setup() {
      // Create a sprite and add it to the stage as the background
      const bg = new this.PIXI.Sprite.from('/background.jpg');
      bg.width = this.app.screen.width;
      bg.height = this.app.screen.height;
      this.app.stage.addChild(bg);
      
      // Create a sprite and add it to the stage
      const sprite = new this.PIXI.Sprite(this.app.loader.resources['/ted.png'].texture);
      sprite.anchor.set(0.5);
      sprite.x = 70;
      sprite.y = this.app.renderer.height - 220;
      this.app.stage.addChild(sprite);
      this.sprite = sprite;
      sprite.scale.set(0.2);
      
      // Create a ticker for animating the sprite
      this.app.ticker.add(this.update.bind(this));

      // Add event listeners for key presses
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keyup', this.onKeyUp.bind(this));

      // Allow the character to jump initially
      this.canJump = true;
    },
    update(delta) {
      const speed = 4;
      const gravity = 10;
      const salto = 150;

      if (this.sprite) {
        if(this.jumping && this.rightKeyDown){
          this.sprite.x += speed * delta;
          if (this.sprite.x > this.app.renderer.width - this.sprite.width / 2) {
            this.sprite.x = this.app.renderer.width - this.sprite.width / 2;
          }
          // Move the sprite upwards
          this.sprite.y -= this.jumpSpeed;
          // Reduce the jump height
          this.jumpHeight -= this.jumpSpeed;
          // Check if the jump height limit is reached
          if (this.jumpHeight <= 0) {
            // Change the direction of the jump
            this.jumping = false;
            // Reset the jump height and speed
            this.jumpHeight = salto;
            this.jumpSpeed = 15;
          }
        }
        else if(this.jumping && this.leftKeyDown){
          this.sprite.x -= speed * delta;
          if (this.sprite.x < this.sprite.width / 2) {
            this.sprite.x = this.sprite.width / 2;
          }
          // Move the sprite upwards
          this.sprite.y -= this.jumpSpeed;
          // Reduce the jump height
          this.jumpHeight -= this.jumpSpeed;
          // Check if the jump height limit is reached
          if (this.jumpHeight <= 0) {
            // Change the direction of the jump
            this.jumping = false;
            // Reset the jump height and speed
            this.jumpHeight = salto;
            this.jumpSpeed = 15;
          }
        }
        // Check if jumping
        else if (this.jumping) {
          // Move the sprite upwards
          this.sprite.y -= this.jumpSpeed;
          // Reduce the jump height
          this.jumpHeight -= this.jumpSpeed;
          // Check if the jump height limit is reached
          if (this.jumpHeight <= 0) {
            // Change the direction of the jump
            this.jumping = false;
            // Reset the jump height and speed
            this.jumpHeight = salto;
            this.jumpSpeed = 15;
          }
        } else {
          // Move the sprite left or right depending on which keys are pressed
          if (this.rightKeyDown) {
            this.sprite.x += speed * delta;
            if (this.sprite.x > this.app.renderer.width - this.sprite.width / 2) {
              this.sprite.x = this.app.renderer.width - this.sprite.width / 2;
            }
          } else if (this.leftKeyDown) {
            this.sprite.x -= speed * delta;
            if (this.sprite.x < this.sprite.width / 2) {
              this.sprite.x = this.sprite.width / 2;
            }
          }
          // Apply gravity to the sprite
          this.sprite.y += gravity;
          // Check if the sprite has fallen to the ground
          if (this.sprite.y > this.app.renderer.height - 220) {
            this.sprite.y = this.app.renderer.height - 220;
            // Enable jumping again when the sprite has landed
            this.canJump = true;
          }
        }
      }
    },
    onKeyDown(event) {
      if (event.key === 'a') {
        this.leftKeyDown = true;
      } else if (event.key === 'd') {
        this.rightKeyDown = true;
      } else if(event.key === 'j' && !this.jumping && this.canJump){
        this.upKeyDown = true;
        this.initialY = this.sprite.y;
        this.jumping = true;
        this.canJump = false;
      }
    },
    onKeyUp(event) {
      if (event.key === 'a') {
        this.leftKeyDown = false;
      } else if (event.key === 'd') {
        this.rightKeyDown = false;
      } else if(event.key ==='j' && this.jumping){
        this.upKeyDown = false;
        // Enable the 'j' key after the jump is completed
        setTimeout(() => { this.jKeyDown = false; }, 1000);
      }
    }
  }
}
</script>
