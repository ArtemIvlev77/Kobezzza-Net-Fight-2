export class Fighter {
    name;
    hp = 100;

    constructor(name) {
        this.name = name;
    }

    move(direction) {
        console.log(direction);
    }

    attack(hit) {
        console.log(hit);
    }

    jump(height) {
        console.log(height);
    }

    death(hp) {
        console.log(hp);
    }

    takeHit(hp) {
        console.log(hp);
    }

    fall(heigth) {
        console.log(heigth)
    }

}
