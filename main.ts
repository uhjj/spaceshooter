controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    missile = sprites.createProjectileFromSprite(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . 5 5 . . . . . . . 
        . . . . . . . 5 5 . . . . . . . 
        . . . . . . . 5 5 . . . . . . . 
        . . . . . . . 5 5 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, spaceship, 0, -160)
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    sprite.destroy(effects.fire, 500)
    scene.cameraShake(4, 100)
    info.changeLifeBy(-1)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 100)
    sprite.destroy(effects.fire, 100)
    info.changeScoreBy(1)
})
let astro: Sprite = null
let boss_life = 0
let big_boss: Sprite = null
let missile: Sprite = null
let spaceship: Sprite = null
info.setScore(0)
info.setLife(3)
let astro_list = [img`
    . . . . . . . . . c c 8 . . . . 
    . . . . . . 8 c c c f 8 c c . . 
    . . . c c 8 8 f c a f f f c c . 
    . . c c c f f f c a a f f c c c 
    8 c c c f f f f c c a a c 8 c c 
    c c c b f f f 8 a c c a a a c c 
    c a a b b 8 a b c c c c c c c c 
    a f c a a b b a c c c c c f f c 
    a 8 f c a a c c a c a c f f f c 
    c a 8 a a c c c c a a f f f 8 a 
    . a c a a c f f a a b 8 f f c a 
    . . c c b a f f f a b b c c 6 c 
    . . . c b b a f f 6 6 a b 6 c . 
    . . . c c b b b 6 6 a c c c c . 
    . . . . c c a b b c c c . . . . 
    . . . . . c c c c c c . . . . . 
    `, img`
    . . . . . . c c c . . . . . . . 
    . . . . . a a a c c c . . . . . 
    . . . c a c f a a a a c . . . . 
    . . c a c f f f a f f a c . . . 
    . c c a c c f a a c f f a c . . 
    . a b a a c 6 a a c c f a c c c 
    . a b b b 6 a b b a a c a f f c 
    . . a b b a f f b b a a c f f c 
    c . a a a c c f c b a a c f a c 
    c c a a a c c a a a b b a c a c 
    a c a b b a a 6 a b b 6 b b c . 
    b a c b b b 6 b c . c c a c . . 
    b a c c a b b a c . . . . . . . 
    b b a c a b a a . . . . . . . . 
    a b 6 b b a c . . . . . . . . . 
    . a a b c . . . . . . . . . . . 
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . c c c c . . 
    . c c c c c . c c c c c f c c . 
    c c a c c c c c 8 f f c f f c c 
    c a f a a c c a f f c a a f f c 
    c a 8 f a a c a c c c a a a a c 
    c b c f a a a a a c c c c c c c 
    c b b a a c f 8 a c c c 8 c c c 
    . c b b a b c f a a a 8 8 c c . 
    . . . . a a b b b a a 8 a c . . 
    . . . . c b c a a c c b . . . . 
    . . . . b b c c a b b a . . . . 
    . . . . b b a b a 6 a . . . . . 
    . . . . c b b b 6 6 c . . . . . 
    . . . . . c a 6 6 b c . . . . . 
    . . . . . . . c c c . . . . . . 
    `]
let astro_speed = 0
let astro_pos = 0
spaceship = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . . f f . . . . . . . 
    . . . . . . f c d f . . . . . . 
    . . . . . . f c d f . . . . . . 
    . . . . . . f c d f . . . . . . 
    . . . . f f c b b d f f . . . . 
    . . . f c 5 b 5 5 b 5 d f . . . 
    . . f c b b b b b b b b d f . . 
    . f c b b 5 b 5 5 b 5 b b d f . 
    . f c b b b b b b b b b b d f . 
    f c b b f f c 5 5 d f f b b d f 
    f c f f . . f c d f . . f f d f 
    f f . . . . f c d f . . . . f f 
    . . . . . . . f f . . . . . . . 
    `, SpriteKind.Player)
spaceship.y = scene.screenHeight() - 10
controller.moveSprite(spaceship, 130, 130)
spaceship.setFlag(SpriteFlag.StayInScreen, true)
game.onUpdate(function () {
    if (big_boss.top > 0) {
        big_boss.top = 0
        big_boss.vy = 0
        big_boss.vx = 10
    }
    if (big_boss.right > scene.screenWidth()) {
        big_boss.vx = -20
    } else if (big_boss.left < scene.screenWidth()) {
        big_boss.vx = -20
    }
    if (boss_life == 0) {
        big_boss.destroy(effects.rings, 500)
    }
})
game.onUpdateInterval(1000, function () {
    astro_pos = randint(0, scene.screenWidth())
    astro_speed = randint(10, 50)
    astro = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . c c c c . . 
        . c c c c c . c c c c c f c c . 
        c c a c c c c c 8 f f c f f c c 
        c a f a a c c a f f c a a f f c 
        c a 8 f a a c a c c c a a a a c 
        c b c f a a a a a c c c c c c c 
        c b b a a c f 8 a c c c 8 c c c 
        . c b b a b c f a a a 8 8 c c . 
        . . . . a a b b b a a 8 a c . . 
        . . . . c b c a a c c b . . . . 
        . . . . b b c c a b b a . . . . 
        . . . . b b a b a 6 a . . . . . 
        . . . . c b b b 6 6 c . . . . . 
        . . . . . c a 6 6 b c . . . . . 
        . . . . . . . c c c . . . . . . 
        `, SpriteKind.Enemy)
    astro.x = astro_pos
    astro.y = -10
    astro.setImage(astro_list[randint(0, 2)])
    astro.ay = astro_speed
})
game.onUpdateInterval(20000, function () {
    big_boss = sprites.create(img`
        ffccbbbbbbbbbbbbbbbbbbbbbbbbddff
        ..ffccbbbbbbbbbbbbbbbbbbbbddff..
        ....ffccbbbbbbbbbbbbbbbbddff....
        ......ffccbbbbbbbbbbbbddff......
        ........ffccbbbbbbbbddff........
        ........ffffccbbbbddfff.........
        .........ffffffffffffff.........
        .........fffff2222fffff.........
        ..........fff224422fff..........
        ..........ff22444422ff..........
        ...........f24455442f...........
        ...........f24455442f...........
        ............22444422............
        .............224422.............
        ..............2222..............
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        `, SpriteKind.Player)
    boss_life = 5
    big_boss.y = -16
    big_boss.vy = 20
})
